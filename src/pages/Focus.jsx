import { useState, useEffect, useRef } from 'react'

function Focus() {
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [workDuration, setWorkDuration] = useState(25)
  const [breakDuration, setBreakDuration] = useState(5)
  const [background, setBackground] = useState('default')
  const [justReset, setJustReset] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef(null)

  // Theme and image backgrounds (images use CSS url())
  const backgrounds = {
    // Themes
    default: 'var(--bg-secondary)',
    ocean: 'linear-gradient(135deg, hsl(220, 70%, 60%) 0%, hsl(250, 50%, 50%) 100%)',
    sunset: 'linear-gradient(135deg, hsl(300, 85%, 75%) 0%, hsl(350, 80%, 60%) 100%)',
    forest: 'linear-gradient(135deg, hsl(200, 90%, 65%) 0%, hsl(180, 100%, 50%) 100%)',
    night: 'linear-gradient(135deg, hsl(210, 20%, 25%) 0%, hsl(0, 0%, 0%) 100%)',
    // Study images
    study1: "url('https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=1920&auto=format&fit=crop')",
    study2: "url('https://images.unsplash.com/photo-1513197425463-bdddb84fdb47?q=80&w=1920&auto=format&fit=crop')",
    study3: "url('https://images.unsplash.com/photo-1529078155058-5d716f45d604?q=80&w=1920&auto=format&fit=crop')",
    study4: "url('https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1920&auto=format&fit=crop')",
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
      setIsBreak(!isBreak)
      setMinutes(isBreak ? workDuration : breakDuration)
    }
  }, [minutes, seconds, isActive, isBreak, workDuration, breakDuration])

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setJustReset(true)
    setMinutes(isBreak ? breakDuration : workDuration)
    setSeconds(0)
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
        await el.requestFullscreen()
        setIsFullscreen(true)
      } else {
        await document.exitFullscreen()
        setIsFullscreen(false)
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

  const bgVal = backgrounds[background]
  const bgStyle = isImageBG(bgVal)
    ? { backgroundImage: bgVal, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }
    : { background: bgVal }

  return (
    <main 
      ref={containerRef}
      className="ml-64 min-h-screen transition-all duration-500" 
      style={{ 
        ...bgStyle,
        paddingTop: '3rem',
        paddingBottom: '3rem'
      }}
    >
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl" style={{ color: 'hsl(220, 70%, 40%)' }}>
            {isBreak ? 'Break Time 🌟' : 'Focus Mode 🎯'}
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleFullscreen}
              className="px-5 py-2 rounded-full transition-all text-sm md:text-base border"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
            >
              {isFullscreen ? 'Exit Full Mode' : 'Full Mode'}
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="px-6 py-2 rounded-full transition-all text-sm md:text-base"
              style={{
                backgroundColor: 'hsl(220, 20%, 96%)',
                border: '1px solid hsl(220, 15%, 90%)',
                color: 'hsl(220, 20%, 20%)'
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
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {Object.keys(backgrounds).map((bg) => (
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
          <div className="relative" style={{ width: '280px', height: '280px' }}>
            {/* Glass Background */}
            <div 
              className="absolute inset-0 rounded-full border"
              style={{ 
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                boxShadow: 'var(--shadow-lg)'
              }}
            />

            {/* SVG Progress */}
            <svg className="absolute inset-0 transform -rotate-90" width="280" height="280">
              <circle
                cx="140"
                cy="140"
                r="125"
                stroke="var(--border-color)"
                strokeWidth="14"
                fill="none"
              />
              <circle
                cx="140"
                cy="140"
                r="125"
                stroke={isBreak ? 'var(--accent-secondary)' : 'var(--accent-primary)'}
                strokeWidth="14"
                fill="none"
                strokeDasharray={2 * Math.PI * 125}
                strokeDashoffset={2 * Math.PI * 125 * (1 - progress / 100)}
                strokeLinecap="round"
                style={{ transition: justReset ? 'none' : 'stroke-dashoffset 1s linear' }}
              />
            </svg>

            {/* Timer Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div 
                className="text-5xl md:text-6xl font-bold"
                style={{ 
                  color: isBreak ? 'hsl(220, 70%, 55%)' : 'hsl(220, 70%, 40%)',
                  fontFamily: "'Space Grotesk', monospace",
                  textShadow: '0 0 8px hsla(220, 70%, 40%, 0.15)'
                }}
              >
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>
              
              <p className="mt-2 text-base font-medium" style={{ color: 'hsl(220, 10%, 50%)' }}>
                {isActive ? '⏱️ Running' : '⏸️ Paused'}
              </p>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 mb-8">
          <button
            onClick={toggleTimer}
            className="px-8 py-3 font-semibold rounded-full hover:scale-105 transition-all duration-300"
            style={{
              backgroundColor: isBreak ? 'var(--accent-secondary)' : 'var(--accent-primary)',
              color: 'var(--bg-primary)'
            }}
          >
            {isActive ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={resetTimer}
            className="px-8 py-3 font-semibold rounded-full hover:scale-105 transition-all duration-300 border"
            style={{
              color: 'hsl(220, 20%, 20%)',
              borderColor: 'var(--border-color)',
              backgroundColor: 'hsl(220, 20%, 98%)'
            }}
          >
            Reset
          </button>
          <button
            onClick={switchMode}
            className="px-8 py-3 font-semibold rounded-full hover:scale-105 transition-all duration-300 border"
            style={{
              color: isBreak ? 'var(--accent-primary)' : 'var(--accent-secondary)',
              borderColor: isBreak ? 'var(--accent-primary)' : 'var(--accent-secondary)',
              backgroundColor: 'transparent'
            }}
          >
            {isBreak ? 'Focus' : 'Break'}
          </button>
        </div>

        {/* Info */}
        <div className="max-w-2xl mx-auto grid md:grid-cols-2 gap-4">
          <div className="border rounded-2xl p-6" style={{ 
            backgroundColor: 'hsl(0, 0%, 100%)',
            borderColor: 'var(--border-color)',
            boxShadow: '0 6px 24px hsla(220, 30%, 20%, 0.06)'
          }}>
            <h3 className="font-bold mb-3" style={{ color: 'var(--accent-primary)', fontSize: '1.25rem' }}>
              Work Session
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              {workDuration} minutes of focused work
            </p>
          </div>
          <div className="border rounded-2xl p-6" style={{ 
            backgroundColor: 'hsl(0, 0%, 100%)',
            borderColor: 'var(--border-color)',
            boxShadow: '0 6px 24px hsla(220, 30%, 20%, 0.06)'
          }}>
            <h3 className="font-bold mb-3" style={{ color: 'var(--accent-secondary)', fontSize: '1.25rem' }}>
              Break Time
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              {breakDuration} minutes to recharge
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Focus
