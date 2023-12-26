import { useState } from 'react'
import { PositionedBlock } from "./utils/Definitions";
import Sidebar from './components/Sidebar';
import './App.css'
import BlockEditor from './components/BlockEditor';

function App() {
  const [blocks, setBlocks] = useState<Array<PositionedBlock>>([]);

  return (
    <>
      <Sidebar blocks={blocks} blockSetter={setBlocks}/>
      <BlockEditor blocksData={blocks} blockSetter={setBlocks}/>
    </>
  )
}

export default App
