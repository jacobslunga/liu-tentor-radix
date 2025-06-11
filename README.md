# 🎓 LiU Tentor - Exam Archive Platform

<div align="center">
  <img src="public/liutentorroundlight.svg" alt="LiU Tentor Logo" width="120" height="120">
  
  <p align="center">
    <strong>A comprehensive exam archive platform for Linköping University students</strong><br>
    Built by students, for students 📚
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/React-18.3.1-blue?logo=react" alt="React">
    <img src="https://img.shields.io/badge/TypeScript-5.7.2-blue?logo=typescript" alt="TypeScript">
    <img src="https://img.shields.io/badge/Vite-6.2.0-646CFF?logo=vite" alt="Vite">
    <img src="https://img.shields.io/badge/TailwindCSS-3.4.17-38B2AC?logo=tailwind-css" alt="Tailwind">
    <img src="https://img.shields.io/badge/Supabase-2.49.1-3ECF8E?logo=supabase" alt="Supabase">
  </p>
</div>

## 🌟 About

LiU Tentor is a modern, student-driven platform that provides easy access to historical exams and solutions from Linköping University. Our mission is to help students prepare more effectively for their exams by centralizing study materials in one accessible location.

### ✨ Key Features

- **📋 Comprehensive Exam Archive** - Browse thousands of exams from all faculties
- **🔍 Smart Search** - Find exams by course code with intelligent filtering
- **📄 PDF Viewer** - Built-in PDF viewer with zoom, rotation, and facit overlay
- **📊 Grade Statistics** - View pass rates and grade distributions for exams
- **🌙 Dark/Light Mode** - Modern UI with theme switching
- **📱 Mobile Responsive** - Optimized for all devices
- **🔄 Recent Activities** - Track your exam viewing history
- **⬆️ Upload System** - Community-driven content with moderated uploads
- **🌐 Bilingual** - Full Swedish and English language support

## 🏗️ Tech Stack

### Frontend

- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Full type safety and better DX
- **Vite** - Lightning-fast dev server and build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible, unstyled UI components
- **Framer Motion** - Smooth animations and transitions

### Backend & Data

- **Supabase** - PostgreSQL database with real-time subscriptions
- **Tanstack Query** - Server state management and caching
- **React PDF** - PDF rendering and manipulation
- **Axios** - HTTP client for API calls

### UI/UX

- **Lucide React** - Beautiful, customizable icons
- **Recharts** - Data visualization for statistics
- **Sonner** - Toast notifications
- **Next Themes** - Theme switching functionality

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn package manager
- Supabase account (for backend)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/jacobslunga/liu-tentor-radix.git
   cd liu-tentor-radix
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env
   ```

   Fill in your Supabase credentials:

   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (shadcn/ui)
│   ├── PDF/            # PDF viewer and related components
│   └── data-table/     # Data table components
├── pages/              # Page components and routes
├── context/            # React context providers
├── hooks/              # Custom React hooks
├── layouts/            # Layout components
├── lib/                # Utility libraries and configs
├── util/               # Helper functions and translations
└── assets/             # Static assets

public/
├── fonts/              # Custom fonts (Playfair Display)
├── courseCodes.json    # Course code data
├── liutentorround*.svg # Logo files
├── favicon*.png        # Favicon variants
└── *.svg               # Additional icon variants
```

## 🎨 Design System

### Typography

- **Primary Font**: System fonts (Inter/San Francisco) for readability
- **Logo Font**: Playfair Display (elegant, academic feel)
- **Monospace**: For course codes and technical text

### Color Scheme

- **Primary**: Green (#29a370 / HSL 155 60% 40%) - Professional and trustworthy
- **Background**: Light (100% white) / Dark (12% gray) - Clean and readable
- **Borders**: Subtle, semi-transparent with 50% opacity
- **Text**: High contrast ratios for accessibility

### Components

Built with Radix UI primitives and custom styling:

- Form components with validation
- Data tables with sorting and filtering
- Modal dialogs and overlays
- Responsive navigation
- Toast notifications

## 🔧 Configuration

### Tailwind CSS

Custom configuration with:

- Extended green color palette with HSL values
- Custom animations (fade-in, bounce-subtle, scale-up)
- Custom border radius system (more rounded design)
- Responsive breakpoints for mobile-first design

### TypeScript

Strict TypeScript configuration with:

- Path mapping for cleaner imports
- Type checking in build process
- Proper interfaces for all data structures

## 📊 Database Schema

The application uses Supabase with these main tables:

- `tentor` - Exam documents and metadata
- `uploaded_documents` - User-uploaded content
- `course_stats` - Grade statistics and analytics

## 🤝 Contributing

We welcome contributions from the LiU student community!

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests if needed**
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Content Contributions

- Upload exams and solutions through the platform
- Report broken links or missing content
- Suggest UI/UX improvements

## 📱 Mobile Support

The platform is fully responsive and optimized for:

- **Mobile phones** - Touch-friendly interface with swipe gestures
- **Tablets** - Optimized PDF viewing experience
- **Desktop** - Full-featured interface with keyboard shortcuts

## 🌐 Internationalization

Full bilingual support:

- **Swedish** - Primary language for LiU students
- **English** - For international students and accessibility

## 🔒 Privacy & Security

- **GDPR Compliant** - Respects user privacy rights
- **No Personal Data** - Only public exam documents
- **Secure Authentication** - Through Supabase Auth
- **Content Moderation** - All uploads are reviewed

## 📈 Performance

- **Fast Loading** - Optimized bundle sizes with Vite
- **Caching** - Intelligent caching with Tanstack Query
- **PDF Optimization** - Efficient PDF rendering and storage
- **CDN Delivery** - Fast global content delivery

## 🛠️ Development Tools

- **ESLint** - Code linting and style enforcement
- **Prettier** - Code formatting (if configured)
- **TypeScript** - Type checking and IntelliSense
- **Vite DevTools** - Development debugging

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Linköping University** - For the educational foundation
- **Student Community** - For contributions and feedback
- **Open Source Libraries** - That make this project possible

---

<div align="center">
  <p><strong>Made with ❤️ by LiU students, for LiU students</strong></p>
  <p>
    <a href="mailto:info@liutentor.se">📧 Contact</a> • 
    <a href="https://liutentor.se">🌐 Website</a> • 
    <a href="#contributing">🤝 Contribute</a>
  </p>
</div>
