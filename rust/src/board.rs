use wasm_bindgen::prelude::*;
use crate::block::{Block, Direction, Side, Space, Tile};
use serde::{Serialize, Deserialize};
use flate2::write::ZlibEncoder;
use flate2::read::ZlibDecoder;
use std::{collections::{HashMap, VecDeque}, io::{Read, Write}};

#[derive(PartialEq)]
#[derive(Serialize, Deserialize)]
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
        Board { grid: vec![Tile::default(); width * height], width, height, player: 0 }
    }

    #[wasm_bindgen] // this adds 70kb rip
    pub fn from_serialized(data: &str) -> Board {
        serde_json::from_str(&data).unwrap()
    }
    #[wasm_bindgen]
    pub fn serialize(&self) -> String {
        serde_json::to_string(&self).unwrap()
    }
    #[wasm_bindgen] // this adds 50kb to the wasm file hmm
    pub fn from_serialized_bytes(data: Vec<u8>) -> Board {
        let mut decoder = ZlibDecoder::new(data.as_slice());
        let mut json = String::new();
        decoder.read_to_string(&mut json).unwrap();
        serde_json::from_str(&json).unwrap()
    }
    #[wasm_bindgen]
    pub fn serialize_bytes(&self) -> Vec<u8> {
        let json = serde_json::to_string(&self).unwrap();
        let mut encoder = ZlibEncoder::new(Vec::new(), flate2::Compression::default());
        encoder.write_all(json.as_bytes()).unwrap();
        encoder.finish().unwrap()
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
    pub fn add_side_top(&mut self) {
        self.height += 1;
        self.grid.splice(0..0, vec![Tile::default(); self.width]);
        self.player += self.width;
    }
    #[wasm_bindgen]
    pub fn add_side_bottom(&mut self) {
        self.height += 1;
        self.grid.append(&mut vec![Tile::default(); self.width]);
    }
    #[wasm_bindgen]
    pub fn add_side_left(&mut self) {
        self.player += self.y_of(self.player) + 1;
        self.width += 1;
        // inefficient realloc but low cost
        for i in 0..self.height {
            self.grid.insert(i*self.width, Tile::default());
        }
    }
    #[wasm_bindgen]
    pub fn add_side_right(&mut self) {
        self.add_side_left();
        self.grid.remove(0);
        self.grid.push(Tile::default());
        self.player -= 1;
    }
    #[wasm_bindgen]
    pub fn remove_side_top(&mut self) {
        if self.height <= 1 {return}
        self.grid.splice(0..self.width, vec![]);
        self.height -= 1;
        self.player -= self.width;
    }
    #[wasm_bindgen]
    pub fn remove_side_bottom(&mut self) {
        if self.height <= 1 {return}
        self.height -= 1;
        self.grid.truncate(self.width*self.height);
    }
    #[wasm_bindgen]
    pub fn remove_side_left(&mut self) {
        if self.width <= 1 {return}
        self.player -= self.y_of(self.player) + 1;
        // inefficient realloc but low cost
        self.width -= 1;
        for i in 0..self.height {
            self.grid.remove(i*self.width);
        }
    }
    #[wasm_bindgen]
    pub fn remove_side_right(&mut self) {
        if self.width <= 1 {return}
        self.grid.insert(0, Tile::default());
        self.grid.pop();
        self.remove_side_left();
        self.player += 1;
    }
    #[wasm_bindgen]
    pub fn get_block_trbl(&self, index: usize) -> Option<Vec<String>> {
        let block = self.grid[index].get_block();
        if block.is_none() {return None}
        let block = block.unwrap();
        Some(
            vec![block.top, block.right, block.bottom, block.left]
            .iter().map(|v| match *v {
                Side::Wall => "wallSide".to_string(),
                Side::Basic => "basicSide".to_string(),
                Side::Ice => "iceSide".to_string(),
                Side::Swap => "swapSide".to_string(),
                Side::Hole => "holeSide".to_string(),
                Side::PushSwap => "pushSwapSide".to_string(),
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
                let mut side = block.pushed_side(dir);
                if side == Side::PushSwap {
                    side = if index == self.player {Side::Basic} else {Side::Swap};
                }

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
                    Side::Hole => {
                        // if a block did the pushing
                        if index != self.player {
                            // remove both holeblock and movingblock
                            self.set_block(index, None);
                            self.set_block(into_index, None);
                        } else {
                            // block player
                            return StepOutcome::Blocked
                        }
                    }
                    Side::PushSwap => {
                        panic!("PushSwap side should already have been processed");
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

    // return a backward flow map giving an optimal route to each empty position
    fn floodfill(&self) -> HashMap<usize, usize> {
        // fill board // cheap so just does the whole thing
        let mut tocheck = VecDeque::new();
        let mut checked = HashMap::new();
        checked.insert(self.player, self.player);
        tocheck.push_back(self.player);
        while let Some(next) = tocheck.pop_front() {
            for dir in [Direction::Right, Direction::Left, Direction::Down, Direction::Up] {
                if let Some(adjacent) = self.get_adjacent_tile(next, dir) {
                    // space or goal
                    if adjacent.0.block.is_none() && !checked.contains_key(&adjacent.1) {
                        tocheck.push_back(adjacent.1);
                        checked.insert(adjacent.1, next);
                    }
                }
            }
        }
        checked
    }

    #[wasm_bindgen]
    pub fn indices_on_path_to_index(&self, index: usize) -> Vec<usize> {
        let fill = self.floodfill();
        let mut backward = vec![];
        let mut last = index;
        while let Some(next) = fill.get(&last) {
            if *next == last {break}
            backward.push(last);
            last = *next;
        }
        backward.reverse();
        backward
    }
}