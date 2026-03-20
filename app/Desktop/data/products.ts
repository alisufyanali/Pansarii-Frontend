// Mock products data - 50+ products with additionalImages
export const allProducts = [
  // HERB (281 products) - 8 products shown
  {
    id: '1',
    img: '/images/product.png',
    nameEn: "Organic Ashwagandha Root",
    nameUr: "نامیاتی اشواگنڈھا جڑ",
    description: "Stress relief & vitality herb",
    rating: 4.8,
    reviews: 406,
    price: 899,
    oldPrice: 1199,
    sale: "25% OFF",
    category: 'Herb',
    isNew: true,
    isBestSeller: true,
    inStock: true,
    tags: ['Stress Relief', 'Energy', 'Adaptogen'],
    additionalImages: [
      '/images/ashwagandha-1.jpg',
      '/images/ashwagandha-2.jpg',
      '/images/ashwagandha-3.jpg'
    ]
  },
  {
    id: '2',
    img: '/images/product.png',
    nameEn: "Pure Shilajit Resin",
    nameUr: "خالص شلاجیت",
    description: "Himalayan mineral pitch for vitality",
    rating: 4.9,
    reviews: 289,
    price: 1499,
    oldPrice: 1999,
    sale: "25% OFF",
    category: 'Herb',
    isNew: true,
    isBestSeller: true,
    inStock: true,
    tags: ['Energy', 'Anti-aging', 'Strength'],
    additionalImages: [
      '/images/shilajit-1.jpg',
      '/images/shilajit-2.jpg',
      '/images/shilajit-3.jpg'
    ]
  },
  {
    id: '3',
    img: '/images/product.png',
    nameEn: "Tulsi (Holy Basil) Leaves",
    nameUr: "تلسی کے پتے",
    description: "Immunity boosting sacred herb",
    rating: 4.7,
    reviews: 512,
    price: 299,
    oldPrice: 399,
    sale: "25% OFF",
    category: 'Herb',
    isNew: false,
    isBestSeller: true,
    inStock: true,
    tags: ['Immunity', 'Respiratory', 'Stress'],
    additionalImages: [
      '/images/tulsi-1.jpg',
      '/images/tulsi-2.jpg',
      '/images/tulsi-3.jpg'
    ]
  },
  {
    id: '4',
    img: '/images/product.png',
    nameEn: "Moringa Leaf Powder",
    nameUr: "مورنگا پتی پاؤڈر",
    description: "Nutrient-rich superfood herb",
    rating: 4.6,
    reviews: 187,
    price: 549,
    oldPrice: 699,
    sale: "21% OFF",
    category: 'Herb',
    isNew: true,
    isBestSeller: false,
    inStock: true,
    tags: ['Nutrients', 'Energy', 'Antioxidants'],
    additionalImages: [
      '/images/moringa-1.jpg',
      '/images/moringa-2.jpg',
      '/images/moringa-3.jpg'
    ]
  },
  {
    id: '5',
    img: '/images/product.png',
    nameEn: "Brahmi (Bacopa) Herb",
    nameUr: "براہمی جڑی بوٹی",
    description: "Memory & cognitive function herb",
    rating: 4.7,
    reviews: 324,
    price: 499,
    oldPrice: 649,
    sale: "23% OFF",
    category: 'Herb',
    isNew: true,
    isBestSeller: true,
    inStock: true,
    tags: ['Memory', 'Focus', 'Brain Health'],
    additionalImages: [
      '/images/brahmi-1.jpg',
      '/images/brahmi-2.jpg',
      '/images/brahmi-3.jpg'
    ]
  },
  {
    id: '6',
    img: '/images/product.png',
    nameEn: "Giloy (Guduchi) Stems",
    nameUr: "گلوئی کے تنے",
    description: "Immunity & fever management",
    rating: 4.5,
    reviews: 213,
    price: 399,
    oldPrice: 499,
    sale: "20% OFF",
    category: 'Herb',
    isNew: false,
    isBestSeller: true,
    inStock: true,
    tags: ['Immunity', 'Fever', 'Detox'],
    additionalImages: [
      '/images/giloy-1.jpg',
      '/images/giloy-2.jpg',
      '/images/giloy-3.jpg'
    ]
  },
  {
    id: '7',
    img: '/images/product.png',
    nameEn: "Fenugreek Seeds (Methi)",
    nameUr: "میتھی کے بیج",
    description: "Blood sugar & lactation support",
    rating: 4.6,
    reviews: 467,
    price: 199,
    oldPrice: 299,
    sale: "33% OFF",
    category: 'Herb',
    isNew: false,
    isBestSeller: true,
    inStock: true,
    tags: ['Blood Sugar', 'Lactation', 'Digestion'],
    additionalImages: [
      '/images/fenugreek-1.jpg',
      '/images/fenugreek-2.jpg',
      '/images/fenugreek-3.jpg'
    ]
  },
  {
    id: '8',
    img: '/images/product.png',
    nameEn: "Dried Ginger (Sonth)",
    nameUr: "سوکھی ادرک (سونتھ)",
    description: "Digestive & anti-inflammatory herb",
    rating: 4.5,
    reviews: 156,
    price: 249,
    oldPrice: 349,
    sale: "29% OFF",
    category: 'Herb',
    isNew: true,
    isBestSeller: false,
    inStock: true,
    tags: ['Digestion', 'Anti-inflammatory', 'Cold'],
    additionalImages: [
      '/images/dry-ginger-1.jpg',
      '/images/dry-ginger-2.jpg',
      '/images/dry-ginger-3.jpg'
    ]
  },

  // OILS (87 products) - 8 products shown
  {
    id: '9',
    img: '/images/product.png',
    nameEn: "Cold Pressed Coconut Oil",
    nameUr: "کولڈ پریسڈ ناریل تیل",
    description: "Virgin oil for cooking & beauty",
    rating: 4.8,
    reviews: 598,
    price: 699,
    oldPrice: 899,
    sale: "22% OFF",
    category: 'Oils',
    isNew: false,
    isBestSeller: true,
    inStock: true,
    tags: ['Cooking', 'Hair Care', 'Skin Care'],
    additionalImages: [
      '/images/coconut-oil-1.jpg',
      '/images/coconut-oil-2.jpg',
      '/images/coconut-oil-3.jpg'
    ]
  },
  {
    id: '10',
    img: '/images/product.png',
    nameEn: "Black Seed Oil (Kalonji)",
    nameUr: "کلونجی کا تیل",
    description: "Cold-pressed for immunity",
    rating: 4.7,
    reviews: 412,
    price: 899,
    oldPrice: 1199,
    sale: "25% OFF",
    category: 'Oils',
    isNew: true,
    isBestSeller: true,
    inStock: true,
    tags: ['Immunity', 'Respiratory', 'Wellness'],
    additionalImages: [
      '/images/kalonji-oil-1.jpg',
      '/images/kalonji-oil-2.jpg',
      '/images/kalonji-oil-3.jpg'
    ]
  },
  {
    id: '11',
    img: '/images/product.png',
    nameEn: "Extra Virgin Olive Oil",
    nameUr: "ایکٹرا ورجن زیتون کا تیل",
    description: "Cold-pressed for health",
    rating: 4.8,
    reviews: 456,
    price: 899,
    oldPrice: 1199,
    sale: "25% OFF",
    category: 'Oils',
    isNew: false,
    isBestSeller: true,
    inStock: true,
    tags: ['Heart Health', 'Cooking', 'Salads'],
    additionalImages: [
      '/images/olive-oil-1.jpg',
      '/images/olive-oil-2.jpg',
      '/images/olive-oil-3.jpg'
    ]
  },
  {
    id: '12',
    img: '/images/product.png',
    nameEn: "Castor Oil Cold Pressed",
    nameUr: "ارنڈی کا تیل",
    description: "For hair growth & lashes",
    rating: 4.7,
    reviews: 378,
    price: 399,
    oldPrice: 599,
    sale: "33% OFF",
    category: 'Oils',
    isNew: true,
    isBestSeller: true,
    inStock: true,
    tags: ['Hair Growth', 'Eyelashes', 'Skin'],
    additionalImages: [
      '/images/castor-oil-1.jpg',
      '/images/castor-oil-2.jpg',
      '/images/castor-oil-3.jpg'
    ]
  },
  {
    id: '13',
    img: '/images/product.png',
    nameEn: "Almond Oil Sweet",
    nameUr: "میٹھا بادام تیل",
    description: "For skin & hair nourishment",
    rating: 4.6,
    reviews: 345,
    price: 499,
    oldPrice: 699,
    sale: "29% OFF",
    category: 'Oils',
    isNew: false,
    isBestSeller: true,
    inStock: true,
    tags: ['Skin Care', 'Hair Oil', 'Moisturizer'],
    additionalImages: [
      '/images/almond-oil-1.jpg',
      '/images/almond-oil-2.jpg',
      '/images/almond-oil-3.jpg'
    ]
  },
  {
    id: '14',
    img: '/images/product.png',
    nameEn: "Mustard Oil Kachi Ghani",
    nameUr: "کچی گھانی سرسوں تیل",
    description: "Traditional cooking oil",
    rating: 4.6,
    reviews: 289,
    price: 499,
    oldPrice: 699,
    sale: "29% OFF",
    category: 'Oils',
    isNew: true,
    isBestSeller: false,
    inStock: true,
    tags: ['Cooking', 'Massage', 'Traditional'],
    additionalImages: [
      '/images/mustard-oil-1.jpg',
      '/images/mustard-oil-2.jpg',
      '/images/mustard-oil-3.jpg'
    ]
  },
  {
    id: '15',
    img: '/images/product.png',
    nameEn: "Sesame Oil (Gingelly)",
    nameUr: "تل کا تیل",
    description: "For cooking & ayurvedic massage",
    rating: 4.5,
    reviews: 234,
    price: 599,
    oldPrice: 799,
    sale: "25% OFF",
    category: 'Oils',
    isNew: false,
    isBestSeller: true,
    inStock: true,
    tags: ['Cooking', 'Massage', 'Ayurveda'],
    additionalImages: [
      '/images/sesame-oil-1.jpg',
      '/images/sesame-oil-2.jpg',
      '/images/sesame-oil-3.jpg'
    ]
  },
  {
    id: '16',
    img: '/images/product.png',
    nameEn: "Amla Hair Oil",
    nameUr: "آملہ بال تیل",
    description: "Herbal oil for hair growth",
    rating: 4.7,
    reviews: 412,
    price: 349,
    oldPrice: 499,
    sale: "30% OFF",
    category: 'Oils',
    isNew: true,
    isBestSeller: true,
    inStock: true,
    tags: ['Hair Growth', 'Anti-dandruff', 'Strong Hair'],
    additionalImages: [
      '/images/amla-oil-1.jpg',
      '/images/amla-oil-2.jpg',
      '/images/amla-oil-3.jpg'
    ]
  },

  // SUPPLEMENTS (36 products) - 6 products shown
  {
    id: '17',
    img: '/images/product.png',
    nameEn: "Whey Protein Powder",
    nameUr: "وہے پروٹین پاؤڈر",
    description: "Premium protein for muscle growth",
    rating: 4.8,
    reviews: 324,
    price: 2499,
    oldPrice: 2999,
    sale: "17% OFF",
    category: 'Supplements',
    isNew: true,
    isBestSeller: true,
    inStock: true,
    tags: ['Protein', 'Muscle Gain', 'Fitness'],
    additionalImages: [
      '/images/whey-protein-1.jpg',
      '/images/whey-protein-2.jpg',
      '/images/whey-protein-3.jpg'
    ]
  },
  {
    id: '18',
    img: '/images/product.png',
    nameEn: "Omega-3 Fish Oil",
    nameUr: "اومیگا 3 مچھلی تیل",
    description: "Heart & brain health support",
    rating: 4.7,
    reviews: 289,
    price: 899,
    oldPrice: 1199,
    sale: "25% OFF",
    category: 'Supplements',
    isNew: false,
    isBestSeller: true,
    inStock: true,
    tags: ['Heart Health', 'Brain', 'Omega-3'],
    additionalImages: [
      '/images/fish-oil-1.jpg',
      '/images/fish-oil-2.jpg',
      '/images/fish-oil-3.jpg'
    ]
  },
  {
    id: '19',
    img: '/images/product.png',
    nameEn: "Vitamin D3 + K2",
    nameUr: "وٹامن ڈی 3 + کے 2",
    description: "Bone health & immunity",
    rating: 4.6,
    reviews: 198,
    price: 699,
    oldPrice: 899,
    sale: "22% OFF",
    category: 'Supplements',
    isNew: true,
    isBestSeller: false,
    inStock: true,
    tags: ['Vitamin D', 'Bone Health', 'Immunity'],
    additionalImages: [
      '/images/vitamin-d-1.jpg',
      '/images/vitamin-d-2.jpg',
      '/images/vitamin-d-3.jpg'
    ]
  },
  {
    id: '20',
    img: '/images/product.png',
    nameEn: "Zinc + Vitamin C",
    nameUr: "زنک + وٹامن سی",
    description: "Immunity booster complex",
    rating: 4.8,
    reviews: 267,
    price: 399,
    oldPrice: 599,
    sale: "33% OFF",
    category: 'Supplements',
    isNew: true,
    isBestSeller: true,
    inStock: true,
    tags: ['Immunity', 'Cold Relief', 'Antioxidant'],
    additionalImages: [
      '/images/zinc-c-1.jpg',
      '/images/zinc-c-2.jpg',
      '/images/zinc-c-3.jpg'
    ]
  },
  {
    id: '21',
    img: '/images/product.png',
    nameEn: "Magnesium Glycinate",
    nameUr: "میگنیشیم گلائسینیٹ",
    description: "For sleep & muscle relaxation",
    rating: 4.7,
    reviews: 178,
    price: 799,
    oldPrice: 1099,
    sale: "27% OFF",
    category: 'Supplements',
    isNew: true,
    isBestSeller: true,
    inStock: true,
    tags: ['Sleep', 'Muscle Health', 'Relaxation'],
    additionalImages: [
      '/images/magnesium-1.jpg',
      '/images/magnesium-2.jpg',
      '/images/magnesium-3.jpg'
    ]
  },
  {
    id: '22',
    img: '/images/product.png',
    nameEn: "Probiotic Complex",
    nameUr: "پروبائیوٹک کمپلیکس",
    description: "Gut health & digestion support",
    rating: 4.6,
    reviews: 156,
    price: 999,
    oldPrice: 1299,
    sale: "23% OFF",
    category: 'Supplements',
    isNew: false,
    isBestSeller: true,
    inStock: true,
    tags: ['Gut Health', 'Digestion', 'Immunity'],
    additionalImages: [
      '/images/probiotic-1.jpg',
      '/images/probiotic-2.jpg',
      '/images/probiotic-3.jpg'
    ]
  },

  // BEAUTY CORNER (40 products) - 6 products shown
  {
    id: '23',
    img: '/images/product.png',
    nameEn: "Vitamin C Face Serum",
    nameUr: "وٹامن سی فیس سیرم",
    description: "Brightening & anti-aging serum",
    rating: 4.8,
    reviews: 345,
    price: 899,
    oldPrice: 1299,
    sale: "31% OFF",
    category: 'Beauty Corner',
    isNew: true,
    isBestSeller: true,
    inStock: true,
    tags: ['Brightening', 'Anti-aging', 'Vitamin C'],
    additionalImages: [
      '/images/vitamin-c-serum-1.jpg',
      '/images/vitamin-c-serum-2.jpg',
      '/images/vitamin-c-serum-3.jpg'
    ]
  },
  {
    id: '24',
    img: '/images/product.png',
    nameEn: "Hyaluronic Acid Moisturizer",
    nameUr: "ہائیلورونک ایسڈ موئسچرائزر",
    description: "Deep hydration for all skin types",
    rating: 4.7,
    reviews: 278,
    price: 799,
    oldPrice: 1099,
    sale: "27% OFF",
    category: 'Beauty Corner',
    isNew: true,
    isBestSeller: true,
    inStock: true,
    tags: ['Hydration', 'Moisturizer', 'Plumping'],
    additionalImages: [
      '/images/hyaluronic-1.jpg',
      '/images/hyaluronic-2.jpg',
      '/images/hyaluronic-3.jpg'
    ]
  },
  {
    id: '25',
    img: '/images/product.png',
    nameEn: "Retinol Night Cream",
    nameUr: "ریٹینول نائٹ کریم",
    description: "Anti-aging overnight treatment",
    rating: 4.6,
    reviews: 198,
    price: 999,
    oldPrice: 1399,
    sale: "29% OFF",
    category: 'Beauty Corner',
    isNew: false,
    isBestSeller: true,
    inStock: true,
    tags: ['Anti-aging', 'Night Cream', 'Retinol'],
    additionalImages: [
      '/images/retinol-1.jpg',
      '/images/retinol-2.jpg',
      '/images/retinol-3.jpg'
    ]
  },
  {
    id: '26',
    img: '/images/product.png',
    nameEn: "Charcoal Face Wash",
    nameUr: "چارکول فیس واش",
    description: "Deep cleansing for oily skin",
    rating: 4.5,
    reviews: 234,
    price: 449,
    oldPrice: 649,
    sale: "31% OFF",
    category: 'Beauty Corner',
    isNew: true,
    isBestSeller: false,
    inStock: true,
    tags: ['Cleanser', 'Oily Skin', 'Pores'],
    additionalImages: [
      '/images/charcoal-wash-1.jpg',
      '/images/charcoal-wash-2.jpg',
      '/images/charcoal-wash-3.jpg'
    ]
  },
  {
    id: '27',
    img: '/images/product.png',
    nameEn: "Under Eye Cream",
    nameUr: "آئی کریم",
    description: "Reduces dark circles & puffiness",
    rating: 4.7,
    reviews: 189,
    price: 599,
    oldPrice: 899,
    sale: "33% OFF",
    category: 'Beauty Corner',
    isNew: true,
    isBestSeller: true,
    inStock: true,
    tags: ['Eye Care', 'Dark Circles', 'Anti-aging'],
    additionalImages: [
      '/images/eye-cream-1.jpg',
      '/images/eye-cream-2.jpg',
      '/images/eye-cream-3.jpg'
    ]
  },
  {
    id: '28',
    img: '/images/product.png',
    nameEn: "Sunscreen SPF 50",
    nameUr: "سن اسکرین ایس پی ایف 50",
    description: "Broad spectrum sun protection",
    rating: 4.8,
    reviews: 312,
    price: 699,
    oldPrice: 999,
    sale: "30% OFF",
    category: 'Beauty Corner',
    isNew: false,
    isBestSeller: true,
    inStock: true,
    tags: ['Sunscreen', 'SPF 50', 'Protection'],
    additionalImages: [
      '/images/sunscreen-1.jpg',
      '/images/sunscreen-2.jpg',
      '/images/sunscreen-3.jpg'
    ]
  },

  // DAWAKHANA (31 products) - 5 products shown
  {
    id: '29',
    img: '/images/product.png',
    nameEn: "Safi Blood Purifier",
    nameUr: "صافی خون صاف کرنے والا",
    description: "Traditional blood purifying syrup",
    rating: 4.7,
    reviews: 267,
    price: 599,
    oldPrice: 799,
    sale: "25% OFF",
    category: 'Dawakhana',
    isNew: true,
    isBestSeller: true,
    inStock: true,
    tags: ['Blood Purifier', 'Skin Health', 'Acne'],
    additionalImages: [
      '/images/safi-1.jpg',
      '/images/safi-2.jpg',
      '/images/safi-3.jpg'
    ]
  },
  {
    id: '30',
    img: '/images/product.png',
    nameEn: "Jawarish Jalinus",
    nameUr: "جوارش جالینوس",
    description: "Digestive & liver tonic",
    rating: 4.6,
    reviews: 189,
    price: 449,
    oldPrice: 649,
    sale: "31% OFF",
    category: 'Dawakhana',
    isNew: false,
    isBestSeller: true,
    inStock: true,
    tags: ['Digestion', 'Liver Health', 'Unani'],
    additionalImages: [
      '/images/jawarish-1.jpg',
      '/images/jawarish-2.jpg',
      '/images/jawarish-3.jpg'
    ]
  },
  {
    id: '31',
    img: '/images/product.png',
    nameEn: "Majun Arad Khurma",
    nameUr: "معجون عرق خرما",
    description: "Energy & vitality tonic",
    rating: 4.8,
    reviews: 156,
    price: 699,
    oldPrice: 999,
    sale: "30% OFF",
    category: 'Dawakhana',
    isNew: true,
    isBestSeller: true,
    inStock: true,
    tags: ['Energy', 'Vitality', 'Strength'],
    additionalImages: [
      '/images/majun-1.jpg',
      '/images/majun-2.jpg',
      '/images/majun-3.jpg'
    ]
  },
  {
    id: '32',
    img: '/images/product.png',
    nameEn: "Habbe Nishat",
    nameUr: "حب نشاط",
    description: "Sexual wellness tablets",
    rating: 4.5,
    reviews: 134,
    price: 399,
    oldPrice: 599,
    sale: "33% OFF",
    category: 'Dawakhana',
    isNew: false,
    isBestSeller: true,
    inStock: true,
    tags: ['Sexual Health', 'Vitality', 'Unani'],
    additionalImages: [
      '/images/habbe-1.jpg',
      '/images/habbe-2.jpg',
      '/images/habbe-3.jpg'
    ]
  },
  {
    id: '33',
    img: '/images/product.png',
    nameEn: "Sharbat Bazoori",
    nameUr: "شربت بزر ی",
    description: "Cooling & kidney health syrup",
    rating: 4.6,
    reviews: 145,
    price: 349,
    oldPrice: 499,
    sale: "30% OFF",
    category: 'Dawakhana',
    isNew: true,
    isBestSeller: false,
    inStock: true,
    tags: ['Kidney Health', 'Cooling', 'Unani'],
    additionalImages: [
      '/images/sharbat-1.jpg',
      '/images/sharbat-2.jpg',
      '/images/sharbat-3.jpg'
    ]
  },

  // REMEDIES (20 products) - 4 products shown
  {
    id: '34',
    img: '/images/product.png',
    nameEn: "Honey Ginger Remedy",
    nameUr: "شہد ادرک علاج",
    description: "Natural cold & cough remedy",
    rating: 4.8,
    reviews: 234,
    price: 399,
    oldPrice: 549,
    sale: "27% OFF",
    category: 'Remedies',
    isNew: true,
    isBestSeller: true,
    inStock: true,
    tags: ['Cold', 'Cough', 'Immunity'],
    additionalImages: [
      '/images/honey-ginger-1.jpg',
      '/images/honey-ginger-2.jpg',
      '/images/honey-ginger-3.jpg'
    ]
  },
  {
    id: '35',
    img: '/images/product.png',
    nameEn: "Turmeric Milk Mix",
    nameUr: "ہلدی دودھ مکس",
    description: "Golden milk for immunity",
    rating: 4.7,
    reviews: 178,
    price: 299,
    oldPrice: 399,
    sale: "25% OFF",
    category: 'Remedies',
    isNew: true,
    isBestSeller: true,
    inStock: true,
    tags: ['Immunity', 'Anti-inflammatory', 'Golden Milk'],
    additionalImages: [
      '/images/turmeric-milk-1.jpg',
      '/images/turmeric-milk-2.jpg',
      '/images/turmeric-milk-3.jpg'
    ]
  },
  {
    id: '36',
    img: '/images/product.png',
    nameEn: "Triphala Powder",
    nameUr: "تری پھلہ پاؤڈر",
    description: "Digestive & detox remedy",
    rating: 4.7,
    reviews: 198,
    price: 349,
    oldPrice: 499,
    sale: "30% OFF",
    category: 'Remedies',
    isNew: false,
    isBestSeller: true,
    inStock: true,
    tags: ['Digestion', 'Detox', 'Ayurvedic'],
    additionalImages: [
      '/images/triphala-1.jpg',
      '/images/triphala-2.jpg',
      '/images/triphala-3.jpg'
    ]
  },
  {
    id: '37',
    img: '/images/product.png',
    nameEn: "Cough Syrup Herbal",
    nameUr: "کف شربت جڑی بوٹیاں",
    description: "Natural cough relief syrup",
    rating: 4.6,
    reviews: 145,
    price: 249,
    oldPrice: 349,
    sale: "29% OFF",
    category: 'Remedies',
    isNew: true,
    isBestSeller: false,
    inStock: true,
    tags: ['Cough', 'Cold', 'Respiratory'],
    additionalImages: [
      '/images/cough-syrup-1.jpg',
      '/images/cough-syrup-2.jpg',
      '/images/cough-syrup-3.jpg'
    ]
  },

  // MURRABAJAT (2 products) - 2 products shown
  {
    id: '38',
    img: '/images/product.png',
    nameEn: "Amla Murabba",
    nameUr: "آملہ مربہ",
    description: "Indian gooseberry preserve",
    rating: 4.7,
    reviews: 89,
    price: 299,
    oldPrice: 399,
    sale: "25% OFF",
    category: 'Murrabajat',
    isNew: true,
    isBestSeller: true,
    inStock: true,
    tags: ['Vitamin C', 'Immunity', 'Digestion'],
    additionalImages: [
      '/images/amla-murabba-1.jpg',
      '/images/amla-murabba-2.jpg',
      '/images/amla-murabba-3.jpg'
    ]
  },
  {
    id: '39',
    img: '/images/product.png',
    nameEn: "Hara (Green) Murabba",
    nameUr: "ہرا مربہ",
    description: "Traditional green fruit preserve",
    rating: 4.6,
    reviews: 67,
    price: 349,
    oldPrice: 499,
    sale: "30% OFF",
    category: 'Murrabajat',
    isNew: false,
    isBestSeller: true,
    inStock: true,
    tags: ['Traditional', 'Digestive', 'Preserve'],
    additionalImages: [
      '/images/hara-murabba-1.jpg',
      '/images/hara-murabba-2.jpg',
      '/images/hara-murabba-3.jpg'
    ]
  },

  // ARQIYAAT (10 products) - 4 products shown
  {
    id: '40',
    img: '/images/product.png',
    nameEn: "Rose Water (Arq-e-Gulab)",
    nameUr: "عرق گلاب",
    description: "Pure rose distillate for skin",
    rating: 4.8,
    reviews: 234,
    price: 249,
    oldPrice: 349,
    sale: "29% OFF",
    category: 'Arqiyaat',
    isNew: true,
    isBestSeller: true,
    inStock: true,
    tags: ['Skin Toner', 'Cooling', 'Fragrance'],
    additionalImages: [
      '/images/rose-arq-1.jpg',
      '/images/rose-arq-2.jpg',
      '/images/rose-arq-3.jpg'
    ]
  },
  {
    id: '41',
    img: '/images/product.png',
    nameEn: "Arq-e-Badiyan",
    nameUr: "عرق بادیان",
    description: "Fennel distillate for digestion",
    rating: 4.6,
    reviews: 145,
    price: 199,
    oldPrice: 299,
    sale: "33% OFF",
    category: 'Arqiyaat',
    isNew: true,
    isBestSeller: true,
    inStock: true,
    tags: ['Digestion', 'Cooling', 'Baby Colic'],
    additionalImages: [
      '/images/badiyan-arq-1.jpg',
      '/images/badiyan-arq-2.jpg',
      '/images/badiyan-arq-3.jpg'
    ]
  },
  {
    id: '42',
    img: '/images/product.png',
    nameEn: "Arq-e-Kewra",
    nameUr: "عرق کیوڑہ",
    description: "Screwpine distillate for flavor",
    rating: 4.5,
    reviews: 112,
    price: 179,
    oldPrice: 249,
    sale: "28% OFF",
    category: 'Arqiyaat',
    isNew: false,
    isBestSeller: true,
    inStock: true,
    tags: ['Flavoring', 'Biryani', 'Cooling'],
    additionalImages: [
      '/images/kewra-arq-1.jpg',
      '/images/kewra-arq-2.jpg',
      '/images/kewra-arq-3.jpg'
    ]
  },
  {
    id: '43',
    img: '/images/product.png',
    nameEn: "Arq-e-Mako",
    nameUr: "عرق ماکو",
    description: "Nightshade distillate for liver",
    rating: 4.6,
    reviews: 98,
    price: 219,
    oldPrice: 329,
    sale: "33% OFF",
    category: 'Arqiyaat',
    isNew: true,
    isBestSeller: false,
    inStock: true,
    tags: ['Liver Health', 'Cooling', 'Unani'],
    additionalImages: [
      '/images/mako-arq-1.jpg',
      '/images/mako-arq-2.jpg',
      '/images/mako-arq-3.jpg'
    ]
  }
];

// Filter to get new arrivals (products marked as isNew: true)
export const newArrivals = allProducts.filter(product => product.isNew);

// Filter to get best sellers (products marked as isBestSeller: true)
export const bestSellers = allProducts.filter(product => product.isBestSeller);