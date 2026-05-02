export const categoryCatalog = {
  new: {
    key: 'new',
    label: 'جديد في',
    description: 'وصل حديثاً، التشكيلات الجديدة، والقطع التي تعطي الصفحة روح متجر فاشون فعلي.',
    sourceCategories: ['all'],
    tags: ['وصل حديثاً', 'ترند', 'مختارات يومية', 'أساسيات'],
  },
  women: {
    key: 'women',
    label: 'ملابس نسائية',
    description: 'فساتين، بلايز، أطقم، وقطع يومية بترتيب أقرب لصفحات الفئات في متاجر الفاشون.',
    sourceCategories: ["women's clothing", 'jewelery'],
    tags: ['فساتين', 'بلايز', 'أطقم', 'إكسسوارات'],
  },
  men: {
    key: 'men',
    label: 'الملابس الرجالية',
    description: 'تيشيرتات، جاكيتات، وقمصان عملية بستايل نظيف وواجهة مرتبة.',
    sourceCategories: ["men's clothing"],
    tags: ['تيشيرتات', 'قمصان', 'جاكيتات', 'دينم'],
  },
  kids: {
    key: 'kids',
    label: 'الأطفال',
    description: 'تشكيلة أطفال ورضع مع عرض أوضح للمنتجات والفلاتر.',
    sourceCategories: ["women's clothing", "men's clothing"],
    tags: ['بنات', 'أولاد', 'رضع', 'أطقم'],
  },
  toys: {
    key: 'toys',
    label: 'الألعاب',
    description: 'قسم ألعاب منظم بعرض واضح للمنتجات ومظهر أقرب للمتاجر الكبيرة.',
    sourceCategories: ['electronics'],
    tags: ['تعليمية', 'أنشطة', 'هدايا', 'لعب'],
  },
  electronics: {
    key: 'electronics',
    label: 'إلكترونيات',
    description: 'أجهزة صغيرة وإكسسوارات تقنية مع فرز وفلاتر أبسط.',
    sourceCategories: ['electronics'],
    tags: ['سماعات', 'ملحقات', 'أجهزة', 'تقنية'],
  },
  shoes: {
    key: 'shoes',
    label: 'أحذية',
    description: 'واجهة فئة للأحذية أقرب لأسلوب شي إن من ناحية الترتيب والفلاتر.',
    sourceCategories: ["women's clothing", "men's clothing"],
    tags: ['صنادل', 'كاجوال', 'رياضي', 'جديد'],
  },
  bags: {
    key: 'bags',
    label: 'حقائب وإكسسوارات',
    description: 'قسم للحقائب والإكسسوارات بتخطيط أقرب لصفحات المتاجر الكبيرة.',
    sourceCategories: ['jewelery'],
    tags: ['حقائب', 'مجوهرات', 'نظارات', 'ساعات'],
  },
  beauty: {
    key: 'beauty',
    label: 'الصحة والجمال',
    description: 'قسم الجمال والعناية الشخصية بعرض منتجات أبسط وأكثر وضوحاً.',
    sourceCategories: ['jewelery', 'electronics'],
    tags: ['بشرة', 'مكياج', 'أظافر', 'عطور'],
  },
  home: {
    key: 'home',
    label: 'المنزل والمطبخ',
    description: 'مستلزمات البيت والمطبخ في صفحة فئة مستقلة بفلترة جانبية.',
    sourceCategories: ['electronics'],
    tags: ['تنظيم', 'مطبخ', 'ديكور', 'منزل'],
  },
  sports: {
    key: 'sports',
    label: 'الرياضة والأنشطة',
    description: 'أقسام رياضية وخارجية ضمن صفحة فئة كاملة بدل فلترة داخلية فقط.',
    sourceCategories: ["men's clothing", "women's clothing"],
    tags: ['رياضة', 'خارجية', 'كاجوال', 'حركة'],
  },
};

export const categoryList = Object.values(categoryCatalog);

export function getCategoryConfig(categoryKey) {
  return categoryCatalog[categoryKey] ?? categoryCatalog.new;
}

export function categoryMatchesProduct(product, categoryKey) {
  const config = getCategoryConfig(categoryKey);
  if (config.sourceCategories.includes('all')) return true;
  return config.sourceCategories.includes(product.category);
}

export function getLocalizedCategoryName(rawCategory) {
  switch (rawCategory) {
    case "men's clothing":
      return 'ملابس رجالية';
    case "women's clothing":
      return 'ملابس نسائية';
    case 'jewelery':
      return 'إكسسوارات ومجوهرات';
    case 'electronics':
      return 'إلكترونيات';
    default:
      return rawCategory;
  }
}
