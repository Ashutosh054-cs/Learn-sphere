import { useState, useEffect, useRef } from 'react'
import { useAuthStore } from '../../stores/authStore'
import { focusService } from '../../services/supabaseService'

// Resize an image file to a data URL (to store in localStorage)
async function resizeImageToDataURL(file, maxW = 1920, maxH = 1080, quality = 0.85) {
  const img = await new Promise((resolve, reject) => {
    const i = new Image()
    i.onload = () => resolve(i)
    i.onerror = reject
    const url = URL.createObjectURL(file)
    i.src = url
  })
  const { naturalWidth: w, naturalHeight: h } = img
  const ratio = Math.min(maxW / w, maxH / h, 1)
  const cw = Math.round(w * ratio)
  const ch = Math.round(h * ratio)
  const canvas = document.createElement('canvas')
  canvas.width = cw
  canvas.height = ch
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, cw, ch)
  const dataUrl = canvas.toDataURL('image/jpeg', quality)
  return dataUrl
}

function Focus() {
  const user = useAuthStore(state => state.user)
  const [sessionStartTime, setSessionStartTime] = useState(null)
  const [originalDuration, setOriginalDuration] = useState(25)
  
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [workDuration, setWorkDuration] = useState(25)
  const [breakDuration, setBreakDuration] = useState(5)
  const [background, setBackground] = useState('default')
  const [customBg, setCustomBg] = useState(() => {
    try {
      return localStorage.getItem('focusCustomBg') || ''
    } catch {
      return ''
    }
  })
  const [justReset, setJustReset] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [fsAnimating, setFsAnimating] = useState(false)
  const [tickPulse, setTickPulse] = useState(false)
  const containerRef = useRef(null)

  // Theme and image backgrounds (images use CSS url())
  const backgrounds = {
    // Themes
    default: 'var(--bg-secondary)',
    ocean: 'linear-gradient(135deg, hsl(220 70% 60%) 0%, hsl(250 50% 50%) 100%)',
    sunset: 'linear-gradient(135deg, hsl(300 85% 75%) 0%, hsl(350 80% 60%) 100%)',
    // Forest needed better readability; keep hue but ensure on-top text is white with a scrim
    forest: 'linear-gradient(135deg, hsl(160 55% 38%) 0%, hsl(160 55% 26%) 100%)',
    night: 'linear-gradient(135deg, hsl(210 25% 14%) 0%, hsl(210 20% 6%) 100%)',
    // Study images
    study1: "url('https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=1920&auto=format&fit=crop')",
    study2: "url('https://images.unsplash.com/photo-1513197425463-bdddb84fdb47?q=80&w=1920&auto=format&fit=crop')",
    study3: "url('https://images.unsplash.com/photo-1529078155058-5d716f45d604?q=80&w=1920&auto=format&fit=crop')",
    study4: "url('https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1920&auto=format&fit=crop')",
    // Custom (user upload)
    custom: ''
  }

  const isImageBG = (val) => typeof val === 'string' && val.startsWith('url(')

  const totalSeconds = isBreak ? breakDuration * 60 : workDuration * 60
  const currentSeconds = minutes * 60 + seconds
  const progress = ((totalSeconds - currentSeconds) / totalSeconds) * 100

  useEffect(() => {
    let interval = null

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(interval)
          } else {
            setMinutes(minutes - 1)
            setSeconds(59)
          }
        } else {
          setSeconds(seconds - 1)
        }
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isActive, minutes, seconds])

  useEffect(() => {
    if (minutes === 0 && seconds === 0 && isActive) {
      setIsActive(false)
      
      // Save completed focus session to database
      if (!isBreak && user && sessionStartTime) {
        saveFocusSession()
      }
      
      setIsBreak(!isBreak)
      setMinutes(isBreak ? workDuration : breakDuration)
      setSessionStartTime(null) // Reset for next session
    }
  }, [minutes, seconds, isActive, isBreak, workDuration, breakDuration])

  const saveFocusSession = async () => {
    try {
      const completedAt = new Date()
      const durationMinutes = originalDuration
      
      await focusService.createSession({
        duration_minutes: durationMinutes,
        session_type: 'focus',
        completed: true,
        background_image: background,
        started_at: sessionStartTime,
        completed_at: completedAt.toISOString()
      })
      
      console.log('Focus session saved!', durationMinutes, 'minutes')
    } catch (error) {
      console.error('Error saving focus session:', error)
    }
  }

  const toggleTimer = () => {
    if (!isActive) {
      // Starting a new session
      setSessionStartTime(new Date().toISOString())
      setOriginalDuration(minutes)
    }
    setIsActive(!isActive)
  }

  // Pulse the time display slightly on each second for smoothness
  useEffect(() => {
    setTickPulse(true)
    const t = setTimeout(() => setTickPulse(false), 220)
    return () => clearTimeout(t)
  }, [seconds])

  const resetTimer = () => {
    setIsActive(false)
    setJustReset(true)
    setMinutes(isBreak ? breakDuration : workDuration)
    setSeconds(0)
    setSessionStartTime(null)
    setTimeout(() => setJustReset(false), 50)
  }

  const switchMode = () => {
    setIsActive(false)
    setJustReset(true)
    setIsBreak(!isBreak)
    setMinutes(isBreak ? workDuration : breakDuration)
    setSeconds(0)
    setTimeout(() => setJustReset(false), 50)
  }

  // Fullscreen controls
  const toggleFullscreen = async () => {
    const el = containerRef.current || document.documentElement
    try {
      if (!document.fullscreenElement) {
        setFsAnimating(true)
        // Small pre-fade for smoother entry
        setTimeout(async () => {
          await el.requestFullscreen()
          setIsFullscreen(true)
          setTimeout(() => setFsAnimating(false), 250)
        }, 150)
      } else {
        setFsAnimating(true)
        await document.exitFullscreen()
        setIsFullscreen(false)
        setTimeout(() => setFsAnimating(false), 250)
      }
    } catch (e) {
      console.warn('Fullscreen not available', e)
    }
  }

  const applySettings = () => {
    setJustReset(true)
    setMinutes(isBreak ? breakDuration : workDuration)
    setSeconds(0)
    setIsActive(false)
    setShowSettings(false)
    setTimeout(() => setJustReset(false), 50)
  }

  const selectedBg = background === 'custom' && customBg ? `url('${customBg}')` : backgrounds[background]
  const bgVal = selectedBg
  const bgStyle = isImageBG(bgVal)
    ? { backgroundImage: bgVal, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }
    : { background: bgVal }

  const isRichBG = background !== 'default'
  // Heavier scrim for images and forest theme for readability
  const scrimOpacity = background === 'forest' ? 0.35 : isImageBG(bgVal) ? 0.35 : isRichBG ? 0.25 : 0
  const onBgColor = isRichBG ? '#ffffff' : 'var(--text-primary)'
  const onBgSubtle = isRichBG ? 'hsla(0,0%,100%,0.85)' : 'var(--text-secondary)'
  const accentOnRich = isBreak ? 'hsl(160 70% 65%)' : 'hsl(220 70% 60%)'

  return (
    <main 
      ref={containerRef}
      className={`${isFullscreen ? 'ml-0' : 'ml-64'} min-h-screen transition-all duration-500 relative`} 
      style={{ 
        ...bgStyle,
        paddingTop: '3rem',
        paddingBottom: '3rem'
      }}
    >
      {/* Scrim for readability on rich backgrounds */}
      {scrimOpacity > 0 && (
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{ background: `rgba(0,0,0,${scrimOpacity})`, opacity: fsAnimating ? 1 : 1 }}
        />
      )}
      {/* Fullscreen fade / mask */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{ background: 'rgba(0,0,0,0.08)', opacity: fsAnimating ? 1 : 0 }}
      />
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-black" style={{ color: isRichBG ? onBgColor : 'var(--text-primary)' }}>
            {isBreak ? 'Break Time 🌟' : 'Focus Mode 🎯'}
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleFullscreen}
              className="px-5 py-2 rounded-full transition-all text-sm md:text-base border"
              style={{
                backgroundColor: isRichBG ? 'rgba(255,255,255,0.08)' : 'var(--bg-secondary)',
                borderColor: isRichBG ? 'rgba(255,255,255,0.25)' : 'var(--border-color)',
                color: isRichBG ? onBgColor : 'var(--text-primary)',
                backdropFilter: isRichBG ? 'blur(6px)' : undefined
              }}
            >
              {isFullscreen ? 'Exit Full Mode' : 'Full Mode'}
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="px-5 py-2 rounded-full transition-all text-sm md:text-base border"
              style={{
                backgroundColor: isRichBG ? 'rgba(255,255,255,0.08)' : 'var(--bg-secondary)',
                borderColor: isRichBG ? 'rgba(255,255,255,0.25)' : 'var(--border-color)',
                color: isRichBG ? onBgColor : 'var(--text-primary)',
                backdropFilter: isRichBG ? 'blur(6px)' : undefined
              }}
            >
              ⚙️ Settings
            </button>
          </div>
        </div>
        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30" onClick={() => setShowSettings(false)} />
            <div className="relative z-10 w-full max-w-2xl mx-auto border rounded-2xl p-6 md:p-8" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', boxShadow: 'var(--shadow-lg)' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl md:text-2xl" style={{ color: 'var(--text-primary)' }}>⚙️ Customize Timer</h2>
                <button onClick={() => setShowSettings(false)} className="px-3 py-1 rounded-full border" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>Close</button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {/* Work Duration */}
                <div>
                  <label className="block mb-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Work Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={workDuration}
                    onChange={(e) => setWorkDuration(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-4 py-2 rounded-xl text-base"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>

                {/* Break Duration */}
                <div>
                  <label className="block mb-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Break Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={breakDuration}
                    onChange={(e) => setBreakDuration(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-4 py-2 rounded-xl text-base"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
              </div>

              {/* Background Selection */}
              <div className="mb-6">
                <label className="block mb-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Backgrounds (themes + images)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                  {/* Upload tile */}
                  <label className="h-20 rounded-xl border-2 transition-all hover:scale-105 flex items-center justify-center cursor-pointer" style={{ borderColor: background === 'custom' ? 'var(--accent-primary)' : 'var(--border-color)', background: 'var(--bg-primary)' }}>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        try {
                          const dataUrl = await resizeImageToDataURL(file, 1920, 1080, 0.85)
                          setCustomBg(dataUrl)
                          try { localStorage.setItem('focusCustomBg', dataUrl) } catch {}
                          setBackground('custom')
                        } catch (err) {
                          console.warn('Failed to process image', err)
                        }
                      }}
                    />
                    <span className="text-xs font-medium px-2 py-1 rounded" style={{ color: 'var(--text-primary)', backgroundColor: 'transparent' }}>
                      + Upload
                    </span>
                  </label>
                  {/* Existing presets */}
                  {Object.keys(backgrounds).filter((k) => k !== 'custom').map((bg) => (
                    <button
                      key={bg}
                      onClick={() => setBackground(bg)}
                      className="h-20 rounded-xl border-2 transition-all hover:scale-105 flex items-center justify-center overflow-hidden"
                      style={{
                        background: isImageBG(backgrounds[bg]) ? undefined : backgrounds[bg],
                        backgroundImage: isImageBG(backgrounds[bg]) ? backgrounds[bg] : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderColor: background === bg ? 'var(--accent-primary)' : 'transparent'
                      }}
                    >
                      <span className="text-xs font-medium px-2 py-1 rounded" style={{ color: '#fff', backgroundColor: 'rgba(0,0,0,0.35)', textTransform: 'capitalize' }}>
                        {bg}
                      </span>
                    </button>
                  ))}
                </div>
                {background === 'custom' && customBg && (
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Using your uploaded image</span>
                    <button
                      className="text-xs px-3 py-1 rounded-full border"
                      style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                      onClick={() => {
                        setCustomBg('')
                        try { localStorage.removeItem('focusCustomBg') } catch {}
                        setBackground('default')
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3">
                <button onClick={() => setShowSettings(false)} className="px-5 py-2 rounded-full border" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>Cancel</button>
                <button
                  onClick={applySettings}
                  className="px-8 py-3 rounded-full font-semibold hover:scale-105 transition-all"
                  style={{
                    backgroundColor: 'hsl(220, 70%, 40%)',
                    color: 'hsl(0, 0%, 100%)'
                  }}
                >
                  Apply Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Circular Timer */}
        <div className="flex justify-center items-center mb-8">
          <div className="relative" style={{ width: '300px', height: '300px' }}>
            {/* Glow Effect */}
            {isActive && (
              <div className="absolute inset-0 rounded-full" style={{
                background: isBreak ? 'radial-gradient(circle, rgba(127, 0, 255, 0.15) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
                animation: 'pulse 2s ease-in-out infinite'
              }} />
            )}
            {/* Glass Background */}
            <div 
              className="absolute inset-0 rounded-full border-2"
              style={{ 
                backgroundColor: isRichBG ? 'rgba(255,255,255,0.06)' : 'var(--bg-primary)',
                borderColor: isRichBG ? 'rgba(255,255,255,0.2)' : 'var(--border-color)',
                boxShadow: isRichBG ? '0 10px 40px rgba(0,0,0,0.25)' : '0 20px 60px hsla(220, 70%, 50%, 0.12), 0 8px 24px hsla(220, 70%, 50%, 0.08)',
                backdropFilter: isRichBG ? 'blur(10px)' : undefined,
                transform: isActive ? 'scale(1.02)' : 'scale(1)',
                transition: 'transform 300ms ease, box-shadow 300ms ease'
              }}
            />

            {/* SVG Progress */}
            <svg className="absolute inset-0 transform -rotate-90" width="300" height="300">
              <defs>
                <linearGradient id="focusGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={accentOnRich} />
                  <stop offset="100%" stopColor={isBreak ? 'hsl(160 70% 45%)' : 'hsl(220 70% 45%)'} />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Minute Markers with Fade Effect */}
              {Array.from({ length: 60 }).map((_, i) => {
                const angle = (i * 6) * (Math.PI / 180); // 6 degrees per minute
                const isFiveMinute = i % 5 === 0;
                const radius = 135;
                const lineLength = isFiveMinute ? 12 : 6;
                const lineWidth = isFiveMinute ? 2.5 : 1.5;
                
                // Calculate which markers should be "filled" based on progress
                const markerProgress = (i / 60) * 100;
                const isPassed = markerProgress <= progress;
                
                // Fade markers that have been passed
                const baseOpacity = isFiveMinute ? 0.9 : 0.4;
                const opacity = isPassed ? baseOpacity * 0.2 : baseOpacity;
                
                const x1 = 150 + (radius - lineLength) * Math.cos(angle);
                const y1 = 150 + (radius - lineLength) * Math.sin(angle);
                const x2 = 150 + radius * Math.cos(angle);
                const y2 = 150 + radius * Math.sin(angle);
                
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={isPassed 
                      ? (isRichBG ? `rgba(255,255,255,${opacity})` : (isBreak ? 'var(--accent-secondary)' : 'var(--accent-primary)'))
                      : (isRichBG ? `rgba(255,255,255,${opacity})` : `var(--text-primary)`)
                    }
                    strokeWidth={lineWidth}
                    strokeLinecap="round"
                    opacity={opacity}
                    style={{ transition: 'opacity 0.5s ease, stroke 0.5s ease' }}
                  />
                );
              })}
            </svg>

            {/* Timer Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div 
                className="text-5xl md:text-6xl font-bold"
                style={{ 
                  color: isRichBG ? '#fff' : (isBreak ? 'hsl(220, 70%, 55%)' : 'hsl(220, 70%, 40%)'),
                  fontFamily: "'Space Grotesk', monospace",
                  textShadow: isRichBG ? '0 6px 22px rgba(0,0,0,0.35)' : '0 0 8px hsla(220, 70%, 40%, 0.15)',
                  transition: 'transform 220ms ease, opacity 220ms ease',
                  transform: tickPulse ? 'translateY(-2px)' : 'translateY(0)',
                  opacity: tickPulse ? 0.95 : 1
                }}
              >
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>
              
              <p className="mt-2 text-base font-medium" style={{ color: isRichBG ? onBgSubtle : 'hsl(220, 10%, 50%)' }}>
                {isActive ? '⏱️ Running' : '⏸️ Paused'}
              </p>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
          <button
            onClick={toggleTimer}
            className="px-10 py-4 font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg"
            style={{
              background: isRichBG 
                ? (isBreak ? 'linear-gradient(135deg, hsl(270, 70%, 60%), hsl(270, 70%, 50%))' : 'linear-gradient(135deg, hsl(220, 70%, 60%), hsl(220, 70%, 50%))')
                : (isBreak ? 'linear-gradient(135deg, var(--accent-secondary), hsl(270, 60%, 48%))' : 'linear-gradient(135deg, var(--accent-primary), hsl(220, 65%, 48%))'),
              color: '#ffffff',
              boxShadow: isActive 
                ? (isBreak ? '0 8px 32px hsla(270, 70%, 50%, 0.4), 0 0 0 3px hsla(270, 70%, 50%, 0.2)' : '0 8px 32px hsla(220, 70%, 50%, 0.4), 0 0 0 3px hsla(220, 70%, 50%, 0.2)')
                : (isBreak ? '0 4px 20px hsla(270, 70%, 50%, 0.3)' : '0 4px 20px hsla(220, 70%, 50%, 0.3)'),
              border: 'none'
            }}
          >
            {isActive ? '⏸️ Pause' : '▶️ Start'}
          </button>
          <button
            onClick={resetTimer}
            className="px-8 py-4 font-semibold rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300 border-2"
            style={{
              color: isRichBG ? onBgColor : 'var(--text-primary)',
              borderColor: isRichBG ? 'rgba(255,255,255,0.3)' : 'var(--accent-primary)',
              backgroundColor: isRichBG ? 'rgba(255,255,255,0.08)' : 'var(--bg-primary)',
              backdropFilter: isRichBG ? 'blur(8px)' : undefined,
              boxShadow: isRichBG ? '0 4px 16px rgba(0,0,0,0.15)' : '0 4px 16px hsla(220, 70%, 50%, 0.08)'
            }}
          >
            🔄 Reset
          </button>
          <button
            onClick={switchMode}
            className="px-8 py-4 font-semibold rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300 border-2"
            style={{
              color: isRichBG ? onBgColor : 'var(--text-primary)',
              borderColor: isRichBG ? 'rgba(255,255,255,0.35)' : (isBreak ? 'var(--accent-primary)' : 'var(--accent-secondary)'),
              backgroundColor: isRichBG ? 'rgba(255,255,255,0.08)' : 'var(--bg-primary)',
              backdropFilter: isRichBG ? 'blur(8px)' : undefined,
              boxShadow: isRichBG ? '0 4px 16px rgba(0,0,0,0.15)' : (isBreak ? '0 4px 16px hsla(220, 70%, 50%, 0.08)' : '0 4px 16px hsla(270, 70%, 50%, 0.08)')
            }}
          >
            {isBreak ? '🎯 Focus' : '☕ Break'}
          </button>
        </div>

        {/* Info */}
        <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="relative overflow-hidden border-2 rounded-3xl p-8 group hover:scale-105 transition-all duration-300" style={{ 
            backgroundColor: isRichBG ? 'rgba(255,255,255,0.08)' : 'var(--bg-primary)',
            borderColor: isRichBG ? 'rgba(255,255,255,0.2)' : 'var(--accent-primary)',
            boxShadow: isRichBG ? '0 8px 32px rgba(0,0,0,0.2)' : '0 8px 32px hsla(220, 70%, 50%, 0.12)',
            backdropFilter: isRichBG ? 'blur(12px)' : undefined
          }}>
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-20" style={{
              background: 'radial-gradient(circle, var(--accent-primary) 0%, transparent 70%)',
              transform: 'translate(30%, -30%)'
            }} />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
                  background: isRichBG ? 'rgba(255,255,255,0.15)' : 'var(--accent-light)'
                }}>
                  <span className="text-xl">🎯</span>
                </div>
                <h3 className="font-bold" style={{ color: isRichBG ? accentOnRich : 'var(--accent-primary)', fontSize: '1.35rem' }}>
                  Work Session
                </h3>
              </div>
              <p className="text-lg" style={{ color: isRichBG ? onBgSubtle : 'var(--text-secondary)' }}>
                {workDuration} minutes of focused work
              </p>
            </div>
          </div>
          <div className="relative overflow-hidden border-2 rounded-3xl p-8 group hover:scale-105 transition-all duration-300" style={{ 
            backgroundColor: isRichBG ? 'rgba(255,255,255,0.08)' : 'var(--bg-primary)',
            borderColor: isRichBG ? 'rgba(255,255,255,0.2)' : 'var(--accent-secondary)',
            boxShadow: isRichBG ? '0 8px 32px rgba(0,0,0,0.2)' : '0 8px 32px hsla(270, 70%, 50%, 0.12)',
            backdropFilter: isRichBG ? 'blur(12px)' : undefined
          }}>
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-20" style={{
              background: 'radial-gradient(circle, var(--accent-secondary) 0%, transparent 70%)',
              transform: 'translate(30%, -30%)'
            }} />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
                  background: isRichBG ? 'rgba(255,255,255,0.15)' : 'var(--accent-light)'
                }}>
                  <span className="text-xl">☕</span>
                </div>
                <h3 className="font-bold" style={{ color: isRichBG ? 'hsl(160 60% 50%)' : 'var(--accent-secondary)', fontSize: '1.35rem' }}>
                  Break Time
                </h3>
              </div>
              <p className="text-lg" style={{ color: isRichBG ? onBgSubtle : 'var(--text-secondary)' }}>
                {breakDuration} minutes to recharge
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Focus
