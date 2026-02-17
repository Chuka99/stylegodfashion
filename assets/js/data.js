// Edit this file to update your products, looks, and blog posts.
// Tip: Keep image sizes consistent for best layout.

export const BRAND = {
  name: "Stylegod",
  tagline: "Soft Luxury. Class in every step.",
  instagram: "https://www.instagram.com/sophia_de_stylegod/",
  email: "hello@stylegod.com",
  phone: "+234 000 000 0000",
  location: "Nigeria",
  highlights: [
    "Beauty & Style Consultant",
    "Confidence • Godfidence • Purpose",
    "Corporate-ready & occasion looks"
  ]
};

export const LOOKS = [
  { id: "look-1", title: "Soft Luxury Look", img: "assets/img/look-1.jpg" },
  { id: "look-2", title: "Corporate Chic", img: "assets/img/look-2.jpg" },
  { id: "look-3", title: "Classic Evening", img: "assets/img/look-3.jpg" },
  { id: "look-4", title: "White Elegance", img: "assets/img/look-4.jpg" },
];

export const PRODUCTS = [
  {
    id: "p1",
    category: "Clothes",
    name: "Signature Bodycon Dress",
    price: 85,
    img: "assets/img/product-1.jpg",
    description: "Sculpted fit with a clean finish — made for confident entrances."
  },
  {
    id: "p2",
    category: "Clothes",
    name: "Soft Luxury Blazer",
    price: 120,
    img: "assets/img/product-2.jpg",
    description: "Minimalist tailoring for corporate days and elevated nights."
  },
  {
    id: "p3",
    category: "Hair",
    name: "Hair Growth Oil",
    price: 22,
    img: "assets/img/product-3.jpg",
    description: "Nourishing oil blend for scalp care and healthy shine."
  },
  {
    id: "p4",
    category: "Hair",
    name: "Silky Shine Shampoo",
    price: 18,
    img: "assets/img/product-4.jpg",
    description: "Gentle cleanse + softness — made for everyday glow."
  },
];

export const BLOG_POSTS = [
  {
    slug: "soft-luxury-styling-guide",
    title: "Soft Luxury Styling Guide: How to Look Expensive Without Trying Too Hard",
    date: "2026-01-10",
    cover: "assets/img/look-4.jpg",
    excerpt:
      "Soft luxury is about clean silhouettes, rich neutrals, and effortless confidence. Here’s how to build the look.",
    content: `
## What is soft luxury?
Soft luxury is a style mindset: polished pieces, quiet colors, and intentional details.

### 1) Choose a clean base
Go for neutrals: black, cream, chocolate, wine. Keep lines simple.

### 2) Add one “rich” texture
Satin, structured knit, wool blend, or a crisp blazer.

### 3) Hair and accessories matter
A sleek install, healthy curls, and a simple bag will transform the fit.

**Stylegod tip:** one statement item at a time — not everything at once.
`
  },
  {
    slug: "corporate-chic-essentials",
    title: "Corporate Chic Essentials: 7 Pieces You’ll Wear On Repeat",
    date: "2026-01-20",
    cover: "assets/img/look-2.jpg",
    excerpt:
      "From a blazer that means business to shoes that finish the look — these are the staples.",
    content: `
## Your 7 corporate chic essentials
- A great blazer
- Neutral trousers
- A fitted knit top
- Classic heels or loafers
- Structured bag
- Minimal jewelry
- A signature fragrance

**Confidence rule:** if it fits well, you look better instantly.
`
  }
];
