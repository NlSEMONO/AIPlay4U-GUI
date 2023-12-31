import { XOFFSET, BHEIGHT, BWIDTH, DEPTHINC } from "../../utils/Constants";
import { BlockParams, PositionedBlock, Block, PotentialBlock } from "../../utils/Definitions";
import { useState } from 'react';

// getBlockById(id, blocks) returns the block associated with a given id.
// time: O(n)
const getBlockById: (id: number, blocks: Array<PositionedBlock | Block >) 
                                        => PotentialBlock = (id, blocks) => {
    for (let i = 0; i < blocks.length; ++i) {
        let curr: PotentialBlock = blocks[i];
        while (curr !== null) {
            if (curr.id === id) return curr;
            if (curr.body !== null) {
                let blockInBody = getBlockById(id, [curr.body]);
                if (blockInBody !== null) return blockInBody;
            }
            curr = curr.next;
        }
    }
    return null;
}

// cloneBlocks(blocks) returns a clone of blocks.
// time: O(n)
const cloneBlocks: (blocks: Array<PositionedBlock>) 
                        => Array<PositionedBlock> = (blocks) => {
    let blocksSoFar = [];
    for (let i = 0; i < blocks.length; ++i) {
        blocksSoFar.push(blocks[i])
    }
    return blocksSoFar;
}

// replaceBlockById(id, newBlock, blocks) returns a clone of blocks where the block 
//    associated with id is replaced with newBlock. 
// time: O(n)
const replaceBlockById: (id: number, newBlock: Block | PositionedBlock, blocks: Array<PositionedBlock | Block >) => void = (id, newBlock, blocks) => {
    for (let i = 0; i < blocks.length; ++i) {
        let curr: PotentialBlock = blocks[i];
        let prev: PotentialBlock = null;
        while (curr !== null) {
            if (curr.id === id) {
                if (prev === null) {
                    newBlock.next = blocks[i].next;
                    blocks[i] = newBlock;
                }
                else {
                    if (newBlock !== null) newBlock.next = curr.next;
                    if (prev !== null) prev.next = newBlock;
                }
            }
            if (curr.body !== null) replaceBlockById(id, newBlock, [curr.body]);
            prev = curr;
            curr = curr.next;
        }
    }
}

// getParent(id, blocks) returns the PositionedBlock the block represented by id
//   is under.
// time: O(n)
const getParent: (id: number, blocks: Array<PositionedBlock>) =>  PositionedBlock | null = (id, blocks) => {
    for (let i = 0; i < blocks.length; ++i) {
        let result = getBlockById(id, [blocks[i]]);
        if (result !== null) return blocks[i];
    }
    return null;
}

// tryFindTarget(x, y, depth, ySoFar, pX, pY, draggedId, block) returns which 
//   block a pair of (x, y) is within that isn't draggedId, based on depth, ySoFar
//   and the parent's (x, y) coordinates. Returns null if such a block doesn't
//   exist.
// time: O(n)
const tryFindTarget: (x: number, y: number, depth: number, ySoFar: number, pX: number, pY: number, draggedId: number, block: PositionedBlock | Block) 
                                                                            => PositionedBlock | Block | number = (x, y, depth, ySoFar, pX, pY, draggedId, block) => {
    let curr: PotentialBlock = block;
    while (curr !== null) {
        let effectiveX = XOFFSET * 4 + pX + depth * DEPTHINC;
        let effectiveY = pY + ySoFar;
        console.log('128904182390481294812934');
        console.log("EFF X: " + effectiveX);
        console.log(`EFF Y ${effectiveY}`);
        
        if (curr.id !== draggedId && effectiveX <= x && x <= effectiveX + BWIDTH * 4 && effectiveY <= y && y <= effectiveY + BHEIGHT * 4) {
            return curr;
        }
        if (curr.body !== null) {
            let result = tryFindTarget(x, y, depth + 1, ySoFar + BHEIGHT * 4 + 16, pX, pY, draggedId, curr.body);
            if (typeof(result) === "number") return ySoFar = result as number;
            else return result;
        }
        else ySoFar += 16 + BHEIGHT * 4;
        curr = curr.next;
    }
    return ySoFar;
}


// getTarget(x, y, draggedId, blocks) returns which block a pair of (x, y) is 
//   within that isn't draggedId.
// time: O(n)
const getTarget: (x: number, y: number, draggedId: number, blocks: Array<PositionedBlock>) 
                                                    => PotentialBlock = (x, y, draggedId, blocks) => {
    console.log(`TGT X:${x}`);
    console.log(`TGT Y:${y}`);
    console.log(`DRG ID:${draggedId}`);
    console.log(blocks);
    for (let i = 0; i < blocks.length; ++i) {
        let result = tryFindTarget(x, y, 0, 0, blocks[i].x, blocks[i].y, draggedId, blocks[i]);
        if (typeof(result) !== "number") return result;
    }
    return null;
}

// removeBlockById(id, block) removes the block represented by id (if its nested
//   within block). Returns null if a block with id is not in block.
// time: O(n)
const removeBlockById: (id: number, block: PositionedBlock | Block) => PotentialBlock = (id, block) => {
    let curr: PotentialBlock = block;
    let prev: PotentialBlock = null;
    while (curr !== null) {
        if (id === curr.id) {
            if (prev === null) {
                return null;
            }
            else {
                prev.next = null;
                return block;
            }
        }
        if (curr.body !== null) {
            let bodyRes = removeBlockById(id, curr.body);
            curr.body = bodyRes;
        }
        prev = curr;
        curr = curr.next;
    }
    return block;
}

export const useBlock = ({id, isParent, blocks, blockSetter, x, y, code, draggedId, setDraggedId} : BlockParams) => {
    const [text, setText] = useState<string>(code);
    const [dragged, setDragged] = useState<boolean>(false);
    const [clickOffset, setClickOffset] = useState<Array<number>>([0, 0]);
    const minDiff = 30; // minimum radius to disconnect connected blocks

    const handleDrag: (event: React.DragEvent) => void = (event) => { 
        // console.log(event.pageX + " " + event.pageY);
        if (event.pageX === 0 || 0 > event.pageX - (XOFFSET * 4)) {
            console.log("DROPPPED!");
            setDragged(false);
            return;
        }

        const block = getBlockById(id, blocks);
        if (!block) return;
        
        setDraggedId(id);
        let newBlock: PositionedBlock | null = null;
        let newBlocks = cloneBlocks(blocks);
        // current block is a PositionedBlock block
        if (isParent) {
            if (!dragged) setClickOffset([event.pageX - (block as PositionedBlock).x, event.pageY - (block as PositionedBlock).y]);
            let newX: number = (dragged) ? (event.pageX - clickOffset[0]) : x;
            let newY: number = (dragged) ? (event.pageY - clickOffset[1]) : y;
            newBlock = {
                id: id, x: newX, y: newY, 
                code: code, next: block.next, body: block.body, 
                blockType: block.blockType
            }
            replaceBlockById(id, newBlock, newBlocks);
            blockSetter(newBlocks);
            setDragged(true);

            return;
        }
        let parent: PositionedBlock = (getParent(id, blocks) as PositionedBlock); // guaranteed to return something if the block itself isn't a parent
        let effectiveX: number = parent.x + x;
        let effectiveY: number = parent.y + y;
        if (!dragged) {
            let newOffset: Array<number> = [event.pageX - effectiveX, event.pageY - effectiveY];
            setClickOffset(newOffset);
        }

        // edge case -- trying to move end (you have to move parent in this case)
        if (block.blockType === 'END') {
            let newParent: PositionedBlock;
            let newX: number = (dragged) ? event.pageX - x - clickOffset[0] : parent.x;
            let newY: number = (dragged) ? event.pageY - y - clickOffset[1] : parent.y;
            newParent = {
                id: parent.id, x: newX, y: newY, 
                code: parent.code, next: parent.next, body: parent.body, 
                blockType: parent.blockType
            }
            replaceBlockById(parent.id, newParent, newBlocks);
            blockSetter(newBlocks);
            setDragged(true);
        }
        // move out of the parent block
        else if (minDiff <= Math.abs(effectiveX - event.clientX) || minDiff <= Math.abs(effectiveY - event.clientY)) {
            newBlocks = [];
            console.log(block);
            for (let i = 0; i < blocks.length; ++i) {
                let result: PotentialBlock = removeBlockById(id, blocks[i]);
                if (result !== null) newBlocks.push(result as PositionedBlock);
            }
            console.log(newBlocks);
            // for (let i = 0; i < newBlocks.length; ++i) if (newBlocks[i].id === id) return;
            newBlock = {
                id: id, x: effectiveX + 72, y: effectiveY, 
                code: code, next: block.next, body: block.body, 
                blockType: block.blockType
            }
            console.log(newBlock);
            newBlocks.push(newBlock);
            console.log(newBlocks);
            blockSetter(newBlocks);
            setDragged(false);
        }
    }

    const onDragOver: (event: React.DragEvent) => void = (event) => {
        event.preventDefault();
    }

    const onDrop: (event: React.DragEvent) => void = (event) => {
        // console.log("FFFFFFFFFFFFFF");
        let newBlocks = cloneBlocks(blocks);
        let draggedBlock = getBlockById(draggedId, blocks);
        if (draggedBlock === null) return;
        // console.log(id +" " + draggedId);
        // console.log(draggedBlock);
        // console.log(newBlocks);

        let block: PotentialBlock = getTarget(event.pageX, event.pageY, draggedId, newBlocks);
        // console.log(block);
        if (block === null) return;
        let newNewBlocks: Array<PositionedBlock> = [];
        for (let i = 0; i < newBlocks.length; ++i) {
            let result: PotentialBlock = removeBlockById(draggedId, newBlocks[i]);
            if (result !== null) newNewBlocks.push(result as PositionedBlock);
        }
        let newBlock: Block = {
            id: draggedBlock.id, 
            next: draggedBlock.next, 
            body: draggedBlock.body,
            code: draggedBlock.code,
            blockType: draggedBlock.blockType
        }
        if (block.blockType === 'IF' || block.blockType === 'REPEAT CONDITION' || block.blockType === 'REPEAT TIMES') {
            // console.log('hi');
            // console.log(block);
            if (block.body === null) {
                block.body = newBlock;
            }
            else {
                let curr: PotentialBlock = newBlock;
                let prev = newBlock;
                while (curr !== null) {
                    prev = curr;
                    curr = curr.next;
                }
                prev.next = block.body;
                block.body = newBlock;
            }
        }
        else {
            console.log('b')
            let curr: PotentialBlock = newBlock;
            let prev = newBlock;
            while (curr !== null) {
                prev = curr;
                curr = curr.next;
            }
            prev.next = block.next;
            block.next = newBlock;
        }
        console.log(newNewBlocks);
        blockSetter(newNewBlocks);
        setDragged(false);
        setDraggedId(-1);
    }

    const handleClick: (e: React.ChangeEvent<HTMLInputElement>) => void = 
                                                e => setText(e.target.value);

    return (
        {
            code: text,
            onDrag: handleDrag, 
            onDragOver: onDragOver,
            onDrop: onDrop,
            onChange: handleClick,
        }
    );
}