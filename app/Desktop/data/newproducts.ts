// data/newArrivalProducts.ts

export interface NewArrivalProduct {
  id: string;
  img: string;
  nameEn: string;
  nameUr: string;
  description: string;
  rating: number;
  reviews: number;
  price: number;
  oldPrice?: number | null;
  sale?: string | null;
  category: string;
  isNew: boolean;
  isBestSeller: boolean;
  features: string[];
  tags?: string[];
}

export const newArrivalProducts: NewArrivalProduct[] = [
  {
    id: '1',
    img: '/images/product.png',
    nameEn: "Pure Apricot Oil",
    nameUr: "خالص خوبانی تیل",
    description: "Cold-pressed for skin & hair",
    rating: 4.7,
    reviews: 406,
    price: 1149,
    oldPrice: 1499,
    sale: "23% OFF",
    category: 'Oils & Ghee',
    isNew: true,
    isBestSeller: true,
    features: [
      'Acts as anti-tan agent',
      'Healthy glowing skin',
      'Improves hair health'
    ],
    tags: ['cold-pressed', 'organic', 'hair-care']
  },
  {
    id: '2',
    img: '/images/product.png',
    nameEn: "Organic Turmeric Powder",
    nameUr: "نامیاتی ہلدی پاؤڈر",
    description: "Pure organic for cooking & health",
    rating: 4.5,
    reviews: 289,
    price: 299,
    oldPrice: 399,
    sale: "25% OFF",
    category: 'Herbs & Spices',
    isNew: true,
    isBestSeller: false,
    features: [
      'Boosts immunity',
      'Anti-inflammatory',
      'Natural antioxidant'
    ],
    tags: ['organic', 'immunity-booster', 'anti-inflammatory']
  },
  {
    id: '3',
    img: '/images/product.png',
    nameEn: "Himalayan Honey",
    nameUr: "ہمالیائی شہد",
    description: "Pure from Himalayan flowers",
    rating: 4.8,
    reviews: 512,
    price: 899,
    category: 'Honey & Sweeteners',
    isNew: true,
    isBestSeller: true,
    features: [
      '100% Natural',
      'Rich in antioxidants',
      'Energy booster'
    ],
    tags: ['natural', 'antibacterial', 'energy']
  },
  {
    id: '4',
    img: '/images/product.png',
    nameEn: "Herbal Face Wash",
    nameUr: "ہربل فیس واش",
    description: "Natural for glowing skin",
    rating: 4.3,
    reviews: 187,
    price: 549,
    oldPrice: 699,
    sale: "21% OFF",
    category: 'Beauty & Skincare',
    isNew: true,
    isBestSeller: false,
    features: [
      'Removes impurities',
      'Non-drying formula',
      'Suitable for all skin'
    ],
    tags: ['herbal', 'skincare', 'cleanser']
  },
  {
    id: '5',
    img: '/images/product.png',
    nameEn: "Ashwagandha Capsules",
    nameUr: "اشواگنڈھا کیپسول",
    description: "Pure for stress relief",
    rating: 4.6,
    reviews: 324,
    price: 799,
    category: 'Supplements',
    isNew: true,
    isBestSeller: true,
    features: [
      'Reduces stress',
      'Improves sleep',
      'Boosts immunity'
    ],
    tags: ['ayurvedic', 'stress-relief', 'sleep-aid']
  },
  {
    id: '6',
    img: '/images/product.png',
    nameEn: "Green Tea Leaves",
    nameUr: "گرین ٹی پتیاں",
    description: "Premium with antioxidants",
    rating: 4.4,
    reviews: 213,
    price: 449,
    oldPrice: 599,
    sale: "25% OFF",
    category: 'Tea & Beverages',
    isNew: true,
    isBestSeller: false,
    features: [
      'Weight management',
      'Rich in antioxidants',
      'Boosts metabolism'
    ],
    tags: ['antioxidants', 'weight-loss', 'metabolism']
  },
  {
    id: '7',
    img: '/images/product.png',
    nameEn: "Coconut Oil Extra Virgin",
    nameUr: "ناریل کا تیل ورجن",
    description: "Cold-pressed for cooking & hair",
    rating: 4.7,
    reviews: 467,
    price: 699,
    oldPrice: 899,
    sale: "22% OFF",
    category: 'Oils & Ghee',
    isNew: false,
    isBestSeller: true,
    features: [
      'For cooking & hair',
      'Moisturizes skin',
      'High in MCTs'
    ],
    tags: ['cold-pressed', 'multipurpose', 'cooking']
  },
  {
    id: '8',
    img: '/images/product.png',
    nameEn: "Aloe Vera Gel",
    nameUr: "ایلوویرا جیل",
    description: "100% pure for skin care",
    rating: 4.2,
    reviews: 156,
    price: 399,
    category: 'Beauty & Skincare',
    isNew: false,
    isBestSeller: false,
    features: [
      'Soothes skin',
      'Hydrating',
      'Sunburn relief'
    ],
    tags: ['soothing', 'hydrating', 'sunburn']
  },
  {
    id: '9',
    img: '/images/product.png',
    nameEn: "Ginger Essential Oil",
    nameUr: "ادرک کا تیل",
    description: "Pure essential oil for aromatherapy",
    rating: 4.6,
    reviews: 198,
    price: 649,
    oldPrice: 799,
    sale: "19% OFF",
    category: 'Oils & Ghee',
    isNew: true,
    isBestSeller: false,
    features: [
      'Relieves nausea',
      'Improves digestion',
      'Natural pain relief'
    ],
    tags: ['essential-oil', 'aromatherapy', 'digestive']
  },
  {
    id: '10',
    img: '/images/product.png',
    nameEn: "Neem Capsules",
    nameUr: "نیم کیپسول",
    description: "Blood purifier and immunity booster",
    rating: 4.4,
    reviews: 167,
    price: 499,
    category: 'Supplements',
    isNew: true,
    isBestSeller: true,
    features: [
      'Blood purifier',
      'Skin health',
      'Detoxifies body'
    ],
    tags: ['detox', 'skin-health', 'immunity']
  },
  {
    id: '11',
    img: '/images/product.png',
    nameEn: "Organic Sesame Oil",
    nameUr: "نامیاتی تل کا تیل",
    description: "Cold-pressed for cooking and massage",
    rating: 4.5,
    reviews: 243,
    price: 899,
    oldPrice: 1199,
    sale: "25% OFF",
    category: 'Oils & Ghee',
    isNew: true,
    isBestSeller: false,
    features: [
      'High in antioxidants',
      'Good for heart',
      'Ayurvedic massage oil'
    ],
    tags: ['cooking-oil', 'massage-oil', 'heart-healthy']
  },
  {
    id: '12',
    img: '/images/product.png',
    nameEn: "Holy Basil Tea",
    nameUr: "تلسی چائے",
    description: "Stress relief and respiratory health",
    rating: 4.7,
    reviews: 189,
    price: 349,
    category: 'Tea & Beverages',
    isNew: true,
    isBestSeller: false,
    features: [
      'Reduces stress',
      'Respiratory health',
      'Antibacterial properties'
    ],
    tags: ['stress-relief', 'respiratory', 'herbal-tea']
  },
  {
    id: '13',
    img: '/images/product.png',
    nameEn: "Argan Oil",
    nameUr: "ارجن تیل",
    description: "For hair and skin moisturizing",
    rating: 4.8,
    reviews: 421,
    price: 1299,
    oldPrice: 1699,
    sale: "24% OFF",
    category: 'Oils & Ghee',
    isNew: true,
    isBestSeller: true,
    features: [
      'Hair growth',
      'Skin hydration',
      'Anti-aging'
    ],
    tags: ['hair-growth', 'anti-aging', 'moisturizing']
  },
  {
    id: '14',
    img: '/images/product.png',
    nameEn: "Amla Powder",
    nameUr: "آملہ پاؤڈر",
    description: "Vitamin C rich for hair and immunity",
    rating: 4.6,
    reviews: 278,
    price: 399,
    oldPrice: 499,
    sale: "20% OFF",
    category: 'Herbs & Spices',
    isNew: true,
    isBestSeller: false,
    features: [
      'Rich in Vitamin C',
      'Hair growth',
      'Immunity booster'
    ],
    tags: ['vitamin-c', 'hair-care', 'immunity']
  },
  {
    id: '15',
    img: '/images/product.png',
    nameEn: "Pure Rose Water",
    nameUr: "خالص گلاب کا پانی",
    description: "Natural toner and skin refresher",
    rating: 4.3,
    reviews: 156,
    price: 299,
    category: 'Beauty & Skincare',
    isNew: true,
    isBestSeller: true,
    features: [
      'Natural toner',
      'Skin hydration',
      'Reduces redness'
    ],
    tags: ['toner', 'hydrating', 'natural']
  },
  {
    id: '16',
    img: '/images/product.png',
    nameEn: "Moringa Capsules",
    nameUr: "مورنگا کیپسول",
    description: "Nutrient-rich superfood supplement",
    rating: 4.7,
    reviews: 312,
    price: 699,
    oldPrice: 899,
    sale: "22% OFF",
    category: 'Supplements',
    isNew: true,
    isBestSeller: true,
    features: [
      'High in nutrients',
      'Energy booster',
      'Antioxidant rich'
    ],
    tags: ['superfood', 'nutrient-rich', 'energy']
  },
  {
    id: '17',
    img: '/images/product.png',
    nameEn: "Organic Jaggery",
    nameUr: "نامیاتی گڑ",
    description: "Natural sweetener with minerals",
    rating: 4.5,
    reviews: 189,
    price: 249,
    category: 'Honey & Sweeteners',
    isNew: true,
    isBestSeller: false,
    features: [
      'Rich in minerals',
      'Natural sweetener',
      'Digestive aid'
    ],
    tags: ['natural-sweetener', 'minerals', 'digestive']
  },
  {
    id: '18',
    img: '/images/product.png',
    nameEn: "Peppermint Essential Oil",
    nameUr: "پیپرمنٹ تیل",
    description: "For headache relief and freshness",
    rating: 4.4,
    reviews: 201,
    price: 549,
    oldPrice: 699,
    sale: "21% OFF",
    category: 'Oils & Ghee',
    isNew: true,
    isBestSeller: false,
    features: [
      'Headache relief',
      'Mental clarity',
      'Digestive aid'
    ],
    tags: ['headache-relief', 'mental-focus', 'digestive']
  },
  {
    id: '19',
    img: '/images/product.png',
    nameEn: "Kashmiri Saffron",
    nameUr: "کشمیری زعفران",
    description: "Premium quality for cooking and health",
    rating: 4.9,
    reviews: 478,
    price: 2499,
    oldPrice: 2999,
    sale: "17% OFF",
    category: 'Herbs & Spices',
    isNew: true,
    isBestSeller: true,
    features: [
      'Mood enhancer',
      'Skin brightening',
      'Antioxidant'
    ],
    tags: ['premium', 'mood-enhancer', 'skin-care']
  },
  {
    id: '20',
    img: '/images/product.png',
    nameEn: "Chamomile Tea",
    nameUr: "بابونہ چائے",
    description: "Calming tea for better sleep",
    rating: 4.6,
    reviews: 234,
    price: 399,
    category: 'Tea & Beverages',
    isNew: true,
    isBestSeller: true,
    features: [
      'Promotes sleep',
      'Reduces anxiety',
      'Digestive aid'
    ],
    tags: ['sleep-aid', 'calming', 'digestive']
  },
  {
    id: '21',
    img: '/images/product.png',
    nameEn: "Black Seed Oil",
    nameUr: "کلونجی کا تیل",
    description: "Prophetic medicine for overall health",
    rating: 4.8,
    reviews: 567,
    price: 999,
    oldPrice: 1299,
    sale: "23% OFF",
    category: 'Oils & Ghee',
    isNew: true,
    isBestSeller: true,
    features: [
      'Immune booster',
      'Anti-inflammatory',
      'Prophetic medicine'
    ],
    tags: ['prophetic-medicine', 'immune-booster', 'anti-inflammatory']
  },
  {
    id: '22',
    img: '/images/product.png',
    nameEn: "Spirulina Powder",
    nameUr: "سپرولینا پاؤڈر",
    description: "Protein-rich superfood algae",
    rating: 4.5,
    reviews: 189,
    price: 899,
    category: 'Supplements',
    isNew: true,
    isBestSeller: false,
    features: [
      'High protein',
      'Detoxifies body',
      'Energy booster'
    ],
    tags: ['protein-rich', 'detox', 'energy']
  },
  {
    id: '23',
    img: '/images/product.png',
    nameEn: "Shea Butter",
    nameUr: "شیا مکھن",
    description: "Natural moisturizer for skin and hair",
    rating: 4.4,
    reviews: 167,
    price: 599,
    oldPrice: 749,
    sale: "20% OFF",
    category: 'Beauty & Skincare',
    isNew: true,
    isBestSeller: false,
    features: [
      'Deep moisturizing',
      'Heals dry skin',
      'Anti-aging'
    ],
    tags: ['moisturizer', 'dry-skin', 'anti-aging']
  },
  {
    id: '24',
    img: '/images/product.png',
    nameEn: "Fennel Seeds",
    nameUr: "سونف کے بیج",
    description: "Digestive aid and mouth freshener",
    rating: 4.3,
    reviews: 145,
    price: 199,
    category: 'Herbs & Spices',
    isNew: true,
    isBestSeller: false,
    features: [
      'Improves digestion',
      'Mouth freshener',
      'Reduces bloating'
    ],
    tags: ['digestive', 'mouth-freshener', 'bloating']
  }
];

// Helper functions
export const getProductsByCategory = (category: string): NewArrivalProduct[] => {
  if (category === 'All Products') {
    return newArrivalProducts.filter(product => product.isNew);
  }
  return newArrivalProducts.filter(product => product.isNew && product.category === category);
};

export const getFeaturedProducts = (count: number = 8): NewArrivalProduct[] => {
  return newArrivalProducts
    .filter(product => product.isNew)
    .slice(0, count);
};

export const getBestSellingProducts = (): NewArrivalProduct[] => {
  return newArrivalProducts
    .filter(product => product.isBestSeller && product.isNew)
    .sort((a, b) => b.rating - a.rating);
};

export const getCategories = (): string[] => {
  const categoriesSet = new Set(newArrivalProducts.map(product => product.category));
  return ['All Products', ...Array.from(categoriesSet)];
};

export const getProductById = (id: string): NewArrivalProduct | undefined => {
  return newArrivalProducts.find(product => product.id === id);
};

// Get statistics
export const getProductStats = () => {
  const newProducts = newArrivalProducts.filter(p => p.isNew);
  return {
    totalNewProducts: newProducts.length,
    bestSellersCount: newProducts.filter(p => p.isBestSeller).length,
    averageRating: newProducts.length > 0 
      ? Math.round((newProducts.reduce((acc, p) => acc + p.rating, 0) / newProducts.length) * 10) / 10
      : 0,
    onSaleCount: newProducts.filter(p => p.sale).length,
    categoriesCount: getCategories().length - 1, // Excluding 'All Products'
  };
};