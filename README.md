# LiU Tentor

A modern exam archive web application for Linköping University students. Browse, search, and access previous exams and solutions with an intuitive interface and advanced study features.

## Quick Start

### Prerequisites

- Node.js 18+
- npm or any other package manager

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/jacobslunga/liu-tentor-radix.git
   cd liu-tentor-radix
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory:

   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server:**

   ```bash
   npm dev
   ```

The application will be available at `http://localhost:5173`

## Available Scripts

| Command       | Description              |
| ------------- | ------------------------ |
| `npm dev`     | Start development server |
| `npm build`   | Build for production     |
| `npm preview` | Preview production build |
| `npm lint`    | Run ESLint               |

## Tech Stack

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

## Features

- Intelligent exam search with course code suggestions
- Built-in PDF viewer with mobile-friendly controls
- Lock-in mode for focused exam sessions with timer
- Exam history tracking and statistics
- Mobile responsive design
- Dark and light theme support
- Swedish and English language support
- Offline PDF caching for improved performance
- Solutions (facit) integration with exams
- Recent activity tracking

## Project Structure

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

## Development

### Testing

```bash
npm test
```

### Build for Production

```bash
npm build
```

The `dist` folder will contain the production-ready files.

## Deployment

This application is optimized for deployment on:

- Vercel
- Netlify
- GitHub Pages (with proper routing configuration)

## API Integration

The application integrates with:

- **Supabase**: Database and authentication
- **LiU Tentor API**: Exam data and course information (https://liutentor.lukasabbe.com/api/)

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Related Projects

- [LiU Tentor Backend](https://github.com/jacobslunga/liu-tentoe-backend) - Django REST API backend

## License

This project is open source and available under the MIT License.
