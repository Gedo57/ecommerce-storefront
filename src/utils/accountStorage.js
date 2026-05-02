import { generateOtpCode, hashPassword, isPasswordHashed } from './security';

const USERS_KEY = 'storefront-users';
const SESSION_KEY = 'storefront-session';

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function normalizeUser(user) {
  if (!user) return user;
  const normalizedPassword = !isPasswordHashed(user.password) ? hashPassword(user.password) : user.password;
  return {
    role: 'customer',
    vendorStatus: 'approved',
    storeName: '',
    businessType: '',
    phone: '',
    ...user,
    password: normalizedPassword,
  };
}

function upsertSeedUser(users, seedUser) {
  const normalizedSeed = normalizeUser(seedUser);
  const exactIndex = users.findIndex((user) => {
    const sameId = user.id && normalizedSeed.id && user.id === normalizedSeed.id;
    const sameEmail = user.email?.toLowerCase() === normalizedSeed.email?.toLowerCase();
    return sameId || sameEmail;
  });

  if (exactIndex >= 0) {
    users[exactIndex] = {
      ...users[exactIndex],
      ...normalizedSeed,
      id: users[exactIndex].id || normalizedSeed.id,
      createdAt: users[exactIndex].createdAt || normalizedSeed.createdAt,
    };
    return users;
  }

  users.push(normalizedSeed);
  return users;
}

function ensureSeedUsers() {
  const existingUsers = readJson(USERS_KEY, []).map(normalizeUser);

  const seededUsers = [
    {
      id: 'admin-seed',
      name: 'SET Admin',
      email: 'Admin@admin.com',
      password: hashPassword('1234'),
      role: 'admin',
      vendorStatus: 'approved',
      emailVerified: true,
      verificationCode: '',
      resetCode: '',
      addresses: [],
      orders: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'vendor-seed',
      name: 'Ahmed Vendor',
      email: 'vendor@vendor.com',
      password: hashPassword('1234'),
      role: 'vendor',
      vendorStatus: 'approved',
      storeName: 'Ahmed Fashion House',
      businessType: 'Fashion Retail',
      phone: '+20 100 000 0000',
      emailVerified: true,
      verificationCode: '',
      resetCode: '',
      addresses: [],
      orders: [],
      createdAt: new Date().toISOString(),
    },
  ];

  let nextUsers = [...existingUsers];
  nextUsers = upsertSeedUser(nextUsers, seededUsers[0]);
  nextUsers = upsertSeedUser(nextUsers, seededUsers[1]);
  saveUsers(nextUsers);
}

export function getUsers() {
  ensureSeedUsers();
  const users = readJson(USERS_KEY, []).map(normalizeUser);
  saveUsers(users);
  return users;
}

export function saveUsers(users) {
  writeJson(USERS_KEY, users.map(normalizeUser));
}

export function getSessionUserId() {
  return localStorage.getItem(SESSION_KEY) || '';
}

export function setSessionUserId(userId) {
  localStorage.setItem(SESSION_KEY, userId);
}

export function clearSessionUserId() {
  localStorage.removeItem(SESSION_KEY);
}

export function findUserByEmail(email) {
  const users = getUsers();
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null;
}

export function findUserById(userId) {
  const users = getUsers();
  return users.find((user) => user.id === userId) || null;
}

export function createUser({
  name,
  email,
  password,
  role = 'customer',
  vendorStatus,
  storeName = '',
  businessType = '',
  phone = '',
}) {
  const users = getUsers();
  const verificationCode = generateOtpCode();
  const resolvedRole = role || 'customer';
  const resolvedVendorStatus =
    resolvedRole === 'vendor' ? vendorStatus || 'pending' : vendorStatus || 'approved';

  const user = {
    id: `user-${Date.now()}`,
    name,
    email,
    password: hashPassword(password),
    role: resolvedRole,
    vendorStatus: resolvedVendorStatus,
    storeName,
    businessType,
    phone,
    emailVerified: false,
    verificationCode,
    resetCode: '',
    addresses: [],
    orders: [],
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  saveUsers(users);
  return normalizeUser(user);
}

export function updateUser(userId, updater) {
  const users = getUsers();
  const nextUsers = users.map((user) => {
    if (user.id !== userId) return user;
    const nextUser = typeof updater === 'function' ? updater(user) : { ...user, ...updater };
    return normalizeUser(nextUser);
  });
  saveUsers(nextUsers);
  return nextUsers.find((user) => user.id === userId) || null;
}

export function getVendorAccounts() {
  return getUsers()
    .filter((user) => user.role === 'vendor')
    .map((user) => ({
      id: user.id,
      name: user.storeName || 'Untitled Store',
      owner: user.name,
      email: user.email,
      phone: user.phone || '—',
      businessType: user.businessType || 'General',
      products: Array.isArray(user.products) ? user.products.length : 0,
      orders: Array.isArray(user.orders) ? user.orders.length : 0,
      revenue: Number(user.vendorRevenue || 0),
      commissionRate: user.commissionRate || '12%',
      status:
        user.vendorStatus === 'approved'
          ? 'Approved'
          : user.vendorStatus === 'pending'
            ? 'Pending'
            : user.vendorStatus === 'suspended'
              ? 'Suspended'
              : user.vendorStatus === 'rejected'
                ? 'Rejected'
                : user.vendorStatus,
      createdAt: user.createdAt,
    }));
}

export function setVendorStatus(userId, vendorStatus) {
  return updateUser(userId, (current) => ({
    ...current,
    vendorStatus,
  }));
}

export function createPasswordReset(email) {
  const found = findUserByEmail(email);
  if (!found) return null;
  const resetCode = generateOtpCode();
  return updateUser(found.id, { resetCode });
}

export function clearPasswordReset(userId) {
  return updateUser(userId, { resetCode: '' });
}

export function refreshVerificationCode(userId) {
  return updateUser(userId, { verificationCode: generateOtpCode() });
}
