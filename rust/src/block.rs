use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};

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
#[derive(Debug, Clone, Copy, PartialEq)]
#[derive(Serialize, Deserialize)]
pub struct Tile {
    pub block: Option<Block>,
    pub space: Space
}

impl Tile {
    pub fn default() -> Tile {
        Tile {block: None, space: Space::Empty}
    }
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
#[derive(Debug, Clone, Copy, PartialEq)]
#[derive(Serialize, Deserialize)]
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
#[derive(Debug, Clone, Copy, PartialEq)]
#[derive(Serialize, Deserialize)]
pub struct Block {
    pub top: Side,
    pub bottom: Side,
    pub left: Side,
    pub right: Side,
}

#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq)]
#[derive(Serialize, Deserialize)]
pub enum Side {
    Wall,
    Basic,
    Ice,
    Swap,
    Hole,
}

#[wasm_bindgen]
impl Block {
    #[wasm_bindgen]
    pub fn from_trbl(top: &str, right: &str, bottom: &str, left: &str) -> Block {
        let parse = |s: &str| {
            match s {
                "wallSide" => Side::Wall,
                "basicSide" => Side::Basic,
                "iceSide" => Side::Ice,
                "swapSide" => Side::Swap,
                "holeSide" => Side::Hole,
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