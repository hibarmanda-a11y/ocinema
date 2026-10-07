import { Link } from 'react-router-dom'
import {  FaTelegram, FaFacebook, FaExclamationTriangle } from 'react-icons/fa'

export const Footer = () => {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/10 mt-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <img
                src="/assets/ocinemalogo.png"
                alt="Ocinema"
                className="h-10 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  const parent = e.currentTarget.parentElement
                  if (parent && !parent.querySelector('.footer-fallback-logo')) {
                    const span = document.createElement('span')
                    span.className = 'footer-fallback-logo text-2xl font-bold text-white'
                    span.innerHTML = 'Oci<span class="text-red-600">nema</span>'
                    parent.appendChild(span)
                  }
                }}
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Your ultimate destination for streaming movies and TV shows in HD quality.
            </p>

            {/* Social */}
            <div className="flex items-center gap-3 mt-5">
              <a
                href="#"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-red-600 text-gray-400 hover:text-white transition-all"
                aria-label="Telegram"
              >
                <FaTelegram />
              </a>
              <a
                href="#"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-red-600 text-gray-400 hover:text-white transition-all"
                aria-label="Facebook"
              >
                <FaFacebook />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-bold mb-4 text-white">Quick Links</h4>
            <nav className="grid grid-cols-2 gap-2" aria-label="Quick links">
              <Link to="/" className="text-gray-400 hover:text-red-500 transition-colors text-sm">
                Home
              </Link>
              <Link to="/category/indian" className="text-gray-400 hover:text-red-500 transition-colors text-sm">
                INDISN
              </Link>
              <Link to="/category/web-series" className="text-gray-400 hover:text-red-500 transition-colors text-sm">
                Web-serie
              </Link>
              <Link to="/category/mcu-hollywood" className="text-gray-400 hover:text-red-500 transition-colors text-sm">
                MCU Hollywood
              </Link>
              <Link to="/genres" className="text-gray-400 hover:text-red-500 transition-colors text-sm">
                Jonra
              </Link>
              <Link to="/category/all" className="text-gray-400 hover:text-red-500 transition-colors text-sm">
                Category
              </Link>
            </nav>
          </div>

          {/* Browse */}
          <div>
            <h4 className="text-base font-bold mb-4 text-white">Browse</h4>
            <nav className="grid grid-cols-2 gap-2" aria-label="Browse links">
              <Link to="/my-list" className="text-gray-400 hover:text-red-500 transition-colors text-sm">
                My List
              </Link>
              <Link to="/studios" className="text-gray-400 hover:text-red-500 transition-colors text-sm">
                Studios
              </Link>
              <Link to="/sports" className="text-gray-400 hover:text-red-500 transition-colors text-sm">
                Sports
              </Link>
              <Link to="/downloader" className="text-gray-400 hover:text-red-500 transition-colors text-sm">
                Downloader
              </Link>
              <Link to="/search" className="text-gray-400 hover:text-red-500 transition-colors text-sm">
                Search
              </Link>
            </nav>
          </div>

          {/* Disclaimer */}
          <div>
            <h4 className="text-base font-bold mb-4 flex items-center gap-2 text-white">
              <FaExclamationTriangle className="text-red-500 text-sm" />
              Disclaimer
            </h4>
            <div className="bg-red-950/20 border border-red-900/30 rounded-lg p-3">
              <p className="text-gray-400 text-xs leading-relaxed">
                This site does not store any files on our server, we only linked to the media
                which is hosted on 3rd party services.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs sm:text-sm text-center sm:text-left">
            ocinema © 2026. All Rights Reserved
          </p>
         
        </div>
      </div>
    </footer>
  )
}