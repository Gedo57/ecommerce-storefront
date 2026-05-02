import { Link } from 'react-router-dom';
import { getContentSettings } from '../utils/commerceStorage';

export default function Footer() {
  const content = getContentSettings();

  return (
    <footer className="mt-10 border-t border-black/10 bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1400px] gap-8 text-right md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="text-xs font-semibold tracking-[0.3em] text-black/55">SET STORE</p>
          <h2 className="mt-2 text-3xl font-black tracking-[0.2em] text-black">SET</h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-black/65">{content.heroSubtitle}</p>
          <p className="mt-4 text-sm text-black/55">{content.supportEmail} • {content.supportPhone}</p>
        </div>

        <div>
          <h3 className="text-sm font-bold text-black">التصفح</h3>
          <ul className="mt-4 space-y-3 text-sm text-black/70">
            <li><Link to="/">الرئيسية</Link></li>
            <li><Link to="/track-order">تتبع الطلب</Link></li>
            <li><Link to="/wishlist">المفضلة</Link></li>
            <li><Link to="/content-studio">Content Studio</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-black">خدمة العملاء</h3>
          <ul className="mt-4 space-y-3 text-sm text-black/70">
            <li><Link to="/checkout">الدفع</Link></li>
            <li><Link to="/support">مركز المساعدة</Link></li>
            <li><Link to="/track-order">تتبع الطلب</Link></li>
            <li><Link to="/login">الحساب</Link></li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-8 grid max-w-[1400px] gap-4 border-t border-black/10 pt-6 text-right sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-sm bg-[#faf7f3] p-4"><p className="text-sm font-black text-black">شحن واضح</p><p className="mt-2 text-xs leading-6 text-black/65">إظهار توقيتات الشحن المتوقعة وخيارات التوصيل داخل المتجر.</p></div>
        <div className="rounded-sm bg-[#faf7f3] p-4"><p className="text-sm font-black text-black">إرجاع واستبدال</p><p className="mt-2 text-xs leading-6 text-black/65">سياسات الدعم والإرجاع معروضة بوضوح في مركز المساعدة.</p></div>
        <div className="rounded-sm bg-[#faf7f3] p-4"><p className="text-sm font-black text-black">دفع آمن</p><p className="mt-2 text-xs leading-6 text-black/65">رحلة Checkout منظمة وواجهة جاهزة لربط بوابات الدفع لاحقًا.</p></div>
        <div className="rounded-sm bg-[#faf7f3] p-4"><p className="text-sm font-black text-black">دعم مباشر</p><p className="mt-2 text-xs leading-6 text-black/65">واتساب سريع + تذاكر دعم + تتبع طلب من داخل الحساب.</p></div>
      </div>
    </footer>
  );
}
