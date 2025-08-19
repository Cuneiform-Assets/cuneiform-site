'use client';

import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with canvas
const TextTrail = dynamic(() => import('../components/TextTrail'), {
  ssr: false,
  loading: () => <div className="text-6xl font-bold text-white">Cuneiform</div>
});

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <a href="#home" className="text-white hover:text-gray-300 transition-colors">Home</a>
              <a href="#about" className="text-white hover:text-gray-300 transition-colors">About</a>
              <a href="#services" className="text-white hover:text-gray-300 transition-colors">Services</a>
              <a href="#whitepaper" className="text-white hover:text-gray-300 transition-colors">Whitepaper</a>
              <a href="#contact" className="text-white hover:text-gray-300 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Manhattan Background with overlay */}
        <div className="absolute inset-0 z-0">
          {/* Urban Manhattan-style gradient background */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `
                linear-gradient(
                  135deg,
                  rgba(15, 23, 42, 0.95) 0%,
                  rgba(30, 41, 59, 0.9) 25%,
                  rgba(51, 65, 85, 0.85) 50%,
                  rgba(30, 41, 59, 0.9) 75%,
                  rgba(15, 23, 42, 0.95) 100%
                ),
                radial-gradient(
                  ellipse at center top,
                  rgba(59, 130, 246, 0.1) 0%,
                  rgba(139, 92, 246, 0.05) 30%,
                  transparent 70%
                ),
                linear-gradient(
                  to bottom,
                  rgba(0, 0, 0, 0.8) 0%,
                  rgba(0, 0, 0, 0.6) 50%,
                  rgba(0, 0, 0, 0.9) 100%
                )
              `
            }}
          />
          {/* Additional dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
          {/* Subtle city lights effect */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent opacity-30"></div>
            <div className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-transparent via-purple-500/20 to-transparent opacity-25"></div>
            <div className="absolute top-0 left-2/3 w-1 h-full bg-gradient-to-b from-transparent via-cyan-500/15 to-transparent opacity-20"></div>
          </div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 text-center">
          <div className="mb-8">
            <TextTrail 
              text="Cuneiform"
              fontFamily="Raleway"
              fontWeight="900"
              noiseFactor={1.2}
              noiseScale={0.001}
              rgbPersistFactor={0.95}
              alphaPersistFactor={0.92}
              animateColor={true}
              startColor="#ff6b6b"
              textColor="#4ecdc4"
              backgroundColor="transparent"
              colorCycleInterval={2000}
              supersample={2}
            />
          </div>
          <h2 className="text-2xl md:text-3xl font-light text-gray-300 mb-8">
            A Babylon Foundation Company
          </h2>
          <p className="text-xl md:text-2xl font-light text-gray-400 max-w-2xl mx-auto">
            The Network Effect
          </p>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">About</h2>
            <div className="space-y-8">
              <div className="bg-gray-800/50 p-8 rounded-lg">
                <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
                <p className="text-gray-300 leading-relaxed">
                  To empower communities and projects with smart, transparent, and legally compliant token reward programs that drive genuine participation and foster ecosystem growth.
                </p>
              </div>
              <div className="bg-gray-800/50 p-8 rounded-lg">
                <h3 className="text-2xl font-semibold mb-4">Our Vision</h3>
                <p className="text-gray-300 leading-relaxed">
                  We envision a world where blockchain networks are accessible, trustworthy, and effectively incentivize constructive participation at all levels.
                </p>
              </div>
              <div className="bg-gray-800/50 p-8 rounded-lg">
                <h3 className="text-2xl font-semibold mb-4">Our Values</h3>
                <p className="text-gray-300 leading-relaxed">
                  Transparency, Integrity, Empowerment, and Collaboration - these principles guide every campaign and partnership we undertake.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Services</h2>
            <p className="text-xl text-gray-400 mb-12">Tokens | Campaigns | Compliance</p>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-800/30 p-8 rounded-lg">
                <h3 className="text-2xl font-semibold mb-4">Token Rewards</h3>
                <p className="text-gray-300 leading-relaxed">
                  Structuring and delivering campaigns that issue tokens to incentivize positive participation and drive ecosystem growth across blockchain networks.
                </p>
              </div>
              <div className="bg-gray-800/30 p-8 rounded-lg">
                <h3 className="text-2xl font-semibold mb-4">Compliance</h3>
                <p className="text-gray-300 leading-relaxed">
                  Ensuring all token distributions meet international regulatory standards with robust KYC/AML protocols and anti-fraud measures.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Whitepaper Section */}
      <section id="whitepaper" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Whitepaper</h2>
            <p className="text-xl text-gray-400 mb-12">Technical Documentation</p>
            <div className="bg-gray-800/50 p-8 rounded-lg">
              <div className="text-sm text-gray-400 mb-4">Version 2.0</div>
              <h3 className="text-2xl font-semibold mb-4">MICA Whitepaper</h3>
              <h4 className="text-lg text-gray-300 mb-6">Babylon Genesis Protocol</h4>
              <p className="text-gray-300 leading-relaxed mb-8">
                Comprehensive technical documentation for Babylon Genesis, the first Layer 1 protocol enabling Bitcoin to provide security and liquidity to other chains through dual staking mechanisms and Bitcoin-anchored finality.
              </p>
              <a 
                href="/whitepaper/mica_whitepaper_v2.pdf" 
                target="_blank" 
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                Download
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Contact</h2>
            <div className="space-y-4 mb-8">
              <p className="text-gray-300">
                c/o SHRM Trustees (BVI) Limited, Trinity Chambers, PO Box 4301, Road Town, Tortola, British Virgin Islands
              </p>
              <a href="mailto:legal@cuneiformassets.io" className="text-blue-400 hover:text-blue-300 text-lg">
              legal@cuneiformassets.io
              </a>
            </div>
            
            {/* Contact Form */}
            <form className="max-w-2xl mx-auto">
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <input 
                  type="text" 
                  placeholder="Name" 
                  required
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
                <input 
                  type="email" 
                  placeholder="Email" 
                  required
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
                <input 
                  type="text" 
                  placeholder="Subject" 
                  required
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>
              <textarea 
                placeholder="Message" 
                rows={5} 
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 mb-4"
              ></textarea>
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Cuneiform Assets Ltd.</a> © 2025 All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}