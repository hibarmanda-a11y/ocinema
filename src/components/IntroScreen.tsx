import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const INTRO_STORAGE_KEY = 'ocinema_intro_shown'

const IntroScreen = () => {
  const [isVisible, setIsVisible] = useState(
    () => localStorage.getItem(INTRO_STORAGE_KEY) !== 'true'
  )

  const dismiss = useCallback(() => {
    localStorage.setItem(INTRO_STORAGE_KEY, 'true')
    setIsVisible(false)
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const timeoutId = window.setTimeout(dismiss, 3000)
    return () => window.clearTimeout(timeoutId)
  }, [dismiss, isVisible])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="ocinema-intro"
          role="button"
          tabIndex={0}
          aria-label="OCINEMA intro screen. Click to continue."
          onClick={dismiss}
          onKeyDown={event => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              dismiss()
            }
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[2000] flex cursor-pointer flex-col items-center justify-center bg-black text-center outline-none"
        >
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-5xl font-black tracking-[0.16em] text-white sm:text-7xl md:text-8xl"
          >
            OCI<span style={{ color: '#E50914' }}>NEMA</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.45 }}
            className="mt-4 text-sm font-semibold uppercase tracking-[0.28em] text-gray-300 sm:text-base"
          >
            Biggest Streaming Site
          </motion.p>
          <span className="mt-6 h-1 w-16 rounded-full bg-[#E50914]" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default IntroScreen
