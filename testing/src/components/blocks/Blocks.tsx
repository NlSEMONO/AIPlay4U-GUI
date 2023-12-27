import { XOFFSET } from "../../utils/Constants";
import { BlockParams, PositionedBlock, Block } from "../../utils/Definitions";
import { useState } from 'react';

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

const cloneBlocks: (blocks: Array<PositionedBlock>) 
                        => Array<PositionedBlock> = (blocks) => {
    let blocksSoFar = [];
    for (let i = 0; i < blocks.length; ++i) {
        blocksSoFar.push(blocks[i])
    }
    return blocksSoFar;
}

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

export const IfBlock = ({id, isParent, blocks, blockSetter, x, y, code} : BlockParams) => {
    const [text, setText] = useState<string>(code);
    const [dragged, setDragged] = useState<boolean>(false);
    const [clickOffset, setClickOffset] = useState<Array<number>>([0, 0]);
    const inputClasses = "bg-white text-black w-32 h-8 my-auto p-2 rounded";
    const blockClasses = "bg-if w-64 h-16 px-4 relative m-0 rounded flex flex-row justify-around";
    const minDiff = 30; // minimum radius to disconnect connected blocks

    const handleDrag: (event: React.DragEvent) => void = (event) => { 
        if (event.pageX === 0 || 0 >= event.pageX - (XOFFSET * 4)) {
            console.log("DROPPPED!");
            setDragged(false);
            return;
        }

        const block = getBlockById(id, blocks);
        if (!block) return;
        
        let newBlock: PositionedBlock | null = null;
        if (isParent) {
            let newBlocks = cloneBlocks(blocks);
            if (!dragged) setClickOffset([event.pageX - (block as PositionedBlock).x, event.pageY - y]);
            let newX: number = (dragged) ? (event.pageX - clickOffset[0]) : x;
            let newY: number = (dragged) ? (event.pageY - clickOffset[1]) : y;
            newBlock = {
                id: id, x: newX, y: newY, 
                code: code, next: null, body: block.body, 
                blockType: block.blockType
            }
            replaceBlockById(id, newBlock, newBlocks);
            blockSetter(newBlocks);
            setDragged(true);
        }
        else if (minDiff <= Math.abs(x - event.clientX) || minDiff <= Math.abs(y - event.clientY)) {

        }
        if (newBlock !== null)  {
            console.log(event.pageX + " " + event.pageY);
            console.log(newBlock.x + " " + newBlock.y);
        }
    }

    return (
        <div className={blockClasses} style={{top: y, left: x, margin: 0}} 
            draggable onDrag={handleDrag} onDrop={event => setDragged(false)}>
            <h1> IF </h1>
            <input type="text" className={inputClasses} onChange={(e) => setText(e.target.value)} value={text}/>
        </div>
    );
}

export const EndBlock = ({id, isParent, blocks, blockSetter, x, y, code} : BlockParams) => {
    const blockClasses = "bg-if w-64 h-16 px-4 relative m-0 rounded flex flex-row justify-around";

    return <div className={blockClasses} style={{top: y, left: x, margin: 0}}>  
            <h1> END </h1> 
            </div>
}

// export const EndIfBlock(id, isParent)