import { BlockEditorParams, PositionedBlock, Block, isPositionedBlock } from "../utils/Definitions";
import { IfBlock } from "./blocks/Blocks";

export default function BlockEditor({blocksData, blockSetter} : BlockEditorParams) {
    const classes = "ml-96 px-8 py-4";
    const blocksDisplay = [];
    for (let i = 0; i < blocksData.length; ++i) {
        let x = blocksData[i].x;
        let y = blocksData[i].y;
        let curr: PositionedBlock | Block | null = blocksData[i];
        let seqeunce = [];
        while (curr !== null) {
            if (curr.blockType === 'IF') {
                seqeunce.push(<IfBlock 
                                id={curr.id} blocks={blocksData} blockSetter={blockSetter}
                                isParent={isPositionedBlock(curr) ? true : false}
                                x={x} y={y} code={curr.code}/>);
            }
            y += 16;
            curr = curr.next;
        }
        blocksDisplay.push(
            <div className="relative m-auto w-fit" style={{top: 0, left: x * 4, margin: 0}}>
                {seqeunce}
            </div>
        );
    }
    return (
        <div className={classes}>
            {blocksDisplay}
        </div>
    )
}