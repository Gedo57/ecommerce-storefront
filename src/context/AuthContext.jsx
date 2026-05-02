import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  clearPasswordReset,
  clearSessionUserId,
  createPasswordReset,
  createUser,
  findUserByEmail,
  findUserById,
  getSessionUserId,
  refreshVerificationCode,
  setSessionUserId,
  updateUser,
} from '../utils/accountStorage';
import { verifyPassword, hashPassword } from '../utils/security';
import { createEmail } from '../utils/commerceStorage';

const AuthContext = createContext(null);

function getDefaultRouteForUser(user) {
  if (!user) return '/login';
  if (user.role === 'admin') return '/admin';
  if (user.role === 'vendor') return user.vendorStatus === 'approved' ? '/vendor' : '/vendor/pending';
  return '/account';
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const sessionUserId = getSessionUserId();
    if (sessionUserId) {
      const found = findUserById(sessionUserId);
      if (found) setUser(found);
    }
  }, []);

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    getDefaultRouteForUser,
    login: ({ email, password }) => {
      const found = findUserByEmail(email);
      if (!found || !verifyPassword(password, found.password)) {
        throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
      }
      setSessionUserId(found.id);
      setUser(found);
      return found;
    },
    register: ({ name, email, password }) => {
      if (findUserByEmail(email)) {
        throw new Error('هذا البريد الإلكتروني مستخدم بالفعل.');
      }
      const created = createUser({ name, email, password, role: 'customer' });
      createEmail({
        to: email,
        subject: 'رمز تفعيل الحساب',
        body: `مرحبًا ${name}، رمز التفعيل المحلي لحسابك هو: ${created.verificationCode}`,
        type: 'verification',
      });
      setSessionUserId(created.id);
      setUser(created);
      return created;
    },
    registerVendor: ({ name, email, password, storeName, phone, businessType }) => {
      if (findUserByEmail(email)) {
        throw new Error('هذا البريد الإلكتروني مستخدم بالفعل.');
      }
      const created = createUser({
        name,
        email,
        password,
        role: 'vendor',
        vendorStatus: 'pending',
        storeName,
        phone,
        businessType,
      });
      createEmail({
        to: email,
        subject: 'تم استلام طلب إنشاء حساب تاجر',
        body: `مرحبًا ${name}، تم استلام طلب المتجر ${storeName}. حالة الحساب الحالية: pending review.`,
        type: 'vendor_registration',
      });
      setSessionUserId(created.id);
      setUser(created);
      return created;
    },
    logout: () => {
      clearSessionUserId();
      setUser(null);
    },
    refreshUser: () => {
      const sessionUserId = getSessionUserId();
      if (!sessionUserId) return null;
      const found = findUserById(sessionUserId);
      setUser(found);
      return found;
    },
    saveAddress: (address) => {
      if (!user) throw new Error('يجب تسجيل الدخول أولاً.');
      const updated = updateUser(user.id, (current) => ({
        ...current,
        addresses: [
          {
            id: `address-${Date.now()}`,
            ...address,
            createdAt: new Date().toISOString(),
          },
          ...(current.addresses || []),
        ],
      }));
      setUser(updated);
      return updated;
    },
    deleteAddress: (addressId) => {
      if (!user) return null;
      const updated = updateUser(user.id, (current) => ({
        ...current,
        addresses: (current.addresses || []).filter((address) => address.id !== addressId),
      }));
      setUser(updated);
      return updated;
    },
    addOrder: (order) => {
      if (!user) return null;
      const updated = updateUser(user.id, (current) => ({
        ...current,
        orders: [order, ...(current.orders || [])],
      }));
      setUser(updated);
      createEmail({
        to: updated.email,
        subject: `تأكيد الطلب ${order.reference}`,
        body: `تم استلام طلبك بنجاح. الحالة الحالية: ${order.status}. إجمالي الطلب: ${order.totalBase}.`,
        type: 'order_confirmation',
      });
      return updated;
    },
    updateProfile: (payload) => {
      if (!user) return null;
      const updated = updateUser(user.id, payload);
      setUser(updated);
      return updated;
    },
    resendVerificationCode: () => {
      if (!user) return null;
      const updated = refreshVerificationCode(user.id);
      createEmail({
        to: updated.email,
        subject: 'إعادة إرسال رمز التفعيل',
        body: `رمز التفعيل المحلي الجديد هو: ${updated.verificationCode}`,
        type: 'verification',
      });
      setUser(updated);
      return updated;
    },
    verifyEmailCode: (code) => {
      if (!user) throw new Error('يجب تسجيل الدخول أولاً.');
      if (String(code).trim() !== String(user.verificationCode || '').trim()) {
        throw new Error('رمز التفعيل غير صحيح.');
      }
      const updated = updateUser(user.id, { emailVerified: true, verificationCode: '' });
      setUser(updated);
      return updated;
    },
    requestPasswordReset: (email) => {
      const updated = createPasswordReset(email);
      if (!updated) {
        throw new Error('لا يوجد حساب بهذا البريد الإلكتروني.');
      }
      createEmail({
        to: updated.email,
        subject: 'رمز إعادة تعيين كلمة المرور',
        body: `رمز إعادة التعيين المحلي هو: ${updated.resetCode}`,
        type: 'password_reset',
      });
      return updated;
    },
    resetPassword: ({ email, code, newPassword }) => {
      const found = findUserByEmail(email);
      if (!found || String(found.resetCode || '').trim() !== String(code).trim()) {
        throw new Error('رمز إعادة التعيين غير صحيح.');
      }
      const updated = updateUser(found.id, { password: hashPassword(newPassword) });
      clearPasswordReset(updated.id);
      createEmail({
        to: updated.email,
        subject: 'تم تغيير كلمة المرور',
        body: 'تم تحديث كلمة المرور المحلية لحسابك بنجاح.',
        type: 'security',
      });
      if (user?.id === updated.id) setUser(findUserById(updated.id));
      return updated;
    },
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
