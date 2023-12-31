import { useState } from 'react';
import { BWIDTH, blockTypes } from "../utils/Constants";
import { SidebarParams, PositionedBlock, Block } from "../utils/Definitions";

// Sidebar(blocks, blockSetter) returns the sidebar used to add new blocks to
//   the drawing area.
export default function Sidebar({blocks, blockSetter} : SidebarParams) {
    const [ids, setIds] = useState<number>(0);

    // handleClick(itm) adds a block of type itm to the back of the current state
    //   of blocks.
    const handleClick: (a: string) => void = (itm: string) => {
        const copy = copyBlocks(blocks);
        let added: number = 1;
        let newX: number = (copy.length === 0) ? 0 : copy[copy.length- 1].x + BWIDTH * 4;
        let newBlock: PositionedBlock = {
            id: ids, x: newX, y: 0, blockType: itm, next: null, code: "", body: null
        };
        if (itm === 'IF' || itm === 'REPEAT TIMES' || itm === 'REPEAT CONDITION') {
            let endBlock: Block = {
                id: ids + 1, blockType: 'END', next: null, code: "", body: null
            }
            newBlock.next = endBlock;
            ++added;
        }
        copy.push(newBlock);
        blockSetter(copy);
        setIds(ids + added);
    }

    const createBlockButtons = blockTypes.map((itm) => {
        return ((itm === 'END') ? null : <button className="w-60 text-xl my-4" onClick={() => { handleClick(itm); console.log(blocks)}}>
                {itm}
                </button>);
    });

    return (
        <div className="w-96 absolute l-0 border-r-8 h-full">
        <h1 className="text-5xl w-72 mt-8 mb-8 mx-auto font-bold"> ADD CODE </h1>
        <div className="w-72 mx-auto"> 
            {createBlockButtons}
        </div>
        </div>
    ); 
}

// copyArr(arr) returns a copy of arr.
// time: O(n)
function copyBlocks(blocks: Array<PositionedBlock>) {
    let copy = [];
    for (let i = 0; i < blocks.length; ++i) copy.push(blocks[i]);
    return copy;
  }