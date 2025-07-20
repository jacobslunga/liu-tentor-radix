# React + TypeScript + Vite

This te# LiU Tentor 🎓

A modern exam archive web application for Linköping University (LiU) students, making it easy to find and access previous exams and solutions.

> **Finally, you can find all your exams from Linköping University in one place!**

## Features ✨

- 🔍 **Search Exams**: Find exams by course code with intelligent search suggestions
- 📄 **PDF Viewer**: Built-in PDF viewer with mobile-friendly controls
- 📱 **Mobile Responsive**: Optimized for both desktop and mobile devices
- 🌙 **Dark/Light Mode**: Toggle between dark and light themes
- 🌐 **Multilingual**: Available in Swedish and English
- 📊 **Statistics**: View exam statistics and course information
- 💾 **Offline Cache**: PDF caching for improved performance
- 🎯 **Course Code Auto-complete**: Smart suggestions for LiU course codes
- 📈 **Recent Activity**: Track recently viewed exams
- 🔄 **Facit Integration**: Solutions (facit) linked to corresponding exams

## Tech Stack 🛠️

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Routing**: React Router DOM v7
- **State Management**: React Query (TanStack Query)
- **PDF Rendering**: react-pdf
- **Database**: Supabase
- **HTTP Client**: Axios
- **Animation**: Framer Motion
- **Forms**: React Hook Form with Zod validation
- **Themes**: next-themes

## Getting Started 🚀

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/jacobslunga/liu-tentor-radix.git
cd liu-tentor-radix
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:

```bash
pnpm dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Scripts 📝

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

## Project Structure 📁

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Radix UI components
│   ├── PDF/            # PDF viewer components
│   ├── data-table/     # Table components for exam listings
│   └── auth/           # Authentication components
├── context/            # React contexts (Theme, Language, Auth)
├── hooks/              # Custom React hooks
├── layouts/            # Layout components
├── lib/                # Utility libraries (API, fetchers, utils)
├── pages/              # Page components
├── supabase/           # Supabase client configuration
└── util/               # Helper functions and translations
```

## Key Features Implementation 🔧

### PDF Viewer

- Custom PDF viewer with zoom controls
- Mobile-optimized navigation
- Facit (solutions) integration
- Download functionality

### Search System

- Course code validation against LiU's official course codes
- Fuzzy search with closest matches
- Popular searches tracking
- Recent activity storage

### Responsive Design

- Mobile-first approach
- Adaptive layouts for different screen sizes
- Touch-friendly controls for mobile PDF viewing

### Internationalization

- Swedish and English language support
- Dynamic content translation
- Locale-aware formatting

## Contributing 🤝

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Deployment 🚀

This application is optimized for deployment on platforms like:

- Vercel
- Netlify
- GitHub Pages (with proper routing configuration)

### Build for Production

```bash
pnpm build
```

The `dist` folder will contain the production-ready files.

## API Integration 📡

The application integrates with:

- **Supabase**: Database and authentication
- **LiU Tentor API**: Exam data and course information (https://liutentor.lukasabbe.com/api/)

## Browser Support 🌐

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License 📄

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments 🙏

- Linköping University for course data
- The React and TypeScript communities
- Radix UI for excellent component primitives
- All contributors who help improve this project

## Contact 📬

For questions, suggestions, or issues, please:

- Open an issue on GitHub
- Use the feedback form in the application
- Contact the development team

---

Made with ❤️ for LiU students by LiU students minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```
