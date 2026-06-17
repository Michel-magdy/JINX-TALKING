import { IProduct } from '../models/iproduct';
import { ICategory } from '../models/icategory';

// ══════════════════════════════════════════════════════════════════════
// STATIC MOCK DATA — Replace with Supabase when ready
// To switch back: restore the original ProductService & AdminService
// ══════════════════════════════════════════════════════════════════════

export const MOCK_PRODUCTS: IProduct[] = [
  // ── ALO ────────────────────────────────────────────────────────────
  {
    id: '1',
    name: 'Classic ALO T-Shirt',
    description:
      'Premium quality white t-shirt made from 100% organic cotton. Features the iconic ALO logo on the chest. Comfortable relaxed fit, perfect for everyday wear with a luxurious feel.',
    price: 1200,
    originalPrice: 1500,
    discount: 20,
    image: 'assets/images/products/AloW.jpeg',
    images: [
      'assets/images/products/AloB.jpeg',
      'assets/images/products/AloHum.png',
      'assets/images/products/AloHum2.jpeg',
    ],
    category: "Men's Casual",
    categorySlug: 'mens-casual',
    stock: 45,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Black'],
    rating: 4.5,
    reviewCount: 128,
    featured: true,
  },

  // ── Balenciaga ─────────────────────────────────────────────────────
  {
    id: '2',
    name: 'Balenciaga Logo Tee',
    description:
      'Iconic Balenciaga oversized t-shirt with bold front branding. Made from premium heavyweight cotton with a relaxed silhouette that embodies modern streetwear luxury.',
    price: 3200,
    originalPrice: 4000,
    discount: 20,
    image: 'assets/images/products/BalB.jpeg',
    images: [
      'assets/images/products/BalF.jpeg',
      'assets/images/products/BalHum.jpeg',
      'assets/images/products/BalHum2.jpeg',
    ],
    category: 'Streetwear',
    categorySlug: 'streetwear',
    stock: 28,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black'],
    rating: 4.7,
    reviewCount: 256,
    featured: true,
  },

  // ── Louis Vuitton ──────────────────────────────────────────────────
  {
    id: '3',
    name: 'Louis Vuitton Premium Tee',
    description:
      'Luxury Louis Vuitton t-shirt featuring the signature monogram pattern. Crafted from the finest Egyptian cotton with meticulous attention to detail. A statement piece for the discerning gentleman.',
    price: 4500,
    originalPrice: 6000,
    discount: 25,
    image: 'assets/images/products/LouiW.jpeg',
    images: [
      'assets/images/products/LouiB.jpeg',
      'assets/images/products/LouiHum.jpeg',
      'assets/images/products/LouiHum.png',
    ],
    category: 'Designer Collection',
    categorySlug: 'designer-collection',
    stock: 15,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Black'],
    rating: 4.9,
    reviewCount: 89,
    featured: true,
  },

  // ── Miu Miu ────────────────────────────────────────────────────────
  {
    id: '4',
    name: 'Miu Miu Signature Shirt',
    description:
      'Elegant Miu Miu t-shirt with the refined aesthetic the brand is known for. Soft premium fabric with a contemporary cut that blends luxury with everyday wearability.',
    price: 2800,
    originalPrice: 3500,
    discount: 20,
    image: 'assets/images/products/MiuW.jpeg',
    images: [
      'assets/images/products/MiwB.jpeg',
      'assets/images/products/MiuHum.png',
      'assets/images/products/MiuHum2.jpeg',
    ],
    category: 'Designer Collection',
    categorySlug: 'designer-collection',
    stock: 22,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Black'],
    rating: 4.6,
    reviewCount: 134,
    featured: true,
  },

  // ── Moschino ───────────────────────────────────────────────────────
  {
    id: '5',
    name: 'Moschino Bold Logo Tee',
    description:
      'Statement Moschino t-shirt with the brand\'s playful yet luxurious logo design. Premium cotton construction with a modern regular fit. Stand out with this bold fashion piece.',
    price: 2200,
    originalPrice: 2800,
    discount: 21,
    image: 'assets/images/products/MoW.jpeg',
    images: [
      'assets/images/products/MoB.jpeg',
      'assets/images/products/Mohum.jpeg',
    ],
    category: "Men's Casual",
    categorySlug: 'mens-casual',
    stock: 35,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Black'],
    rating: 4.4,
    reviewCount: 97,
    featured: false,
  },

  // ── Off-White ──────────────────────────────────────────────────────
  {
    id: '6',
    name: 'Off-White Arrow Tee',
    description:
      'Signature Off-White t-shirt featuring the iconic diagonal arrows on the back. A must-have streetwear staple crafted from soft premium cotton with the distinctive industrial-style branding.',
    price: 3500,
    originalPrice: 4500,
    discount: 22,
    image: 'assets/images/products/OffW.jpeg',
    images: [
      'assets/images/products/OffB.jpeg',
      'assets/images/products/OffHum.jpeg',
      'assets/images/products/OffHum2.jpeg',
    ],
    category: 'Streetwear',
    categorySlug: 'streetwear',
    stock: 30,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Black'],
    rating: 4.8,
    reviewCount: 312,
    featured: true,
  },

  // ── Palm Angels ────────────────────────────────────────────────────
  {
    id: '7',
    name: 'Palm Angels Classic Tee',
    description:
      'The Palm Angels classic logo t-shirt with the brand\'s California-inspired aesthetic. Premium quality cotton with a comfortable fit that bridges luxury fashion and skate culture.',
    price: 2600,
    originalPrice: 3200,
    discount: 19,
    image: 'assets/images/products/PalB.jpeg',
    images: [
      'assets/images/products/PalHum.jpeg',
      'assets/images/products/PalFB.jpeg',
      'assets/images/products/PalFW.jpeg',
    ],
    category: 'Streetwear',
    categorySlug: 'streetwear',
    stock: 38,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White'],
    rating: 4.5,
    reviewCount: 178,
    featured: false,
  },

  // ── Stone Island ───────────────────────────────────────────────────
  {
    id: '8',
    name: 'Stone Island Compass Tee',
    description:
      'The iconic Stone Island t-shirt with the signature compass rose patch on the sleeve. Made from garment-dyed premium cotton for a unique washed finish. A wardrobe essential for any style-conscious man.',
    price: 2900,
    originalPrice: 3600,
    discount: 19,
    image: 'assets/images/products/StoB.jpeg',
    images: [
      'assets/images/products/StoHum.png',
      'assets/images/products/StoHum2.jpeg',
    ],
    category: "Men's Casual",
    categorySlug: 'mens-casual',
    stock: 42,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black'],
    rating: 4.7,
    reviewCount: 215,
    featured: true,
  },

  // ── Additional products for variety ────────────────────────────────

  {
    id: '9',
    name: 'ALO Sport Performance Tee',
    description:
      'Engineered for both style and performance. This ALO sport tee features moisture-wicking technology and a sleek fit, perfect for active lifestyles without compromising on luxury.',
    price: 1400,
    originalPrice: 1800,
    discount: 22,
    image: 'assets/images/products/AloB.jpeg',
    images: [
      'assets/images/products/AloW.jpeg',
      'assets/images/products/AloHum2.jpeg',
    ],
    category: "Men's Casual",
    categorySlug: 'mens-casual',
    stock: 55,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White'],
    rating: 4.3,
    reviewCount: 67,
    featured: false,
  },

  {
    id: '10',
    name: 'Balenciaga Oversized Fit',
    description:
      'The ultimate oversized silhouette from Balenciaga. This premium tee features dropped shoulders and an extended body for that coveted high-fashion streetwear look.',
    price: 3800,
    originalPrice: 4800,
    discount: 21,
    image: 'assets/images/products/BalHum.jpeg',
    images: [
      'assets/images/products/BalB.jpeg',
      'assets/images/products/BalF.jpeg',
      'assets/images/products/BalHum2.jpeg',
    ],
    category: 'Streetwear',
    categorySlug: 'streetwear',
    stock: 18,
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Black'],
    rating: 4.6,
    reviewCount: 143,
    featured: false,
  },

  {
    id: '11',
    name: 'Louis Vuitton Monogram Crew',
    description:
      'Exquisite Louis Vuitton crew neck with subtle monogram embroidery. A masterpiece of understated luxury, crafted for those who appreciate the finer things in life.',
    price: 5200,
    originalPrice: 6500,
    discount: 20,
    image: 'assets/images/products/LouiB.jpeg',
    images: [
      'assets/images/products/LouiW.jpeg',
      'assets/images/products/LouiHum.png',
    ],
    category: 'Designer Collection',
    categorySlug: 'designer-collection',
    stock: 10,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White'],
    rating: 4.8,
    reviewCount: 56,
    featured: false,
  },

  {
    id: '12',
    name: 'Off-White Industrial Belt Tee',
    description:
      'Featuring the distinctive industrial-style graphics that made Off-White a global phenomenon. This limited edition tee combines art, fashion, and street culture.',
    price: 3200,
    originalPrice: 4000,
    discount: 20,
    image: 'assets/images/products/OffHum2.jpeg',
    images: [
      'assets/images/products/OffW.jpeg',
      'assets/images/products/OffB.jpeg',
      'assets/images/products/OffHum.jpeg',
    ],
    category: 'Streetwear',
    categorySlug: 'streetwear',
    stock: 25,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Black'],
    rating: 4.5,
    reviewCount: 189,
    featured: false,
  },

  {
    id: '13',
    name: 'Palm Angels Track Tee',
    description:
      'Inspired by the Los Angeles skate scene, this Palm Angels track tee features side stripe detailing and the brand\'s signature bear motif. Premium sportswear meets luxury fashion.',
    price: 2400,
    originalPrice: 3000,
    discount: 20,
    image: 'assets/images/products/PalFW.jpeg',
    images: [
      'assets/images/products/PalFB.jpeg',
      'assets/images/products/PalB.jpeg',
      'assets/images/products/PalHum.jpeg',
    ],
    category: "Men's Casual",
    categorySlug: 'mens-casual',
    stock: 33,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Black'],
    rating: 4.4,
    reviewCount: 102,
    featured: false,
  },

  {
    id: '14',
    name: 'Stone Island Badge Polo',
    description:
      'Classic polo shirt from Stone Island featuring the removable compass badge. Made from premium piqué cotton with ribbed collar and cuffs. The epitome of refined casual style.',
    price: 3100,
    originalPrice: 3800,
    discount: 18,
    image: 'assets/images/products/StoHum2.jpeg',
    images: [
      'assets/images/products/StoB.jpeg',
      'assets/images/products/StoHum.png',
    ],
    category: "Men's Formal",
    categorySlug: 'mens-formal',
    stock: 20,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black'],
    rating: 4.6,
    reviewCount: 88,
    featured: false,
  },

  {
    id: '15',
    name: 'Miu Miu Graphic Print Tee',
    description:
      'A contemporary Miu Miu tee with artistic graphic prints. This piece showcases the brand\'s commitment to pushing fashion boundaries while maintaining impeccable quality.',
    price: 2500,
    originalPrice: 3200,
    discount: 22,
    image: 'assets/images/products/MiuHum2.jpeg',
    images: [
      'assets/images/products/MiuW.jpeg',
      'assets/images/products/MiwB.jpeg',
    ],
    category: 'Designer Collection',
    categorySlug: 'designer-collection',
    stock: 16,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White'],
    rating: 4.5,
    reviewCount: 76,
    featured: false,
  },

  {
    id: '16',
    name: 'Moschino Couture Crew',
    description:
      'The Moschino Couture line crew neck t-shirt with embroidered logo. A fusion of Italian craftsmanship and contemporary design that adds a touch of playful luxury to any outfit.',
    price: 1900,
    originalPrice: 2400,
    discount: 21,
    image: 'assets/images/products/Mohum.jpeg',
    images: [
      'assets/images/products/MoW.jpeg',
      'assets/images/products/MoB.jpeg',
    ],
    category: "Men's Casual",
    categorySlug: 'mens-casual',
    stock: 40,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Black'],
    rating: 4.3,
    reviewCount: 64,
    featured: false,
  },
];

export const MOCK_CATEGORIES: ICategory[] = [
  {
    id: 'cat-1',
    name: "Men's Casual",
    slug: 'mens-casual',
    image: 'assets/images/products/AloW.jpeg',
    productCount: 6,
  },
  {
    id: 'cat-2',
    name: "Men's Formal",
    slug: 'mens-formal',
    image: 'assets/images/products/StoHum2.jpeg',
    productCount: 1,
  },
  {
    id: 'cat-3',
    name: 'Streetwear',
    slug: 'streetwear',
    image: 'assets/images/products/OffW.jpeg',
    productCount: 5,
  },
  {
    id: 'cat-4',
    name: 'Designer Collection',
    slug: 'designer-collection',
    image: 'assets/images/products/LouiW.jpeg',
    productCount: 4,
  },
];
