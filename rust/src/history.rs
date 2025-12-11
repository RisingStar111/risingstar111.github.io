use wasm_bindgen::prelude::*;
use crate::{block::Direction, board::{Board, StepOutcome}};


// the board history contains a minimal representation of the traversal of the level
// this means naive undoing doesn't undo the 'visual' traversal
#[wasm_bindgen]
pub struct BoardHistory {
    board_stack: Vec<Board>,
    pub current_step: usize,
}

#[wasm_bindgen]
impl BoardHistory {
    #[wasm_bindgen]
    pub fn from_board(board: Board) -> BoardHistory {
        BoardHistory { board_stack: vec![board], current_step: 0 }
    }
    #[wasm_bindgen]
    pub fn step(&mut self, dir: Direction) {
        assert!(self.current_step < self.board_stack.len());
        // attempt to get board after moving
        let mut moving_board = self.board_stack[self.current_step].clone();
        moving_board.move_player(dir);
        if moving_board == self.board_stack[self.current_step] {
            // try better but needed something with new weird side
            return
        }
        
        // check for seeing this board in the stack
        for (index, stack_board) in self.board_stack.iter().enumerate() {
            if moving_board == *stack_board {
                if index <= self.current_step {
                    // change the step if seen earlier
                    self.current_step = index;
                } else {
                    // collapse the stack if seen later
                    self.current_step += 1;
                    self.board_stack.drain(self.current_step .. index);
                }
                // don't add a new board
                return
            }
        }
        // not seen in the stack
        self.add_not_seen(moving_board);
    }

    #[wasm_bindgen]
    pub fn add_not_seen(&mut self, new_board: Board) {
        self.current_step += 1;
        if self.current_step == self.board_stack.len() {
            self.board_stack.push(new_board);
        } else {
            self.board_stack[self.current_step] = new_board;
        }
    }

    #[wasm_bindgen]
    pub fn get_current_board(&self) -> Board {
        self.board_stack[self.current_step].clone()
    }
    #[wasm_bindgen]
    pub fn get_history_length(&self) -> usize {
        self.board_stack.len()
    }
}