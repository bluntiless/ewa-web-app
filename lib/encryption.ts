import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto"

// Get encryption key from environment or generate a default for development
function getEncryptionKey(): Buffer {
  const secret = process.env.SUBMISSION_ENCRYPTION_KEY || process.env.NEXTAUTH_SECRET
  if (!secret) {
    throw new Error("SUBMISSION_ENCRYPTION_KEY or NEXTAUTH_SECRET must be set for secure storage")
  }
  // Derive a 32-byte key from the secret
  return scryptSync(secret, "skills-scan-salt", 32)
}

export function encryptData(data: string): string {
  const key = getEncryptionKey()
  const iv = randomBytes(16)
  const cipher = createCipheriv("aes-256-gcm", key, iv)
  
  let encrypted = cipher.update(data, "utf8", "hex")
  encrypted += cipher.final("hex")
  
  const authTag = cipher.getAuthTag()
  
  // Return IV + AuthTag + Encrypted data (all hex encoded)
  return iv.toString("hex") + ":" + authTag.toString("hex") + ":" + encrypted
}

export function decryptData(encryptedData: string): string {
  const key = getEncryptionKey()
  const [ivHex, authTagHex, encrypted] = encryptedData.split(":")
  
  if (!ivHex || !authTagHex || !encrypted) {
    throw new Error("Invalid encrypted data format")
  }
  
  const iv = Buffer.from(ivHex, "hex")
  const authTag = Buffer.from(authTagHex, "hex")
  
  const decipher = createDecipheriv("aes-256-gcm", key, iv)
  decipher.setAuthTag(authTag)
  
  let decrypted = decipher.update(encrypted, "hex", "utf8")
  decrypted += decipher.final("utf8")
  
  return decrypted
}

// For storing JSON data
export function encryptJSON(data: object): string {
  return encryptData(JSON.stringify(data))
}

export function decryptJSON<T>(encryptedData: string): T {
  return JSON.parse(decryptData(encryptedData)) as T
}
