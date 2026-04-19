import { useState } from 'react'

const BLOCK_TYPES = [
  {
    type: 'header',
    label: 'Heading',
    description: 'Section title or subtitle',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M4 12h16M4 6h16M4 18h10" />
      </svg>
    ),
  },
  {
    type: 'text',
    label: 'Text',
    description: 'Paragraph or body copy',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M4 6h16M4 10h16M4 14h12M4 18h8" />
      </svg>
    ),
  },
  {
    type: 'image',
    label: 'Image',
    description: 'Photo with caption',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-5-5L5 21" />
      </svg>
    ),
  },
]

export default function Sidebar({ onAddBlock, blockCount, onClearAll }) {
  const [hoveredType, setHoveredType] = useState(null)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const handleClear = () => {
    if (showClearConfirm) {
      onClearAll()
      setShowClearConfirm(false)
    } else {
      setShowClearConfirm(true)
      setTimeout(() => setShowClearConfirm(false), 3000)
    }
  }

  return (
    <aside className="w-64 shrink-0 h-full flex flex-col bg-white border-r border-gray-100">
      {/* Logo / Brand */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <rect x="3" y="3" width="8" height="8" rx="1.5" />
              <rect x="13" y="3" width="8" height="8" rx="1.5" />
              <rect x="3" y="13" width="8" height="8" rx="1.5" />
              <rect x="13" y="13" width="8" height="8" rx="1.5" />
            </svg>
          </div>
          <span className="font-display font-700 text-[15px] tracking-tight text-gray-900">
            Notesly
          </span>
        </div>
        <p className="text-[11px] text-gray-400 mt-1 ml-[37px]">Save your Notes</p>
      </div>

      {/* Block count */}
      <div className="px-5 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-gray-400 uppercase tracking-widest">Canvas</span>
          <span className="text-[11px] font-mono bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
            {blockCount} {blockCount === 1 ? 'block' : 'blocks'}
          </span>
        </div>
      </div>

      {/* Add Blocks */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400 px-2 mb-3">
          Add Blocks
        </p>
        <div className="space-y-1">
          {BLOCK_TYPES.map(({ type, label, description, icon }) => (
            <button
              key={type}
              onClick={() => onAddBlock(type)}
              onMouseEnter={() => setHoveredType(type)}
              onMouseLeave={() => setHoveredType(null)}
              className="w-full text-left px-3 py-3 rounded-xl transition-all duration-150 group
                hover:bg-gray-50 active:scale-[0.98] active:bg-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150
                  ${hoveredType === type
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-500'
                  }`}>
                  {icon}
                </div>
                <div>
                  <p className="text-[13px] font-medium text-gray-800 leading-tight">{label}</p>
                  <p className="text-[11px] text-gray-400 leading-tight mt-0.5">{description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-gray-100">
        {blockCount > 0 && (
          <button
            onClick={handleClear}
            className={`w-full text-center py-2 rounded-lg text-[12px] font-medium transition-all duration-200
              ${showClearConfirm
                ? 'bg-red-50 text-red-600 border border-red-200'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
          >
            {showClearConfirm ? 'Click again to confirm' : 'Clear all blocks'}
          </button>
        )}
        <p className="text-center text-[10px] text-gray-300 mt-2">Auto-saved to local storage</p>
      </div>
    </aside>
  )
}
