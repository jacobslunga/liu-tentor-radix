# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-11

### 🎉 Initial Release

This marks the first stable release of LiU Tentor Radix!

### Added

- **Unified Search System**: Complete rewrite of search functionality
  - CourseSearchDropdown with main-input variant
  - Keyboard navigation with arrow keys, enter, and escape
  - Unified recent searches across Header, ExamHeader, and MainInput
  - LocalStorage-based search history
- **Enhanced UI/UX**:
  - Full keyboard accessibility
  - Smooth animations and visual feedback
  - Responsive design for all screen sizes
  - Professional green color scheme (#29a370)
- **PDF Integration**: Advanced PDF viewing and handling
- **Bilingual Support**: Full Swedish/English internationalization
- **Grade Statistics**: Pass rates and grade distribution data
- **Modern Icon System**: Replaced SVGs with Lucide React icons
- **Comprehensive Documentation**: README, LICENSE, and setup guides

### Fixed

- **Code Quality**: Removed console.logs, unused imports, and variables
- **TypeScript**: Proper typing throughout the application
- **Performance**: Optimized bundle size and loading times
- **Browser Compatibility**: Cross-browser testing and fixes

### Technical

- **React 18** with TypeScript and Vite
- **Supabase** for backend and real-time data
- **Tailwind CSS** with custom design system
- **Radix UI** components for accessibility
- **React Query** for efficient data fetching
- **React Router** for navigation

---

## Version History Format

Going forward, versions will follow this format:

### [Unreleased]

- List of upcoming changes

### [X.Y.Z] - YYYY-MM-DD

#### Added

- New features

#### Changed

- Changes in existing functionality

#### Deprecated

- Soon-to-be removed features

#### Removed

- Now removed features

#### Fixed

- Bug fixes

#### Security

- Vulnerability fixes
