import fs from 'node:fs'
import path from 'node:path'

function parseEnv(filePath) {
  const buf = fs.readFileSync(filePath)
  let text = ''
  if (buf.length >= 2 && buf[0] === 0xFF && buf[1] === 0xFE) {
    text = buf.toString('utf16le')
  } else if (buf.length >= 2 && buf[0] === 0xFE && buf[1] === 0xFF) {
    const swapped = Buffer.from(buf)
    for (let i = 0; i + 1 < swapped.length; i += 2) {
      const a = swapped[i]
      swapped[i] = swapped[i + 1]
      swapped[i + 1] = a
    }
    text = swapped.toString('utf16le')
  } else {
    text = buf.toString('utf8')
  }
  if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1)
  const lines = text.split(/\r?\n/)
  const out = {}
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let val = trimmed.slice(eq + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    out[key] = val
  }
  return out
}

const env = parseEnv(path.join(process.cwd(), '.env.local'))
const url = env.VITE_SUPABASE_URL
const key = env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env.local')
  process.exit(1)
}

const ts = Date.now()
const candidates = [
  `test${ts}@example.org`,
  `test${ts}@example.com`,
  `test${ts}@test.com`
]
const password = 'TestPass123!'

async function main(){
  const endpoint = `${url.replace(/\/$/, '')}/auth/v1/signup`
  for (const email of candidates) {
    console.log('Trying email:', email)
    try{
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: key,
          Authorization: `Bearer ${key}`
        },
        body: JSON.stringify({ email, password })
      })
      const body = await res.text()
      console.log('Status:', res.status, res.statusText)
      try{ console.log('Response:', JSON.stringify(JSON.parse(body), null, 2)) } catch { console.log('Response:', body) }
      if (res.ok) {
        console.log('User created successfully:', email)
        return
      }
    } catch (err) {
      console.error('Request failed:', err)
    }
  }
  console.error('All signup attempts failed')
}

main()
