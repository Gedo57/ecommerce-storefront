export function hashPassword(value = '') {
  try {
    return `hashed:${btoa(unescape(encodeURIComponent(String(value))))}`;
  } catch {
    return `hashed:${String(value)}`;
  }
}

export function isPasswordHashed(value = '') {
  return String(value).startsWith('hashed:');
}

export function verifyPassword(rawPassword, storedPassword) {
  if (!storedPassword) return false;
  if (isPasswordHashed(storedPassword)) {
    return hashPassword(rawPassword) === storedPassword;
  }
  return String(rawPassword) === String(storedPassword);
}

export function generateOtpCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}
