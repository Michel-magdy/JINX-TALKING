export interface IProduct {
    id: string;
    name: string;
    description: string;
    category: string;
    categorySlug?: string;
    price: number;
    originalPrice?: number;     // For discounts
    discount?: number;          // Discount %
    image: string;              // Main image
    images?: string[];          // Other images
    rating: number;             // 1-5 stars
    reviewCount: number;        // Total reviews
    stock: number;              // Available qty
    sizes?: string[];           // S, M, L, XL
    colors?: string[];          // Available colors
    featured?: boolean;         // Show on homepage
}
