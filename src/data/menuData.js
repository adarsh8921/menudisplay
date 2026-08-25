export const menuCategories = [
  { id: 'all', name: 'All Items', icon: 'Utensils' },
  { id: 'original', name: 'Original Series', japanese: 'オリジナル', badge: 'Popular' },
  { id: 'curry', name: 'Curry Series', japanese: 'カレー', badge: 'Rich Flavor' },
  { id: 'nanban', name: 'Nanban Series', japanese: '南蛮', badge: 'Tartar Special' },
  { id: 'udon', name: 'Creamy Udon', japanese: 'クリーミーうどん', badge: 'Chef Choice' },
  { id: 'chiri', name: 'Chiri Series', japanese: 'チリ', badge: 'Spicy' },
  { id: 'teppanyaki', name: 'Teppanyaki Series', japanese: '鉄板焼き', badge: 'Sizzling' },
  { id: 'yakitori', name: 'Yakitori Skewers', japanese: '焼き鳥', badge: 'Fresh Grill' },
  { id: 'extra', name: 'Extra Sides', japanese: 'エキストラ' },
  { id: 'minuman', name: 'Minuman (Drinks)', japanese: 'ドリンク' },
];

export const menuItems = [
  // ORIGINAL SERIES
  {
    id: 'orig-1',
    category: 'original',
    name: 'Nasi Tamago',
    japanese: 'ナシタマゴ',
    description: 'Steamed fragrant rice topped with fluffy Japanese seasoned scrambled egg and signature sauce.',
    basePrice: 12,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    tags: ['Best Value', 'Egg'],
  },
  {
    id: 'orig-2',
    category: 'original',
    name: 'Nasi Ayam Karage',
    japanese: 'ナシアヤムカラゲ',
    description: 'Crispy Japanese fried chicken served over rice with sweet-savory soy glaze.',
    basePrice: 23,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80',
    tags: ['Customer Favorite', 'Crispy Chicken'],
  },
  {
    id: 'orig-3',
    category: 'original',
    name: 'Nasi Soseji',
    japanese: 'ナシソーセージ',
    description: 'Sliced premium Japanese grill sausages served with soft egg over warm rice.',
    basePrice: 25,
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80',
    tags: ['Sausage'],
  },
  {
    id: 'orig-4',
    category: 'original',
    name: 'Nasi Sapi Karage',
    japanese: 'ナシサピカラゲ',
    description: 'Crispy marinated beef slices topped with sesame and signature house glaze.',
    basePrice: 33,
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
    tags: ['Premium Beef'],
  },

  // CURRY SERIES
  {
    id: 'curry-1',
    category: 'curry',
    name: 'Curry Rice Bowls',
    japanese: 'カレーライス',
    description: 'Traditional thick Japanese brown curry bowl served with soft egg and spring onions.',
    hasMeatOptions: true,
    options: [
      { name: 'Chicken (Ayam)', price: 15, isDefault: true },
      { name: 'Beef (Sapi)', price: 25 },
      { name: 'Special Double (Sapi + Ayam)', price: 36 },
    ],
    image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=600&q=80',
    tags: ['Signature Curry', 'Spicy Option'],
  },

  // NANBAN SERIES
  {
    id: 'nanban-1',
    category: 'nanban',
    name: 'Nanban Bowls',
    japanese: 'チキン南蛮',
    description: 'Sweet and sour marinated protein topped with thick homemade Japanese tartar sauce.',
    hasMeatOptions: true,
    options: [
      { name: 'Chicken (Ayam)', price: 34, isDefault: true },
      { name: 'Beef (Sapi)', price: 44 },
    ],
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
    tags: ['Creamy Tartar', 'Must Try'],
  },

  // CREAMY UDON
  {
    id: 'udon-1',
    category: 'udon',
    name: 'Creamy Udon Soup',
    japanese: 'クリーミーうどん',
    description: 'Chewy Japanese wheat udon noodles in rich creamy collagen broth with shredded nori.',
    hasMeatOptions: true,
    options: [
      { name: 'Original Chicken', price: 42, isDefault: true },
      { name: 'Sliced Beef Premium', price: 51 },
    ],
    image: 'https://images.unsplash.com/photo-1618841557871-b4664fbf0cb3?auto=format&fit=crop&w=600&q=80',
    tags: ['Hot Noodles', 'Rich Broth'],
  },

  // CHIRI SERIES
  {
    id: 'chiri-1',
    category: 'chiri',
    name: 'Chiri Yakiniku Bowl',
    japanese: 'チリ焼肉',
    description: 'Fiery chili sauce bowl with flame-grilled protein and half-cooked egg.',
    hasMeatOptions: true,
    options: [
      { name: 'Chicken (Ayam)', price: 33, isDefault: true },
      { name: 'Beef (Sapi)', price: 42 },
    ],
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=600&q=80',
    tags: ['Spicy 🔥🔥'],
  },
  {
    id: 'chiri-2',
    category: 'chiri',
    name: 'Chiri Teriyaki Bowl',
    japanese: 'チリ照り焼き',
    description: 'Sweet chili glaze combined with rich teriyaki reduction over rice.',
    hasMeatOptions: true,
    options: [
      { name: 'Chicken (Ayam)', price: 33, isDefault: true },
      { name: 'Beef (Sapi)', price: 42 },
    ],
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80',
    tags: ['Sweet & Spicy'],
  },
  {
    id: 'chiri-3',
    category: 'chiri',
    name: 'Chiri Karage Bowl',
    japanese: 'チリ唐揚げ',
    description: 'Extra crunchy fried pieces tossed in fiery Japanese chili oil.',
    hasMeatOptions: true,
    options: [
      { name: 'Chicken (Ayam)', price: 27, isDefault: true },
      { name: 'Beef (Sapi)', price: 37 },
    ],
    image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=600&q=80',
    tags: ['Crunchy'],
  },
  {
    id: 'chiri-4',
    category: 'chiri',
    name: 'Chiri Curry Bowl',
    japanese: 'チリカレー',
    description: 'Combination of classic curry broth infused with red chili paste.',
    hasMeatOptions: true,
    options: [
      { name: 'Chicken (Ayam)', price: 29, isDefault: true },
      { name: 'Beef (Sapi)', price: 39 },
    ],
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80',
    tags: ['Spicy Curry'],
  },

  // TEPPANYAKI SERIES
  {
    id: 'tep-1',
    category: 'teppanyaki',
    name: 'Teppanyaki Teriyaki',
    japanese: '鉄板照り焼き',
    description: 'Pan-seared teppan style meat with glazed garlic teriyaki sauce.',
    hasMeatOptions: true,
    options: [
      { name: 'Chicken (Ayam)', price: 31, isDefault: true },
      { name: 'Beef (Sapi)', price: 38 },
    ],
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80',
    tags: ['Sizzling Grill'],
  },
  {
    id: 'tep-2',
    category: 'teppanyaki',
    name: 'Teppanyaki Yakiniku',
    japanese: '鉄板焼肉',
    description: 'Smoky grilled meat marinated in sweet garlic soy on hot teppan.',
    hasMeatOptions: true,
    options: [
      { name: 'Chicken (Ayam)', price: 28, isDefault: true },
      { name: 'Beef (Sapi)', price: 36 },
    ],
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    tags: ['Smoky Soy'],
  },
];

export const yakitoriItems = [
  { id: 'yaki-1', name: 'Torikawa', japanese: 'とりかわ', price: 6, description: 'Crispy grilled chicken skin skewered with sweet tare sauce.', icon: '🍢' },
  { id: 'yaki-2', name: 'Tahu Ikan', japanese: '魚豆腐', price: 6, description: 'Golden fried fish tofu skewer with seasoning dip.', icon: '🍢' },
  { id: 'yaki-3', name: 'Sosis Grill', japanese: 'ソーセージ', price: 8, description: 'Jumbo grilled sausage stick with barbecue glaze.', icon: '🍢' },
  { id: 'yaki-4', name: 'Fish Ball', japanese: 'フィッシュボール', price: 6, description: 'Tender bouncy fish balls grilled over open flame.', icon: '🍢' },
  { id: 'yaki-5', name: 'Baso Salmon', japanese: 'サーモンボール', price: 6, description: 'Savory salmon meatball skewered and lightly charred.', icon: '🍢' },
  { id: 'yaki-6', name: 'Baso Ikan', japanese: 'フィッシュ団子', price: 6, description: 'Traditional fish cake balls with sea salt & pepper.', icon: '🍢' },
];

export const extraSides = [
  { id: 'ext-1', name: 'Nasi (Extra Rice)', price: 3 },
  { id: 'ext-2', name: 'Curry Sauce Bowl', price: 2 },
  { id: 'ext-3', name: 'Sambal Chiri', price: 7 },
  { id: 'ext-4', name: 'Telur (Egg)', price: 5 },
  { id: 'ext-5', name: 'Crispy Spinach', price: 4 },
  { id: 'ext-6', name: 'Sambal Hijau', price: 5 },
];

export const minumanDrinks = [
  { id: 'drk-1', name: 'Stee (Sweet Ice Tea)', price: 8, icon: '🧃' },
  { id: 'drk-2', name: 'Soda (Fanta / Coca-Cola / Sprite)', price: 8, icon: '🥤' },
  { id: 'drk-3', name: 'Air Mineral (Bottled Water)', price: 8, icon: '💧' },
  { id: 'drk-4', name: 'Teh Botol Sosro', price: 8, icon: '🍵' },
];
