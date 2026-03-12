/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gamepad2, X, Play, Info, Search, ChevronLeft, Maximize, Shield } from 'lucide-react';
import gamesData from './games.json';
import './index.css';

export default function App() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGames, setFilteredGames] = useState(gamesData);
  const [isCloaked, setIsCloaked] = useState(false);
  const [showCloakModal, setShowCloakModal] = useState(false);
  const [cloakTitle, setCloakTitle] = useState('Google Drive');
  const [cloakIcon, setCloakIcon] = useState('https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png');

  useEffect(() => {
    if (isCloaked) {
      document.title = cloakTitle || 'Google Drive';
      const link = document.querySelector("link[rel~='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = cloakIcon || 'https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png';
      document.getElementsByTagName('head')[0].appendChild(link);
    } else {
      document.title = 'UBG World';
      const link = document.querySelector("link[rel~='icon']");
      if (link) {
        link.href = '/vite.svg'; // Default Vite icon, or fallback
      }
    }
  }, [isCloaked, cloakTitle, cloakIcon]);

  useEffect(() => {
    const filtered = gamesData.filter(game =>
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredGames(filtered);
  }, [searchQuery]);

  const handlePlayGame = (game) => {
    setSelectedGame(game);
  };

  const handleCloseGame = () => {
    setSelectedGame(null);
  };

  const toggleFullscreen = () => {
    const container = document.querySelector('.player-iframe-container');
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className={`app-container ${selectedGame ? 'game-active' : ''}`}>
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div 
            className="logo-container"
            onClick={() => setSelectedGame(null)}
          >
            <div className="logo-icon">
              <Gamepad2 className="text-black w-6 h-6" />
            </div>
            <h1 className="logo-text">
              UBG<span className="logo-accent">WORLD</span>
            </h1>
          </div>

          <div className="search-container">
            <div className="search-wrapper">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          {!selectedGame && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button 
                onClick={() => setShowCloakModal(true)}
                style={{ 
                  background: isCloaked ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  color: isCloaked ? '#10b981' : 'rgba(255,255,255,0.6)', 
                  padding: '0.5rem',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
                title="Tab Cloak"
              >
                <Shield size={18} />
                {isCloaked ? 'Cloaked' : 'Cloak'}
              </button>
              <button style={{ backgroundColor: 'white', color: 'black', padding: '0.5rem 1rem', borderRadius: '9999px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
                Request Game
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="main-content">
        <AnimatePresence mode="wait">
          {!selectedGame ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Game Grid */}
              <div className="game-grid">
                {filteredGames.map((game) => (
                  <motion.div
                    key={game.id}
                    whileHover={{ y: -8 }}
                    className="game-card"
                    onClick={() => handlePlayGame(game)}
                  >
                    <div className="card-thumbnail-wrapper">
                      <img 
                        src={game.thumbnail} 
                        alt={game.title}
                        referrerPolicy="no-referrer"
                        className="card-thumbnail"
                      />
                      <div className="card-overlay">
                        <div className="play-icon-circle">
                          <Play className="text-black" fill="currentColor" />
                        </div>
                      </div>
                    </div>
                    <div className="card-content">
                      <h3 className="card-title">{game.title}</h3>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredGames.length === 0 && (
                <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '5rem', height: '5rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '50%', marginBottom: '1rem' }}>
                    <Search style={{ width: '2rem', height: '2rem', color: 'rgba(255,255,255,0.2)' }} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>No games found</h3>
                  <p style={{ color: 'rgba(255,255,255,0.4)' }}>Try searching for something else</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="player"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="player-view"
            >
              <div className="player-header">
                <button 
                  onClick={handleCloseGame}
                  className="back-button"
                >
                  <ChevronLeft size={18} />
                  Back
                </button>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => {
                      const blob = new Blob([selectedGame.html], { type: 'text/html' });
                      const url = URL.createObjectURL(blob);
                      window.open(url, '_blank');
                    }}
                    className="close-game-btn"
                    style={{ width: 'auto', padding: '0 1rem', fontSize: '0.875rem', fontWeight: '500', gap: '0.5rem' }}
                    title="Open in New Tab"
                  >
                    <Play size={14} fill="currentColor" />
                    Open in New Tab
                  </button>
                  <button 
                    onClick={() => setShowCloakModal(true)}
                    className="close-game-btn"
                    style={{ color: isCloaked ? '#10b981' : 'white' }}
                    title="Tab Cloak"
                  >
                    <Shield size={18} />
                  </button>
                  <button 
                    onClick={toggleFullscreen}
                    className="close-game-btn"
                    title="Fullscreen"
                  >
                    <Maximize size={18} />
                  </button>
                  <button 
                    onClick={handleCloseGame}
                    className="close-game-btn"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="player-iframe-container">
                <iframe
                  title={selectedGame.title}
                  srcDoc={selectedGame.html}
                  className="game-iframe"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock"
                  allowFullScreen
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      {!selectedGame && (
        <footer className="footer">
          <div className="footer-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Gamepad2 style={{ color: '#10b981' }} />
              <span style={{ fontWeight: 'bold' }}>UBG WORLD</span>
            </div>
            <div className="footer-links">
              <a href="#">Terms</a>
              <a href="#">Privacy</a>
              <a href="#">Contact</a>
              <a href="#">DMCA</a>
            </div>
            <p className="footer-copy">© 2026 UBG World. All rights reserved.</p>
          </div>
        </footer>
      )}

      {/* Cloak Modal */}
      <AnimatePresence>
        {showCloakModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100
            }}
            onClick={() => setShowCloakModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              style={{
                backgroundColor: '#151515',
                padding: '2rem',
                borderRadius: '1rem',
                width: '100%',
                maxWidth: '400px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Tab Cloaking</h2>
                <button onClick={() => setShowCloakModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}>Tab Title</label>
                <input 
                  type="text" 
                  value={cloakTitle} 
                  onChange={e => setCloakTitle(e.target.value)}
                  placeholder="e.g. Google Drive"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }}
                />
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}>Favicon URL</label>
                <input 
                  type="text" 
                  value={cloakIcon} 
                  onChange={e => setCloakIcon(e.target.value)}
                  placeholder="e.g. https://example.com/favicon.ico"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={() => { setIsCloaked(true); setShowCloakModal(false); }}
                  style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: '#10b981', color: 'black', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
                >
                  Apply Cloak
                </button>
                {isCloaked && (
                  <button 
                    onClick={() => { setIsCloaked(false); setShowCloakModal(false); }}
                    style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
                  >
                    Remove Cloak
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
