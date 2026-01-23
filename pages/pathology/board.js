import init, { Board, Block, Direction, Space, BoardHistory } from './pkg/hello_wasm.js';
// load wasm // this runs when this module is imported, which shouldn't happen more than once
await init();
console.log("Loaded Pathology WASM")

export {Direction, Block, Board, Space}

export class Level {
    history;
    constructor(initialBoard = null) {
        this.history = BoardHistory.from_board(initialBoard == null ? Board.default(5, 5) : initialBoard);
        this.loadCurrentBoard(true);
    }

    moveHandler(direction) {
        this.history.step(direction);
        this.loadCurrentBoard();
    }

    loadCurrentBoard(suppressCallback = false) {
        this.board = this.history.get_current_board();
        this.width = this.board.get_width();
        this.height = this.board.get_height();
        if (suppressCallback) return
        Level.levelChangedCallback();
    }

    indexToPosition(index) {
        return [index % this.width, Math.floor(index / this.width)];
    }

    setStep(newStep) {
        this.history.current_step = newStep;
        this.loadCurrentBoard();
    }

    drawToCanvas(canvas, ctx, grid = false, fullWall = true) {
        // User should resize the canvas before calling this, which will then regenerate the canvas with new bitmap
        const baseSide = Math.min(canvas.width, canvas.height);
        // resize canvas to a square ratio
        const ratio = this.width / this.height;
        if (ratio > 1) {
            // shrink height
            canvas.width = baseSide;
            canvas.height = baseSide / ratio;
        } else {
            // shrink width
            canvas.width = ratio * baseSide;
            canvas.height = baseSide;
        }
        // reset image smoothing to false because changing dimensions resets entire canvas
        ctx.imageSmoothingEnabled = false; // maybe should rely on user or save/load settings

        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                const index = x + y * this.width;
                const block = this.board.get_block_trbl(index);
                const space = this.board.get_space(index);
                Level.drawSpace(space, [x, y], this.width, this.height, ctx, canvas);
                if (grid) {
                    Level.drawSpace("gridOutline", [x, y], this.width, this.height, ctx, canvas);
                }
                if (block != null) {
                    if (fullWall && block.every((side) => {return side == "wallSide"})) {
                        // draw special fullblock wall
                        Level.drawSpace("wallTile", [x, y], this.width, this.height, ctx, canvas);
                    } else {
                        Level.drawBlock(block, [x, y], this.width, this.height, ctx, canvas);
                    }
                }
            }
        }
        const playerIndex = this.board.get_player();
        Level.drawSpace("playerTile", this.indexToPosition(playerIndex), this.width, this.height, ctx, canvas)
    }

    drawHighlights(highlightIndices, canvas, ctx) {
        for (const index of highlightIndices) {
            Level.drawSpace("spaceHighlight", this.indexToPosition(index), this.width, this.height, ctx, canvas);
        }
    }

    generateDataImageBlob() {
        // create canvas element to render board to
        let canvas = new OffscreenCanvas(320, 320);
        let ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false;
        ctx.fillRect(0, 0, 320, 320); // set all alpha to 255 so rgb is not lost (rgb is premultiplied by alpha ie set directly to given value * alpha)

        // insert data and return image/png blob
        this.drawToCanvas(canvas, ctx); // actual preview not just black
        Level.drawData(this.board.serialize_bytes(), canvas, ctx);
        return canvas.convertToBlob();
    }

    // no checks for if the data will fit
    static drawData(bytes, canvas, ctx) { //todo make this not bad // better but still don't like it
        let image = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let data = image.data;
        // IMPORTANT alpha channel gets reset to 255 on render so must be skipped
        // llm suggestion to extract pixel management into a function
        let p = 0;
        const setNextBits = (v) => {
            data[p] = (data[p] & ~0b11) | (v & 0b11);
            // next rgb, skipping alpha (4th channel)
            p++;
            if (p % 4 == 3) {p++}
        }
        // first add bottom 16 bits of length (bytes is a Uint8Array, so is unextendable)
        // compiler unlikely to unroll this but not expensive
        for (let i = 0; i < 2 * 8; i += 2) {
            setNextBits(bytes.length >> i);
        }
        // pack bytes into bottom 2 bits of rgb of pixels
        for (let i = 0; i < bytes.length * 8; i += 2) {
            setNextBits(bytes[i >> 3] >> (i % 8));
        }
        ctx.putImageData(image, 0, 0);
        // ctx.drawImage(Level.tileset, 0, 0, 100, 100, 0, 0, 50, 50);
        Level.dataFromImageData(ctx.getImageData(0, 0, canvas.width, canvas.height).data, canvas, ctx)
    }
    // no checks for valid data
    static dataFromImageData(data, canvas, ctx) {
        let bytes = [];
        let numBytes = 0;
        let p = 0;
        const getNextBits = () => {
            const o = data[p] & 0b11;
            p++;
            if (p % 4 == 3) {p++}
            return o;
        }
        // get number of bytes from first 16 bits
        for (let i = 0; i < 2 * 8; i += 2) {
            numBytes |= getNextBits() << i;
        }
        // read bytedata
        let byte = 0;
        for (let i = 0; i < numBytes * 8; i += 2) {
            byte |= getNextBits() << (i % 8);
            if (i % 8 == 6) {
                bytes.push(byte);
                byte = 0;
            }
        }
        return bytes
    }

    add_side(side) { // unsure if these should call loadCurrentBoard() since it will get called on the render anyway
        let updatedBoard = this.board.clone();
        if (side == "top") {updatedBoard.add_side_top()}
        if (side == "left") {updatedBoard.add_side_left()}
        if (side == "right") {updatedBoard.add_side_right()}
        if (side == "bottom") {updatedBoard.add_side_bottom()}
        this.history.add_not_seen(updatedBoard);
        this.loadCurrentBoard();
    }
    remove_side(side) {
        let updatedBoard = this.board.clone();
        if (side == "top") {updatedBoard.remove_side_top()}
        if (side == "left") {updatedBoard.remove_side_left()}
        if (side == "right") {updatedBoard.remove_side_right()}
        if (side == "bottom") {updatedBoard.remove_side_bottom()}
        this.history.add_not_seen(updatedBoard);
        this.loadCurrentBoard();
    }
    
    loadText(textData) {
        let board = Board.from_serialized(textData);
        this.history.add_not_seen(board);
        this.loadCurrentBoard();
    }
    loadBinary(binaryData) {
        let board = Board.from_serialized_bytes(binaryData);
        this.history.add_not_seen(board);
        this.loadCurrentBoard();
    }
    loadDefault(width, height) {
        let board = Board.default(width, height);
        this.history.add_not_seen(board);
        this.loadCurrentBoard();
    }

    static levelChangedCallback() {

    }

    static tileset;
    static sideOffsets = {
        "wallSide" : 68,
        "basicSide" : 0,
        "iceSide" : 34,
        "swapSide" : 102,
        "holeSide" : 136,
        "pushSwapSide" : 170,
        }
    static spaceOffsets = {
        "emptySpace" : 0,
        "goalSpace" : 34,
        "playerTile" : 68,
        "wallTile" : 102,
        "gridOutline" : 136,
        "spaceHighlight" : 170,
        }
    static {
        Level.tileset = new Image();
        Level.tileset.src = "sprites/modular.png";
    }
        
    static drawBlock(blockSides, gridPos, gridWidth, gridHeight, ctx, canvas) {
        for (let i = 0; i < 4; i++) {
            Level.drawTile(Level.sideOffsets[blockSides[i]], 0, gridPos, i*Math.PI/2, gridWidth, gridHeight, ctx, canvas);
        }
    }
    static drawSpace(space, gridPos, gridWidth, gridHeight, ctx, canvas) {
        Level.drawTile(Level.spaceOffsets[space], 34, gridPos, 0, gridWidth, gridHeight, ctx, canvas)
    }
    static drawTile(spriteXOffset, spriteYOffset, gridPos, angle, gridWidth, gridHeight, ctx, canvas) {
        // grid to canvas position
        const canvasX = gridPos[0] * (canvas.width / gridWidth);
        const canvasY = gridPos[1] * (canvas.height / gridHeight);
        const tileWidth = canvas.width / gridWidth;
        const tileHeight = canvas.height / gridHeight;
        const spriteSize = 32;
        // render image from spritesheet
        ctx.translate(canvasX + tileWidth/2, canvasY + tileHeight/2);
        ctx.rotate(angle);
        ctx.translate(-tileWidth/2, -tileHeight/2);
        ctx.drawImage(Level.tileset, spriteXOffset, spriteYOffset, spriteSize, spriteSize, 0, 0, tileWidth, tileHeight);
        ctx.translate(tileWidth/2, tileHeight/2);
        ctx.rotate(-angle);
        ctx.translate(-canvasX - tileWidth/2, -canvasY - tileHeight/2);
    }
}