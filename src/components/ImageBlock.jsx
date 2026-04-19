import { useState, useRef } from 'react'
 
export default function ImageBlock({ content, onChange }) {
  const [imgError, setImgError] = useState(false)
  const [tab, setTab] = useState(content.url?.startsWith('data:') ? 'upload' : 'url')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)
 
  const hasImage = content.url && content.url.trim() !== ''
 
  const handleUrlChange = (e) => {
    setImgError(false)
    onChange({ ...content, url: e.target.value })
  }
 
  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      setImgError(false)
      onChange({ ...content, url: e.target.result, fileName: file.name })
    }
    reader.readAsDataURL(file)
  }
 
  const handleFileInput = (e) => handleFile(e.target.files[0])
 
  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }
 
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true) }
  const handleDragLeave = () => setIsDragging(false)
 
  const handleRemove = () => {
    setImgError(false)
    onChange({ ...content, url: '', fileName: '' })
  }
 
  return (
    <div className="space-y-3">
 
      {/* Tab switcher */}
      <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl w-fit">
        <button
          onClick={() => setTab('upload')}
          className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150
            ${tab === 'upload' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Upload File
        </button>
        <button
          onClick={() => setTab('url')}
          className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150
            ${tab === 'url' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Paste URL
        </button>
      </div>
 
      {/* Upload tab */}
      {tab === 'upload' && !hasImage && (
        <>
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
 
          {/* Drop zone — clicking opens file picker */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200
              flex flex-col items-center justify-center gap-3 py-10 select-none
              ${isDragging
                ? 'border-black bg-gray-50 scale-[1.01]'
                : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50 active:scale-[0.99]'
              }`}
          >
            {/* Upload icon */}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200
              ${isDragging ? 'bg-black' : 'bg-gray-100'}`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={isDragging ? 'white' : 'currentColor'} strokeWidth="1.8" strokeLinecap="round" className={isDragging ? '' : 'text-gray-400'}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
 
            <div className="text-center">
              <p className="text-[14px] font-medium text-gray-700">
                {isDragging ? 'Drop image here' : 'Click to browse files'}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                or drag & drop · PNG, JPG, GIF, WebP, SVG
              </p>
            </div>
 
            {/* Keyboard hint */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-lg border border-gray-100 shadow-sm">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-gray-400">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="M8 8h.01M12 8h.01M16 8h.01M8 12h.01M12 12h.01M16 12h.01M8 16h8"/>
              </svg>
              <span className="text-[10px] font-mono text-gray-400">Opens your file system</span>
            </div>
          </div>
        </>
      )}
 
      {/* URL tab */}
      {tab === 'url' && !hasImage && (
        <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-100 focus-within:border-gray-300 transition-all duration-150">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-gray-400 shrink-0">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          <input
            type="url"
            value={content.url || ''}
            onChange={handleUrlChange}
            placeholder="https://example.com/image.jpg"
            className="flex-1 bg-transparent outline-none text-[13px] text-gray-700 placeholder:text-gray-300"
          />
        </div>
      )}
 
      {/* Image preview (both tabs) */}
      {hasImage && !imgError && (
        <div className="relative rounded-xl overflow-hidden bg-gray-50 border border-gray-100 group">
          <img
            src={content.url}
            alt={content.alt || 'Image'}
            onError={() => setImgError(true)}
            onLoad={() => setImgError(false)}
            className="w-full object-cover max-h-80"
          />
          {/* Remove overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
            <button
              onClick={handleRemove}
              className="opacity-0 group-hover:opacity-100 transition-all duration-200 px-3 py-1.5 bg-white rounded-lg text-[12px] font-medium text-gray-700 shadow-md hover:bg-red-50 hover:text-red-600 flex items-center gap-1.5"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
              </svg>
              Remove image
            </button>
          </div>
          {/* File name badge if uploaded */}
          {content.fileName && (
            <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded-md text-[10px] font-mono text-white">
              {content.fileName}
            </div>
          )}
        </div>
      )}
 
      {/* Error state */}
      {hasImage && imgError && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-red-300 mx-auto mb-2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-5-5L5 21" />
          </svg>
          <p className="text-[12px] text-red-400 mb-2">Unable to load image.</p>
          <button onClick={handleRemove} className="text-[11px] text-red-400 underline">Clear and try again</button>
        </div>
      )}
 
      {/* Alt text + Caption */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1">Alt Text</label>
          <input
            type="text"
            value={content.alt || ''}
            onChange={(e) => onChange({ ...content, alt: e.target.value })}
            placeholder="Describe the image..."
            className="w-full px-3 py-2 text-[12px] bg-gray-50 rounded-lg border border-gray-100 outline-none
              focus:border-gray-300 transition-all duration-150 placeholder:text-gray-300 text-gray-700"
          />
        </div>
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1">Caption</label>
          <input
            type="text"
            value={content.caption || ''}
            onChange={(e) => onChange({ ...content, caption: e.target.value })}
            placeholder="Optional caption..."
            className="w-full px-3 py-2 text-[12px] bg-gray-50 rounded-lg border border-gray-100 outline-none
              focus:border-gray-300 transition-all duration-150 placeholder:text-gray-300 text-gray-700"
          />
        </div>
      </div>
 
      {content.caption && (
        <p className="text-center text-[12px] text-gray-400 italic">{content.caption}</p>
      )}
    </div>
  )
}