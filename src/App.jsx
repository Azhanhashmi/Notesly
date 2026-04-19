import { useState } from 'react'
import { useBlocks } from './hooks/useBlocks'
import Sidebar from './components/Sidebar'
import Canvas from './components/Canvas'

function SaveBadge({ saved }) {
  return (
    <div className={`flex items-center gap-1.5 transition-all duration-500 ${saved ? 'opacity-100' : 'opacity-0'}`}>
      <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
      <span className="text-[11px] font-mono text-gray-400">Saved</span>
    </div>
  )
}

export default function App() {
  const { blocks, addBlock, updateBlock, deleteBlock, duplicateBlock, reorderBlocks, clearAll } = useBlocks()
  const [showSaved, setShowSaved] = useState(true)

  const handleAddBlock = (type) => {
    addBlock(type)
    triggerSaved()
  }

  const handleUpdate = (id, content) => {
    updateBlock(id, content)
    triggerSaved()
  }

  const triggerSaved = () => {
    setShowSaved(false)
    setTimeout(() => setShowSaved(true), 600)
  }

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-[#f5f5f5]">
      <Sidebar onAddBlock={handleAddBlock} blockCount={blocks.length} onClearAll={clearAll} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="shrink-0 h-12 flex items-center justify-between px-8 bg-white border-b border-gray-100">
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-[13px] text-gray-800 tracking-tight">
              Page
            </span>
            <span className="text-gray-200 text-lg leading-none">·</span>
            <SaveBadge saved={showSaved} />
          </div>
          <span className="text-[11px] font-mono text-gray-300">
            Drag to reorder · Click to edit
          </span>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-6 py-10">
            <Canvas
              blocks={blocks}
              onUpdate={handleUpdate}
              onDelete={deleteBlock}
              onDuplicate={duplicateBlock}
              onReorder={reorderBlocks}
              onAddBlock={handleAddBlock}
            />
          </div>
        </main>
      </div>
    </div>
  )
}
