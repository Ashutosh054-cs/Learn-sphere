const STORAGE_KEY = 'ls_focus_timer_state_v1'

const defaultState = {
  isActive: false,
  isBreak: false,
  workDuration: 25,
  breakDuration: 5,
  minutes: 25,
  seconds: 0,
  sessionStartTime: null,
  originalDuration: 25
}

class TimerManager {
  constructor() {
    this.listeners = new Set()
    this.interval = null
    this.onComplete = null
    this.state = this._load() || { ...defaultState }
    if (this.state.isActive) this._startInterval()
  }

  _save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state))
    } catch {}
  }

  _load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  }

  _notify() {
    const ev = new CustomEvent('ls:timer:update', { detail: this.state })
    window.dispatchEvent(ev)
    for (const l of this.listeners) l(this.state)
  }

  _startInterval() {
    if (this.interval) return
    this.interval = setInterval(() => this._tick(), 1000)
  }

  _stopInterval() {
    if (!this.interval) return
    clearInterval(this.interval)
    this.interval = null
  }

  _tick() {
    if (!this.state.isActive) return
    let { minutes, seconds } = this.state
    if (seconds === 0) {
      if (minutes === 0) {
        // session complete
        this.state.isActive = false
        this._save()
        this._stopInterval()
        this._notify()
        if (typeof this.onComplete === 'function') this.onComplete(this.state)
        return
      } else {
        minutes -= 1
        seconds = 59
      }
    } else {
      seconds -= 1
    }
    this.state.minutes = minutes
    this.state.seconds = seconds
    this._save()
    this._notify()
  }

  start({ workDuration = 25, breakDuration = 5, isBreak = false } = {}) {
    const minutes = isBreak ? breakDuration : workDuration
    this.state = {
      ...this.state,
      isActive: true,
      isBreak,
      workDuration,
      breakDuration,
      minutes,
      seconds: 0,
      sessionStartTime: new Date().toISOString(),
      originalDuration: minutes
    }
    this._save()
    this._startInterval()
    this._notify()
  }

  pause() {
    this.state.isActive = false
    this._save()
    this._stopInterval()
    this._notify()
  }

  resume() {
    if (this.state.isActive) return
    this.state.isActive = true
    this._save()
    this._startInterval()
    this._notify()
  }

  reset() {
    this.state = { ...defaultState }
    this._save()
    this._stopInterval()
    this._notify()
  }

  // change mode without starting (useful when switching between break/focus)
  setMode({ isBreak = false, workDuration = 25, breakDuration = 5 } = {}) {
    const minutes = isBreak ? breakDuration : workDuration
    this.state = {
      ...this.state,
      isActive: false,
      isBreak,
      workDuration,
      breakDuration,
      minutes,
      seconds: 0,
      originalDuration: minutes,
      sessionStartTime: null
    }
    this._save()
    this._notify()
  }

  subscribe(cb) {
    this.listeners.add(cb)
    try { cb(this.state) } catch {}
    return () => this.listeners.delete(cb)
  }

  setOnComplete(fn) { this.onComplete = fn }

  getState() { return this.state }
}

const instance = new TimerManager()
export default instance
