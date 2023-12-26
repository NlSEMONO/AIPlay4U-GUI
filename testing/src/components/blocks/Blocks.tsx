import { BlockParams } from "../../utils/Definitions";
import { useState} from 'react';

export const IfBlock = ({x, y, code} : BlockParams) => {
    const [text, setText] = useState(code);
    return (
        <div className="bg-if w-64 h-16 px-4 relative m-0 rounded flex flex-row justify-around" style={{top: y * 4, left: 0, margin: 0}} draggable>
            <h1> IF </h1>
            <input type="text" className="bg-white text-black w-32 h-8 my-auto p-4 rounded" onChange={(e) => setText(e.target.value)} value={text}/>
        </div>
    );
}