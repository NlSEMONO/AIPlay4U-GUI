import { useState } from 'react'
import { PositionedBlock } from "./utils/Definitions";
import Sidebar from './components/Sidebar';
import './App.css'

function App() {
  const [blocks, setBlocks] = useState<Array<PositionedBlock>>([]);
  const XOFFSET = 96;

  return (
    <>
      <Sidebar blocks={blocks} blockSetter={setBlocks}/>
    </>
  )
}

export default App
