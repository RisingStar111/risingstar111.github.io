use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum Direction {
    Down,
    Right,
    Up,
    Left,
}

impl std::ops::Neg for Direction {
    type Output = Direction;
    fn neg(self) -> Direction {
        match self {
            Direction::Up => Direction::Down,
            Direction::Down => Direction::Up,
            Direction::Left => Direction::Right,
            Direction::Right => Direction::Left,
        }
    }
}

#[wasm_bindgen]
#[derive(Debug, Clone, Copy)]
pub struct Tile {
    pub block: Option<Block>,
    pub space: Space
}

impl Tile {
    pub fn get_block(&self) -> &Option<Block> {
        &self.block
    }
    pub fn set_block(&mut self, new_block: Option<Block>) {
        self.block = new_block
    }
    pub fn get_space(&self) -> &Space {
        &self.space
    }
    pub fn set_space(&mut self, new_space: Space) {
        self.space = new_space
    }
}

#[wasm_bindgen]
#[derive(Debug, Clone, Copy)]
pub enum Space {
    Empty,
    Goal,
}

impl Space {
    pub fn is_goal(&self) -> bool {
        match self {
            Space::Goal => true,
            _ => false,
        }
    }
}

#[wasm_bindgen]
#[derive(Debug, Clone, Copy)]
pub struct Block {
    pub top: Side,
    pub bottom: Side,
    pub left: Side,
    pub right: Side,
}

#[wasm_bindgen]
#[derive(Debug, Clone, Copy)]
pub enum Side {
    Wall,
    Basic,
    Ice,
    Swap,
}

#[wasm_bindgen]
impl Block {
    #[wasm_bindgen]
    pub fn from_tblr(top: &str, bottom: &str, left: &str, right: &str) -> Block {
        let parse = |s: &str| {
            match s {
                "wallSide" => Side::Wall,
                "basicSide" => Side::Basic,
                "iceSide" => Side::Ice,
                "swapSide" => Side::Swap,
                _ => panic!()
            }
        };
        Block {top: parse(top), bottom: parse(bottom), left: parse(left), right: parse(right)}
    }
    pub fn pushed_side(&self, move_dir: Direction) -> Side {
        match move_dir {
            Direction::Up => self.bottom,
            Direction::Down => self.top,
            Direction::Left => self.right,
            Direction::Right => self.left,
        }
    }
}