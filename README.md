<div align="center">
  <img src="public/liutentorroundedlight.svg" alt="LiU Tentor Logo" width="120" height="120">
  
  # LiU Tentor
  
  A web application for browsing and viewing past exams from Linköping University.
</div>

## Features

- Browse and search exams by course code or course name
- PDF viewer with integrated facit (answer key) support
- Exam mode for timed practice sessions with statistics
- Mobile-responsive design for studying on any device
- Dark/light theme support
- Multiple language support (Swedish/English)
- Recent activity tracking
- Course-specific exam filtering

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:5173 in your browser

## Backend

The backend API is available at: https://github.com/jacobslunga/fast-api-liu-tentor

## Tech Stack

- **Frontend**: React + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Database**: Supabase
- **PDF Handling**: PDF.js throgh react-pdf
