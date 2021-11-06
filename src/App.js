import './App.css'
import { useEffect, useState, useRef } from 'react'
import Message from './components/Message'

const CHARS_PER_STROKE = 5

function App() {
  const [sourceCode, setSourceCode] = useState('')
  const [content, setContent] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [messageType, setMessageType] = useState('denied')
  const [isLocked, setIsLocked] = useState(false)

  const containerRef = useRef(null)
  const paragraphRef = useRef(null)

  useEffect(() => {
    containerRef.current.focus()

    fetch('code.txt').then((response) =>
      response.text().then((text) => setSourceCode(text))
    )
  }, [])

  const runScript = () => {
    if (isLocked) return
    setCurrentIndex(currentIndex + CHARS_PER_STROKE)
    setContent(sourceCode.substring(0, currentIndex))

    paragraphRef.current.scrollIntoView()

    if (currentIndex !== 0 && currentIndex % 300 === 0) {
      setIsLocked(true)
      setMessageType('denied')
    }
    if (currentIndex !== 0 && currentIndex % 900 === 0) {
      setIsLocked(true)
      setMessageType('success')
    }
  }
  const removeMessage = () => {
    setIsLocked(false)
  }

  const handleKeyDown = (e) => {
    if (e.key !== 'Escape') {
      runScript()
    } else {
      removeMessage()
    }
  }

  return (
    <>
      <div
        id='container'
        onKeyDown={handleKeyDown}
        tabIndex={0}
        ref={containerRef}
      >
        <div id='source'>{content}</div>
        <p ref={paragraphRef}></p>
      </div>
      {isLocked && <Message type={messageType} />}
    </>
  )
}

export default App
