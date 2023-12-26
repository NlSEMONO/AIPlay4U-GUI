export interface PositionedBlock {
    x: number,
    y: number, 
    blockType: string,
    next: Block | null,
    body: Block | null,
    code: string
}

export interface Block {
    blockType: string,
    next: Block,
    code: string
}

export interface SidebarParams {
    blocks: Array<PositionedBlock>,
    blockSetter: (arr: Array<PositionedBlock>) => void
}