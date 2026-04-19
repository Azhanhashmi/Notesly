import { useReducer, useEffect } from 'react'
import { loadBlocks, saveBlocks } from '../utils/storage'

const generateId = () => `block_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`

const initialState = {
  blocks: loadBlocks(),
}

function blocksReducer(state, action) {
  switch (action.type) {
    case 'ADD_BLOCK': {
      const newBlock = {
        id: generateId(),
        type: action.blockType,
        content: getDefaultContent(action.blockType),
      }
      return { ...state, blocks: [...state.blocks, newBlock] }
    }
    case 'UPDATE_BLOCK': {
      return {
        ...state,
        blocks: state.blocks.map(b =>
          b.id === action.id ? { ...b, content: action.content } : b
        ),
      }
    }
    case 'DELETE_BLOCK': {
      return { ...state, blocks: state.blocks.filter(b => b.id !== action.id) }
    }
    case 'DUPLICATE_BLOCK': {
      const idx = state.blocks.findIndex(b => b.id === action.id)
      if (idx === -1) return state
      const original = state.blocks[idx]
      const clone = { ...original, id: generateId() }
      const newBlocks = [...state.blocks]
      newBlocks.splice(idx + 1, 0, clone)
      return { ...state, blocks: newBlocks }
    }
    case 'REORDER_BLOCKS': {
      return { ...state, blocks: action.blocks }
    }
    case 'CLEAR_ALL': {
      return { ...state, blocks: [] }
    }
    default:
      return state
  }
}

function getDefaultContent(type) {
  switch (type) {
    case 'header':
      return { text: 'Untitled Header', level: 1 }
    case 'text':
      return { text: 'Start writing your content here...' }
    case 'image':
      return { url: '', alt: '', caption: '' }
    default:
      return {}
  }
}

export function useBlocks() {
  const [state, dispatch] = useReducer(blocksReducer, initialState)

  useEffect(() => {
    saveBlocks(state.blocks)
  }, [state.blocks])

  return {
    blocks: state.blocks,
    addBlock: (blockType) => dispatch({ type: 'ADD_BLOCK', blockType }),
    updateBlock: (id, content) => dispatch({ type: 'UPDATE_BLOCK', id, content }),
    deleteBlock: (id) => dispatch({ type: 'DELETE_BLOCK', id }),
    duplicateBlock: (id) => dispatch({ type: 'DUPLICATE_BLOCK', id }),
    reorderBlocks: (blocks) => dispatch({ type: 'REORDER_BLOCKS', blocks }),
    clearAll: () => dispatch({ type: 'CLEAR_ALL' }),
  }
}
