export type Language = "sv" | "en";

// Grouped translation interfaces for better organization
interface CommonTranslations {
  // Navigation & Layout
  homeLink: string;
  goBack: string;
  goHome: string;
  backToHome: string;
  settings: string;
  contactUs: string;
  quickLinks: string;

  // Loading & States
  loadingMessage: string;
  loadingPDF: string;
  noResults: string;
  noResultsFound: string;
  notFound: string;
  lostMessage: string;

  // Actions
  submitButton: string;
  searchButton: string;
  clearSearch: string;
  reset: string;
  tryAgainButton: string;
  acceptCookie: string;
  rejectCookie: string;
  closeDialog: string;
}

interface HomePageTranslations {
  homeTitle: string;
  homeDescription: string;
  searchPlaceholder: string;
  courseCodePlaceholder: string;
  popularSearches: string;
  popularSearchesTitle: string;
  popularSearchesDescription: string;
  recentSearches: string;
  noPopularSearchesMessage: string;
  globalSearch: string;
  allCourses: string;
  courses: string;
  suggestions: string;
  didYouMean: string;
}

interface ExamTranslations {
  exam: string;
  exams: string;
  examName: string;
  examDone: string;
  examOnly: string;
  examAndFacit: string;
  facit: string;
  facitAvailable: string;
  facitNotAvailable: string;
  showFacit: string;
  hideFacit: string;
  chooseFacit: string;
  noFacitAvailable: string;
  noFacitAvailableDescription: string;
  chooseFacitDescription: string;
  mouseOverDescription: string;
  withFacit: string;
  withSolution: string;
  hasFacit: string;
  toggleExam: string;
  toggleShowFacit: string;
}

interface PDFControlTranslations {
  downloadExam: string;
  downloadFacit: string;
  showExamToolbar: string;
  hideExamToolbar: string;
  showFacitToolbar: string;
  hideFacitToolbar: string;
  toggleExamToolbar: string;
  toggleFacitToolbar: string;
  moveFacitLeft: string;
  moveFacitRight: string;
  toggleAIChat: string;
  next: string;
  previous: string;
  nextSide: string;
  previousSide: string;
}

interface CourseTranslations {
  courseCode: string;
  searchCoursePlaceholder: string;
  searchResultsForCourseCode: string;
  examsAvailable: string;
  noExamsFound: string;
  courseCodeNotFound: string;
  courseCodeNotFoundMessage: string;
  noExamsFoundMessage: string;
  createdAt: string;
}

interface UserProgressTranslations {
  completed: string;
  notCompleted: string;
  markAsCompleted: string;
  markedAsCompleted: string;
  unMarkedAsCompleted: string;
  remainingExamsTitle: string;
  remainingExamsMessage: string;
  allExamsCompletedTitle: string;
  allExamsCompletedMessage: string;
  congratulationsMessage: string;
  goodJob: string;
  continueWhereYouLeftOff: string;
  showContinueWhereYouLeftOff: string;
  hideContinueWhereYouLeftOff: string;
  recentActivityDescription: string;
  noRecentActivity: string;
}

interface FeedbackTranslations {
  feedbackLink: string;
  feedbackTitle: string;
  feedbackDescription: string;
  feedbackForm: string;
  feedbackSuccessTitle: string;
  feedbackSuccessMessage: string;
  feedbackErrorTitle: string;
  feedbackErrorMessage: string;
  nameLegend: string;
  namePlaceholder: string;
  nameDescription: string;
  messageLegend: string;
  messagePlaceholder: string;
  messageDescription: string;
  partOfWebsiteLegend: string;
  partOfWebsitePlaceholder: string;
  emailPlaceholder: string;
  exampleEmail: string;
  requiredField: string;
  requiredFieldMessage: string;
  weNeedYourHelp: string;
  makeLiuTentorBetter: string;
}

interface UploadTranslations {
  uploadTitle: string;
  uploadButton: string;
  uploadDescription: string;
  uploadSuccess: string;
  uploadError: string;
  uploadExamsOrFacit: string;
  dragAndDrop: string;
  moreExamsTitle: string;
  moreExamsBtn: string;
  uploadGuidelinesTitle: string;
  uploadGuidelineCourseCode: string;
  uploadGuidelineNaming: string;
  uploadGuidelineDate: string;
  uploadGuidelineDuplicateCheck: string;
  uploadGuidelineQuality: string;
}

interface UITranslations {
  textSize: string;
  selectTextSize: string;
  small: string;
  standard: string;
  large: string;
  font: string;
  fontDescription: string;
  theme: string;
  themeDescription: string;
  settingsDescription: string;
  settingsTheme: string;
  settingsLanguage: string;
  settingsKeyboardShortcuts: string;
  addTab: string;
  removeTab: string;
  showPagination: string;
  hidePagination: string;
  togglePagination: string;
  scrollHint: string;
  tapToSeeMore: string;
}

interface KeyboardTranslations {
  keyboardShortcuts: string;
  usefulShortcuts: string;
  keyboardAction: string;
}

interface TimeTranslations {
  justNow: string;
  minutesAgo: string;
  hoursAgo: string;
  daysAgo: string;
  new: string;
  minShort: string;
  hShort: string;
  dShort: string;
}

interface CookieTranslations {
  cookieBannerText: string;
  cookieBannerDescription: string;
  cookieConsentRequired: string;
}

interface PrivacyTranslations {
  privacyPolicyTitle: string;
  privacyPolicyLastUpdated: string;
  privacyPolicyIntro: string;
  privacyPolicySection1Title: string;
  privacyPolicySection1Content: string;
  privacyPolicySection1Item1: string;
  privacyPolicySection1Item2: string;
  privacyPolicySection1Item3: string;
  privacyPolicySection1Item4: string;
  privacyPolicySection2Title: string;
  privacyPolicySection2Content: string;
  privacyPolicySection3Title: string;
  privacyPolicySection3Content: string;
  privacyPolicySection4Title: string;
  privacyPolicySection4Content: string;
  privacyPolicySection5Title: string;
  privacyPolicySection5Content: string;
  privacyPolicySection5Item1: string;
  privacyPolicySection5Item2: string;
  privacyPolicySection5Item3: string;
  privacyPolicySection6Title: string;
  privacyPolicySection6Content: string;
  privacyPolicySection7Title: string;
  privacyPolicySection7Content: string;
  privacyPolicySection7Item1: string;
  privacyPolicySection7Item2: string;
  privacyPolicySection7Item3: string;
  privacyPolicySection8Title: string;
  privacyPolicySection8Content: string;
  privacyPolicyContactEmail: string;
  privacyPolicyContactText: string;
  privacyPolicyGDPRTitle: string;
  privacyPolicyGDPRContent: string;
  privacyPolicyGDPRItem1: string;
  privacyPolicyGDPRItem2: string;
  privacyPolicyGDPRItem3: string;
}

interface AuthTranslations {
  login: string;
  create_account: string;
  welcome_back: string;
  login_with_liu_mail: string;
  register_with_liu_mail: string;
}

interface StatisticsTranslations {
  statistics: string;
  passedCount: string;
  averagePassRate: string;
  examStatisticsDescription: string;
}

interface MiscTranslations {
  allRightsReserved: string;
  madeBy: string;
  contactLink: string;
  contactEmail: string;
  askAI: string;
  aiTitle: string;
  aiDescription: string;
  aiChatTitle: string;
  aiChatEmptyTitle: string;
  aiChatEmptyDescription: string;
  aiChatPlaceholder: string;
  aiChatPoweredBy: string;
  aiChatSend: string;
  aiChatThinking: string;
  // AI Introduction Dialog
  aiIntroTitle: string;
  aiIntroSubtitle: string;
  aiIntroDescription: string;
  aiIntroFeature1Title: string;
  aiIntroFeature1Description: string;
  aiIntroFeature2Title: string;
  aiIntroFeature2Description: string;
  aiIntroFeature3Title: string;
  aiIntroFeature3Description: string;
  aiIntroGetStarted: string;
  aiIntroSkip: string;
  // Page specific
  faq: string;
  aboutUs: string;
  feedback: string;
  privacyPolicy: string;
  loadingExams: string;
  uploadExams: string;
  noExamsFoundShort: string;
  helpOtherStudentsMessage: string;
  uploadMore: string;
  examCount: string;
  solutionCount: string;
  learnMore: string;
}

interface SponsorTranslations {
  sponsorsWeWorkWith: string;
  ourSponsors: string;
}

// Main translations interface combining all sections
export interface Translations
  extends
    CommonTranslations,
    HomePageTranslations,
    ExamTranslations,
    PDFControlTranslations,
    CourseTranslations,
    UserProgressTranslations,
    FeedbackTranslations,
    UploadTranslations,
    UITranslations,
    KeyboardTranslations,
    TimeTranslations,
    CookieTranslations,
    PrivacyTranslations,
    AuthTranslations,
    StatisticsTranslations,
    SponsorTranslations,
    MiscTranslations {}

const translations: Record<Language, Translations> = {
  sv: {
    // Common
    homeLink: "Hem",
    goBack: "Gå tillbaka",
    goHome: "Gå hem",
    backToHome: "Tillbaka till startsidan",
    settings: "Inställningar",
    contactUs: "Kontakta oss",
    quickLinks: "Snabblänkar",
    loadingMessage: "Laddar...",
    loadingPDF: "Laddar PDF...",
    noResults: "Inga resultat",
    noResultsFound: "Inga resultat hittades",
    notFound: "Inga tentor hittades för kurskod",
    lostMessage: "Det verkar som att du kommit till den akademiska djungeln.",
    submitButton: "Skicka",
    searchButton: "Sök tentor",
    clearSearch: "Rensa",
    reset: "Återställ",
    tryAgainButton: "Försök igen",
    acceptCookie: "Acceptera",
    rejectCookie: "Avvisa",
    closeDialog: "Stäng",

    // Home Page
    homeTitle: "LiU Tentor",
    homeDescription:
      "Äntligen kan du hitta tentor från Linköpings universitet på ett och samma ställe... Främst TekFak",
    searchPlaceholder: "Sök efter",
    courseCodePlaceholder: "Kurskod",
    popularSearches: "Populära sökningar",
    popularSearchesTitle: "Senaste sökningar",
    popularSearchesDescription:
      "Här är några av dina senaste sökta kurser just nu.",
    recentSearches: "Senaste sökningarna",
    noPopularSearchesMessage:
      "Börja söka för att se dina mest besökta kurser här",
    globalSearch: "Global sökning",
    allCourses: "Kurser",
    courses: "Kurser",
    suggestions: "Förslag",
    didYouMean: "Menade du",

    // Exams
    exam: "Tenta",
    exams: "Tentor",
    examName: "Namn",
    examDone: "Gjord",
    examOnly: "Facit dolt",
    examAndFacit: "Facit synligt",
    facit: "Facit",
    facitAvailable: "Facit tillgängligt",
    facitNotAvailable: "Facit inte tillgängligt",
    showFacit: "Visa facit",
    hideFacit: "Dölj facit",
    chooseFacit: "Välj facit",
    noFacitAvailable: "Inget facit tillgängligt",
    noFacitAvailableDescription:
      "Vissa tentor har inget facit. Du kan ladda upp ett facit om du har ett.",
    chooseFacitDescription:
      "Vissa tentor har inget facit, men du kan välja ett facit från listan nedan om det finns tillgängligt. Det kan också vara så att facit finns lite längre ner i tenta dokumentet.",
    mouseOverDescription: "Håll musen över för att se facit",
    withFacit: "Med facit",
    withSolution: "med facit",
    hasFacit: "Har facit",
    toggleExam: "Toggla facit (facit bara mode)",
    toggleShowFacit: "Toggla facit visning",

    // PDF Controls
    downloadExam: "Ladda ner tenta",
    downloadFacit: "Ladda ner facit",
    showExamToolbar: "Visa tenta verktygsfält",
    hideExamToolbar: "Dölj tenta verktygsfält",
    showFacitToolbar: "Visa facit verktygsfält",
    hideFacitToolbar: "Dölj facit verktygsfält",
    toggleExamToolbar: "Toggla tenta verktygsfält",
    toggleFacitToolbar: "Toggla facit verktygsfält",
    moveFacitLeft: "Flytta facit till vänster",
    moveFacitRight: "Flytta facit till höger",
    toggleAIChat: "Toggla AI-chatt",
    next: "Nästa",
    previous: "Föregående",
    nextSide: "Nästa sida",
    previousSide: "Föregående sida",

    // Course
    courseCode: "Kurskod",
    searchCoursePlaceholder: "Sök efter kurskod",
    searchResultsForCourseCode: "Sökresultat",
    examsAvailable: "Tentor tillgängliga för",
    noExamsFound: "Inga tentor hittades för kurskoden: ",
    courseCodeNotFound: "Kurskoden hittades inte",
    courseCodeNotFoundMessage:
      "Kurskoden finns inte i vår databas. Kontrollera stavningen eller prova en annan kurskod.",
    noExamsFoundMessage: "Inga tentor hittades för kurskoden.",
    createdAt: "Skriven",

    // User Progress
    completed: "Har gjorts",
    notCompleted: "Inte gjord",
    markAsCompleted: "Markera som klar",
    markedAsCompleted: "Markerad som klar",
    unMarkedAsCompleted: "Avmarkerad som klar",
    remainingExamsTitle: "Grymt jobbat!",
    remainingExamsMessage: "Här är tentor du inte har gjort:",
    allExamsCompletedTitle: "Bra jobbat!",
    allExamsCompletedMessage: "Du har klarat alla tentor för denna kurs!",
    congratulationsMessage: "Grattis! Du har klarat alla tentor!",
    goodJob: "Bra jobbat!",
    continueWhereYouLeftOff: "Senaste aktiviteter",
    showContinueWhereYouLeftOff: "Visa fortsätt där du slutade",
    hideContinueWhereYouLeftOff: "Dölj fortsätt där du slutade",
    recentActivityDescription: "Här är dina senaste aktiviteter",
    noRecentActivity: "Inga senaste aktiviteter",

    // Feedback
    feedbackLink: "Ge feedback",
    feedbackTitle: "Hjälp oss bli bättre!",
    feedbackDescription:
      "Vi uppskattar din feedback. Vänligen fyll i formuläret.",
    feedbackForm: "Feedback Formulär",
    feedbackSuccessTitle: "Tack för din feedback!",
    feedbackSuccessMessage: "Vi återkommer så snart som möjligt!",
    feedbackErrorTitle: "Något gick fel",
    feedbackErrorMessage: "Något gick fel när din feedback skickades.",
    nameLegend: "Namn",
    namePlaceholder: "Namn",
    nameDescription: "Valfritt",
    messageLegend: "Meddelande",
    messagePlaceholder: "Meddelande",
    messageDescription:
      "Berätta vad du tycker om LiU Tentor! Vi uppskattar om du är så detaljerad som möjligt.",
    partOfWebsiteLegend: "Del av hemsidan",
    partOfWebsitePlaceholder: "Vilken del av hemsidan?",
    emailPlaceholder: "LiU Mail",
    exampleEmail: "t.ex. liuid123@student.liu.se",
    requiredField: "Obligatoriskt",
    requiredFieldMessage: "Obligatoriskt fält",
    weNeedYourHelp: "Vi behöver din hjälp!",
    makeLiuTentorBetter: "Hjälp oss göra LiU Tentor bättre",

    // Upload
    uploadTitle: "Ladda upp tenta eller facit",
    uploadButton: "Ladda upp tenta eller facit",
    uploadDescription:
      "Vänligen ange kurskod och ladda upp en eller flera PDF:er.",
    uploadSuccess: "Uppladdning lyckades",
    uploadError: "Något gick fel vid uppladdningen",
    uploadExamsOrFacit: "Ladda upp fler tentor eller facit",
    dragAndDrop: "Släpp PDF-filer här eller klicka för att välja filer",
    moreExamsTitle: "Hittade inte tentan eller facit du letade efter?",
    moreExamsBtn: "Klicka här",
    uploadGuidelinesTitle: "Riktlinjer för uppladdning",
    uploadGuidelineCourseCode:
      "Se till att kurskoden är korrekt innan uppladdning.",
    uploadGuidelineNaming:
      'Namnge filerna tydligt - t.ex. "2024-03-20-Frågor.pdf".',
    uploadGuidelineDate: "Inkludera gärna datum eller termin i filnamnet.",
    uploadGuidelineDuplicateCheck: "Dubbelkolla om filen redan finns på sidan.",
    uploadGuidelineQuality: "Ladda endast upp tydliga och läsbara PDF-filer.",

    // UI
    textSize: "Text storlek",
    selectTextSize: "Välj textstorlek",
    small: "Liten",
    standard: "Standard",
    large: "Stor",
    font: "Font",
    fontDescription: "Välj vilken font du vill använda på LiU Tentor",
    theme: "Tema",
    themeDescription: "Välj vilket tema du vill använda på LiU Tentor",
    settingsDescription: "Anpassa dina inställningar och visa kortkommandon",
    settingsTheme: "Tema",
    settingsLanguage: "Språk",
    settingsKeyboardShortcuts: "Kortkommandon",
    addTab: "Lägg till tab",
    removeTab: "Ta bort tab",
    showPagination: "Visa sidnummer",
    hidePagination: "Dölj sidnummer",
    togglePagination: "Toggla sidnummer",
    scrollHint: "Scrolla för att se mer",
    tapToSeeMore: "Tryck för att se mer",

    // Keyboard
    keyboardShortcuts: "Keyboard Shortcuts",
    usefulShortcuts: "Här är några användbara tangentbordsgenvägar:",
    keyboardAction: "Handling",

    // Time
    justNow: "Just nu",
    minutesAgo: "minuter sedan",
    hoursAgo: "timmar sedan",
    daysAgo: "dagar sedan",
    new: "Ny",
    minShort: "m",
    hShort: "h",
    dShort: "d",

    // Cookies
    cookieBannerText:
      "Vi använder cookies för att ge dig den bästa upplevelsen på vår webbplats.",
    cookieBannerDescription:
      "När du accepterar cookies kan du använda alla funktioner som snabb sökning och filtrering.",
    cookieConsentRequired:
      "Du måste acceptera cookies för att se populära sökningar.",

    // Privacy Policy
    privacyPolicyTitle: "Integritetspolicy",
    privacyPolicyLastUpdated: "Senast uppdaterad: ",
    privacyPolicyIntro:
      "Välkommen till vår integritetspolicy. Vi värnar om din integritet och vill att du ska känna dig trygg när du använder vår tjänst. Här beskriver vi hur vi samlar in och använder information samt hur du kan hantera dina inställningar.",
    privacyPolicySection1Title: "1. Vilken information samlar vi in?",
    privacyPolicySection1Content:
      "Vi samlar in följande information när du använder vår tjänst:",
    privacyPolicySection1Item1:
      "Sökhistorik: Vi sparar vilka tentor du har sökt efter för att visa populära sökningar och förbättra användarupplevelsen.",
    privacyPolicySection1Item2:
      "Genomförda tentor: Vi sparar information om vilka tentor du markerat som genomförda för att ge dig en översikt över dina framsteg.",
    privacyPolicySection1Item3:
      "Språkinställningar: Vi sparar vilket språk du föredrar för att visa innehåll på ditt valda språk vid framtida besök.",
    privacyPolicySection1Item4:
      "UI-inställningar: Vi sparar dina val gällande textstorlek och andra UI-preferenser.",
    privacyPolicySection2Title: "2. Hur använder vi din information?",
    privacyPolicySection2Content:
      "Informationen vi samlar in används för att anpassa tjänsten efter dina preferenser och inställningar samt visa dina tidigare sökningar och genomförda tentor.",
    privacyPolicySection3Title: "3. Cookies",
    privacyPolicySection3Content:
      "Vi använder cookies för att spara användarens preferenser och inställningar. Cookies är små textfiler som placeras på din enhet för att förbättra användarupplevelsen. Du kan när som helst välja att blockera eller radera cookies via din webbläsares inställningar, men det kan påverka funktionaliteten på webbplatsen.",
    privacyPolicySection4Title: "4. Delning av din information",
    privacyPolicySection4Content:
      "Vi delar inte din information med tredje parter förutom när det är nödvändigt för att uppfylla juridiska krav eller skydda våra rättigheter.",
    privacyPolicySection5Title: "5. Dina rättigheter",
    privacyPolicySection5Content: "Du har rätt att:",
    privacyPolicySection5Item1:
      "Få tillgång till den information vi har om dig.",
    privacyPolicySection5Item2: "Radera eller korrigera dina uppgifter.",
    privacyPolicySection5Item3:
      "Återkalla ditt samtycke till datainsamling när som helst.",
    privacyPolicySection6Title: "6. Ändringar i denna policy",
    privacyPolicySection6Content:
      "Vi förbehåller oss rätten att uppdatera denna policy när som helst. Eventuella ändringar kommer att publiceras på denna sida, och vi rekommenderar att du regelbundet granskar denna policy för att hålla dig uppdaterad.",
    privacyPolicySection7Title: "7. AI-assistent och datahantering",
    privacyPolicySection7Content:
      "Vi använder en AI-assistent för att hjälpa dig förstå tentamaterial. För att säkerställa kvaliteten och förbättra tjänsten gäller följande:",
    privacyPolicySection7Item1:
      "Anonymiserad lagring: Vi sparar konversationer i syfte att träna och förbättra AI:ns förståelse för specifika kurser.",
    privacyPolicySection7Item2:
      "Ingen personlig koppling: Data lagras kopplat till ett anonymt ID. Vi sparar ingen personlig information som kan identifiera dig.",
    privacyPolicySection7Item3:
      "Kvalitetssäkring: Vi analyserar anonymiserade konversationer för att motverka felaktig information och förbättra AI-modellen.",
    privacyPolicySection8Title: "8. Kontaktinformation",
    privacyPolicySection8Content:
      "Om du har några frågor om denna integritetspolicy eller hur dina uppgifter hanteras, vänligen kontakta oss på:",
    privacyPolicyContactEmail: "E-post: liutentor@gmail.com",
    privacyPolicyContactText:
      "Om du har några frågor om vår integritetspolicy, vänligen kontakta oss.",
    privacyPolicyGDPRTitle: "Hantering av personuppgifter och GDPR",
    privacyPolicyGDPRContent:
      "Vi visar offentligt tillgängliga tentor som publicerats av universitetet, inklusive namn på examinatorer som en del av dokumentets originalinnehåll. Vi respekterar rätten till integritet och följer GDPR-regleringen. Om du är en examinator och vill begära borttagning av ditt namn från en tenta, vänligen kontakta oss.",
    privacyPolicyGDPRItem1:
      "Vi publicerar endast tentor som är offentligt tillgängliga.",
    privacyPolicyGDPRItem2:
      "Examinatorers namn ingår endast om de finns med i den ursprungliga tentan.",
    privacyPolicyGDPRItem3:
      "Om du vill begära borttagning av en tenta eller ett namn, vänligen kontakta oss via e-post.",

    // Auth
    login: "Logga in",
    create_account: "Skapa konto",
    welcome_back: "Välkommen tillbaka",
    login_with_liu_mail: "Logga in med LiU-mail",
    register_with_liu_mail: "Registrera med LiU-mail",

    // Statistics
    statistics: "Statistik",
    passedCount: "Godkända",
    averagePassRate: "Genomsnitt godkända",
    examStatisticsDescription:
      "Vi har precis introducerat tentastatistik, klicka på procenten för att få en mer detaljerad vy",

    // Misc
    allRightsReserved: "All rights reserved",
    madeBy: "Made with",
    contactLink: "Kontakt",
    contactEmail: "Kontakta via e-post",
    askAI: "Fråga AI",
    aiTitle: "Vad behöver du hjälp med?",
    aiDescription:
      "Få frågor besvarade, förklarade och diskuterade av chatten.",
    aiChatTitle: "LiU Tentor AI",
    aiChatEmptyTitle: "Ställ en fråga om tentan!",
    aiChatEmptyDescription:
      "Jag kan hjälpa dig att förstå frågor och koncept från denna tenta.",
    aiChatPlaceholder: "Fråga vad som helst om tentan...",
    aiChatPoweredBy: "AI kan göra misstag, kontrollera alltid svar.",
    aiChatSend: "Skicka",
    aiChatThinking: "Tänker",
    aiIntroTitle: "LiU Tentor x ChatGPT",
    aiIntroSubtitle: "Din personliga studieassistent",
    aiIntroDescription:
      "Vi har lagt in chatten som vi alla älskar som hjälper dig att förstå och lära dig från tentor. Ställ frågor, få förklaringar och förbättra din förståelse.",
    aiIntroFeature1Title: "Ställ frågor om tentan",
    aiIntroFeature1Description:
      "Få hjälp med att förstå frågor, koncept och lösningar direkt från tentan.",
    aiIntroFeature2Title: "Förklaringar i realtid",
    aiIntroFeature2Description:
      "AI:n analyserar tentans innehåll och ger dig detaljerade förklaringar.",
    aiIntroFeature3Title: "Alltid tillgänglig",
    aiIntroFeature3Description:
      "Använd kortkommandot 'C' när som helst för att öppna AI-chatten.",
    aiIntroGetStarted: "Kom igång",
    aiIntroSkip: "Hoppa över",
    learnMore: "Läs mer",
    faq: "Vanliga frågor",
    aboutUs: "Om oss",
    feedback: "Feedback",
    privacyPolicy: "Integritetspolicy",
    loadingExams: "Laddar tentor...",
    uploadExams: "Ladda upp tentor",
    noExamsFoundShort: "Inga tentor hittades",
    helpOtherStudentsMessage:
      "Har du tentor för den här kursen? Hjälp andra studenter genom att ladda upp dem!",
    uploadMore: "Ladda upp mer",
    examCount: "tenta",
    solutionCount: "facit",

    // Sponsors
    sponsorsWeWorkWith: "Sponsorer vi jobbar med",
    ourSponsors: "Våra sponsorer",
  },
  en: {
    // Common
    homeLink: "Home",
    goBack: "Go back",
    goHome: "Go home",
    backToHome: "Back to Home",
    settings: "Settings",
    contactUs: "Contact Us",
    quickLinks: "Quick Links",
    loadingMessage: "Loading...",
    loadingPDF: "Loading PDF...",
    noResults: "No results",
    noResultsFound: "No results found",
    notFound: "No exams found for course code",
    lostMessage: "It looks like you're lost in the academic void...",
    submitButton: "Submit",
    searchButton: "Search Exams",
    clearSearch: "Clear",
    reset: "Reset",
    tryAgainButton: "Try again",
    acceptCookie: "Accept",
    rejectCookie: "Reject",
    closeDialog: "Close",

    // Home Page
    homeTitle: "LiU Exams",
    homeDescription:
      "Finally, you can find exams from Linköping University all in one place... Mostly TekFak",
    searchPlaceholder: "Search for",
    courseCodePlaceholder: "Course Code",
    popularSearches: "Popular Searches",
    popularSearchesTitle: "Recently Searched",
    popularSearchesDescription:
      "Here are some of your recent searched courses right now.",
    recentSearches: "Recent Searches",
    noPopularSearchesMessage:
      "Start searching to see your most visited courses here",
    globalSearch: "Global Search",
    allCourses: "Courses",
    courses: "Courses",
    suggestions: "Suggestions",
    didYouMean: "Did you mean",

    // Exams
    exam: "Exam",
    exams: "Exams",
    examName: "Name",
    examDone: "Done",
    examOnly: "Solution hidden",
    examAndFacit: "Solution visible",
    facit: "Facit",
    facitAvailable: "Facit available",
    facitNotAvailable: "Facit not available",
    showFacit: "Show Facit",
    hideFacit: "Hide Facit",
    chooseFacit: "Choose Facit",
    noFacitAvailable: "No facit available",
    noFacitAvailableDescription:
      "Some exams do not have a facit. You can upload a facit if you have one.",
    chooseFacitDescription:
      "Some exams do not have a facit, but you can choose a facit from the list below if available. It may also be that the facit is a bit further down in the exam document.",
    mouseOverDescription: "Hover over to see facit",
    withFacit: "With solution",
    withSolution: "with solutions",
    hasFacit: "Has solution",
    toggleExam: "Toggle exam (exam only mode)",
    toggleShowFacit: "Toggle show solution",

    // PDF Controls
    downloadExam: "Download exam",
    downloadFacit: "Download facit",
    showExamToolbar: "Show exam toolbar",
    hideExamToolbar: "Hide exam toolbar",
    showFacitToolbar: "Show facit toolbar",
    hideFacitToolbar: "Hide facit toolbar",
    toggleExamToolbar: "Toggle exam toolbar",
    toggleFacitToolbar: "Toggle facit toolbar",
    moveFacitLeft: "Move facit to the left",
    moveFacitRight: "Move facit to the right",
    toggleAIChat: "Toggle AI chat",
    next: "Next",
    previous: "Previous",
    nextSide: "Next side",
    previousSide: "Previous side",

    // Course
    courseCode: "Course Code",
    searchCoursePlaceholder: "Search for course code",
    searchResultsForCourseCode: "Search results",
    examsAvailable: "Exams available for",
    noExamsFound: "No exams found for course code: ",
    courseCodeNotFound: "Course code not found",
    courseCodeNotFoundMessage:
      "The course code was not found in our database. Please check the spelling or try another course code.",
    noExamsFoundMessage: "No exams found for course code.",
    createdAt: "Written",

    // User Progress
    completed: "Completed",
    notCompleted: "Not completed",
    markAsCompleted: "Mark as completed",
    markedAsCompleted: "Marked as completed",
    unMarkedAsCompleted: "Unmarked as completed",
    remainingExamsTitle: "Great job!",
    remainingExamsMessage: "Here are the exams you haven't completed:",
    allExamsCompletedTitle: "Great Job!",
    allExamsCompletedMessage:
      "You have completed all available exams for this course!",
    congratulationsMessage: "Congratulations! You have completed all exams!",
    goodJob: "Good job!",
    continueWhereYouLeftOff: "Recent activities",
    showContinueWhereYouLeftOff: "Show continue where you left off",
    hideContinueWhereYouLeftOff: "Hide continue where you left off",
    recentActivityDescription: "Here are your recent activities",
    noRecentActivity: "No recent activities",

    // Feedback
    feedbackLink: "Give Feedback",
    feedbackTitle: "Help us get better!",
    feedbackDescription:
      "We appreciate your feedback. Please fill out the form.",
    feedbackForm: "Feedback Form",
    feedbackSuccessTitle: "Thank you for your feedback!",
    feedbackSuccessMessage: "We will get back to you as soon as possible!",
    feedbackErrorTitle: "Something went wrong",
    feedbackErrorMessage: "Something went wrong when your feedback was sent.",
    nameLegend: "Name",
    namePlaceholder: "Name",
    nameDescription: "Optional",
    messageLegend: "Message",
    messagePlaceholder: "Message",
    messageDescription:
      "Tell us what you think about LiU Exams! We appreciate as much detail as possible.",
    partOfWebsiteLegend: "Part of the website",
    partOfWebsitePlaceholder: "Which part of the website?",
    emailPlaceholder: "LiU Mail",
    exampleEmail: "e.g. liuid123@student.liu.se",
    requiredField: "Required",
    requiredFieldMessage: "Required field",
    weNeedYourHelp: "We need your help!",
    makeLiuTentorBetter: "Help us make LiU Exams better",

    // Upload
    uploadTitle: "Upload exam or solution",
    uploadButton: "Upload exam or solution",
    uploadDescription: "Please enter course code and upload one or more PDFs.",
    uploadSuccess: "Upload successful",
    uploadError: "Something went wrong with the upload",
    uploadExamsOrFacit: "Upload more exams or solutions",
    dragAndDrop: "Drop PDF files here or click to select files",
    moreExamsTitle: "Didn't find the exam or solution you were looking for?",
    moreExamsBtn: "Click here",
    uploadGuidelinesTitle: "Upload Guidelines",
    uploadGuidelineCourseCode:
      "Make sure the course code is correct before uploading.",
    uploadGuidelineNaming:
      'Name files clearly - e.g., "2024-03-20-Questions.pdf".',
    uploadGuidelineDate:
      "Include the date or term in the filename if possible.",
    uploadGuidelineDuplicateCheck:
      "Double-check if the file already exists on the site.",
    uploadGuidelineQuality: "Only upload clear and readable PDF files.",

    // UI
    textSize: "Text size",
    selectTextSize: "Select text size",
    small: "Small",
    standard: "Standard",
    large: "Large",
    font: "Font",
    fontDescription: "Choose which font you want to use on LiU Exams",
    theme: "Theme",
    themeDescription: "Choose which theme you want to use on LiU Exams",
    settingsDescription:
      "Customize your preferences and view keyboard shortcuts",
    settingsTheme: "Theme",
    settingsLanguage: "Language",
    settingsKeyboardShortcuts: "Keyboard Shortcuts",
    addTab: "Add tab",
    removeTab: "Remove tab",
    showPagination: "Show page number",
    hidePagination: "Hide page number",
    togglePagination: "Toggle page number",
    scrollHint: "Scroll to see more",
    tapToSeeMore: "Tap to see more",

    // Keyboard
    keyboardShortcuts: "Keyboard Shortcuts",
    usefulShortcuts: "Here are some handy keyboard shortcuts:",
    keyboardAction: "Action",

    // Time
    justNow: "Just now",
    minutesAgo: "minutes ago",
    hoursAgo: "hours ago",
    daysAgo: "days ago",
    new: "New",
    minShort: "m",
    hShort: "h",
    dShort: "d",

    // Cookies
    cookieBannerText:
      "We use cookies to give you the best experience on our website",
    cookieBannerDescription:
      "When you accept cookies, you can use all features like quick search and filtering.",
    cookieConsentRequired: "You must accept cookies to see popular searches.",

    // Privacy Policy
    privacyPolicyTitle: "Privacy Policy",
    privacyPolicyLastUpdated: "Last updated: ",
    privacyPolicyIntro:
      "Welcome to our Privacy Policy. We value your privacy and want you to feel secure when using our service. Here we describe how we collect and use information as well as how you can manage your settings.",
    privacyPolicySection1Title: "1. What information do we collect?",
    privacyPolicySection1Content:
      "We collect the following information when you use our service:",
    privacyPolicySection1Item1:
      "Search history: We save the exams you have searched for to display popular searches and improve the user experience.",
    privacyPolicySection1Item2:
      "Completed exams: We save information about the exams you have marked as completed to provide you with an overview of your progress.",
    privacyPolicySection1Item3:
      "Language settings: We save your preferred language to show content in your chosen language during future visits.",
    privacyPolicySection1Item4:
      "UI settings: We save your preferences regarding text size and other UI options.",
    privacyPolicySection2Title: "2. How do we use your information?",
    privacyPolicySection2Content:
      "The information we collect is used to customize the service according to your preferences and settings, as well as to show your previous searches and completed exams.",
    privacyPolicySection3Title: "3. Cookies",
    privacyPolicySection3Content:
      "We use cookies to save the user's preferences and settings. Cookies are small text files placed on your device to enhance the user experience. You can choose to block or delete cookies at any time through your browser settings, but this may affect the functionality of the website.",
    privacyPolicySection4Title: "4. Sharing your information",
    privacyPolicySection4Content:
      "We do not share your information with third parties except when necessary to comply with legal requirements or protect our rights.",
    privacyPolicySection5Title: "5. Your rights",
    privacyPolicySection5Content: "You have the right to:",
    privacyPolicySection5Item1: "Access the information we have about you.",
    privacyPolicySection5Item2: "Delete or correct your information.",
    privacyPolicySection5Item3:
      "Withdraw your consent to data collection at any time.",
    privacyPolicySection6Title: "6. Changes to this policy",
    privacyPolicySection6Content:
      "We reserve the right to update this policy at any time. Any changes will be published on this page, and we recommend that you regularly review this policy to stay informed.",
    privacyPolicySection7Title: "7. AI Assistant and Data Management",
    privacyPolicySection7Content:
      "We use an AI assistant to help you understand exam materials. To ensure quality and improve the service, the following applies:",
    privacyPolicySection7Item1:
      "Anonymized Storage: We store conversations for the purpose of training and improving the AI's understanding of specific courses.",
    privacyPolicySection7Item2:
      "No Personal Link: Data is stored linked to an anonymous ID. We do not store any personal information that can identify you.",
    privacyPolicySection7Item3:
      "Quality Assurance: We analyze anonymized conversations to prevent incorrect information and improve the AI model.",
    privacyPolicySection8Title: "8. Contact information",
    privacyPolicySection8Content:
      "If you have any questions about this privacy policy or how your data is handled, please contact us at:",
    privacyPolicyContactEmail: "Email: liutentor@gmail.com",
    privacyPolicyContactText:
      "If you have any questions about our privacy policy, please contact us.",
    privacyPolicyGDPRTitle: "Handling of personal data and GDPR",
    privacyPolicyGDPRContent:
      "We display publicly available exams published by the university, including names of examiners as part of the document original content. We respect the right to privacy and follow GDPR regulations. If you are an examiner and want to request removal of your name from an exam, please contact us.",
    privacyPolicyGDPRItem1:
      "We only publish exams that are publicly available.",
    privacyPolicyGDPRItem2:
      "Examiners names are included only if they are part of the original exam.",
    privacyPolicyGDPRItem3:
      "If you want to request removal of an exam or a name, please contact us via email.",

    // Auth
    login: "Login",
    create_account: "Create account",
    welcome_back: "Welcome back",
    login_with_liu_mail: "Login with LiU mail",
    register_with_liu_mail: "Register with LiU mail",

    // Statistics
    statistics: "Statistics",
    passedCount: "Passed",
    averagePassRate: "Average pass rate",
    examStatisticsDescription:
      "We have just introduced exam statistics, click on the percentage to get a more detailed view",

    // Misc
    allRightsReserved: "All rights reserved",
    madeBy: "Made with",
    contactLink: "Contact",
    contactEmail: "Contact Email",
    askAI: "Ask AI",
    aiTitle: "What do you need help with?",
    aiDescription:
      "Get questions answered, explained, and discussed by the chat.",
    aiChatTitle: "LiU Tentor AI",
    aiChatEmptyTitle: "Ask a question about the exam!",
    aiChatEmptyDescription:
      "I can help you understand questions and concepts from this exam.",
    aiChatPlaceholder: "Ask anything about the exam...",
    aiChatPoweredBy: "AI can make mistakes, always check responses.",
    aiChatSend: "Send",
    aiChatThinking: "Thinking",
    aiIntroTitle: "LiU Tentor x ChatGPT",
    aiIntroSubtitle: "Your personal study assistant",
    aiIntroDescription:
      "We've added chat as we all love to help you understand and learn from exams. Ask questions, get explanations, and improve your understanding.",
    aiIntroFeature1Title: "Ask questions about the exam",
    aiIntroFeature1Description:
      "Get help understanding questions, concepts, and solutions directly from the exam.",
    aiIntroFeature2Title: "Real-time explanations",
    aiIntroFeature2Description:
      "The AI analyzes the exam content and provides you with detailed explanations.",
    aiIntroFeature3Title: "Always available",
    aiIntroFeature3Description:
      "Use the 'C' keyboard shortcut anytime to open the AI chat.",
    aiIntroGetStarted: "Get Started",
    aiIntroSkip: "Skip",
    learnMore: "Learn More",
    faq: "FAQ",
    aboutUs: "About Us",
    feedback: "Feedback",
    privacyPolicy: "Privacy Policy",
    loadingExams: "Loading exams...",
    uploadExams: "Upload exams",
    noExamsFoundShort: "No exams found",
    helpOtherStudentsMessage:
      "Do you have exams for this course? Help other students by uploading them!",
    uploadMore: "Upload more",
    examCount: "exam",
    solutionCount: "solution",

    // Sponsors
    sponsorsWeWorkWith: "Sponsors we work with",
    ourSponsors: "Our sponsors",
  },
};

export default translations;
