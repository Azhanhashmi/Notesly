import { useState, useRef, useEffect } from 'react'

const LEVELS = [
  { value: 1, label: 'H1', size: 'text-4xl font-display font-800 tracking-tighter' },
  { value: 2, label: 'H2', size: 'text-3xl font-display font-700 tracking-tight' },
  { value: 3, label: 'H3', size: 'text-2xl font-display font-600 tracking-tight' },
]

export default function HeaderBlock({ content, onChange }) {
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef(null)
  const level = content.level || 1
  const currentLevel = LEVELS.find(l => l.value === level) || LEVELS[0]

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [content.text, level])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') e.preventDefault()
  }

  return (
    <div>
      {/* Level picker */}
      <div className="flex items-center gap-1 mb-3">
        {LEVELS.map(l => (
          <button
            key={l.value}
            onClick={() => onChange({ ...content, level: l.value })}
            className={`px-2 py-1 rounded-md text-[11px] font-mono font-medium transition-all duration-150
              ${level === l.value
                ? 'bg-black text-white'
                : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
              }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      <textarea
        ref={textareaRef}
        value={content.text || ''}
        onChange={(e) => onChange({ ...content, text: e.target.value })}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Heading text..."
        rows={1}
        className={`w-full bg-transparent outline-none resize-none leading-tight text-gray-900
          placeholder:text-gray-300 transition-colors duration-150
          ${currentLevel.size}`}
        style={{ overflow: 'hidden' }}
      />
    </div>
  )
}
