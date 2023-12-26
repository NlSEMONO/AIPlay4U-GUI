export interface PositionedBlock {
    x: number,
    y: number, 
    blockType: string
}

export interface Block {
    blockType: string
}

export interface SidebarParams {
    blocks: Array<PositionedBlock>,
    blockSetter: (arr: Array<PositionedBlock>) => void
}