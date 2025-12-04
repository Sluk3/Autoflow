/**
 * Hash a password using SHA-256
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password in hex format
 */
export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Verify a password against a hash
 * @param {string} password - Plain text password
 * @param {string} hash - SHA-256 hash
 * @returns {Promise<boolean>} True if password matches
 */
export async function verifyPassword(password, hash) {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}
