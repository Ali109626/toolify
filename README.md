# Toolify — Fast, Free & Private Online Tools Platform

![Toolify Banner](./Toolify%20Dark%20Tech%20Brand%20Board.png)

Toolify is a production-quality, free all-in-one digital utility suite designed for students, office workers, developers, content creators, and everyday internet users worldwide. 

**Zero server uploads. 100% Client-Side Privacy.** Every file compression, PDF merge, image crop, code formatting, and calculation happens strictly within your browser's local memory using WebAssembly, Canvas 2D GPU acceleration, and JavaScript APIs. Your confidential files never touch an external server.

---

## 🚀 Key Features & Highlights

- **100% Client-Side Processing**: No servers, no tracking, no file storage, zero data retention.
- **18 Functional Utilities**: Ready-to-use tools across Images, PDFs, Text, Developer Tools, and Calculators.
- **Integrated Engineering Blog**: 8 in-depth, practical tutorials and guides with actionable step-by-step instructions, practical limitations, and direct tool CTAs.
- **Universal Responsiveness**: Fully tested and optimized from compact mobile phones (320px width) up to 1080p desktop monitors.
- **Dark Cinematic Aesthetic**: Crafted with rich dark surfaces (`#0F172A`, `#1E293B`), vivid blue/cyan accents (`#3B82F6`, `#06B6D4`), and accessible typography.
- **Instant Global Search**: Modal command palette (`⌘K` / `Ctrl+K`) for lightning-fast tool discovery.
- **Technical SEO Optimized**: Clean metadata, Open Graph tags, canonical URLs, Article JSON-LD structured data, XML sitemap, and robots.txt.

---

## 🛠️ Complete Utilities Suite

### 1. Image Tools (`/category/image`)
- **Image Compressor** (`/tools/image-compressor`): Adjustable quality slider with real-time file size comparison and download controls.
- **Image Resizer** (`/tools/image-resizer`): Custom pixel dimensions, aspect ratio lock, and quick social preset scaling.
- **Image Converter** (`/tools/image-converter`): Fast client-side conversion between WebP, PNG, and JPEG.
- **Image Cropper** (`/tools/image-cropper`): Interactive touch- and mouse-friendly cropping canvas with 1:1, 16:9, and 4:3 aspect ratio presets.

### 2. PDF Tools (`/category/pdf`)
- **PDF Merger** (`/tools/pdf-merger`): Combine multiple PDF documents into an organized file with drag reordering.
- **PDF Splitter** (`/tools/pdf-split`): Extract specific page ranges or burst into individual chapter pages with ZIP packaging.
- **PDF Rotator** (`/tools/pdf-rotate`): Rotate pages by 90° clockwise, 90° counter-clockwise, or 180° with live previews.
- **PDF Page Extractor** (`/tools/pdf-extract`): Extract selected page numbers into a clean, standalone PDF.

### 3. Text & Writing Utilities (`/category/text`)
- **Word & Character Counter** (`/tools/word-counter`): Live word counts, character counts (with/without spaces), reading speeds, and speaking time estimates.
- **Case Converter** (`/tools/case-converter`): Convert text between lowercase, UPPERCASE, Title Case, camelCase, snake_case, and kebab-case.
- **Line Cleaner** (`/tools/line-cleaner`): Strip duplicate lines, remove empty whitespace lines, sort alphabetically, and trim edges.
- **Text Diff Viewer** (`/tools/text-diff`): Visual side-by-side and unified diff highlighting additions and deletions.

### 4. Developer Tools (`/category/developer`)
- **JSON Formatter & Validator** (`/tools/json-formatter`): Validate syntax errors, beautify with 2/4 space indentation, and minify payloads for production.
- **Base64 Encoder / Decoder** (`/tools/base64-converter`): Convert raw strings to Base64 and decode encoded payloads with UTF-8 safety.
- **URL Encoder / Decoder** (`/tools/url-encoder`): Sanitize query strings and extract URL query parameters into an organized table.

### 5. Smart Calculators (`/category/calculators`)
- **Percentage Calculator** (`/tools/percentage-calculator`): Calculate percentage of values, percentage increases/decreases, and fractional ratios.
- **Discount Calculator** (`/tools/discount-calculator`): Compute promotional discounts, coupon deductions, and sales tax.
- **Age Calculator** (`/tools/age-calculator`): Calculate precise chronological age in years, months, days, and countdown to next birthday.

---

## 💻 Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 8
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Document Processing**: `pdf-lib` (pure client-side PDF binary manipulation)
- **Archive Generation**: `jszip`
- **Text Diffing**: `diff`
- **Testing**: Vitest + Testing Library + JSDOM
- **Linter**: Oxlint

---

## 🏃 Local Development

### Prerequisites
- Node.js (version 18 or newer recommended)
- npm or pnpm or yarn

### Setup & Run
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/toolify.git

# Navigate into project directory
cd toolify

# Install dependencies
npm install

# Start local development server
npm run dev
```

The application will launch at `http://localhost:5173/`.

### Run Tests & Build
```bash
# Run unit and component test suite
npm test

# Run code linter
npm run lint

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🌐 Deploy to Vercel

Toolify includes a pre-configured [`vercel.json`](./vercel.json) that automatically handles Single Page Application (SPA) routing, cache-control headers, and security policies.

### Method 1: Deploy with Vercel Web Dashboard (Recommended)

1. Push your code to your GitHub repository.
2. Log into [vercel.com](https://vercel.com) and click **"Add New..." → "Project"**.
3. Import your `toolify` repository from GitHub.
4. Verify project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. (Optional) In **Environment Variables**, add:
   - Key: `VITE_SITE_URL`
   - Value: `https://your-custom-domain.com` (or your assigned Vercel URL)
6. Click **Deploy**. Your site will be live worldwide in less than a minute!

### Method 2: Deploy with Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Deploy preview
vercel

# Deploy to production
vercel --prod
```

---

## 📄 License & Attribution

Handcrafted with speed, precision, and privacy in mind. Distributed under the MIT License.
