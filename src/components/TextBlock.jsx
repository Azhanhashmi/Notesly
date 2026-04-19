import { useRef, useEffect } from 'react'

export default function TextBlock({ content, onChange }) {
  const textareaRef = useRef(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [content.text])

  return (
    <textarea
      ref={textareaRef}
      value={content.text || ''}
      onChange={(e) => onChange({ ...content, text: e.target.value })}
      placeholder="Start writing..."
      rows={3}
      className="w-full bg-transparent outline-none resize-none leading-relaxed text-gray-700
        text-[15px] placeholder:text-gray-300 transition-colors duration-150"
      style={{ overflow: 'hidden', minHeight: '72px' }}
    />
  )
}
