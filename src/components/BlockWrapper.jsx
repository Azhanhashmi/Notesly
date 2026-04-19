import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const BLOCK_LABELS = {
  header: 'Heading',
  text: 'Text',
  image: 'Image',
}

export default function BlockWrapper({ id, type, children, onDelete, onDuplicate }) {
  const [isHovered, setIsHovered] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : 'auto',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative bg-white rounded-2xl border transition-all duration-200 animate-slide-in
        ${isDragging
          ? 'border-gray-300 shadow-block-drag scale-[1.02]'
          : isHovered
            ? 'border-gray-200 shadow-block-hover'
            : 'border-gray-100 shadow-block'
        }`}
    >
      {/* Top bar with type label + actions */}
      <div className={`flex items-center justify-between px-4 py-2.5 border-b transition-all duration-150
        ${isHovered ? 'border-gray-100' : 'border-transparent'}`}>
        {/* Type label + drag handle */}
        <div className="flex items-center gap-2">
          {/* Drag handle */}
          <div
            {...attributes}
            {...listeners}
            className={`cursor-grab active:cursor-grabbing p-1 rounded-md transition-all duration-150
              ${isHovered ? 'opacity-100' : 'opacity-0'} hover:bg-gray-100`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="9" cy="5" r="1" fill="currentColor" stroke="none" />
              <circle cx="15" cy="5" r="1" fill="currentColor" stroke="none" />
              <circle cx="9" cy="12" r="1" fill="currentColor" stroke="none" />
              <circle cx="15" cy="12" r="1" fill="currentColor" stroke="none" />
              <circle cx="9" cy="19" r="1" fill="currentColor" stroke="none" />
              <circle cx="15" cy="19" r="1" fill="currentColor" stroke="none" />
            </svg>
          </div>
          <span className={`text-[10px] font-mono uppercase tracking-widest transition-all duration-150
            ${isHovered ? 'text-gray-400' : 'text-transparent'}`}>
            {BLOCK_LABELS[type] || type}
          </span>
        </div>

        {/* Actions */}
        <div className={`flex items-center gap-1 transition-all duration-150
          ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={() => onDuplicate(id)}
            title="Duplicate block"
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all duration-150"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(id)}
            title="Delete block"
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-150"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Block content */}
      <div className="px-4 py-4">
        {children}
      </div>
    </div>
  )
}
