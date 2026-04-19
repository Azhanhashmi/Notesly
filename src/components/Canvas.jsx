import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers'
import { useState } from 'react'

import BlockWrapper from './BlockWrapper'
import HeaderBlock from './HeaderBlock'
import TextBlock from './TextBlock'
import ImageBlock from './ImageBlock'

function renderBlockContent(block, onChange) {
  switch (block.type) {
    case 'header':
      return <HeaderBlock content={block.content} onChange={(c) => onChange(block.id, c)} />
    case 'text':
      return <TextBlock content={block.content} onChange={(c) => onChange(block.id, c)} />
    case 'image':
      return <ImageBlock content={block.content} onChange={(c) => onChange(block.id, c)} />
    default:
      return <p className="text-gray-400 text-sm">Unknown block type</p>
  }
}

function EmptyState({ onAddBlock }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center px-8 animate-fade-in">
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-gray-400">
            <rect x="3" y="3" width="8" height="8" rx="1.5" />
            <rect x="13" y="3" width="8" height="8" rx="1.5" />
            <rect x="3" y="13" width="8" height="8" rx="1.5" />
            <path d="M17 17h.01M17 21v-4M21 17h-4" />
          </svg>
        </div>
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-black rounded-full flex items-center justify-center">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </div>
      </div>
      <h2 className="font-display font-700 text-[22px] text-gray-900 tracking-tight mb-2">
        Canvas is empty
      </h2>
      <p className="text-gray-400 text-[14px] leading-relaxed max-w-xs mb-6">
        Add your first block from the sidebar to start building your page.
      </p>
      <div className="flex gap-2">
        {['header', 'text', 'image'].map((type) => (
          <button
            key={type}
            onClick={() => onAddBlock(type)}
            className="px-3 py-1.5 rounded-lg text-[12px] font-medium bg-gray-100 text-gray-600
              hover:bg-black hover:text-white transition-all duration-150 capitalize"
          >
            + {type}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function Canvas({ blocks, onUpdate, onDelete, onDuplicate, onReorder, onAddBlock }) {
  const [activeId, setActiveId] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const activeBlock = blocks.find(b => b.id === activeId)

  const handleDragStart = ({ active }) => setActiveId(active.id)

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null)
    if (!over || active.id === over.id) return
    const oldIndex = blocks.findIndex(b => b.id === active.id)
    const newIndex = blocks.findIndex(b => b.id === over.id)
    if (oldIndex !== -1 && newIndex !== -1) {
      onReorder(arrayMove(blocks, oldIndex, newIndex))
    }
  }

  const handleDragCancel = () => setActiveId(null)

  if (blocks.length === 0) {
    return <EmptyState onAddBlock={onAddBlock} />
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
        <div className={`space-y-3 ${activeId ? 'drag-active' : ''}`}>
          {blocks.map((block) => (
            <BlockWrapper
              key={block.id}
              id={block.id}
              type={block.type}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
            >
              {renderBlockContent(block, onUpdate)}
            </BlockWrapper>
          ))}
        </div>
      </SortableContext>

      {/* Drag overlay — ghost copy while dragging */}
      <DragOverlay dropAnimation={{ duration: 200, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }}>
        {activeBlock && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-block-drag scale-[1.02] opacity-95 px-4 py-4 rotate-1">
            {renderBlockContent(activeBlock, () => {})}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
