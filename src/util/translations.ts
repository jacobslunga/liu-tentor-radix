export type Language = "sv" | "en";

export interface Translations {
  [key: string]: {
    homeTitle: string;
    homeDescription: string;
    searchPlaceholder: string;
    popularSearches: string;
    courseCodePlaceholder: string;
    searchButton: string;
    popularSearchesTitle: string;
    popularSearchesDescription: string;
    homeLink: string;
    feedbackLink: string;
    allRightsReserved: string;
    madeBy: string;
    feedbackTitle: string;
    feedbackDescription: string;
    nameLegend: string;
    namePlaceholder: string;
    nameDescription: string;
    messageLegend: string;
    messagePlaceholder: string;
    messageDescription: string;
    partOfWebsitePlaceholder: string;
    submitButton: string;
    searchCoursePlaceholder: string;
    zoomIn: string;
    zoomOut: string;
    showFacit: string;
    hideFacit: string;
    chooseFacit: string;
    loadingPDF: string;
    noFacitAvailable: string;
    chooseFacitDescription: string;
    mouseOverDescription: string;
    next: string;
    previous: string;
    courseCode: string;
    examName: string;
    createdAt: string;
    searchResultsForCourseCode: string;
    examsAvailable: string;
    usefulShortcuts: string;
    keyboardAction: string;
    nextSide: string;
    previousSide: string;
    toggleShowFacit: string;
    noPopularSearchesMessage: string;
    feedbackSuccessMessage: string;
    feedbackErrorMessage: string;
    tryAgainButton: string;
    homeButton: string;
    showPagination: string;
    hidePagination: string;
    togglePagination: string;
    completed: string;
    cookieBannerText: string;
    acceptCookie: string;
    rejectCookie: string;
    cookieBannerDescription: string;
    cookieConsentRequired: string;
    noExamsFound: string;
    rotateLeft: string;
    rotateRight: string;
    markAsCompleted: string;
    moveFacitLeft: string;
    moveFacitRight: string;
    downloadExam: string;
    downloadFacit: string;
    showExamToolbar: string;
    hideExamToolbar: string;
    showFacitToolbar: string;
    hideFacitToolbar: string;
    toggleFacitToolbar: string;
    toggleExamToolbar: string;
    goBack: string;
    loadingMessage: string;
    clearSearch: string;
    suggestions: string;
    keyboardShortcuts: string;
    feedbackForm: string;
    didYouMean: string;
    notFound: string;
    hasFacit: string;
    textSize: string;
    addTab: string;
    removeTab: string;
    emailPlaceholder: string;
    contactLink: string;
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
    privacyPolicyContactEmail: string;
    remainingExamsTitle: string;
    remainingExamsMessage: string;
    allExamsCompletedTitle: string;
    allExamsCompletedMessage: string;
    closeDialog: string;
    congratulationsMessage: string;
    facitAvailable: string;
    facitNotAvailable: string;
    notCompleted: string;
    examOnly: string;
    examAndFacit: string;
    toggleExam: string;
    moreExamsTitle: string;
    moreExamsBtn: string;
    uploadTitle: string;
    selectTextSize: string;
    small: string;
    standard: string;
    large: string;
    askAI: string;
    aiTitle: string;
    aiDescription: string;
    examDone: string;
    withFacit: string;
    noResults: string;
    scrollHint: string;
    requiredField: string;
    requiredFieldMessage: string;
    exampleEmail: string;
    partOfWebsiteLegend: string;
    dragAndDrop: string;
    uploadDescription: string;
    uploadSuccess: string;
    uploadError: string;
    reset: string;
    noFacitAvailableDescription: string;
    uploadButton: string;
    weNeedYourHelp: string;
    markedAsCompleted: string;
    unMarkedAsCompleted: string;
    goodJob: string;
    makeLiuTentorBetter: string;
    settings: string;
    settingsDescription: string;
    settingsTheme: string;
    settingsLanguage: string;
    settingsKeyboardShortcuts: string;
    exam: string;
    facit: string;
    courses: string;
    noResultsFound: string;
    recentSearches: string;
    allCourses: string;
    globalSearch: string;
    login: string;
    create_account: string;
    welcome_back: string;
    login_with_liu_mail: string;
    register_with_liu_mail: string;
    exams: string;
    uploadExamsOrFacit: string;
    backToHome: string;
    contactUs: string;
    privacyPolicyContactText: string;
    contactEmail: string;
    feedbackSuccessTitle: string;
    feedbackErrorTitle: string;
    justNow: string;
    minutesAgo: string;
    hoursAgo: string;
    daysAgo: string;
    continueWhereYouLeftOff: string;
    recentActivityDescription: string;
    noRecentActivity: string;
    lostMessage: string;
    goHome: string;
    theme: string;
    themeDescription: string;
    font: string;
    fontDescription: string;
    quickLinks: string;
    tapToSeeMore: string;
    privacyPolicyGDPRTitle: string;
    privacyPolicyGDPRContent: string;
    privacyPolicyGDPRItem1: string;
    privacyPolicyGDPRItem2: string;
    privacyPolicyGDPRItem3: string;
    showContinueWhereYouLeftOff: string;
    hideContinueWhereYouLeftOff: string;
    new: string;
    minShort: string;
    hShort: string;
    dShort: string;
    uploadGuidelinesTitle: string;
    uploadGuidelineCourseCode: string;
    uploadGuidelineNaming: string;
    uploadGuidelineDate: string;
    uploadGuidelineDuplicateCheck: string;
    uploadGuidelineQuality: string;
    passedCount: string;
    averagePassRate: string;
    withSolution: string;
    examStatisticsDescription: string;
  };
}

const translations: Translations = {
  sv: {
    homeTitle: "LiU Tentor",
    homeDescription:
      "Äntligen kan du hitta tentor från Linköpings universitet på ett och samma ställe... Främst TekFak",
    searchPlaceholder: "Sök efter tentor...",
    popularSearches: "Populära sökningar",
    courseCodePlaceholder: "Kurskod",
    searchButton: "Sök tentor",
    popularSearchesTitle: "Senaste sökningar",
    popularSearchesDescription:
      "Här är några av dina senaste sökta kurser just nu.",
    homeLink: "Hem",
    feedbackLink: "Ge feedback",
    allRightsReserved: "All rights reserved",
    madeBy: "Made with",
    feedbackTitle: "Hjälp oss bli bättre!",
    feedbackDescription:
      "Vi uppskattar din feedback. Vänligen fyll i formuläret.",
    nameLegend: "Namn",
    namePlaceholder: "Namn",
    nameDescription: "Valfritt",
    messageLegend: "Meddelande",
    messagePlaceholder: "Meddelande",
    messageDescription:
      "Berätta vad du tycker om LiU Tentor! Vi uppskattar om du är så detaljerad som möjligt.",
    partOfWebsitePlaceholder: "Vilken del av hemsidan?",
    submitButton: "Skicka",
    searchCoursePlaceholder: "Sök efter kurskod",
    zoomIn: "Zooma in",
    zoomOut: "Zooma ut",
    showFacit: "Visa facit",
    hideFacit: "Dölj facit",
    chooseFacit: "Välj facit",
    loadingPDF: "Laddar PDF...",
    noFacitAvailable: "Inget facit tillgängligt",
    chooseFacitDescription:
      "Vissa tentor har inget facit, men du kan välja ett facit från listan nedan om det finns tillgängligt. Det kan också vara så att facit finns lite längre ner i tenta dokumentet.",
    mouseOverDescription: "Håll musen över för att se facit",
    next: "Nästa",
    previous: "Föregående",
    courseCode: "Kurskod",
    examName: "Namn",
    createdAt: "Skriven",
    searchResultsForCourseCode: `Sökresultat`,
    examsAvailable: "Tentor tillgängliga för",
    usefulShortcuts: "Här är några användbara tangentbordsgenvägar:",
    keyboardAction: "Handling",
    nextSide: "Nästa sida",
    previousSide: "Föregående sida",
    toggleShowFacit: "Toggla facit visning",
    noPopularSearchesMessage:
      "Börja söka för att se dina mest besökta kurser här",
    feedbackSuccessMessage: "Vi återkommer så snart som möjligt!",
    feedbackErrorMessage: "Något gick fel när din feedback skickades.",
    tryAgainButton: "Försök igen",
    homeButton: "Hitta din tenta!",
    showPagination: "Visa sidnummer",
    hidePagination: "Dölj sidnummer",
    togglePagination: "Toggla sidnummer",
    completed: "Har gjorts",
    cookieBannerText:
      "Vi använder cookies för att ge dig den bästa upplevelsen på vår webbplats.",
    acceptCookie: "Acceptera",
    rejectCookie: "Avvisa",
    cookieBannerDescription:
      "När du accepterar cookies kan du använda alla funktioner som snabb sökning och filtrering.",
    cookieConsentRequired:
      "Du måste acceptera cookies för att se populära sökningar.",
    noExamsFound: "Inga tentor hittades för kurskoden: ",
    rotateLeft: "Rotera vänster",
    rotateRight: "Rotera höger",
    markAsCompleted: "Markera som klar",
    moveFacitLeft: "Flytta facit till vänster",
    moveFacitRight: "Flytta facit till höger",
    downloadExam: "Ladda ner tenta",
    downloadFacit: "Ladda ner facit",
    showExamToolbar: "Visa tenta verktygsfält",
    hideExamToolbar: "Dölj tenta verktygsfält",
    showFacitToolbar: "Visa facit verktygsfält",
    hideFacitToolbar: "Dölj facit verktygsfält",
    toggleExamToolbar: "Toggla tenta verktygsfält",
    toggleFacitToolbar: "Toggla facit verktygsfält",
    goBack: "Gå tillbaka",
    loadingMessage: "Laddar...",
    clearSearch: "Rensa",
    suggestions: "Förslag",
    keyboardShortcuts: "Keyboard Shortcuts",
    feedbackForm: "Feedback Formulär",
    didYouMean: "Menade du",
    notFound: "Inga tentor hittades för kurskod",
    hasFacit: "Har facit",
    textSize: "Text storlek",
    addTab: "Lägg till tab",
    removeTab: "Ta bort tab",
    emailPlaceholder: "LiU Mail",
    contactLink: "Kontakt",
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
    privacyPolicySection7Title: "7. Kontaktinformation",
    privacyPolicySection7Content:
      "Om du har några frågor om denna integritetspolicy eller hur dina uppgifter hanteras, vänligen kontakta oss på:",
    privacyPolicyContactEmail: "E-post: liutentor@gmail.com",
    remainingExamsTitle: "Grymt jobbat!",
    remainingExamsMessage: "Här är tentor du inte har gjort:",
    allExamsCompletedTitle: "Bra jobbat!",
    allExamsCompletedMessage: "Du har klarat alla tentor för denna kurs!",
    closeDialog: "Stäng",
    congratulationsMessage: "Grattis! Du har klarat alla tentor!",
    facitAvailable: "Facit tillgängligt",
    facitNotAvailable: "Facit inte tillgängligt",
    notCompleted: "Inte gjord",
    examAndFacit: "Facit synligt",
    examOnly: "Facit dolt",
    toggleExam: "Toggla facit (facit bara mode)",
    moreExamsTitle: "Hittade inte tentan eller facit du letade efter?",
    moreExamsBtn: "Klicka här",
    uploadTitle: "Ladda upp tenta eller facit",
    selectTextSize: "Välj textstorlek",
    small: "Liten",
    standard: "Standard",
    large: "Stor",
    askAI: "Fråga AI",
    aiTitle: "Vad behöver du hjälp med?",
    aiDescription:
      "Få frågor besvarade, förklarade och diskuterade av chatten.",
    examDone: "Gjord",
    withFacit: "Med facit",
    noResults: "Inga resultat",
    scrollHint: "Scrolla för att se mer",
    requiredField: "Obligatoriskt",
    requiredFieldMessage: "Obligatoriskt fält",
    exampleEmail: "t.ex. liuid123@student.liu.se",
    partOfWebsiteLegend: "Del av hemsidan",
    dragAndDrop: "Släpp PDF-filer här eller klicka för att välja filer",
    uploadDescription:
      "Vänligen ange kurskod och ladda upp en eller flera PDF:er.",
    uploadSuccess: "Uppladdning lyckades",
    uploadError: "Något gick fel vid uppladdningen",
    reset: "Återställ",
    noFacitAvailableDescription:
      "Vissa tentor har inget facit. Du kan ladda upp ett facit om du har ett.",
    uploadButton: "Ladda upp tenta eller facit",
    weNeedYourHelp: "Vi behöver din hjälp!",
    markedAsCompleted: "Markerad som klar",
    unMarkedAsCompleted: "Avmarkerad som klar",
    goodJob: "Bra jobbat!",
    makeLiuTentorBetter: "Hjälp oss göra LiU Tentor bättre",
    settings: "Inställningar",
    settingsDescription: "Anpassa dina inställningar och visa kortkommandon",
    settingsTheme: "Tema",
    settingsLanguage: "Språk",
    settingsKeyboardShortcuts: "Kortkommandon",
    exam: "Tenta",
    facit: "Facit",
    courses: "Kurser",
    noResultsFound: "Inga resultat hittades",
    allCourses: "Kurser",
    recentSearches: "Senaste sökningarna",
    globalSearch: "Global sökning",
    login: "Logga in",
    create_account: "Skapa konto",
    login_with_liu_mail: "Logga in med LiU-mail",
    welcome_back: "Välkommen tillbaka",
    register_with_liu_mail: "Registrera med LiU-mail",
    exams: "Tentor",
    uploadExamsOrFacit: "Ladda upp fler tentor eller facit",
    backToHome: "Tillbaka till startsidan",
    contactUs: "Kontakta oss",
    privacyPolicyContactText:
      "Om du har några frågor om vår integritetspolicy, vänligen kontakta oss.",
    contactEmail: "Kontakta via e-post",
    feedbackSuccessTitle: "Tack för din feedback!",
    feedbackErrorTitle: "Något gick fel",
    continueWhereYouLeftOff: "Senaste aktiviteter",
    justNow: "Just nu",
    minutesAgo: "minuter sedan",
    hoursAgo: "timmar sedan",
    daysAgo: "dagar sedan",
    recentActivityDescription: "Här är dina senaste aktiviteter",
    noRecentActivity: "Inga senaste aktiviteter",
    lostMessage: "Det verkar som att du kommit till den akademiska djungeln.",
    goHome: "Gå hem",
    theme: "Tema",
    font: "Font",
    fontDescription: "Välj vilken font du vill använda på LiU Tentor",
    themeDescription: "Välj vilket tema du vill använda på LiU Tentor",
    quickLinks: "Snabblänkar",
    tapToSeeMore: "Tryck för att se mer",
    privacyPolicyGDPRContent:
      "Vi visar offentligt tillgängliga tentor som publicerats av universitetet, inklusive namn på examinatorer som en del av dokumentets originalinnehåll. Vi respekterar rätten till integritet och följer GDPR-regleringen. Om du är en examinator och vill begära borttagning av ditt namn från en tenta, vänligen kontakta oss.",
    privacyPolicyGDPRItem1:
      "Vi publicerar endast tentor som är offentligt tillgängliga.",
    privacyPolicyGDPRItem2:
      "Examinatorers namn ingår endast om de finns med i den ursprungliga tentan.",
    privacyPolicyGDPRItem3:
      "Om du vill begära borttagning av en tenta eller ett namn, vänligen kontakta oss via e-post.",
    privacyPolicyGDPRTitle: "Hantering av personuppgifter och GDPR",
    showContinueWhereYouLeftOff: "Visa fortsätt där du slutade",
    hideContinueWhereYouLeftOff: "Dölj fortsätt där du slutade",
    new: "Ny",
    dShort: "d",
    hShort: "h",
    minShort: "m",
    uploadGuidelinesTitle: "Riktlinjer för uppladdning",
    uploadGuidelineCourseCode:
      "Se till att kurskoden är korrekt innan uppladdning.",
    uploadGuidelineNaming:
      'Namnge filerna tydligt – t.ex. "2024-03-20-Frågor.pdf".',
    uploadGuidelineDate: "Inkludera gärna datum eller termin i filnamnet.",
    uploadGuidelineDuplicateCheck: "Dubbelkolla om filen redan finns på sidan.",
    uploadGuidelineQuality: "Ladda endast upp tydliga och läsbara PDF-filer.",
    passedCount: "Godkända",
    averagePassRate: "Genomsnitt godkända",
    withSolution: "med facit",
    examStatisticsDescription:
      "Vi har precis introducerat tentastatistik, klicka på procenten för att få en mer detaljerad vy",
  },
  en: {
    homeTitle: "LiU Exams",
    homeDescription:
      "Finally, you can find exams from Linköping University all in one place... Mostly TekFak",
    searchPlaceholder: "Search for exams...",
    popularSearches: "Popular Searches",
    courseCodePlaceholder: "Course Code",
    searchButton: "Search Exams",
    popularSearchesTitle: "Recently Searched",
    popularSearchesDescription:
      "Here are some of your recent searched courses right now.",
    homeLink: "Home",
    feedbackLink: "Give Feedback",
    allRightsReserved: "All rights reserved",
    madeBy: "Made with",
    feedbackTitle: "Help us get better!",
    feedbackDescription:
      "We appreciate your feedback. Please fill out the form.",
    nameLegend: "Name",
    namePlaceholder: "Name",
    nameDescription: "Optional",
    messageLegend: "Message",
    messagePlaceholder: "Message",
    messageDescription:
      "Tell us what you think about LiU Exams! We appreciate as much detail as possible.",
    partOfWebsitePlaceholder: "Which part of the website?",
    submitButton: "Submit",
    searchCoursePlaceholder: "Search for course code",
    zoomIn: "Zoom In",
    zoomOut: "Zoom Out",
    showFacit: "Show Facit",
    hideFacit: "Hide Facit",
    chooseFacit: "Choose Facit",
    loadingPDF: "Loading PDF...",
    noFacitAvailable: "No facit available",
    chooseFacitDescription:
      "Some exams do not have a facit, but you can choose a facit from the list below if available. It may also be that the facit is a bit further down in the exam document.",
    mouseOverDescription: "Hover over to see facit",
    next: "Next",
    previous: "Previous",
    courseCode: "Course Code",
    examName: "Name",
    createdAt: "Written",
    searchResultsForCourseCode: `Search results`,
    examsAvailable: "Exams available for",
    usefulShortcuts: "Here are some handy keyboard shortcuts:",
    keyboardAction: "Action",
    nextSide: "Next side",
    previousSide: "Previous side",
    toggleShowFacit: "Toggle show solution",
    noPopularSearchesMessage:
      "Start searching to see your most visited courses here",
    feedbackSuccessMessage: "We will get back to you as soon as possible!",
    feedbackErrorMessage: "Something went wrong when your feedback was sent.",
    tryAgainButton: "Try again",
    homeButton: "Find your exam!",
    showPagination: "Show page number",
    hidePagination: "Hide page number",
    togglePagination: "Toggle page number",
    completed: "Completed",
    cookieBannerText:
      "We use cookies to give you the best experience on our website",
    acceptCookie: "Accept",
    rejectCookie: "Reject",
    cookieBannerDescription:
      "When you accept cookies, you can use all features like quick search and filtering.",
    cookieConsentRequired: "You must accept cookies to see popular searches.",
    noExamsFound: "No exams found for course code: ",
    rotateLeft: "Rotate left",
    rotateRight: "Rotate right",
    markAsCompleted: "Mark as completed",
    moveFacitLeft: "Move facit to the left",
    moveFacitRight: "Move facit to the right",
    downloadExam: "Download exam",
    downloadFacit: "Download facit",
    hideExamToolbar: "Hide exam toolbar",
    showExamToolbar: "Show exam toolbar",
    showFacitToolbar: "Show facit toolbar",
    hideFacitToolbar: "Hide facit toolbar",
    toggleExamToolbar: "Toggle exam toolbar",
    toggleFacitToolbar: "Toggle facit toolbar",
    goBack: "Go back",
    loadingMessage: "Loading...",
    clearSearch: "Clear",
    suggestions: "Suggestions",
    keyboardShortcuts: "Keyboard Shortcuts",
    feedbackForm: "Feedback Form",
    didYouMean: "Did you mean",
    notFound: "No exams found for course code",
    hasFacit: "Has solution",
    textSize: "Text size",
    addTab: "Add tab",
    removeTab: "Remove tab",
    emailPlaceholder: "LiU Mail",
    contactLink: "Contact",
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
    privacyPolicySection7Title: "7. Contact information",
    privacyPolicySection7Content:
      "If you have any questions about this privacy policy or how your data is handled, please contact us at:",
    privacyPolicyContactEmail: "Email: liutentor@gmail.com",
    remainingExamsTitle: "Great job!",
    remainingExamsMessage: "Here are the exams you haven't completed:",
    allExamsCompletedTitle: "Great Job!",
    allExamsCompletedMessage:
      "You have completed all available exams for this course!",
    closeDialog: "Close",
    congratulationsMessage: "Congratulations! You have completed all exams!",
    facitAvailable: "Facit available",
    facitNotAvailable: "Facit not available",
    notCompleted: "Not completed",
    examAndFacit: "Solution visible",
    examOnly: "Solution hidden",
    toggleExam: "Toggle exam (exam only mode)",
    moreExamsTitle: "Didn't find the exam or solution you were looking for?",
    moreExamsBtn: "Click here",
    uploadTitle: "Upload exam or solution",
    selectTextSize: "Select text size",
    small: "Small",
    standard: "Standard",
    large: "Large",
    askAI: "Ask AI",
    aiTitle: "What do you need help with?",
    aiDescription:
      "Get questions answered, explained, and discussed by the chat.",
    examDone: "Done",
    withFacit: "With solution",
    noResults: "No results",
    scrollHint: "Scroll to see more",
    requiredField: "Required",
    requiredFieldMessage: "Required field",
    exampleEmail: "e.g. liuid123@student.liu.se",
    partOfWebsiteLegend: "Part of the website",
    dragAndDrop: "Drop PDF files here or click to select files",
    uploadDescription: "Please enter course code and upload one or more PDFs.",
    uploadSuccess: "Upload successful",
    uploadError: "Something went wrong with the upload",
    reset: "Reset",
    noFacitAvailableDescription:
      "Some exams do not have a facit. You can upload a facit if you have one.",
    uploadButton: "Upload exam or solution",
    weNeedYourHelp: "We need your help!",
    markedAsCompleted: "Marked as completed",
    unMarkedAsCompleted: "Unmarked as completed",
    goodJob: "Good job!",
    makeLiuTentorBetter: "Help us make LiU Exams better",
    settings: "Settings",
    settingsDescription:
      "Customize your preferences and view keyboard shortcuts",
    settingsTheme: "Theme",
    settingsLanguage: "Language",
    settingsKeyboardShortcuts: "Keyboard Shortcuts",
    exam: "Exam",
    facit: "Facit",
    courses: "Courses",
    noResultsFound: "No results found",
    allCourses: "Courses",
    recentSearches: "Recent Searches",
    globalSearch: "Global Search",
    create_account: "Create account",
    login: "Login",
    login_with_liu_mail: "Login with LiU mail",
    welcome_back: "Welcome back",
    register_with_liu_mail: "Register with LiU mail",
    exams: "Exams",
    uploadExamsOrFacit: "Upload more exams or solutions",
    backToHome: "Back to Home",
    contactUs: "Contact Us",
    privacyPolicyContactText:
      "If you have any questions about our privacy policy, please contact us.",
    contactEmail: "Contact Email",
    feedbackSuccessTitle: "Thank you for your feedback!",
    feedbackErrorTitle: "Something went wrong",
    continueWhereYouLeftOff: "Recent activities",
    justNow: "Just now",
    minutesAgo: "minutes ago",
    hoursAgo: "hours ago",
    daysAgo: "days ago",
    recentActivityDescription: "Here are your recent activities",
    noRecentActivity: "No recent activities",
    goHome: "Go home",
    lostMessage: "It looks like you're lost in the academic void...",
    font: "Font",
    theme: "Theme",
    fontDescription: "Choose which font you want to use on LiU Exams",
    themeDescription: "Choose which theme you want to use on LiU Exams",
    quickLinks: "Quick Links",
    tapToSeeMore: "Tap to see more",
    privacyPolicyGDPRContent:
      "We display publicly available exams published by the university, including names of examiners as part of the document original content. We respect the right to privacy and follow GDPR regulations. If you are an examiner and want to request removal of your name from an exam, please contact us.",
    privacyPolicyGDPRItem1:
      "We only publish exams that are publicly available.",
    privacyPolicyGDPRItem2:
      "Examiners names are included only if they are part of the original exam.",
    privacyPolicyGDPRItem3:
      "If you want to request removal of an exam or a name, please contact us via email.",
    privacyPolicyGDPRTitle: "Handling of personal data and GDPR",
    hideContinueWhereYouLeftOff: "Hide continue where you left off",
    showContinueWhereYouLeftOff: "Show continue where you left off",
    new: "New",
    dShort: "d",
    hShort: "h",
    minShort: "m",
    uploadGuidelinesTitle: "Upload Guidelines",
    uploadGuidelineCourseCode:
      "Make sure the course code is correct before uploading.",
    uploadGuidelineNaming:
      'Name files clearly – e.g., "2024-03-20-Questions.pdf".',
    uploadGuidelineDate:
      "Include the date or term in the filename if possible.",
    uploadGuidelineDuplicateCheck:
      "Double-check if the file already exists on the site.",
    uploadGuidelineQuality: "Only upload clear and readable PDF files.",
    passedCount: "Passed",
    averagePassRate: "Average pass rate",
    withSolution: "with solutions",
    examStatisticsDescription:
      "We have just introduced exam statistics, click on the percentage to get a more detailed view",
  },
};

export default translations;
