import { XOFFSET } from "../../utils/Constants";
import { BlockParams, PositionedBlock, Block } from "../../utils/Definitions";
import { useState } from 'react';
import { useBlock } from "./BlockHelpers";

// IfBlock(id, isParent, blocks, blockSetter, x, y, code) returns a component
//    representing an if statement. Note that (x, y) are relative to the sequence
//    div the IfBlock is stored in.
export const IfBlock = ({id, isParent, blocks, blockSetter, x, y, code} : BlockParams) => {
    const inputClasses = "bg-white text-black w-32 h-8 my-auto p-2 rounded";
    const blockClasses = "bg-if w-64 h-16 px-4 relative m-0 rounded flex flex-row justify-around";
    const {code: text, onChange, onDrag} = useBlock({id, isParent, blocks, blockSetter, x, y, code});
    return (
            <div className={blockClasses} style={{top: y, left: x, margin: 0}} 
                draggable onDrag={onDrag}>
                <h1> IF </h1>
                <input type="text" className={inputClasses} onChange={onChange} value={text}/>
            </div>
        );
}



export const EndBlock = ({id, isParent, blocks, blockSetter, x, y, code} : BlockParams) => {
    const blockClasses = "bg-if w-64 h-16 px-4 relative m-0 rounded flex flex-row justify-around";
    const {code: text, onChange, onDrag} = useBlock({id, isParent, blocks, blockSetter, x, y, code});
    
    return (<div className={blockClasses} style={{top: y, left: x, margin: 0}} 
                draggable onDrag={onDrag}>
                <h1> END </h1> 
            </div>);
}

// export const EndIfBlock(id, isParent)