use wasm_bindgen::prelude::*;
use crate::block::{Block, Direction, Side, Space, Tile};

pub const DIRARRAY: [Direction; 4] = [Direction::Left, Direction::Up, Direction::Right, Direction::Down];

#[wasm_bindgen]
pub struct Board {
    grid: Vec<Tile>,
    width: usize,
    height: usize,
    player: usize,
}

#[wasm_bindgen]
#[derive(PartialEq)]
pub enum StepOutcome {
    Blocked,
    Stepped,
    FilledHole,
    GoalReached,
    PartialStep,
}

#[wasm_bindgen]
impl Board {
    #[wasm_bindgen]
    pub fn default(width: usize, height: usize) -> Board {
        Board { grid: vec![Tile {block: None, space: Space::Empty}; width * height], width, height, player: 0 }
    }

    #[wasm_bindgen]
    pub fn clone(&self) -> Board {
        Board { grid: self.grid.clone(), width: self.width, height: self.height, player: self.player }
    }

    pub fn get_tile(&self, index: usize) -> Tile {
        self.grid[index]
    }
    fn get_tile_mut(&mut self, index: usize) -> &mut Tile {
        &mut self.grid[index]
    }
    #[wasm_bindgen]
    pub fn get_index(&self, x_fraction: f64, y_fraction: f64) -> usize {
        (x_fraction * self.width as f64).floor() as usize + self.width * (y_fraction * self.height as f64).floor() as usize
    }
    #[wasm_bindgen]
    pub fn set_block(&mut self, index: usize, new_block: Option<Block>) {
        self.grid[index].set_block(new_block);
    }
    #[wasm_bindgen]
    pub fn set_space(&mut self, index: usize, new_space: Space) {
        self.grid[index].set_space(new_space);
    }
    #[wasm_bindgen]
    pub fn get_block_tblr(&self, index: usize) -> Option<Vec<String>> {
        let block = self.grid[index].get_block();
        if block.is_none() {return None}
        let block = block.unwrap();
        Some(
            vec![block.top, block.bottom, block.left, block.right]
            .iter().map(|v| match *v {
                Side::Wall => "wallSide".to_string(),
                Side::Basic => "basicSide".to_string(),
                Side::Ice => "iceSide".to_string(),
                Side::Swap => "swapSide".to_string(),
            })
            .collect()
        )
    }
    #[wasm_bindgen]
    pub fn get_space(&self, index: usize) -> String {
        let space = self.grid[index].get_space();
        match *space {
            Space::Empty => "emptySpace".to_string(),
            Space::Goal => "goalSpace".to_string(),
        }
    }
    #[wasm_bindgen]
    pub fn set_player(&mut self, index: usize) {
        self.player = index;
    }
    #[wasm_bindgen]
    pub fn get_player(&mut self) -> usize {
        self.player
    }
    #[wasm_bindgen]
    pub fn get_width(&mut self) -> usize {
        self.width
    }
    #[wasm_bindgen]
    pub fn get_height(&mut self) -> usize {
        self.height
    }

    fn y_of(&self, index: usize) -> usize {
        index / self.width
    }
    fn x_of(&self, index: usize) -> usize {
        index % self.width
    }

    fn get_adjacent_tile(&self, index: usize, dir: Direction) -> Option<(Tile, usize)> {
        // return None if out of bounds
        if match dir {
            Direction::Up => self.y_of(index) == 0,
            Direction::Down => self.y_of(index) == self.height - 1,
            Direction::Left => self.x_of(index) == 0,
            Direction::Right => self.x_of(index) == self.width - 1,
            } {
            return None
        }
        println!("{:?}", self.y_of(index));
        
        let adjacent = (index as isize + match dir {
            Direction::Up => -(self.width as isize),
            Direction::Down => self.width as isize,
            Direction::Left => -1,
            Direction::Right => 1,
        }) as usize;
        Some((self.get_tile(adjacent), adjacent))
    }

    #[wasm_bindgen]
    pub fn move_player(&mut self, dir: Direction) -> StepOutcome {
        let mut step;
        let mut first = true;
        loop {
            step = self.move_tile(self.player, dir, first);
            first = false;
            if step != StepOutcome::PartialStep {
                return step
            }
        }
    }

    pub fn move_tile(&mut self, index: usize, dir: Direction, first: bool) -> StepOutcome {
        if let Some((into_tile, into_index)) = self.get_adjacent_tile(index, dir) {
            // tile exists and is in bounds
            if let Some(block) = into_tile.get_block() {
                // tile does have a block
                let side = block.pushed_side(dir);

                // per side type logic
                match side {
                    Side::Wall => {
                        // cannot push wall
                        return StepOutcome::Blocked
                    },
                    Side::Basic => {
                        // if the player did the pushing
                        if index == self.player && first {
                            // move the block
                            self.move_tile(into_index, dir, false);
                            // return to call to get player to move
                            return StepOutcome::PartialStep
                        }
                        // no multipush
                        return StepOutcome::Blocked
                    },
                    Side::Ice => {
                        // if the player did the pushing
                        if index == self.player && first {
                            // repeat basic moves while successful
                            let mut next = index; // find a nicer method imo // still not working
                            loop {
                                if let Some((_, next_index)) = self.get_adjacent_tile(next, dir) {
                                    next = next_index;
                                    if self.move_tile(next_index, dir, false) != StepOutcome::Stepped {
                                        break;
                                    }
                                } else {
                                    break;
                                }
                            }
                            // return to call to get player to move
                            return StepOutcome::PartialStep
                        }
                        // no multipush
                        return StepOutcome::Blocked
                    },
                    Side::Swap => {
                        // swap pushing block with pushed block
                        let moving_tile = self.get_tile_mut(index);
                        let temp_block = *moving_tile.get_block();
                        moving_tile.set_block(*into_tile.get_block());
                        self.get_tile_mut(into_index).set_block(temp_block);
                    },
                }
            } else {
                // tile doesn't have a block
                let moving_block = *self.get_tile(index).get_block();
                self.get_tile_mut(into_index).set_block(moving_block);
                // set moved tile block to empty
                self.get_tile_mut(index).set_block(None);
            }

            // tile moved
            // if player check goal and move stored player position
            if index == self.player {
                self.player = into_index;
                if into_tile.get_space().is_goal() {
                    return StepOutcome::GoalReached
                }
            }
            return StepOutcome::Stepped
        }
        StepOutcome::Blocked
    }
}