/* tslint:disable */
/* eslint-disable */

export class Block {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  pushed_side(move_dir: Direction): Side;
  static from_trbl(top: string, right: string, bottom: string, left: string): Block;
  top: Side;
  bottom: Side;
  left: Side;
  right: Side;
}

export class Board {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  get_height(): number;
  get_player(): number;
  set_player(index: number): void;
  move_player(dir: Direction): StepOutcome;
  get_block_trbl(index: number): string[] | undefined;
  static from_serialized(data: string): Board;
  clone(): Board;
  static default(width: number, height: number): Board;
  get_tile(index: number): Tile;
  get_index(x_fraction: number, y_fraction: number): number;
  get_space(index: number): string;
  get_width(): number;
  move_tile(index: number, dir: Direction, first: boolean): StepOutcome;
  serialize(): string;
  set_block(index: number, new_block?: Block | null): void;
  set_space(index: number, new_space: Space): void;
}

export class BoardHistory {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  static from_board(board: Board): BoardHistory;
  get_current_board(): Board;
  get_history_length(): number;
  step(dir: Direction): void;
  current_step: number;
}

export enum Direction {
  Down = 0,
  Right = 1,
  Up = 2,
  Left = 3,
}

export enum Side {
  Wall = 0,
  Basic = 1,
  Ice = 2,
  Swap = 3,
  Hole = 4,
}

export enum Space {
  Empty = 0,
  Goal = 1,
}

export enum StepOutcome {
  Blocked = 0,
  Stepped = 1,
  FilledHole = 2,
  GoalReached = 3,
  PartialStep = 4,
}

export class Tile {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  get block(): Block | undefined;
  set block(value: Block | null | undefined);
  space: Space;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_block_free: (a: number, b: number) => void;
  readonly __wbg_get_block_bottom: (a: number) => number;
  readonly __wbg_get_block_left: (a: number) => number;
  readonly __wbg_get_block_right: (a: number) => number;
  readonly __wbg_get_block_top: (a: number) => number;
  readonly __wbg_get_tile_block: (a: number) => number;
  readonly __wbg_get_tile_space: (a: number) => number;
  readonly __wbg_set_block_bottom: (a: number, b: number) => void;
  readonly __wbg_set_block_left: (a: number, b: number) => void;
  readonly __wbg_set_block_right: (a: number, b: number) => void;
  readonly __wbg_set_block_top: (a: number, b: number) => void;
  readonly __wbg_set_tile_block: (a: number, b: number) => void;
  readonly __wbg_set_tile_space: (a: number, b: number) => void;
  readonly __wbg_tile_free: (a: number, b: number) => void;
  readonly block_from_trbl: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => number;
  readonly block_pushed_side: (a: number, b: number) => number;
  readonly __wbg_boardhistory_free: (a: number, b: number) => void;
  readonly __wbg_get_boardhistory_current_step: (a: number) => number;
  readonly __wbg_set_boardhistory_current_step: (a: number, b: number) => void;
  readonly boardhistory_from_board: (a: number) => number;
  readonly boardhistory_get_current_board: (a: number) => number;
  readonly boardhistory_get_history_length: (a: number) => number;
  readonly boardhistory_step: (a: number, b: number) => void;
  readonly __wbg_board_free: (a: number, b: number) => void;
  readonly board_clone: (a: number) => number;
  readonly board_default: (a: number, b: number) => number;
  readonly board_from_serialized: (a: number, b: number) => number;
  readonly board_get_block_trbl: (a: number, b: number) => [number, number];
  readonly board_get_height: (a: number) => number;
  readonly board_get_index: (a: number, b: number, c: number) => number;
  readonly board_get_player: (a: number) => number;
  readonly board_get_space: (a: number, b: number) => [number, number];
  readonly board_get_tile: (a: number, b: number) => number;
  readonly board_get_width: (a: number) => number;
  readonly board_move_player: (a: number, b: number) => number;
  readonly board_move_tile: (a: number, b: number, c: number, d: number) => number;
  readonly board_serialize: (a: number) => [number, number];
  readonly board_set_block: (a: number, b: number, c: number) => void;
  readonly board_set_player: (a: number, b: number) => void;
  readonly board_set_space: (a: number, b: number, c: number) => void;
  readonly __wbindgen_externrefs: WebAssembly.Table;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __externref_drop_slice: (a: number, b: number) => void;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
