// Quick verification for Supabase anon key against Auth API
// Usage: node scripts/verify-supabase-key.mjs
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(process.cwd())
const envPath = path.join(root, '.env.local')

function parseEnv(filePath) {
	const buf = fs.readFileSync(filePath)
	let text = ''
	// Detect BOM/encoding
	if (buf.length >= 2 && buf[0] === 0xFF && buf[1] === 0xFE) {
		// UTF-16 LE
		text = buf.toString('utf16le')
	} else if (buf.length >= 2 && buf[0] === 0xFE && buf[1] === 0xFF) {
		// UTF-16 BE -> swap then decode as LE
		const swapped = Buffer.from(buf)
		for (let i = 0; i + 1 < swapped.length; i += 2) {
			const a = swapped[i]
			swapped[i] = swapped[i + 1]
			swapped[i + 1] = a
		}
		text = swapped.toString('utf16le')
	} else {
		// Assume UTF-8
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

async function main() {
	if (!fs.existsSync(envPath)) {
		console.error('Missing .env.local at project root')
		process.exit(1)
	}
	const env = parseEnv(envPath)
	const url = env.VITE_SUPABASE_URL
	const key = env.VITE_SUPABASE_ANON_KEY

	if (!url || !key) {
		console.error('VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY missing in .env.local')
		process.exit(1)
	}

	const endpoint = `${url.replace(/\/$/, '')}/auth/v1/settings`
	console.log('Checking:', endpoint)

	try {
		const res = await fetch(endpoint, {
			headers: {
				apikey: key,
				Authorization: `Bearer ${key}`,
			},
		})
		const text = await res.text()
		console.log('Status:', res.status, res.statusText)
		try {
			console.log('Body:', JSON.stringify(JSON.parse(text), null, 2))
		} catch {
			console.log('Body:', text)
		}
		if (res.status === 401) {
			console.error('\nResult: Invalid API key for this project.')
			process.exit(2)
		}
		if (!res.ok) {
			console.error('\nResult: Request failed; see status/body above.')
			process.exit(3)
		}
		console.log('\nResult: Key accepted by Supabase Auth. ✅')
	} catch (err) {
		console.error('Request error:', err)
		process.exit(4)
	}
}

main()
