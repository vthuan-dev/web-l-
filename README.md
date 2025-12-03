# Wizus Food Website

A modern, responsive React website for Wizus Food - a Vietnamese company specializing in seafood and agricultural products.

## 🌟 Features

- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **Multilingual Support**: Vietnamese and English language options
- **Product Catalog**: Browse products by categories and subcategories
- **Interactive Maps**: Company location display with Leaflet maps
- **SEO Optimized**: Dynamic meta tags and structured navigation
- **Modern UI**: Clean design with TailwindCSS

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- Modern web browser

### Installation

#### Clone the repository

```bash
git clone <repository-url>
cd wizus
```

#### Install dependencies

```bash
npm install
```

##### Start the development server

```bash
npm start
```

#### Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```bash
wizus/
├── public/                 # Static assets
│   ├── index.html         # Main HTML template
│   └── data/              # JSON data files
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/            # Main application pages
│   ├── utils/            # Utility functions
│   └── i18n/             # Translation files
├── package.json          # Dependencies and scripts
└── tailwind.config.js    # TailwindCSS configuration
```

## 🛠️ Built With

- **React 18.2.0** - Frontend framework
- **React Router DOM 6.8.0** - Client-side routing
- **TailwindCSS 3.2.7** - Utility-first CSS framework
- **Leaflet 1.9.4** - Interactive maps
- **PostCSS** - CSS processing

## 📱 Responsive Design

The website is built with a mobile-first approach and includes:

- **Mobile** (< 768px): Single column layouts, touch-friendly interface
- **Tablet** (768px - 1024px): Two-column layouts, medium spacing
- **Desktop** (> 1024px): Multi-column layouts, full navigation

## 🌍 Internationalization

Supports Vietnamese (default) and English languages:

- Language toggle in header
- Complete UI translation
- Persistent language preferences
- Structured translation keys

## 📄 Pages

### Homepage

- Hero section with company introduction
- Featured product categories
- Action buttons for contact and product search

### Products

- Category-based product browsing
- Subcategory filtering
- Responsive product grid

### Product Detail

- Individual product information
- High-quality product images
- Contact information for ordering

### About Us

- Company history and mission
- Product overview
- Quality commitments

### Contact

- Company contact information
- Interactive location map
- Social media links

## 🔧 Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Create production build
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Environment Setup

1. Install dependencies: `npm install`
2. Start development: `npm start`
3. Build for production: `npm run build`

### Adding New Content

#### Adding Products

Edit `public/data/products.json`:

```json
{
  "id": "unique-id",
  "name": "Product Name",
  "description": "Product description",
  "category": "category-id",
  "subcategory": "subcategory-id",
  "image": "/images/product.jpg",
  "price": 100000,
  "unit": "kg"
}
```

#### Adding Categories

Edit `public/data/categories.json`:

```json
{
  "id": "category-id",
  "name": "Category Name",
  "description": "Category description",
  "image": "/images/category.jpg",
  "subcategories": ["sub1", "sub2"]
}
```

#### Adding Translations

Edit files in `src/i18n/`:

- `vi.json` - Vietnamese translations
- `en.json` - English translations

## 🎨 Customization

### Colors

Primary brand colors are defined in `tailwind.config.js`:

```js
colors: {
  primary: '#0193E9',
  'primary-dark': '#0170B8',
}
```

### Typography

Responsive text sizes using TailwindCSS utilities:

- Mobile: `text-sm` to `text-lg`
- Tablet: `text-base` to `text-xl`
- Desktop: `text-lg` to `text-4xl`

### Layout

Grid layouts automatically adapt:

- Mobile: 1 column
- Tablet: 2-3 columns
- Desktop: 3-4 columns

## 📦 Production Build

### Create production build

```bash
npm run build
```

### Deploy the `build/` folder to your web server

#### Deployment Options

- **Static Hosting**: Netlify, Vercel, GitHub Pages
- **Web Servers**: Apache, Nginx
- **CDN**: AWS CloudFront, Cloudflare

## 🔍 SEO Features

- Dynamic page titles and descriptions
- Structured breadcrumb navigation
- Semantic HTML markup
- Mobile-friendly design
- Fast loading times

## 🗺️ Maps Integration

Interactive maps powered by Leaflet:

- Company location markers
- Responsive map sizing
- Custom popup information
- Multiple location support

## 📞 Support

For technical support or questions:

- Email: <info@wizusfood.com>
- Phone: +84 987055245

## 📄 License

This project is proprietary software owned by Wizus Food.

## 🤝 Contributing

Internal development only. For feature requests or bug reports, please contact the development team.

---

**Wizus Food** - Chuyên cung cấp các mặt hàng cá tra, cá nước ngọt, chả cá đông lạnh các loại và nông sản chất lượng cao.
