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
#[derive(Debug, Clone, Copy, PartialEq)]
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
    pub fn serialize(&self) -> Vec<u8> {
        let mut bytes = vec![];
        bytes.push(self.space.serialize());
        if self.block.is_none() {
            bytes.push(0);
        } else {
            bytes.append(&mut self.block.unwrap().serialize());
        }
        bytes
    }
    pub fn steal_tile(data: &mut Vec<u8>) -> Tile {
        let mut tile = Tile::default();
        tile.space = Space::from_byte(data[0]);
        if data[1] == 0 {
            data.drain(0..2);
            return tile
        }
        tile.block = Some(Block::from_trbl_bytes(data[1], data[4], data[2], data[3]));
        data.drain(0..5);
        tile
    }
    pub fn mirror(&mut self) {
        if self.block.is_some() {
            self.block.as_mut().unwrap().mirror();
        }
    }
    pub fn rotate_ccw(&mut self) {
        if self.block.is_some() {
            self.block.as_mut().unwrap().rotate_ccw();
        }
    }
}

#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq)]
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
    pub fn serialize(&self) -> u8 {
        match *self {
            Space::Empty => 1,
            Space::Goal => 2,
        }
    }
    pub fn from_byte(byte: u8) -> Space {
        match byte {
            1 => Space::Empty,
            2 => Space::Goal,
            _ => panic!()
        }
    }
}

#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Block {
    pub top: Side,
    pub bottom: Side,
    pub left: Side,
    pub right: Side,
}

#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum Side {
    Wall,
    Basic,
    Ice,
    Swap,
    Hole,
    PushSwap,
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
                "pushSwapSide" => Side::PushSwap,
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
    pub fn serialize(&self) -> Vec<u8> {
        let parse = |s: Side| {
            match s {
                Side::Wall => 1,
                Side::Basic => 2,
                Side::Ice => 3,
                Side::Swap => 4,
                Side::Hole => 5,
                Side::PushSwap => 6,
            }
        };
        vec![parse(self.top), parse(self.bottom), parse(self.left), parse(self.right)]
    }
    pub fn from_trbl_bytes(top: u8, right: u8, bottom: u8, left: u8) -> Block {
        let parse = |s: u8| {
            match s {
                1 => Side::Wall,
                2 => Side::Basic,
                3 => Side::Ice,
                4 => Side::Swap,
                5 => Side::Hole,
                6 => Side::PushSwap,
                _ => panic!()
            }
        };
        Block {top: parse(top), bottom: parse(bottom), left: parse(left), right: parse(right)}
    }
    pub fn rotate_ccw(&mut self) {
        let temp = self.top;
        self.top = self.right;
        self.right = self.bottom;
        self.bottom = self.left;
        self.left = temp;
    }
    pub fn mirror(&mut self) {
        let temp = self.left;
        self.left = self.right;
        self.right = temp;
    }
}