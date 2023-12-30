import { BlockParams, EndBlockParams } from "../../utils/Definitions";
import { useBlock } from "./BlockHelpers";

// IfBlock(id, isParent, blocks, blockSetter, x, y, code) returns a component
//    representing an if statement. Note that (x, y) are relative to the sequence
//    div the IfBlock is stored in.
export const IfBlock = ({id, isParent, blocks, blockSetter, x, y, code, draggedId, setDraggedId} : BlockParams) => {
    const inputClasses = "bg-white text-black w-32 h-8 my-auto p-2 rounded";
    const blockClasses = "bg-if w-64 h-16 px-4 relative m-0 rounded flex flex-row justify-around";
    const {code: text, onChange, onDrag, onDragOver, onDrop} = useBlock({id, isParent, blocks, blockSetter, x, y, code, draggedId, setDraggedId});
    return (
            <div className={blockClasses} style={{top: y, left: x, margin: 0}} 
                draggable onDrag={onDrag} 
                onDragOver={onDragOver} 
                onDrop={onDrop}>
                <h1> IF </h1>
                <input type="text" className={inputClasses} onChange={onChange} value={text}/>
            </div>
        );
}

// EndBlock(id, isParent, blocks, blockSetter, x, y, code) returns a component
//    representing an end block (to denote the end of a body). Note that (x, y) 
//    are relative to the sequence div the IfBlock is stored in.
export const EndBlock = ({defaultParams, prevType} : EndBlockParams) => {
    let blockClasses = "bg-if w-64 h-16 px-4 relative m-0 rounded flex flex-row justify-around";
    if (prevType === 'REPEAT TIMES') {
        blockClasses = "bg-rt w-64 h-16 px-4 relative m-0 rounded flex flex-row justify-around"
    }
    else if (prevType === 'REPEAT CONDITION') {
        blockClasses = "bg-rc w-64 h-16 px-4 relative m-0 rounded flex flex-row justify-around"
    }
    const stuff = useBlock(defaultParams);

    return (<div className={blockClasses} style={{top: defaultParams.y, left: defaultParams.x, margin: 0}} 
                draggable onDrag={stuff['onDrag']} 
                onDragOver={stuff['onDragOver']} 
                onDrop={stuff['onDrop']}>
                <h1> END </h1> 
            </div>);
}

// SetBlock(id, isParent, blocks, blockSetter, x, y, code) returns a component
//    representing a set statement (setting the value of a variable). Note that 
//    (x, y) are relative to the sequence div the IfBlock is stored in.

// export const EndIfBlock(id, isParent)