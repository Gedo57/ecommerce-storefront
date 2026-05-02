import { useMemo, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getEmails, markEmailAsRead } from '../utils/commerceStorage';
import { useDocumentMeta } from '../utils/seo';

const defaultLogin = { email: '', password: '' };
const defaultRegister = { name: '', email: '', password: '', confirmPassword: '' };
const defaultVendorRegister = {
  name: '',
  storeName: '',
  email: '',
  phone: '',
  businessType: '',
  password: '',
  confirmPassword: '',
};
const defaultReset = { email: '', code: '', newPassword: '' };

function DemoCredentials() {
  return (
    <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-4 text-xs leading-6 text-white/80">
      <p className="font-semibold text-white">Demo credentials</p>
      <p className="mt-2">Admin: Admin@admin.com / 1234</p>
      <p>Vendor approved: vendor@vendor.com / 1234</p>
    </div>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    login,
    register,
    registerVendor,
    requestPasswordReset,
    resetPassword,
    verifyEmailCode,
    resendVerificationCode,
    user,
    getDefaultRouteForUser,
  } = useAuth();

  const [mode, setMode] = useState('login');
  const [loginForm, setLoginForm] = useState(defaultLogin);
  const [registerForm, setRegisterForm] = useState(defaultRegister);
  const [vendorRegisterForm, setVendorRegisterForm] = useState(defaultVendorRegister);
  const [resetForm, setResetForm] = useState(defaultReset);
  const [verifyCode, setVerifyCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const emails = useMemo(() => getEmails().slice(0, 5), [mode, success, user?.emailVerified]);

  useDocumentMeta({ title: 'Login | SET', description: 'تسجيل الدخول، إنشاء الحساب، وتقديم طلب حساب تاجر داخل المشروع.' });

  if (isAuthenticated && mode !== 'verify') {
    return <Navigate to={getDefaultRouteForUser(user)} replace />;
  }

  const safeAction = (fn) => {
    setError('');
    setSuccess('');
    try {
      fn();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1240px] gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
        <div className="rounded-sm bg-black p-8 text-right text-white">
          <p className="text-sm text-white/60">Authentication Hub / مركز الدخول</p>
          <h1 className="mt-2 text-4xl font-black">دخول العميل والتاجر والأدمن</h1>
          <p className="mt-4 text-sm leading-7 text-white/75">
            النظام الحالي يدعم تسجيل العميل، طلبات انضمام التجار، التحويل حسب نوع الحساب،
            وتفعيل البريد واسترجاع كلمة المرور محليًا.
          </p>
          <div className="mt-8 space-y-3 text-sm text-white/80">
            <p>• إنشاء حساب عميل والدخول للحساب</p>
            <p>• تقديم طلب حساب تاجر بحالة Pending</p>
            <p>• تحويل الأدمن والتاجر المعتمد تلقائيًا للوحة الصحيحة</p>
            <p>• OTP محلي واسترجاع كلمة المرور</p>
          </div>

          <div className="mt-8">
            <DemoCredentials />
          </div>
        </div>

        <div className="rounded-sm bg-white p-6 shadow-[0_10px_24px_rgba(0,0,0,0.06)] sm:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-end gap-3 text-sm">
            {[
              ['registerVendor', 'حساب تاجر'],
              ['register', 'إنشاء حساب عميل'],
              ['login', 'تسجيل الدخول'],
              ['forgot', 'نسيت كلمة المرور'],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setMode(key)}
                className={`rounded-full px-4 py-2 font-semibold transition ${
                  mode === key ? 'bg-black text-white' : 'bg-[#f2f2f2] text-black/70'
                }`}
              >
                {label}
              </button>
            ))}
            {isAuthenticated && !user?.emailVerified ? (
              <button
                type="button"
                onClick={() => setMode('verify')}
                className={`rounded-full px-4 py-2 font-semibold transition ${
                  mode === 'verify' ? 'bg-black text-white' : 'bg-[#f2f2f2] text-black/70'
                }`}
              >
                تفعيل البريد
              </button>
            ) : null}
          </div>

          {error ? <div className="mb-4 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-right text-sm text-red-700">{error}</div> : null}
          {success ? <div className="mb-4 rounded-sm border border-emerald-200 bg-emerald-50 px-4 py-3 text-right text-sm text-emerald-700">{success}</div> : null}

          {mode === 'login' ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                safeAction(() => {
                  const loggedIn = login(loginForm);
                  navigate(getDefaultRouteForUser(loggedIn));
                });
              }}
              className="space-y-4 text-right"
            >
              <input type="email" value={loginForm.email} onChange={(e) => setLoginForm((c) => ({ ...c, email: e.target.value }))} className="checkout-input text-right" placeholder="البريد الإلكتروني" required />
              <input type="password" value={loginForm.password} onChange={(e) => setLoginForm((c) => ({ ...c, password: e.target.value }))} className="checkout-input text-right" placeholder="كلمة المرور" required />
              <button className="primary-btn w-full" type="submit">دخول</button>
            </form>
          ) : null}

          {mode === 'register' ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                safeAction(() => {
                  if (registerForm.password !== registerForm.confirmPassword) throw new Error('كلمتا المرور غير متطابقتين.');
                  register(registerForm);
                  setSuccess('تم إنشاء حساب العميل بنجاح. يمكنك الآن تفعيل البريد من نفس الصفحة.');
                  setMode('verify');
                });
              }}
              className="space-y-4 text-right"
            >
              <input type="text" value={registerForm.name} onChange={(e) => setRegisterForm((c) => ({ ...c, name: e.target.value }))} className="checkout-input text-right" placeholder="الاسم الكامل" required />
              <input type="email" value={registerForm.email} onChange={(e) => setRegisterForm((c) => ({ ...c, email: e.target.value }))} className="checkout-input text-right" placeholder="البريد الإلكتروني" required />
              <input type="password" value={registerForm.password} onChange={(e) => setRegisterForm((c) => ({ ...c, password: e.target.value }))} className="checkout-input text-right" placeholder="كلمة المرور" required />
              <input type="password" value={registerForm.confirmPassword} onChange={(e) => setRegisterForm((c) => ({ ...c, confirmPassword: e.target.value }))} className="checkout-input text-right" placeholder="تأكيد كلمة المرور" required />
              <button className="primary-btn w-full" type="submit">إنشاء حساب عميل</button>
            </form>
          ) : null}

          {mode === 'registerVendor' ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                safeAction(() => {
                  if (vendorRegisterForm.password !== vendorRegisterForm.confirmPassword) throw new Error('كلمتا المرور غير متطابقتين.');
                  const created = registerVendor(vendorRegisterForm);
                  setSuccess(`تم إرسال طلب المتجر ${created.storeName}. سيتم تحويلك إلى صفحة انتظار المراجعة.`);
                  navigate('/vendor/pending');
                });
              }}
              className="space-y-4 text-right"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <input type="text" value={vendorRegisterForm.name} onChange={(e) => setVendorRegisterForm((c) => ({ ...c, name: e.target.value }))} className="checkout-input text-right" placeholder="اسم صاحب الحساب" required />
                <input type="text" value={vendorRegisterForm.storeName} onChange={(e) => setVendorRegisterForm((c) => ({ ...c, storeName: e.target.value }))} className="checkout-input text-right" placeholder="اسم المتجر" required />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <input type="email" value={vendorRegisterForm.email} onChange={(e) => setVendorRegisterForm((c) => ({ ...c, email: e.target.value }))} className="checkout-input text-right" placeholder="البريد الإلكتروني" required />
                <input type="text" value={vendorRegisterForm.phone} onChange={(e) => setVendorRegisterForm((c) => ({ ...c, phone: e.target.value }))} className="checkout-input text-right" placeholder="رقم الهاتف" required />
              </div>
              <input type="text" value={vendorRegisterForm.businessType} onChange={(e) => setVendorRegisterForm((c) => ({ ...c, businessType: e.target.value }))} className="checkout-input text-right" placeholder="نوع النشاط التجاري" required />
              <div className="grid gap-4 md:grid-cols-2">
                <input type="password" value={vendorRegisterForm.password} onChange={(e) => setVendorRegisterForm((c) => ({ ...c, password: e.target.value }))} className="checkout-input text-right" placeholder="كلمة المرور" required />
                <input type="password" value={vendorRegisterForm.confirmPassword} onChange={(e) => setVendorRegisterForm((c) => ({ ...c, confirmPassword: e.target.value }))} className="checkout-input text-right" placeholder="تأكيد كلمة المرور" required />
              </div>
              <button className="primary-btn w-full" type="submit">إرسال طلب حساب تاجر</button>
            </form>
          ) : null}

          {mode === 'forgot' ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                safeAction(() => {
                  resetPassword(resetForm);
                  setSuccess('تم تحديث كلمة المرور بنجاح. يمكنك تسجيل الدخول الآن.');
                  setMode('login');
                });
              }}
              className="space-y-4 text-right"
            >
              <input type="email" value={resetForm.email} onChange={(e) => setResetForm((c) => ({ ...c, email: e.target.value }))} className="checkout-input text-right" placeholder="البريد الإلكتروني" required />
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm font-semibold text-black underline"
                  onClick={() => safeAction(() => {
                    requestPasswordReset(resetForm.email);
                    setSuccess('تم إرسال رمز إعادة التعيين محليًا إلى صندوق البريد الداخلي.');
                  })}
                >
                  أرسل رمز إعادة التعيين
                </button>
              </div>
              <input type="text" value={resetForm.code} onChange={(e) => setResetForm((c) => ({ ...c, code: e.target.value }))} className="checkout-input text-right" placeholder="رمز التعيين" required />
              <input type="password" value={resetForm.newPassword} onChange={(e) => setResetForm((c) => ({ ...c, newPassword: e.target.value }))} className="checkout-input text-right" placeholder="كلمة المرور الجديدة" required />
              <button className="primary-btn w-full" type="submit">تحديث كلمة المرور</button>
            </form>
          ) : null}

          {mode === 'verify' && isAuthenticated ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                safeAction(() => {
                  verifyEmailCode(verifyCode);
                  setSuccess('تم تفعيل البريد الإلكتروني بنجاح.');
                  navigate(getDefaultRouteForUser(user));
                });
              }}
              className="space-y-4 text-right"
            >
              <input type="text" value={verifyCode} onChange={(e) => setVerifyCode(e.target.value)} className="checkout-input text-right" placeholder="أدخل رمز التفعيل" required />
              <div className="flex flex-wrap justify-end gap-3">
                <button type="button" className="secondary-btn" onClick={() => safeAction(() => { resendVerificationCode(); setSuccess('تمت إعادة إرسال رمز التفعيل.'); })}>
                  إعادة إرسال الرمز
                </button>
                <button className="primary-btn" type="submit">تأكيد التفعيل</button>
              </div>
            </form>
          ) : null}

          <div className="mt-8 rounded-sm border border-black/10 bg-[#fafafa] p-5 text-right">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-black text-black">Internal Inbox Preview</h2>
              <Link to="/content-studio" className="text-sm font-semibold text-black underline">افتح البريد الداخلي</Link>
            </div>
            <div className="space-y-3">
              {emails.length ? emails.map((email) => (
                <button
                  key={email.id}
                  type="button"
                  onClick={() => markEmailAsRead(email.id)}
                  className="w-full rounded-sm border border-black/10 bg-white px-4 py-3 text-right transition hover:border-black/30"
                >
                  <p className="text-sm font-bold">{email.subject}</p>
                  <p className="mt-1 text-xs text-black/60">{email.to} • {email.type}</p>
                  <p className="mt-2 text-sm text-black/70 line-clamp-2">{email.body}</p>
                </button>
              )) : <p className="text-sm text-black/55">لا توجد رسائل داخلية حديثًا.</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
