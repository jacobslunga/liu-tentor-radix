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
- **PDF Handling**: Native browser PDF rendering via iframes

## Contributing

Thanks for wanting to contribute! Below are our guidelines for how we want contributions to be made via Git and pull requests.

### Branch Naming

- Use short, clear, lowercase names with hyphens. Examples:
  - `feature/add-search-by-code`
  - `fix/pdf-rendering`
  - `chore/update-deps`
  - `docs/readme-improvements`
  - `hotfix/login-error`

### Git Workflow

1. Fetch the latest `main` and create your branch:

   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/short-description
   ```

2. Implement your changes in the feature branch. Commit messages should be short and descriptive. We recommend conventions like "type(scope): message" (e.g., `feat(search): add course-code autocomplete`).

3. Push your branch to remote:

   ```bash
   git push -u origin feature/short-description
   ```

4. Open a Pull Request against `main` on GitHub. In the PR description:
   - Describe what is being changed and why.
   - Reference any related issues.
   - Add screenshots or GIFs for UI changes.
   - List any migration steps or configuration changes.

5. Request at least one review (two for larger changes). Once the PR is approved, squash-merge or merge according to the repo standard.

### Code Style & Commits

- Use TypeScript types wherever possible.
- Follow existing code conventions in the project.
- Write clear commit messages; short first line, optionally a longer description after a blank line.

### License and Copyright

By contributing, you agree that your changes will be included in the project under the same license as the repository (see `LICENSE` if applicable). If you're unsure, ask a repo administrator.

## Contact

If you have questions about how to contribute, open an issue or contact the repo owner.
