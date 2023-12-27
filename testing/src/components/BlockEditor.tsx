import { BlockEditorParams, PositionedBlock, Block, isPositionedBlock } from "../utils/Definitions";
import { EndBlock, IfBlock } from "./blocks/Blocks";

export default function BlockEditor({blocksData, blockSetter} : BlockEditorParams) {
    const classes = "ml-96 px-8 py-4";
    const blocksDisplay = [];

    const createBlock: (depth: number, y: number, block: PositionedBlock | Block) => Array<any> = (depth, y, block) => {
        let curr: PositionedBlock | Block | null = block;
        let prev: PositionedBlock | Block | null = null;
        let sequence: Array<any> = [];
        let xCoord = depth * 16;
        while (curr !== null) {
            if (curr.blockType === 'IF') {
                sequence.push(<IfBlock 
                                id={curr.id} blocks={blocksData} blockSetter={blockSetter}
                                isParent={isPositionedBlock(curr) ? true : false}
                                x={xCoord} y={y} code={curr.code}/>);
            } 
            else if (curr.blockType === 'END') {
                sequence.push(<EndBlock
                                id={curr.id} blocks={blocksData} blockSetter={blockSetter}
                                isParent={isPositionedBlock(curr) ? true : false}
                                x={xCoord} y={y} code={curr.code}/>);
            }
            let bodyBlocks = [];
            if (curr.body !== null) bodyBlocks = createBlock(depth + 1, y + 16, curr.body);
            sequence.concat(bodyBlocks);
            y += 16 + bodyBlocks.length * 16;
            prev = curr;
            curr = curr.next;
        }
        return sequence;
    }
    for (let i = 0; i < blocksData.length; ++i) {
        let x = blocksData[i].x;
        let y = blocksData[i].y;
        let curr: PositionedBlock = blocksData[i];
        let sequence = createBlock(0, y, curr);
        
        blocksDisplay.push(
            <div className="relative m-auto w-fit" style={{top: 0, left: x, margin: 0}}>
                {sequence}
            </div>
        );
    }
    return (
        <div className={classes}>
            {blocksDisplay}
        </div>
    )
}