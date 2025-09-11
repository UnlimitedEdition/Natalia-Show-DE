import React, { createContext, useContext, useState, useEffect } from 'react'

// Define the shape of our translations
interface Translations {
  // Admin Panel Header
  adminPanel: string
  welcome: string
  signOut: string
  
  // Authentication
  signIn: string
  signUp: string
  signInToYourAccount: string
  createAnAccount: string
  email: string
  password: string
  dontHaveAnAccount: string
  alreadyHaveAnAccount: string
  registrationSuccessful: string
  processing: string
  
  // Navigation
  content: string
  media: string
  advertisements: string
  announcements: string
  pageSections: string
  contactLinks: string
  contentDescription: string
  mediaDescription: string
  advertisementsDescription: string
  announcementsDescription: string
  pageSectionsDescription: string
  contactLinksDescription: string
  
  language: string
  section: string
  title: string
  description: string
  subtitle: string
  quote: string
  addressLabel: string
  phoneLabel: string
  emailLabel: string
  nameLabel: string
  namePlaceholder: string
  emailPlaceholder: string
  messageLabel: string
  messagePlaceholder: string
  sendButton: string
  contactInfo: string
  sendMessage: string
  saving: string
  save: string
  
  // Media Manager
  mediaManager: string
  addMedia: string
  editMedia: string
  mediaType: string
  fileUrl: string
  videoUrl: string
  socialUrl: string
  thumbnailUrl: string
  displayOrder: string
  isActive: string
  actions: string
  edit: string
  delete: string
  add: string
  update: string
  cancel: string
  save: string
  saving: string
  upload: string
  uploading: string
  noMediaFound: string
  image: string
  video: string
  socialVideo: string
  selectSection: string
  uploadFile: string
  mediaItems: string
  serbian: string
  english: string
  german: string
  translations: string
  active: string
  inactive: string
  status: string
  
  // Advertisement Manager
  advertisementManager: string
  addAdvertisement: string
  editAdvertisement: string
  imageUrl: string
  videoUrl: string
  linkUrl: string
  position: string
  header: string
  betweenSections: string
  footer: string
  clickCount: string
  startDate: string
  endDate: string
  adType: string
  imageAd: string
  videoAd: string
  noAdvertisementsFound: string
  
  // Announcement Manager
  announcementManager: string
  addAnnouncement: string
  editAnnouncement: string
  isPublished: string
  publishDate: string
  expireDate: string
  noAnnouncementsFound: string
  
  // Page Section Manager
  pageSectionManager: string
  addPageSection: string
  editPageSection: string
  sectionKey: string
  sectionName: string
  backgroundImageUrl: string
  backgroundVideoUrl: string
  noPageSectionsFound: string
  sectionDetails: string
  previewSectionForUsers: string
  selectSectionPlaceholder: string
  sectionDisplayName: string
  sectionImageUrl: string
  imageUrlPlaceholder: string
  preview: string
  imageLoaded: string
  noImage: string
  existingSections: string
  backgroundImage: string
  updateSection: string
  sectionCreatedDescription: string
  sectionUpdatedDescription: string
  sectionDeletedDescription: string
  confirmDeleteSection: string
  
  // Section Manager
  sectionManager: string
  addSection: string
  editSection: string
  sections: string
  sectionKeyDescription: string
  pleaseFillAllRequiredFields: string
  sectionKeyAlreadyExists: string
  sectionCreatedSuccessfully: string
  sectionUpdatedSuccessfully: string
  sectionDeletedSuccessfully: string
  failedToLoadSections: string
  failedToSaveSection: string
  failedToDeleteSection: string
  areYouSureYouWantToDeleteThisSection: string
  error: string
  
  // Content Manager
  contentManager: string

  posts: {
    sr: string
    en: string
    de: string
  }
  postsDescription: {
    sr: string
    en: string
    de: string
  }
  postManager: {
    sr: string
    en: string
    de: string
  }
  existingPosts: {
    sr: string
    en: string
    de: string
  }
  noPostsFound: {
    sr: string
    en: string
    de: string
  }
  createPost: {
    sr: string
    en: string
    de: string
  }
  updatePost: {
    sr: string
    en: string
    de: string
  }
  postCreatedSuccessfully: {
    sr: string
    en: string
    de: string
  }
  postCreatedDescription: {
    sr: string
    en: string
    de: string
  }
  postUpdatedSuccessfully: {
    sr: string
    en: string
    de: string
  }
  postUpdatedDescription: {
    sr: string
    en: string
    de: string
  }
  postDeletedSuccessfully: {
    sr: string
    en: string
    de: string
  }
  postDeletedDescription: {
    sr: string
    en: string
    de: string
  }
  failedToLoadPosts: {
    sr: string
    en: string
    de: string
  }
  failedToSavePost: {
    sr: string
    en: string
    de: string
  }
  failedToDeletePost: {
    sr: string
    en: string
    de: string
  }
  confirmDeletePost: {
    sr: string
    en: string
    de: string
  }
  titleIsRequired: {
    sr: string
    en: string
    de: string
  }
  enterPostTitle: {
    sr: string
    en: string
    de: string
  }
  enterPostContent: {
    sr: string
    en: string
    de: string
  }
  displayOrder: {
    sr: string
    en: string
    de: string
  }
  isPublished: {
    sr: string
    en: string
    de: string
  }
  draft: {
    sr: string
    en: string
    de: string
  }
  image: {
    sr: string
    en: string
    de: string
  }
}

// Define translations for each language
const translations: Record<string, Translations> = {
  de: {
    // Admin Panel Header
    adminPanel: "Admin-Panel",
    welcome: "Willkommen",
    signOut: "Abmelden",
    
    // Authentication
    signIn: "Anmelden",
    signUp: "Registrieren",
    signInToYourAccount: "Melden Sie sich bei Ihrem Konto an",
    createAnAccount: "Ein Konto erstellen",
    email: "E-Mail",
    password: "Passwort",
    dontHaveAnAccount: "Sie haben noch kein Konto?",
    alreadyHaveAnAccount: "Sie haben bereits ein Konto?",
    registrationSuccessful: "Registrierung erfolgreich",
    processing: "Verarbeitung...",
    
    // Navigation
    content: "Inhalt",
    media: "Medien",
    advertisements: "Ankündigungen",
    announcements: "Mitteilungen",
    pageSections: "Seitenabschnitte",
    contactLinks: "Kontaktlinks",
    contentDescription: "Verwalten Sie den Seiteninhalt in verschiedenen Sprachen",
    mediaDescription: "Verwalten Sie Bilder und Videos für verschiedene Seitenabschnitte",
    advertisementsDescription: "Verwalten Sie Werbeanzeigen, die auf der Website angezeigt werden",
    announcementsDescription: "Verwalten Sie Ankündigungen und wichtige Mitteilungen",
    pageSectionsDescription: "Verwalten Sie die Hauptsektionen der Website",
    contactLinksDescription: "Verwalten Sie Links zu sozialen Medien und Kontaktinformationen",
    
    language: "Sprache",
    section: "Abschnitt",
    title: "Titel",
    description: "Beschreibung",
    subtitle: "Untertitel",
    quote: "Zitat",
    addressLabel: "Adresse",
    phoneLabel: "Telefon",
    emailLabel: "E-Mail",
    nameLabel: "Name",
    namePlaceholder: "Ihr Name",
    emailPlaceholder: "Ihre E-Mail",
    messageLabel: "Nachricht",
    messagePlaceholder: "Ihre Nachricht",
    sendButton: "Nachricht senden",
    contactInfo: "Kontaktinformationen",
    sendMessage: "Senden Sie uns eine Nachricht",
    saving: "Speichern...",
    save: "Speichern",
    
    // Media Manager
    mediaManager: "Medienmanager",
    addMedia: "Medien hinzufügen",
    editMedia: "Medien bearbeiten",
    mediaType: "Medientyp",
    fileUrl: "Datei-URL",
    videoFile: "Video-Datei",
    socialUrl: "Soziale Medien URL",
    thumbnailUrl: "Thumbnail-URL",
    displayOrder: "Anzeigereihenfolge",
    isActive: "Ist aktiv",
    actions: "Aktionen",
    edit: "Bearbeiten",
    delete: "Löschen",
    add: "Hinzufügen",
    update: "Aktualisieren",
    updateMedia: "Medien aktualisieren",
    cancel: "Abbrechen",
    save: "Speichern",
    saving: "Speichern...",
    upload: "Hochladen",
    uploading: "Hochladen...",
    noMediaFound: "Keine Medien gefunden",
    noMediaItems: "Keine Medienelemente gefunden",
    image: "Bild",
    video: "Video",
    socialVideo: "Soziales Video",
    selectSection: "Abschnitt auswählen",
    uploadFile: "Datei hochladen",
    mediaItems: "Medienelemente",
    serbian: "Serbisch",
    english: "Englisch",
    german: "Deutsch",
    translations: "Übersetzungen",
    active: "Aktiv",
    inactive: "Inaktiv",
    status: "Status",
    type: "Typ",
    currentFile: "Aktuelle Datei",
    optional: "Optional",
    
    // Advertisement Manager
    advertisementManager: "Ankündigungsmanager",
    addAdvertisement: "Ankündigung hinzufügen",
    editAdvertisement: "Ankündigung bearbeiten",
    imageUrl: "Bild-URL",
    videoUrl: "Video-URL",
    linkUrl: "Link-URL",
    position: "Position",
    header: "Kopfzeile",
    betweenSections: "Zwischen Abschnitten",
    footer: "Fußzeile",
    clickCount: "Klickanzahl",
    startDate: "Startdatum",
    endDate: "Enddatum",
    adType: "Ankündigungstyp",
    imageAd: "Bildanzeige",
    videoAd: "Videoanzeige",
    noAdvertisementsFound: "Keine Ankündigungen gefunden",
    
    // Announcement Manager
    announcementManager: "Mitteilungsmanager",
    addAnnouncement: "Mitteilung hinzufügen",
    editAnnouncement: "Mitteilung bearbeiten",
    updateAnnouncement: "Mitteilung aktualisieren",
    isPublished: "Ist veröffentlicht",
    publishDate: "Veröffentlichungsdatum",
    expireDate: "Ablaufdatum",
    noAnnouncementsFound: "Keine Mitteilungen gefunden",
    announcementList: "Mitteilungsliste",
    enterTitle: "Titel eingeben",
    enterContent: "Inhalt eingeben",
    
    // Page Section Manager
    pageSectionManager: "Seitenabschnittsmanager",
    addPageSection: "Seitenabschnitt hinzufügen",
    editPageSection: "Seitenabschnitt bearbeiten",
    sectionKey: "Abschnittsschlüssel",
    sectionName: "Abschnittsname",
    backgroundImageUrl: "Hintergrundbild-URL",
    backgroundVideoUrl: "Hintergrundvideo-URL",
    noPageSectionsFound: "Keine Seitenabschnitte gefunden",
    sectionDetails: "Abschnittsdetails",
    
    // Section Manager
    sectionManager: "Abschnittsmanager",
    addSection: "Abschnitt hinzufügen",
    editSection: "Abschnitt bearbeiten",
    sections: "Abschnitte",
    sectionKeyDescription: "Eindeutiger Schlüssel zur Identifizierung des Abschnitts (z. B. 'hero', 'podcast')",
    pleaseFillAllRequiredFields: "Bitte füllen Sie alle erforderlichen Felder aus",
    sectionKeyAlreadyExists: "Ein Abschnitt mit diesem Schlüssel existiert bereits",
    sectionCreatedSuccessfully: "Abschnitt erfolgreich erstellt",
    sectionUpdatedSuccessfully: "Abschnitt erfolgreich aktualisiert",
    sectionDeletedSuccessfully: "Abschnitt erfolgreich gelöscht",
    failedToLoadSections: "Abschnitte konnten nicht geladen werden",
    failedToSaveSection: "Abschnitt konnte nicht gespeichert werden",
    failedToDeleteSection: "Abschnitt konnte nicht gelöscht werden",
    areYouSureYouWantToDeleteThisSection: "Sind Sie sicher, dass Sie diesen Abschnitt löschen möchten?",
    
    // Content Manager
    contentManager: "Inhaltsmanager",
  },
  en: {
    // Admin Panel Header
    adminPanel: "Admin Panel",
    welcome: "Welcome",
    signOut: "Sign Out",
    
    // Authentication
    signIn: "Sign In",
    signUp: "Sign Up",
    signInToYourAccount: "Sign in to your account",
    createAnAccount: "Create an account",
    email: "Email",
    password: "Password",
    dontHaveAnAccount: "Don't have an account?",
    alreadyHaveAnAccount: "Already have an account?",
    registrationSuccessful: "Registration successful",
    processing: "Processing...",
    
    // Navigation
    content: "Content",
    media: "Media",
    advertisements: "Advertisements",
    announcements: "Announcements",
    pageSections: "Page Sections",
    contactLinks: "Contact Links",
    contentDescription: "Manage website content in different languages",
    mediaDescription: "Manage images and videos for different page sections",
    advertisementsDescription: "Manage advertisements displayed on the website",
    announcementsDescription: "Manage announcements and important notices",
    pageSectionsDescription: "Manage main sections of the website",
    contactLinksDescription: "Manage social media links and contact information",
    
    language: "Language",
    section: "Section",
    title: "Title",
    description: "Description",
    subtitle: "Subtitle",
    quote: "Quote",
    addressLabel: "Address",
    phoneLabel: "Phone",
    emailLabel: "Email",
    nameLabel: "Name",
    namePlaceholder: "Your name",
    emailPlaceholder: "Your email",
    messageLabel: "Message",
    messagePlaceholder: "Your message",
    sendButton: "Send Message",
    contactInfo: "Contact Information",
    sendMessage: "Send us a message",
    saving: "Saving...",
    save: "Save",
    
    // Media Manager
    mediaManager: "Media Manager",
    addMedia: "Add Media",
    editMedia: "Edit Media",
    mediaType: "Media Type",
    fileUrl: "File URL",
    videoFile: "Video File",
    socialUrl: "Social Media URL",
    thumbnailUrl: "Thumbnail URL",
    displayOrder: "Display Order",
    isActive: "Is Active",
    actions: "Actions",
    edit: "Edit",
    delete: "Delete",
    add: "Add",
    update: "Update",
    updateMedia: "Update Media",
    cancel: "Cancel",
    save: "Save",
    saving: "Saving...",
    upload: "Upload",
    uploading: "Uploading...",
    noMediaFound: "No media found",
    noMediaItems: "No media items found",
    image: "Image",
    video: "Video",
    socialVideo: "Social Video",
    selectSection: "Select Section",
    uploadFile: "Upload File",
    mediaItems: "Media Items",
    serbian: "Serbian",
    english: "English",
    german: "German",
    translations: "Translations",
    active: "Active",
    inactive: "Inactive",
    status: "Status",
    type: "Type",
    currentFile: "Current File",
    optional: "Optional",
    
    // Advertisement Manager
    advertisementManager: "Advertisement Manager",
    addAdvertisement: "Add Advertisement",
    editAdvertisement: "Edit Advertisement",
    imageUrl: "Image URL",
    videoUrl: "Video URL",
    linkUrl: "Link URL",
    position: "Position",
    header: "Header",
    betweenSections: "Between Sections",
    footer: "Footer",
    clickCount: "Click Count",
    startDate: "Start Date",
    endDate: "End Date",
    adType: "Ad Type",
    imageAd: "Image Ad",
    videoAd: "Video Ad",
    noAdvertisementsFound: "No advertisements found",
    
    // Announcement Manager
    announcementManager: "Announcement Manager",
    addAnnouncement: "Add Announcement",
    editAnnouncement: "Edit Announcement",
    updateAnnouncement: "Update Announcement",
    isPublished: "Is Published",
    publishDate: "Publish Date",
    expireDate: "Expire Date",
    noAnnouncementsFound: "No announcements found",
    announcementList: "Announcement List",
    enterTitle: "Enter title",
    enterContent: "Enter content",
    
    // Page Section Manager
    pageSectionManager: "Page Section Manager",
    addPageSection: "Add Page Section",
    editPageSection: "Edit Page Section",
    sectionKey: "Section Key",
    sectionName: "Section Name",
    backgroundImageUrl: "Background Image URL",
    backgroundVideoUrl: "Background Video URL",
    noPageSectionsFound: "No page sections found",
    sectionDetails: "Section Details",
    
    // Section Manager
    sectionManager: "Section Manager",
    addSection: "Add Section",
    editSection: "Edit Section",
    sections: "Sections",
    sectionKeyDescription: "Unique key to identify the section (e.g. 'hero', 'podcast')",
    pleaseFillAllRequiredFields: "Please fill all required fields",
    sectionKeyAlreadyExists: "A section with this key already exists",
    sectionCreatedSuccessfully: "Section created successfully",
    sectionUpdatedSuccessfully: "Section updated successfully",
    sectionDeletedSuccessfully: "Section deleted successfully",
    failedToLoadSections: "Failed to load sections",
    failedToSaveSection: "Failed to save section",
    failedToDeleteSection: "Failed to delete section",
    areYouSureYouWantToDeleteThisSection: "Are you sure you want to delete this section?",
    
  },
  sr: {
    // Admin Panel Header
    adminPanel: "Админ Панел",
    welcome: "Добродошли",
    signOut: "Одјави се",
    
    // Authentication
    signIn: "Пријави се",
    signUp: "Региструј се",
    signInToYourAccount: "Пријавите се на ваш налог",
    createAnAccount: "Креирај налог",
    email: "Е-маил",
    password: "Лозинка",
    dontHaveAnAccount: "Немате налог?",
    alreadyHaveAnAccount: "Већ имате налог?",
    registrationSuccessful: "Регистрација је успешна",
    processing: "Обрада...",
    
    // Navigation
    content: "Садржај",
    media: "Медији",
    advertisements: "Обавештења",
    announcements: "Објаве",
    pageSections: "Секције Странице",
    contactLinks: "Линкови за Контакт",
    contentDescription: "Управљајте садржајем веб сајта на различитим језицима",
    mediaDescription: "Управљајте сликама и видео записима за различите секције странице",
    advertisementsDescription: "Управљајте огласима који се приказују на веб сајту",
    announcementsDescription: "Управљајте обавештењима и важним обавештењима",
    pageSectionsDescription: "Управљајте главним секцијама веб сајта",
    contactLinksDescription: "Управљајте линковима ка друштвеним мрежама и контакт информацијама",
    
    // Content Manager
    contentManager: "Менаџер Садржаја",
    language: "Језик",
    section: "Секција",
    title: "Наслов",
    description: "Опис",
    subtitle: "Поднаслов",
    quote: "Цитат",
    addressLabel: "Адреса",
    phoneLabel: "Телефон",
    emailLabel: "Емаил",
    nameLabel: "Име и презиме",
    namePlaceholder: "Ваше име и презиме",
    emailPlaceholder: "Ваш емаил",
    messageLabel: "Порука",
    messagePlaceholder: "Ваша порука",
    sendButton: "Пошаљи поруку",
    contactInfo: "Контакт информације",
    sendMessage: "Пошаљите нам поруку",
    saving: "Чување...",
    save: "Сачувај",
    
    // Media Manager
    mediaManager: "Менаџер медија",
    addMedia: "Додај Медиј",
    editMedia: "Измени Медиј",
    mediaType: "Тип Медија",
    fileUrl: "URL Фајла",
    videoFile: "Видео Фајл",
    socialUrl: "URL Друштвених Мрежа",
    thumbnailUrl: "URL Сличице",
    displayOrder: "Редослед приказа",
    isActive: "Је активно",
    actions: "Акције",
    edit: "Измени",
    delete: "Обриши",
    add: "Додај",
    update: "Ажурирај",
    updateMedia: "Ажурирај Медиј",
    cancel: "Откажи",
    save: "Сачувај",
    saving: "Чување...",
    upload: "Отпреми",
    uploading: "Отпремање...",
    noMediaFound: "Нема пронађених медија",
    noMediaItems: "Нема пронађених медија елемената",
    image: "Слика",
    video: "Видео",
    socialVideo: "Друштвени видео",
    selectSection: "Изаберите секцију",
    uploadFile: "Отпреми фајл",
    mediaItems: "Медији",
    serbian: "Српски",
    english: "Енглески",
    german: "Немачки",
    translations: "Преводи",
    active: "Активно",
    inactive: "Неактивно",
    status: "Статус",
    type: "Тип",
    currentFile: "Тренутни фајл",
    optional: "Опционо",
    
    // Advertisement Manager
    advertisementManager: "Менаџер Обавештења",
    addAdvertisement: "Додај Обавештење",
    editAdvertisement: "Измени Обавештење",
    imageUrl: "URL слике",
    videoUrl: "URL видеа",
    linkUrl: "URL линк",
    position: "Позиција",
    header: "Хедер",
    betweenSections: "Између секција",
    footer: "Футер",
    clickCount: "Број кликова",
    startDate: "Датум почетка",
    endDate: "Датум завршетка",
    adType: "Тип огласа",
    imageAd: "Слика оглас",
    videoAd: "Видео оглас",
    noAdvertisementsFound: "Нема пронађених обавештења",
    
    // Announcement Manager
    announcementManager: "Менаџер Објава",
    addAnnouncement: "Додај Објаву",
    editAnnouncement: "Измени Објаву",
    updateAnnouncement: "Ажурирај Објаву",
    isPublished: "Је објављено",
    publishDate: "Датум објаве",
    expireDate: "Датум истека",
    noAnnouncementsFound: "Нема пронађених објава",
    announcementList: "Листа објава",
    enterTitle: "Унесите наслов",
    enterContent: "Унесите садржај",
    
    // Page Section Manager
    pageSectionManager: "Менаџер Секција Странице",
    addPageSection: "Додај Секцију Странице",
    editPageSection: "Измени Секцију Странице",
    sectionKey: "Кључ Секције",
    sectionName: "Назив Секције",
    backgroundImageUrl: "URL Позадинске Слике",
    backgroundVideoUrl: "URL Позадинског Видеа",
    noPageSectionsFound: "Нема пронађених секција странице",
    sectionDetails: "Детаљи секције",
    
    // Section Manager
    sectionManager: "Менаџер Секција",
    addSection: "Додај Секцију",
    editSection: "Измени Секцију",
    sections: "Секције",
    sectionKeyDescription: "Јединствен кључ за идентификацију секције (нпр. 'hero', 'podcast')",
    pleaseFillAllRequiredFields: "Молимо попуните сва обавезна поља",
    sectionKeyAlreadyExists: "Секција са овим кључем већ постоји",
    sectionCreatedSuccessfully: "Секција је успешно креирана",
    sectionUpdatedSuccessfully: "Секција је успешно ажурирана",
    sectionDeletedSuccessfully: "Секција је успешно обрисана",
    failedToLoadSections: "Неуспешно учитавање секција",
    failedToSaveSection: "Неуспешно чување секције",
    failedToDeleteSection: "Неуспешно брисање секције",
    areYouSureYouWantToDeleteThisSection: "Да ли сте сигурни да желите да обришете ову секцију?",
  }
}

// Create context
interface AdminLanguageContextType {
  currentLanguage: string
  setLanguage: (lang: string) => void
  t: Translations
  languages: { code: string; name: string }[]
}

const AdminLanguageContext = createContext<AdminLanguageContextType | undefined>(undefined)

// Provider component
export const AdminLanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('de')
  const languages = [
    { code: 'de', name: 'Deutsch' },
    { code: 'en', name: 'English' },
    { code: 'sr', name: 'Srpski' }
  ]

  useEffect(() => {
    // Check browser language and set accordingly
    const browserLang = navigator.language.split('-')[0]
    if (translations[browserLang]) {
      setCurrentLanguage(browserLang)
    }
  }, [])

  return (
    <AdminLanguageContext.Provider 
      value={{ 
        currentLanguage, 
        setLanguage: setCurrentLanguage, 
        t: translations[currentLanguage],
        languages
      }}
    >
      {children}
    </AdminLanguageContext.Provider>
  )
}

// Hook to use translations
export const useAdminLanguage = () => {
  const context = useContext(AdminLanguageContext)
  if (!context) {
    throw new Error('useAdminLanguage must be used within an AdminLanguageProvider')
  }
  return context
}