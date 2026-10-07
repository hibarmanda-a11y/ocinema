import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaSearch, FaBars, FaTimes, FaChevronDown, FaCheck } from 'react-icons/fa'
import { SearchSuggestions } from './SearchSuggestions'
import { type HomeMode } from '../utils/homeMode'

interface NavbarProps {
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (isOpen: boolean) => void
  setIsMobileSearchOpen: (isOpen: boolean) => void
  setIsSettingsOpen: (isOpen: boolean) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  showSuggestions: boolean
  setShowSuggestions: (show: boolean) => void
  isModeDropdownOpen: boolean
  setIsModeDropdownOpen: (isOpen: boolean) => void
  handleSearch: (e: React.FormEvent) => void
  handleSearchInput: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSuggestionClick: (query: string) => void
  handleInputFocus: () => void
  handleInputBlur: () => void
  handleModeChange: (mode: HomeMode) => void
  currentMode: HomeMode
  searchInputRef: React.RefObject<HTMLInputElement>
  modeDropdownRef: React.RefObject<HTMLDivElement>
}

export const Navbar = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  setIsMobileSearchOpen,
  searchQuery,
  setSearchQuery,
  showSuggestions,
  setShowSuggestions,
  isModeDropdownOpen,
  setIsModeDropdownOpen,
  handleSearch,
  handleSearchInput,
  handleSuggestionClick,
  handleInputFocus,
  handleInputBlur,
  handleModeChange,
  currentMode,
  searchInputRef,
  modeDropdownRef,
}: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Indian', path: '/category/indian' },
    { label: 'Web-serie', path: '/category/web-series' },
    { label: 'MCU/Hollywood', path: '/category/mcu-hollywood' },
    { label: 'Jonra', path: '/genres' },
    { label: 'Category', path: '/category/all' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-[999] !overflow-visible">
      {/* Background Layer */}
      <div
        className={`absolute inset-0 transition-all duration-300 ${
          isScrolled
            ? 'bg-black/95 backdrop-blur-md shadow-lg shadow-red-900/20'
            : 'bg-gradient-to-b from-black/90 to-transparent'
        }`}
      />

      <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 hover:scale-105 transition-transform flex-shrink-0"
            aria-label="Ocinema Home"
          >
            <img
              src="/assets/ocinemalogo.png"
              alt="Ocinema"
              className="h-8 sm:h-10 md:h-12 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                const parent = e.currentTarget.parentElement
                if (parent && !parent.querySelector('.fallback-logo')) {
                  const span = document.createElement('span')
                  span.className = 'fallback-logo text-xl sm:text-2xl font-bold text-white'
                  span.innerHTML = 'Oci<span class="text-red-600">nema</span>'
                  parent.appendChild(span)
                }
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-5 xl:space-x-7">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="text-sm font-medium text-gray-200 hover:text-red-500 transition-colors relative group whitespace-nowrap"
                aria-label={item.label}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}

            {/* Search Bar */}
            {currentMode === 'default' && (
              <form onSubmit={handleSearch} className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInput}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleSearch(e as any)
                    } else if (e.key === 'Escape') {
                      setSearchQuery('')
                      setShowSuggestions(false)
                    }
                  }}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder="Search..."
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 pl-10
                           text-white placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent
                           transition-all w-44 xl:w-56 focus:w-56 xl:focus:w-72"
                  aria-label="Search movies and TV shows"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />

                <SearchSuggestions
                  query={searchQuery}
                  isVisible={showSuggestions}
                  onSuggestionClick={handleSuggestionClick}
                  onClose={() => setShowSuggestions(false)}
                />
              </form>
            )}

            {/* Mode Dropdown */}
            <div className="relative" ref={modeDropdownRef}>
              <button
                onClick={() => setIsModeDropdownOpen(!isModeDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-2 bg-white/10 border border-white/20 rounded-lg
                         hover:bg-white/20 transition-all duration-300
                         focus:outline-none focus:ring-2 focus:ring-red-600"
                aria-label="Select mode"
              >
                <span className="text-xs xl:text-sm font-medium text-white whitespace-nowrap">
                  {currentMode === 'sports' ? 'Sports' : 'Movies'}
                </span>
                <FaChevronDown
                  className={`text-xs text-white transition-transform duration-200 ${
                    isModeDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isModeDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-44 bg-black/95 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl z-50 overflow-hidden animate-slide-up">
                  <div className="p-2">
                    <button
                      onClick={() => handleModeChange('default')}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200
                               hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-red-600
                               ${currentMode === 'default' ? 'bg-red-600/20' : ''}`}
                    >
                      <span className="font-medium text-sm text-white">Movies</span>
                      {currentMode === 'default' && <FaCheck className="text-red-500 text-sm" />}
                    </button>
                    <button
                      onClick={() => handleModeChange('sports')}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200
                               hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-red-600
                               ${currentMode === 'sports' ? 'bg-red-600/20' : ''}`}
                    >
                      <span className="font-medium text-sm text-white">Sports</span>
                      {currentMode === 'sports' && <FaCheck className="text-red-500 text-sm" />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile/Tablet Buttons */}
          <div className="lg:hidden flex items-center space-x-2">
            {currentMode === 'default' && (
              <button
                onClick={() => setIsMobileSearchOpen(true)}
                className="text-lg sm:text-xl text-white hover:text-red-500 transition-colors p-2 rounded-full hover:bg-white/10"
                aria-label="Search"
              >
                <FaSearch />
              </button>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-xl sm:text-2xl text-white hover:text-red-500 transition-colors p-2 rounded-full hover:bg-white/10"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile/Tablet Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-6 animate-slide-up border-t border-white/10 bg-black/95 backdrop-blur-sm">
            <div className="flex flex-col space-y-4 pt-4">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white hover:text-red-500 transition-colors px-2 py-2 rounded-lg hover:bg-white/10 text-base sm:text-lg"
                >
                  {item.label}
                </Link>
              ))}

              {/* Mode Selector for Mobile */}
              <div className="border-t border-white/10 pt-4 mt-2">
                <div className="text-xs text-gray-400 mb-2 px-2 uppercase tracking-wider">
                  Mode
                </div>
                <button
                  onClick={() => handleModeChange('default')}
                  className={`w-full flex items-center justify-between px-2 py-3 rounded-lg transition-all duration-200
                               hover:bg-white/10 text-left
                               ${currentMode === 'default' ? 'bg-red-600/20' : ''}`}
                >
                  <span className="text-base sm:text-lg text-white">Movies</span>
                  {currentMode === 'default' && <FaCheck className="text-red-500" />}
                </button>
                <button
                  onClick={() => handleModeChange('sports')}
                  className={`w-full flex items-center justify-between px-2 py-3 rounded-lg transition-all duration-200
                               hover:bg-white/10 text-left
                               ${currentMode === 'sports' ? 'bg-red-600/20' : ''}`}
                >
                  <span className="text-base sm:text-lg text-white">Sports</span>
                  {currentMode === 'sports' && <FaCheck className="text-red-500" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}