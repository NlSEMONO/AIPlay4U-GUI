import { XOFFSET } from "../../utils/Constants";
import { BlockParams, PositionedBlock, Block } from "../../utils/Definitions";
import { useState } from 'react';

// getBlockById(id, blocks) returns the block associated with a given id.
// time: O(n)
const getBlockById: (id: number, blocks: Array<PositionedBlock | Block >) 
                        => PositionedBlock | Block | null = (id, blocks) => {
    for (let i = 0; i < blocks.length; ++i) {
        let curr: null | PositionedBlock | Block = blocks[i];
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

// cloneBlocks(id, newBlock, blocks) returns a clone of blocks where the block 
//    associated with id is replaced with newBlock.
// time: O(n)
const replaceBlockById: (id: number, newBlock: Block | PositionedBlock, blocks: Array<PositionedBlock | Block >) => void = (id, newBlock, blocks) => {
    for (let i = 0; i < blocks.length; ++i) {
        let curr: null | PositionedBlock | Block = blocks[i];
        let prev: null | PositionedBlock | Block = null;
        while (curr !== null) {
            if (curr.id === id) {
                if (prev === null) {
                    newBlock.next = blocks[i].next;
                    blocks[i] = newBlock;
                }
                else {
                    newBlock.next = curr.next;
                    prev.next = newBlock;
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

// getLength(block) returns how many times
// time: O(n)
// const getPosn: (block: PositionedBlock | Block) => number = (block) => {
//     let sum: number = 0;
//     let curr: PositionedBlock | Block | null = block;
//     while (curr !== null) {
//         let bodyLen = (curr.body) ? getLength(curr.body) : 0;
//         sum += 1 + bodyLen;
//         curr = curr.next;
//     }
//     return sum;
// }

export const useBlock = ({id, isParent, blocks, blockSetter, x, y, code} : BlockParams) => {
    const [text, setText] = useState<string>(code);
    const [dragged, setDragged] = useState<boolean>(false);
    const [clickOffset, setClickOffset] = useState<Array<number>>([0, 0]);
    const minDiff = 30; // minimum radius to disconnect connected blocks

    const handleDrag: (event: React.DragEvent) => void = (event) => { 
        if (event.pageX === 0 || 0 > event.pageX - (XOFFSET * 4)) {
            console.log("DROPPPED!");
            setDragged(false);
            return;
        }

        const block = getBlockById(id, blocks);
        if (!block) return;
        
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
        console.log("*************************************");
        if (!dragged) {
            let newOffset: Array<number> = [event.pageX - effectiveX, event.pageY - effectiveY];
            console.log(newOffset[0]);
            console.log(newOffset[1]);
            setClickOffset(newOffset);
        }

        // edge case -- trying to move end (you have to move parent in this case)
        if (block.blockType === 'END') {
            let newParent: PositionedBlock;
            let newX: number = (dragged) ? event.pageX - x -clickOffset[0] : parent.x;
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
        else if (minDiff <= Math.abs(x - event.clientX) || minDiff <= Math.abs(y - event.clientY)) {
            
        }
        // if (newBlock !== null)  {
        //     console.log(event.pageX + " " + event.pageY);
        //     console.log(newBlock.x + " " + newBlock.y);
        // }
    }

    const handleClick: (e: React.ChangeEvent<HTMLInputElement>) => void = 
                                                e => setText(e.target.value);

    return (
        {
            code: text,
            onDrag: handleDrag, 
            onChange: handleClick,
        }
    );
}