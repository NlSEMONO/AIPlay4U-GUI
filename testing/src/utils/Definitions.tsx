// Definitions
export interface PositionedBlock {
    id: number,
    x: number,
    y: number, 
    blockType: string,
    next: Block | null,
    body: Block | null,
    code: string
}

export interface Block {
    id: number,
    blockType: string,
    next: Block | null,
    body: Block | null,
    code: string
}

export type PotentialBlock = Block | null | PositionedBlock;

export interface BlockParams {
    id: number, 
    isParent: boolean,
    blocks: Array<PositionedBlock>,
    blockSetter: (blocks: Array<PositionedBlock>) => void,
    x: number, 
    y: number,
    code: string, 
    draggedId: number,
    setDraggedId: (n: number) => void,
}

export interface EndBlockParams {
    defaultParams: BlockParams,
    prevType: string;
}

export interface SidebarParams {
    blocks: Array<PositionedBlock>,
    blockSetter: (arr: Array<PositionedBlock>) => void
}

export interface BlockEditorParams {
    blocksData: Array<PositionedBlock>,
    blockSetter: (arr: Array<PositionedBlock>) => void
}

// type checkers
export const isPositionedBlock: (value: any) => boolean = (value) => {
    return (value as PositionedBlock).x !== undefined;
}