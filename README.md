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
- **PDF Handling**: PDF.js through react-pdf

## Contributing

Tack för att du vill bidra! Nedan följer våra riktlinjer för hur vi vill att bidrag görs via Git och pull requests.

### Branch-namn

- Använd korta, tydliga, gemener och bindestreck. Exempel:
  - `feature/add-search-by-code`
  - `fix/pdf-rendering`
  - `chore/update-deps`
  - `docs/readme-improvements`
  - `hotfix/login-error`

### Arbetsflöde (git)

1. Hämta senaste `main` och skapa din branch:

   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/short-description
   ```

2. Implementera din ändring i feature-branchen. Commit-meddelanden bör vara korta och beskrivande. Vi rekommenderar konventioner som "type(scope): message" (t.ex. `feat(search): add course-code autocomplete`).

3. Pusha din branch till remote:

   ```bash
   git push -u origin feature/short-description
   ```

4. Öppna en Pull Request mot `main` i GitHub. I PR-beskrivningen:
   - Beskriv vad som ändras och varför.
   - Referera eventuella issues.
   - Lägg till skärmdumpar eller GIF om det är UI-ändringar.
   - Lista eventuella migrationssteg eller konfigurationsändringar.

5. Be om minst en review (två för större ändringar). När PR:en är godkänd, squash-merge eller merge enligt repo-standard.

### Kodstil & commits

- Använd TypeScript-typer där det går.
- Följ befintliga kodkonventioner i projektet.
- Skriv tydliga commit-meddelanden; kort rad 1, eventuellt en längre beskrivning efter en tom rad.

### Licens och upphovsrätt

Genom att bidra accepterar du att dina ändringar inkluderas i projektet under samma licens som repositoryt (se `LICENSE` om tillämpligt). Om du är osäker, fråga en repo-administratör.

## Kontakt

Om du har frågor om hur man bidrar, öppna ett issue eller kontakta repo-ägaren.
