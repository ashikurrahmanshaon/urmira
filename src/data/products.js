// URMIRA (উর্মিরা) - Product & Brand Data
// 100% Authentic Bangladeshi Homemade & Natural Food Data with Verified Product Assets

export const siteConfig = {
  name: "URMIRA",
  banglaName: "উর্মিরা",
  tagline: "HOMEMADE & NATURAL FOODS",
  banglaTagline: "বাছাই করা উপকরণে যত্নসহকারে তৈরি ঘরোয়া স্বাদের খাবার।",
  phone: "+880 1630-072800",
  whatsappNumber: "8801630072800",
  email: "info@urmira.com",
  address: "Rajbari, Bangladesh",
  deliveryText: "সারা বাংলাদেশে ক্যাশ অন ডেলিভারি সুবিধা",
};

// 6 Core Categories matching URMIRA Products
export const categories = [
  {
    id: "dates",
    name: "খেজুর ও খেজুরজাত পণ্য",
    englishName: "Dates & Date Products",
    count: "১২+ পণ্য",
    image: "/assets/dates.svg",
    slug: "dates-products",
    badge: "জনপ্রিয়"
  },
  {
    id: "nuts",
    name: "বাদাম ও ড্রাই ফ্রুটস",
    englishName: "Almonds & Dry Fruits",
    count: "১৮+ পণ্য",
    image: "/assets/nuts.svg",
    slug: "nuts-dry-fruits",
    badge: "প্রিমিয়াম"
  },
  {
    id: "ghee",
    name: "বিশুদ্ধ ঘি",
    englishName: "Pure Desi Ghee",
    count: "৬+ পণ্য",
    image: "/assets/ghee.svg",
    slug: "pure-desi-ghee",
    badge: "১০০% খাঁটি"
  },
  {
    id: "homemade",
    name: "হোমমেড স্পেশাল",
    englishName: "Date & Almond Energy Balls",
    count: "১৫+ পণ্য",
    image: "/assets/energy_balls.svg",
    slug: "homemade-specials",
    badge: "ঘরোয়া"
  },
  {
    id: "energy",
    name: "এনার্জি ফুডস",
    englishName: "Homemade Snacks & Bars",
    count: "১০+ পণ্য",
    image: "/assets/energy_bar.svg",
    slug: "energy-foods",
    badge: "চিনিমুক্ত"
  },
  {
    id: "gift",
    name: "গিফট প্যাক",
    englishName: "Gift Packs",
    count: "৮+ পণ্য",
    image: "/assets/gift_box.svg",
    slug: "gift-packs",
    badge: "স্পেশাল"
  },
];

// Curated Products - 100% Matching URMIRA Catalog
export const products = [
  {
    id: 1,
    name: "প্রিমিয়াম আজওয়া খেজুর (১ কেজি)",
    englishName: "Premium Ajwa Dates (1kg)",
    category: "dates",
    badge: "বেস্ট সেলার",
    badgeType: "best",
    rating: 4.9,
    reviewsCount: 128,
    price: 950,
    originalPrice: 1200,
    unit: "১ কেজি বক্স",
    image: "/assets/dates.svg",
    description: "মদিনার খাঁটি প্রিমিয়াম গ্রেড আজওয়া খেজুর। সম্পূর্ণ প্রাকৃতিক, মিষ্টি ও অত্যন্ত পুষ্টিকর। কোনো কৃত্রিম মিষ্টি বা রাসায়নিক দেওয়া হয়নি।",
    features: ["১০০% খাঁটি ও প্রাকৃতিক", "সরাসরি মদিনা থেকে আমদানিকৃত", "উচ্চ পুষ্টিগুণ ও রোগ প্রতিরোধক"],
    inStock: true,
  },
  {
    id: 2,
    name: "খেজুর ও বাদামের এনার্জি বল (১২ পিস)",
    englishName: "Date & Almond Energy Balls (12 pcs)",
    category: "homemade",
    badge: "নতুন",
    badgeType: "new",
    rating: 4.9,
    reviewsCount: 94,
    price: 650,
    originalPrice: 780,
    unit: "১২ পিস বক্স",
    image: "/assets/energy_balls.svg",
    description: "প্রাকৃতিক খেজুর, কাঠবাদাম, কাজু, পেস্তা ও খাঁটি বিলোনা ঘিয়ে ঘরে তৈরি সুস্বাদু এনার্জি বল। সম্পূর্ণ চিনিমুক্ত ও পুষ্টিকর।",
    features: ["০% রিফাইনড সুগার", "খাঁটি দেশি ঘিয়ে প্রস্তুত", "শিশু ও বড়দের জন্য আদর্শ হেলদি স্ন্যাক্স"],
    inStock: true,
  },
  {
    id: 3,
    name: "খাঁটি দেশি গরুর ঘি (বিলোনা পদ্ধতি)",
    englishName: "Pure Desi Cow Bilona Ghee 500ml",
    category: "ghee",
    badge: "১০০% খাঁটি",
    badgeType: "best",
    rating: 5.0,
    reviewsCount: 156,
    price: 1450,
    originalPrice: 1680,
    unit: "৫০০ মিলি কাঁচের জার",
    image: "/assets/ghee.svg",
    description: "ঘাস খাওয়া দেশি গরুর দুধ থেকে ঐতিহ্যবাহী বিলোনা (দই মন্থন) পদ্ধতিতে তৈরি ১০০% খাঁটি দানাদার সুগন্ধি ঘি।",
    features: ["ঐতিহ্যবাহী বিলোনা পদ্ধতিতে প্রস্তুত", "প্রাকৃতিক দানাদার ও মনোমুগ্ধকর সুবাস", "কোনো প্রিজারভেটিভ বা রাসায়নিক নেই"],
    inStock: true,
  },
  {
    id: 4,
    name: "মিক্সড নাটস প্রিমিয়াম কোয়ালিটি (২৫০ গ্রাম)",
    englishName: "Premium Roasted Mixed Nuts (250g)",
    category: "nuts",
    badge: "১০% ছাড়",
    badgeType: "discount",
    rating: 4.8,
    reviewsCount: 88,
    price: 950,
    originalPrice: 1100,
    unit: "২৫০ গ্রাম প্যাক",
    image: "/assets/nuts.svg",
    description: "কাজুবাদাম, কাঠবাদাম, পেস্তা, আখরোট ও রোস্টেড নাটসের পারফেক্ট ব্লেন্ড। প্রতিদিনের স্বাস্থ্যকর ফ্যাট ও প্রোটিনের সেরা উৎস।",
    features: ["১ম গ্রেডের ফ্রেশ বাদাম", "হালকা ক্রাঞ্চি ও পুষ্টিকর", "ভ্যাকুয়াম সিল প্যাকেজিং"],
    inStock: true,
  },
  {
    id: 5,
    name: "খেজুর এনার্জি বার (চিনি ছাড়া) (৬ পিস)",
    englishName: "Homemade Date Energy Bar (6 pcs)",
    category: "energy",
    badge: "চিনিমুক্ত",
    badgeType: "new",
    rating: 4.8,
    reviewsCount: 62,
    price: 650,
    originalPrice: 850,
    unit: "৬ পিস বক্স",
    image: "/assets/energy_bar.svg",
    description: "খাঁটি খেজুর, চিয়া সিড, ওটস এবং বাদামের সংমিশ্রণে তৈরি এনার্জি বার। অফিস, জিম বা ভ্রমণের পারফেক্ট পুষ্টিকর স্ন্যাক।",
    features: ["১০০% রিফাইনড সুগার ফ্রি", "উচ্চ ফাইবার ও প্রোটিন সমৃদ্ধ", "তাত্ক্ষণিক শক্তি জোগায়"],
    inStock: true,
  },
  {
    id: 6,
    name: "প্রিমিয়াম গিফট বক্স (স্পেশাল এডিশন)",
    englishName: "Premium Gift Box (Special Edition)",
    category: "gift",
    badge: "উপহার স্পেশাল",
    badgeType: "discount",
    rating: 4.9,
    reviewsCount: 74,
    price: 2200,
    originalPrice: 2500,
    unit: "১টি লাক্সারি গিফট বক্স",
    image: "/assets/gift_box.svg",
    description: "প্রিয়জনকে স্বাস্থ্যকর শুভেচ্ছা জানানোর জন্য ঐতিহ্যবাহী রাজকীয় কাঠের উপহার বক্স। এতে রয়েছে প্রিমিয়াম আজওয়া খেজুর, খাঁটি ঘি ও মিক্স নাটস।",
    features: ["লাক্সারি কাঠের ফিনিশিং", "৩টি প্রিমিয়াম পণ্যের এক্সক্লুসিভ কম্বো", "উপহার দেওয়ার জন্য আকর্ষণীয় ডিজাইন"],
    inStock: true,
  },
];

// Featured Product Spotlight Data (Pure Desi Cow Ghee)
export const featuredProductSpotlight = {
  id: 3,
  title: "খাঁটি দেশি গরুর ঘি (বিলোনা পদ্ধতি)",
  englishTitle: "Pure Desi Cow Bilona Ghee",
  tagline: "ঐতিহ্যবাহী মাটির পাত্রে দই মন্থন করে প্রস্তুত ১০০% দানাদার ও সুবাসিত ঘি",
  rating: 5.0,
  reviewsCount: 156,
  description: "URMIRA-র দেশি গরুর ঘি তৈরি হয় শতভাগ খাঁটি দুধ থেকে। প্রাচীন বিলোনা পদ্ধতিতে দই মন্থন করে মাখন আলাদা করার পর মৃদু আঁচে ফুটিয়ে এই সুগন্ধি দানাদার ঘি তৈরি করা হয়। এতে কোনো প্রকার প্রিজারভেটিভ, কৃত্রিম সুবাস বা ভেজাল নেই।",
  benefits: [
    "ঘাস খাওয়া দেশি গরুর খাঁটি দুধ থেকে প্রস্তুত",
    "ঐতিহ্যবাহী কাঠের বিলোনা ও মাটির পাত্রে তৈরি",
    "প্রাকৃতিক রোগ প্রতিরোধ ক্ষমতা ও হজম শক্তি বৃদ্ধি করে",
    "মনোমুগ্ধকর প্রাকৃতিক সুবাস ও খাঁটি দানাদার টেক্সচার"
  ],
  sizes: [
    { label: "২৫০ মিলি", price: 780, originalPrice: 900, key: "250ml" },
    { label: "৫০০ মিলি", price: 1450, originalPrice: 1680, key: "500ml", default: true },
    { label: "১ লিটার", price: 2800, originalPrice: 3200, key: "1000ml" }
  ],
  images: [
    "/assets/ghee.svg",
    "/assets/dates.svg",
    "/assets/nuts.svg"
  ]
};

// Trust Bar Points (5 Line Items)
export const trustPoints = [
  {
    icon: "fa-solid fa-house-chimney-user",
    title: "১০০% হোমমেড",
    subtitle: "ঘরোয়া পরিবেশে তৈরি",
  },
  {
    icon: "fa-solid fa-seedling",
    title: "প্রাকৃতিক উপকরণ",
    subtitle: "কোনো ক্ষতিকর কেমিক্যাল নেই",
  },
  {
    icon: "fa-solid fa-bowl-food",
    title: "তাজা প্রস্তুত",
    subtitle: "অর্ডারের পর যত্নসহকারে তৈরি",
  },
  {
    icon: "fa-solid fa-truck-fast",
    title: "ক্যাশ অন ডেলিভারি",
    subtitle: "পণ্য হাতে পেয়ে মূল্য পরিশোধ",
  },
  {
    icon: "fa-solid fa-box-archive",
    title: "নিরাপদ প্যাকেজিং",
    subtitle: "ফুড-গ্রেড ও হাইজেনিক প্যাক",
  },
];

// Why URMIRA (4 Concise Core Value Cards)
export const whyUrmiraFeatures = [
  {
    icon: "fa-solid fa-gem",
    title: "বিশুদ্ধ উপকরণ",
    desc: "আমরা সরাসরি নিজস্ব তত্ত্বাবধানে সংগৃহীত খাঁটি দুধ, কাঠবাদাম, কাজু ও মদিনার আজওয়া খেজুর ব্যবহার করি। কোনো কৃত্রিম স্বাদ বা ভেজাল নেই।"
  },
  {
    icon: "fa-solid fa-hand-holding-heart",
    title: "যত্নসহকারে প্রস্তুত",
    desc: "প্রাচীন ঐতিহ্যবাহী পদ্ধতিতে ঘরোয়া পরিবেশে অত্যন্ত পরিচ্ছন্নতার সাথে খাবার প্রস্তুত করা হয়, যা আপনার পরিবারের প্রতিটি সদস্যের জন্য নিরাপদ।"
  },
  {
    icon: "fa-solid fa-box-check",
    title: "নিরাপদ প্যাকেজিং",
    desc: "খাবারের আসল স্বাদ ও সুবাস অক্ষুণ্ণ রাখতে প্রিমিয়াম ফুড-গ্রেড কাঁচের জার এবং ভ্যাকুয়াম সিল প্যাকেজিং ব্যবহার করা হয়।"
  },
  {
    icon: "fa-solid fa-headset",
    title: "দ্রুত সাপোর্ট",
    desc: "অর্ডার ট্র্যাকিং, ডেলিভারি আপডেট বা যেকোনো তথ্যের জন্য আমাদের হেল্পলাইন ও হোয়াটসঅ্যাপ সাপোর্ট সর্বদা আপনার পাশে।"
  }
];

// Brand Story Data
export const brandStoryData = {
  tagline: "আমাদের গল্প ও দর্শন",
  title: "বিশুদ্ধতা ও ভালোবাসার ঘরে তৈরি খাবার",
  story: "URMIRA-র যাত্রা শুরু হয়েছিল পরিবারের প্রতিটি সদস্যের পাতে ভেজালমুক্ত, খাঁটি ও স্বাস্থ্যকর খাবার তুলে দেওয়ার তীব্র তাগিদ থেকে। বাজারে যখন কৃত্রিম উপাদান ও প্রিজারভেটিভের ছড়াছড়ি, তখন আমরা বেছে নিয়েছি প্রাচীন ঐতিহ্যবাহী রেসিপি ও খাঁটি উপকরণের পথ। আমরা বিশ্বাস করি—ভালোবাসা আর খাঁটি উপকরণ দিয়ে তৈরি খাবারই পারে পরিবারকে সুস্থ ও প্রাণবন্ত রাখতে।",
  principles: [
    "১০০% প্রাকৃতিক ও রাসায়নিকমুক্ত উপকরণ",
    "প্রাচীন ঐতিহ্যবাহী স্বাস্থ্যসম্মত রেসিপি",
    "কোনো প্রকার কৃত্রিম রং, ফ্লেভার বা প্রিজারভেটিভ নয়",
    "পরিবারের প্রতি সর্বোচ্চ আন্তরিকতা ও জবাবদিহিতা"
  ],
  image: "/assets/dates.svg"
};
