import { randomBytes, scrypt } from 'node:crypto'
import { promisify } from 'node:util'

const derive = promisify(scrypt)

function readPassword() {
  if (!process.stdin.isTTY) {
    throw new Error('Run this command in an interactive terminal so the password is not exposed in shell history.')
  }

  return new Promise((resolve, reject) => {
    let value = ''
    const stdin = process.stdin
    stdin.setRawMode(true)
    stdin.resume()
    stdin.setEncoding('utf8')
    process.stdout.write('New admin password: ')

    const done = () => {
      stdin.setRawMode(false)
      stdin.pause()
      process.stdout.write('\n')
    }

    stdin.on('data', (chunk) => {
      const key = String(chunk)
      if (key === '\u0003') {
        done()
        reject(new Error('Cancelled.'))
      } else if (key === '\r' || key === '\n') {
        done()
        resolve(value)
      } else if (key === '\u007f' || key === '\b') {
        value = value.slice(0, -1)
      } else {
        value += key
      }
    })
  })
}

const password = await readPassword()
if (typeof password !== 'string' || password.length < 16) {
  throw new Error('Use a new password with at least 16 characters.')
}

const salt = randomBytes(16)
const hash = await derive(password, salt, 64, {
  N: 16_384,
  r: 8,
  p: 1,
  maxmem: 64 * 1024 * 1024,
})

console.log(`ADMIN_PASSWORD_HASH=scrypt:${salt.toString('base64')}:${hash.toString('base64')}`)
