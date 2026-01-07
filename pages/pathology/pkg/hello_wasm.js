let wasm;

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(wasm.__wbindgen_externrefs.get(mem.getUint32(i, true)));
    }
    wasm.__externref_drop_slice(ptr, len);
    return result;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    }
}

let WASM_VECTOR_LEN = 0;

const BlockFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_block_free(ptr >>> 0, 1));

const BoardFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_board_free(ptr >>> 0, 1));

const BoardHistoryFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_boardhistory_free(ptr >>> 0, 1));

const TileFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_tile_free(ptr >>> 0, 1));

export class Block {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Block.prototype);
        obj.__wbg_ptr = ptr;
        BlockFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BlockFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_block_free(ptr, 0);
    }
    /**
     * @returns {Side}
     */
    get top() {
        const ret = wasm.__wbg_get_block_top(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {Side} arg0
     */
    set top(arg0) {
        wasm.__wbg_set_block_top(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {Side}
     */
    get bottom() {
        const ret = wasm.__wbg_get_block_bottom(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {Side} arg0
     */
    set bottom(arg0) {
        wasm.__wbg_set_block_bottom(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {Side}
     */
    get left() {
        const ret = wasm.__wbg_get_block_left(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {Side} arg0
     */
    set left(arg0) {
        wasm.__wbg_set_block_left(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {Side}
     */
    get right() {
        const ret = wasm.__wbg_get_block_right(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {Side} arg0
     */
    set right(arg0) {
        wasm.__wbg_set_block_right(this.__wbg_ptr, arg0);
    }
    /**
     * @param {Direction} move_dir
     * @returns {Side}
     */
    pushed_side(move_dir) {
        const ret = wasm.block_pushed_side(this.__wbg_ptr, move_dir);
        return ret;
    }
    /**
     * @param {string} top
     * @param {string} right
     * @param {string} bottom
     * @param {string} left
     * @returns {Block}
     */
    static from_trbl(top, right, bottom, left) {
        const ptr0 = passStringToWasm0(top, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(right, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(bottom, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ptr3 = passStringToWasm0(left, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len3 = WASM_VECTOR_LEN;
        const ret = wasm.block_from_trbl(ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3);
        return Block.__wrap(ret);
    }
}
if (Symbol.dispose) Block.prototype[Symbol.dispose] = Block.prototype.free;

export class Board {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Board.prototype);
        obj.__wbg_ptr = ptr;
        BoardFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BoardFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_board_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get_height() {
        const ret = wasm.board_get_height(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get_player() {
        const ret = wasm.board_get_player(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} index
     */
    set_player(index) {
        wasm.board_set_player(this.__wbg_ptr, index);
    }
    /**
     * @param {Direction} dir
     * @returns {StepOutcome}
     */
    move_player(dir) {
        const ret = wasm.board_move_player(this.__wbg_ptr, dir);
        return ret;
    }
    add_side_top() {
        wasm.board_add_side_top(this.__wbg_ptr);
    }
    add_side_left() {
        wasm.board_add_side_left(this.__wbg_ptr);
    }
    add_side_right() {
        wasm.board_add_side_right(this.__wbg_ptr);
    }
    /**
     * @param {number} index
     * @returns {string[] | undefined}
     */
    get_block_trbl(index) {
        const ret = wasm.board_get_block_trbl(this.__wbg_ptr, index);
        let v1;
        if (ret[0] !== 0) {
            v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        }
        return v1;
    }
    add_side_bottom() {
        wasm.board_add_side_bottom(this.__wbg_ptr);
    }
    /**
     * @param {string} data
     * @returns {Board}
     */
    static from_serialized(data) {
        const ptr0 = passStringToWasm0(data, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.board_from_serialized(ptr0, len0);
        return Board.__wrap(ret);
    }
    remove_side_top() {
        wasm.board_remove_side_top(this.__wbg_ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    serialize_bytes() {
        const ret = wasm.board_serialize_bytes(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
    remove_side_left() {
        wasm.board_remove_side_left(this.__wbg_ptr);
    }
    remove_side_right() {
        wasm.board_remove_side_right(this.__wbg_ptr);
    }
    remove_side_bottom() {
        wasm.board_remove_side_bottom(this.__wbg_ptr);
    }
    /**
     * @param {Uint8Array} data
     * @returns {Board}
     */
    static from_serialized_bytes(data) {
        const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.board_from_serialized_bytes(ptr0, len0);
        return Board.__wrap(ret);
    }
    /**
     * @returns {Board}
     */
    clone() {
        const ret = wasm.board_clone(this.__wbg_ptr);
        return Board.__wrap(ret);
    }
    /**
     * @param {number} width
     * @param {number} height
     * @returns {Board}
     */
    static default(width, height) {
        const ret = wasm.board_default(width, height);
        return Board.__wrap(ret);
    }
    /**
     * @param {number} index
     * @returns {Tile}
     */
    get_tile(index) {
        const ret = wasm.board_get_tile(this.__wbg_ptr, index);
        return Tile.__wrap(ret);
    }
    /**
     * @param {number} x_fraction
     * @param {number} y_fraction
     * @returns {number}
     */
    get_index(x_fraction, y_fraction) {
        const ret = wasm.board_get_index(this.__wbg_ptr, x_fraction, y_fraction);
        return ret >>> 0;
    }
    /**
     * @param {number} index
     * @returns {string}
     */
    get_space(index) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.board_get_space(this.__wbg_ptr, index);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {number}
     */
    get_width() {
        const ret = wasm.board_get_width(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} index
     * @param {Direction} dir
     * @param {boolean} first
     * @returns {StepOutcome}
     */
    move_tile(index, dir, first) {
        const ret = wasm.board_move_tile(this.__wbg_ptr, index, dir, first);
        return ret;
    }
    /**
     * @returns {string}
     */
    serialize() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.board_serialize(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {number} index
     * @param {Block | null} [new_block]
     */
    set_block(index, new_block) {
        let ptr0 = 0;
        if (!isLikeNone(new_block)) {
            _assertClass(new_block, Block);
            ptr0 = new_block.__destroy_into_raw();
        }
        wasm.board_set_block(this.__wbg_ptr, index, ptr0);
    }
    /**
     * @param {number} index
     * @param {Space} new_space
     */
    set_space(index, new_space) {
        wasm.board_set_space(this.__wbg_ptr, index, new_space);
    }
}
if (Symbol.dispose) Board.prototype[Symbol.dispose] = Board.prototype.free;

export class BoardHistory {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(BoardHistory.prototype);
        obj.__wbg_ptr = ptr;
        BoardHistoryFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BoardHistoryFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_boardhistory_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get current_step() {
        const ret = wasm.__wbg_get_boardhistory_current_step(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} arg0
     */
    set current_step(arg0) {
        wasm.__wbg_set_boardhistory_current_step(this.__wbg_ptr, arg0);
    }
    /**
     * @param {Board} board
     * @returns {BoardHistory}
     */
    static from_board(board) {
        _assertClass(board, Board);
        var ptr0 = board.__destroy_into_raw();
        const ret = wasm.boardhistory_from_board(ptr0);
        return BoardHistory.__wrap(ret);
    }
    /**
     * @param {Board} new_board
     */
    add_not_seen(new_board) {
        _assertClass(new_board, Board);
        var ptr0 = new_board.__destroy_into_raw();
        wasm.boardhistory_add_not_seen(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Board}
     */
    get_current_board() {
        const ret = wasm.boardhistory_get_current_board(this.__wbg_ptr);
        return Board.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    get_history_length() {
        const ret = wasm.boardhistory_get_history_length(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {Direction} dir
     */
    step(dir) {
        wasm.boardhistory_step(this.__wbg_ptr, dir);
    }
}
if (Symbol.dispose) BoardHistory.prototype[Symbol.dispose] = BoardHistory.prototype.free;

/**
 * @enum {0 | 1 | 2 | 3}
 */
export const Direction = Object.freeze({
    Down: 0, "0": "Down",
    Right: 1, "1": "Right",
    Up: 2, "2": "Up",
    Left: 3, "3": "Left",
});

/**
 * @enum {0 | 1 | 2 | 3 | 4 | 5}
 */
export const Side = Object.freeze({
    Wall: 0, "0": "Wall",
    Basic: 1, "1": "Basic",
    Ice: 2, "2": "Ice",
    Swap: 3, "3": "Swap",
    Hole: 4, "4": "Hole",
    PushSwap: 5, "5": "PushSwap",
});

/**
 * @enum {0 | 1}
 */
export const Space = Object.freeze({
    Empty: 0, "0": "Empty",
    Goal: 1, "1": "Goal",
});

/**
 * @enum {0 | 1 | 2 | 3 | 4}
 */
export const StepOutcome = Object.freeze({
    Blocked: 0, "0": "Blocked",
    Stepped: 1, "1": "Stepped",
    FilledHole: 2, "2": "FilledHole",
    GoalReached: 3, "3": "GoalReached",
    PartialStep: 4, "4": "PartialStep",
});

export class Tile {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Tile.prototype);
        obj.__wbg_ptr = ptr;
        TileFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TileFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_tile_free(ptr, 0);
    }
    /**
     * @returns {Block | undefined}
     */
    get block() {
        const ret = wasm.__wbg_get_tile_block(this.__wbg_ptr);
        return ret === 0 ? undefined : Block.__wrap(ret);
    }
    /**
     * @param {Block | null} [arg0]
     */
    set block(arg0) {
        let ptr0 = 0;
        if (!isLikeNone(arg0)) {
            _assertClass(arg0, Block);
            ptr0 = arg0.__destroy_into_raw();
        }
        wasm.__wbg_set_tile_block(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Space}
     */
    get space() {
        const ret = wasm.__wbg_get_tile_space(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {Space} arg0
     */
    set space(arg0) {
        wasm.__wbg_set_tile_space(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) Tile.prototype[Symbol.dispose] = Tile.prototype.free;

const EXPECTED_RESPONSE_TYPES = new Set(['basic', 'cors', 'default']);

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = module.ok && EXPECTED_RESPONSE_TYPES.has(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg___wbindgen_throw_dd24417ed36fc46e = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_cast_2241b6af4c4b2941 = function(arg0, arg1) {
        // Cast intrinsic for `Ref(String) -> Externref`.
        const ret = getStringFromWasm0(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_externrefs;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
    };

    return imports;
}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedDataViewMemory0 = null;
    cachedUint8ArrayMemory0 = null;


    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (typeof module_or_path === 'undefined') {
        module_or_path = new URL('hello_wasm_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;
