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

// EndBlock(defaultParams, prevType) returns a component representing an end block
//    (to denote the end of a body). Note that (x, y) are relative to the sequence
//    div the EndBlock is stored in.
export const EndBlock = ({defaultParams, prevType} : EndBlockParams) => {
    let blockClasses = "bg-if w-64 h-16 px-4 relative m-0 rounded flex flex-row justify-around";
    // set blockClasses to different colour based on what the type of the block before end is (done like this because of tailwind)
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
//    (x, y) are relative to the sequence div the SetBlock is stored in.
export const SetBlock = ({id, isParent, blocks, blockSetter, x, y, code, draggedId, setDraggedId} : BlockParams) => {
    const inputClasses = "bg-white text-black w-32 h-8 my-auto p-2 rounded";
    const blockClasses = "bg-set w-64 h-16 px-4 relative m-0 rounded flex flex-row justify-around";
    const {code: text, onChange, onDrag, onDragOver, onDrop} = useBlock({id, isParent, blocks, blockSetter, x, y, code, draggedId, setDraggedId});
    return (
            <div className={blockClasses} style={{top: y, left: x, margin: 0}} 
                draggable onDrag={onDrag} 
                onDragOver={onDragOver} 
                onDrop={onDrop}>
                <h1> SET </h1>
                <input type="text" className={inputClasses} onChange={onChange} value={text}/>
            </div>
        );
}

// DefBlock(id, isParent, blocks, blockSetter, x, y, code) returns a component
//    representing a define statement (setting the value of a variable). Note that 
//    (x, y) are relative to the sequence div the DefBlock is stored in.
export const DefBlock = ({id, isParent, blocks, blockSetter, x, y, code, draggedId, setDraggedId} : BlockParams) => {
    const inputClasses = "bg-white text-black w-32 h-8 my-auto p-2 rounded";
    const blockClasses = "bg-def w-64 h-16 px-4 relative m-0 rounded flex flex-row justify-around";
    const {code: text, onChange, onDrag, onDragOver, onDrop} = useBlock({id, isParent, blocks, blockSetter, x, y, code, draggedId, setDraggedId});
    return (
            <div className={blockClasses} style={{top: y, left: x, margin: 0}} 
                draggable onDrag={onDrag} 
                onDragOver={onDragOver} 
                onDrop={onDrop}>
                <h1> DEF </h1>
                <input type="text" className={inputClasses} onChange={onChange} value={text}/>
            </div>
        );
}

// RTBlock(id, isParent, blocks, blockSetter, x, y, code) returns a component
//    representing a repeat times statement (setting the value of a variable). 
//    Note that (x, y) are relative to the sequence div the RTBlock is stored in.
export const RTBlock = ({id, isParent, blocks, blockSetter, x, y, code, draggedId, setDraggedId} : BlockParams) => {
    const inputClasses = "bg-white text-black w-8 h-8 my-auto p-2 rounded";
    const blockClasses = "bg-rt w-64 h-16 px-4 relative m-0 rounded flex flex-row justify-around";
    const textClasses = "text-2xl self-center";
    const {code: text, onChange, onDrag, onDragOver, onDrop} = useBlock({id, isParent, blocks, blockSetter, x, y, code, draggedId, setDraggedId});
    return (
            <div className={blockClasses} style={{top: y, left: x, margin: 0}} 
                draggable onDrag={onDrag} 
                onDragOver={onDragOver} 
                onDrop={onDrop}>
                <h1 className={textClasses}> REPEAT </h1>
                <input type="text" className={inputClasses} onChange={onChange} value={text}/>
                <h1 className={textClasses}> TIMES </h1>
            </div>
        );
}


// RCBlock(id, isParent, blocks, blockSetter, x, y, code) returns a component
//    representing a repeat times statement (setting the value of a variable). 
//    Note that (x, y) are relative to the sequence div the RTBlock is stored in.
export const RCBlock = ({id, isParent, blocks, blockSetter, x, y, code, draggedId, setDraggedId} : BlockParams) => {
    const inputClasses = "bg-white text-black w-32 h-8 my-auto p-2 rounded";
    const blockClasses = "bg-rc w-64 h-16 px-4 relative m-0 rounded flex flex-row justify-around";
    const textClasses = "text-2xl self-center";
    const {code: text, onChange, onDrag, onDragOver, onDrop} = useBlock({id, isParent, blocks, blockSetter, x, y, code, draggedId, setDraggedId});
    return (
            <div className={blockClasses} style={{top: y, left: x, margin: 0}} 
                draggable onDrag={onDrag} 
                onDragOver={onDragOver} 
                onDrop={onDrop}>
                <h1 className={textClasses}> REPEAT WHILE </h1>
                <input type="text" className={inputClasses} onChange={onChange} value={text}/>
            </div>
        );
}