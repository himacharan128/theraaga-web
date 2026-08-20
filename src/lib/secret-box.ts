import 'server-only'

import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_BYTES = 12
const AUTH_TAG_BYTES = 16

function encryptionKey(): Buffer {
  const encoded = process.env.GSC_TOKEN_ENCRYPTION_KEY?.trim()
  if (!encoded) throw new Error('GSC_TOKEN_ENCRYPTION_KEY is not set')

  const key = Buffer.from(encoded, 'base64')
  if (key.length !== 32) {
    throw new Error('GSC_TOKEN_ENCRYPTION_KEY must be a base64-encoded 32-byte key')
  }
  return key
}

/**
 * Encrypts a server-only OAuth token before it reaches MongoDB. The three
 * fields are base64url so they are safe to store and rotate independently.
 */
export function sealSecret(value: string): string {
  const iv = randomBytes(IV_BYTES)
  const cipher = createCipheriv(ALGORITHM, encryptionKey(), iv)
  const ciphertext = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return [iv, tag, ciphertext].map((part) => part.toString('base64url')).join('.')
}

export function openSecret(sealed: string): string {
  const [ivEncoded, tagEncoded, ciphertextEncoded] = sealed.split('.')
  if (!ivEncoded || !tagEncoded || !ciphertextEncoded) throw new Error('Malformed encrypted secret')

  const iv = Buffer.from(ivEncoded, 'base64url')
  const tag = Buffer.from(tagEncoded, 'base64url')
  const ciphertext = Buffer.from(ciphertextEncoded, 'base64url')
  if (iv.length !== IV_BYTES || tag.length !== AUTH_TAG_BYTES || !ciphertext.length) {
    throw new Error('Malformed encrypted secret')
  }

  const decipher = createDecipheriv(ALGORITHM, encryptionKey(), iv)
  decipher.setAuthTag(tag)
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8')
}
