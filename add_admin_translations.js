import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const SUPABASE_URL = 'https://ykixjxocfbcczvkjgwts.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlraXhqeG9jZmJjY3p2a2pnd3RzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzE2MDgyNiwiZXhwIjoyMDcyNzM2ODI2fQ.yVm112ou5zHIZnvDq2kZY4t_BRTiP0wNWHTuLyjY3lw'

// Create a Supabase client with full access
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
})

// Admin panel translations
const adminTranslations = [
  // Admin Panel Header
  { section_key: 'admin', language_code: 'de', content_key: 'adminPanel', content_value: 'Admin Panel' },
  { section_key: 'admin', language_code: 'de', content_key: 'welcome', content_value: 'Willkommen' },
  { section_key: 'admin', language_code: 'de', content_key: 'signOut', content_value: 'Abmelden' },
  
  { section_key: 'admin', language_code: 'en', content_key: 'adminPanel', content_value: 'Admin Panel' },
  { section_key: 'admin', language_code: 'en', content_key: 'welcome', content_value: 'Welcome' },
  { section_key: 'admin', language_code: 'en', content_key: 'signOut', content_value: 'Sign Out' },
  
  { section_key: 'admin', language_code: 'sr', content_key: 'adminPanel', content_value: 'Админ Панел' },
  { section_key: 'admin', language_code: 'sr', content_key: 'welcome', content_value: 'Добродошли' },
  { section_key: 'admin', language_code: 'sr', content_key: 'signOut', content_value: 'Одјави се' },
  
  // Authentication
  { section_key: 'admin', language_code: 'de', content_key: 'signIn', content_value: 'Anmelden' },
  { section_key: 'admin', language_code: 'de', content_key: 'signUp', content_value: 'Registrieren' },
  { section_key: 'admin', language_code: 'de', content_key: 'signInToYourAccount', content_value: 'Melden Sie sich bei Ihrem Konto an' },
  { section_key: 'admin', language_code: 'de', content_key: 'createAnAccount', content_value: 'Ein Konto erstellen' },
  { section_key: 'admin', language_code: 'de', content_key: 'email', content_value: 'E-Mail' },
  { section_key: 'admin', language_code: 'de', content_key: 'password', content_value: 'Passwort' },
  { section_key: 'admin', language_code: 'de', content_key: 'dontHaveAnAccount', content_value: 'Sie haben noch kein Konto?' },
  { section_key: 'admin', language_code: 'de', content_key: 'alreadyHaveAnAccount', content_value: 'Sie haben bereits ein Konto?' },
  { section_key: 'admin', language_code: 'de', content_key: 'registrationSuccessful', content_value: 'Registrierung erfolgreich' },
  { section_key: 'admin', language_code: 'de', content_key: 'processing', content_value: 'Verarbeitung...' },
  
  { section_key: 'admin', language_code: 'en', content_key: 'signIn', content_value: 'Sign In' },
  { section_key: 'admin', language_code: 'en', content_key: 'signUp', content_value: 'Sign Up' },
  { section_key: 'admin', language_code: 'en', content_key: 'signInToYourAccount', content_value: 'Sign in to your account' },
  { section_key: 'admin', language_code: 'en', content_key: 'createAnAccount', content_value: 'Create an account' },
  { section_key: 'admin', language_code: 'en', content_key: 'email', content_value: 'Email' },
  { section_key: 'admin', language_code: 'en', content_key: 'password', content_value: 'Password' },
  { section_key: 'admin', language_code: 'en', content_key: 'dontHaveAnAccount', content_value: "Don't have an account?" },
  { section_key: 'admin', language_code: 'en', content_key: 'alreadyHaveAnAccount', content_value: 'Already have an account?' },
  { section_key: 'admin', language_code: 'en', content_key: 'registrationSuccessful', content_value: 'Registration successful' },
  { section_key: 'admin', language_code: 'en', content_key: 'processing', content_value: 'Processing...' },
  
  { section_key: 'admin', language_code: 'sr', content_key: 'signIn', content_value: 'Пријави се' },
  { section_key: 'admin', language_code: 'sr', content_key: 'signUp', content_value: 'Региструј се' },
  { section_key: 'admin', language_code: 'sr', content_key: 'signInToYourAccount', content_value: 'Пријавите се на ваш налог' },
  { section_key: 'admin', language_code: 'sr', content_key: 'createAnAccount', content_value: 'Направите налог' },
  { section_key: 'admin', language_code: 'sr', content_key: 'email', content_value: 'Емаил' },
  { section_key: 'admin', language_code: 'sr', content_key: 'password', content_value: 'Лозинка' },
  { section_key: 'admin', language_code: 'sr', content_key: 'dontHaveAnAccount', content_value: 'Немате налог?' },
  { section_key: 'admin', language_code: 'sr', content_key: 'alreadyHaveAnAccount', content_value: 'Већ имате налог?' },
  { section_key: 'admin', language_code: 'sr', content_key: 'registrationSuccessful', content_value: 'Регистрација успешна' },
  { section_key: 'admin', language_code: 'sr', content_key: 'processing', content_value: 'Обрађује се...' },
  
  // Navigation
  { section_key: 'admin', language_code: 'de', content_key: 'content', content_value: 'Inhalt' },
  { section_key: 'admin', language_code: 'de', content_key: 'media', content_value: 'Medien' },
  { section_key: 'admin', language_code: 'de', content_key: 'advertisements', content_value: 'Ankündigungen' },
  { section_key: 'admin', language_code: 'de', content_key: 'announcements', content_value: 'Mitteilungen' },
  { section_key: 'admin', language_code: 'de', content_key: 'pageSections', content_value: 'Seitenabschnitte' },
  { section_key: 'admin', language_code: 'de', content_key: 'contactLinks', content_value: 'Kontaktlinks' },
  { section_key: 'admin', language_code: 'de', content_key: 'contentDescription', content_value: 'Verwalten Sie den Seiteninhalt in verschiedenen Sprachen' },
  { section_key: 'admin', language_code: 'de', content_key: 'mediaDescription', content_value: 'Verwalten Sie Bilder und Videos für verschiedene Seitenabschnitte' },
  { section_key: 'admin', language_code: 'de', content_key: 'advertisementsDescription', content_value: 'Verwalten Sie Werbeanzeigen, die auf der Website angezeigt werden' },
  { section_key: 'admin', language_code: 'de', content_key: 'announcementsDescription', content_value: 'Verwalten Sie Ankündigungen und wichtige Mitteilungen' },
  { section_key: 'admin', language_code: 'de', content_key: 'pageSectionsDescription', content_value: 'Verwalten Sie die Hauptsektionen der Website' },
  { section_key: 'admin', language_code: 'de', content_key: 'contactLinksDescription', content_value: 'Verwalten Sie Links zu sozialen Medien und Kontaktinformationen' },
  
  { section_key: 'admin', language_code: 'en', content_key: 'content', content_value: 'Content' },
  { section_key: 'admin', language_code: 'en', content_key: 'media', content_value: 'Media' },
  { section_key: 'admin', language_code: 'en', content_key: 'advertisements', content_value: 'Advertisements' },
  { section_key: 'admin', language_code: 'en', content_key: 'announcements', content_value: 'Announcements' },
  { section_key: 'admin', language_code: 'en', content_key: 'pageSections', content_value: 'Page Sections' },
  { section_key: 'admin', language_code: 'en', content_key: 'contactLinks', content_value: 'Contact Links' },
  { section_key: 'admin', language_code: 'en', content_key: 'contentDescription', content_value: 'Manage website content in different languages' },
  { section_key: 'admin', language_code: 'en', content_key: 'mediaDescription', content_value: 'Manage images and videos for different page sections' },
  { section_key: 'admin', language_code: 'en', content_key: 'advertisementsDescription', content_value: 'Manage advertisements displayed on the website' },
  { section_key: 'admin', language_code: 'en', content_key: 'announcementsDescription', content_value: 'Manage announcements and important notices' },
  { section_key: 'admin', language_code: 'en', content_key: 'pageSectionsDescription', content_value: 'Manage the main sections of the website' },
  { section_key: 'admin', language_code: 'en', content_key: 'contactLinksDescription', content_value: 'Manage social media links and contact information' },
  
  { section_key: 'admin', language_code: 'sr', content_key: 'content', content_value: 'Садржај' },
  { section_key: 'admin', language_code: 'sr', content_key: 'media', content_value: 'Медији' },
  { section_key: 'admin', language_code: 'sr', content_key: 'advertisements', content_value: 'Обавештења' },
  { section_key: 'admin', language_code: 'sr', content_key: 'announcements', content_value: 'Објаве' },
  { section_key: 'admin', language_code: 'sr', content_key: 'pageSections', content_value: 'Секције Странице' },
  { section_key: 'admin', language_code: 'sr', content_key: 'contactLinks', content_value: 'Линкови за Контакт' },
  { section_key: 'admin', language_code: 'sr', content_key: 'contentDescription', content_value: 'Управљајте садржајем веб сајта на различитим језицима' },
  { section_key: 'admin', language_code: 'sr', content_key: 'mediaDescription', content_value: 'Управљајте сликама и видеима за различите секције странице' },
  { section_key: 'admin', language_code: 'sr', content_key: 'advertisementsDescription', content_value: 'Управљајте огласима приказаним на веб сајту' },
  { section_key: 'admin', language_code: 'sr', content_key: 'announcementsDescription', content_value: 'Управљајте објавама и важним обавештењима' },
  { section_key: 'admin', language_code: 'sr', content_key: 'pageSectionsDescription', content_value: 'Управљајте главним секцијама веб сајта' },
  { section_key: 'admin', language_code: 'sr', content_key: 'contactLinksDescription', content_value: 'Управљајте линковима друштвених мрежа и контакт информацијама' },
  
  // Common terms
  { section_key: 'admin', language_code: 'de', content_key: 'language', content_value: 'Sprache' },
  { section_key: 'admin', language_code: 'de', content_key: 'section', content_value: 'Abschnitt' },
  { section_key: 'admin', language_code: 'de', content_key: 'title', content_value: 'Titel' },
  { section_key: 'admin', language_code: 'de', content_key: 'description', content_value: 'Beschreibung' },
  { section_key: 'admin', language_code: 'de', content_key: 'subtitle', content_value: 'Untertitel' },
  { section_key: 'admin', language_code: 'de', content_key: 'quote', content_value: 'Zitat' },
  { section_key: 'admin', language_code: 'de', content_key: 'addressLabel', content_value: 'Adresse' },
  { section_key: 'admin', language_code: 'de', content_key: 'phoneLabel', content_value: 'Telefon' },
  { section_key: 'admin', language_code: 'de', content_key: 'emailLabel', content_value: 'E-Mail' },
  { section_key: 'admin', language_code: 'de', content_key: 'nameLabel', content_value: 'Name' },
  { section_key: 'admin', language_code: 'de', content_key: 'namePlaceholder', content_value: 'Ihr Name' },
  { section_key: 'admin', language_code: 'de', content_key: 'emailPlaceholder', content_value: 'Ihre E-Mail' },
  { section_key: 'admin', language_code: 'de', content_key: 'messageLabel', content_value: 'Nachricht' },
  { section_key: 'admin', language_code: 'de', content_key: 'messagePlaceholder', content_value: 'Ihre Nachricht' },
  { section_key: 'admin', language_code: 'de', content_key: 'sendButton', content_value: 'Nachricht senden' },
  { section_key: 'admin', language_code: 'de', content_key: 'contactInfo', content_value: 'Kontaktinformationen' },
  { section_key: 'admin', language_code: 'de', content_key: 'sendMessage', content_value: 'Senden Sie uns eine Nachricht' },
  
  { section_key: 'admin', language_code: 'en', content_key: 'language', content_value: 'Language' },
  { section_key: 'admin', language_code: 'en', content_key: 'section', content_value: 'Section' },
  { section_key: 'admin', language_code: 'en', content_key: 'title', content_value: 'Title' },
  { section_key: 'admin', language_code: 'en', content_key: 'description', content_value: 'Description' },
  { section_key: 'admin', language_code: 'en', content_key: 'subtitle', content_value: 'Subtitle' },
  { section_key: 'admin', language_code: 'en', content_key: 'quote', content_value: 'Quote' },
  { section_key: 'admin', language_code: 'en', content_key: 'addressLabel', content_value: 'Address' },
  { section_key: 'admin', language_code: 'en', content_key: 'phoneLabel', content_value: 'Phone' },
  { section_key: 'admin', language_code: 'en', content_key: 'emailLabel', content_value: 'Email' },
  { section_key: 'admin', language_code: 'en', content_key: 'nameLabel', content_value: 'Name' },
  { section_key: 'admin', language_code: 'en', content_key: 'namePlaceholder', content_value: 'Your name' },
  { section_key: 'admin', language_code: 'en', content_key: 'emailPlaceholder', content_value: 'Your email' },
  { section_key: 'admin', language_code: 'en', content_key: 'messageLabel', content_value: 'Message' },
  { section_key: 'admin', language_code: 'en', content_key: 'messagePlaceholder', content_value: 'Your message' },
  { section_key: 'admin', language_code: 'en', content_key: 'sendButton', content_value: 'Send message' },
  { section_key: 'admin', language_code: 'en', content_key: 'contactInfo', content_value: 'Contact Information' },
  { section_key: 'admin', language_code: 'en', content_key: 'sendMessage', content_value: 'Send us a message' },
  
  { section_key: 'admin', language_code: 'sr', content_key: 'language', content_value: 'Језик' },
  { section_key: 'admin', language_code: 'sr', content_key: 'section', content_value: 'Секција' },
  { section_key: 'admin', language_code: 'sr', content_key: 'title', content_value: 'Наслов' },
  { section_key: 'admin', language_code: 'sr', content_key: 'description', content_value: 'Опис' },
  { section_key: 'admin', language_code: 'sr', content_key: 'subtitle', content_value: 'Поднаслов' },
  { section_key: 'admin', language_code: 'sr', content_key: 'quote', content_value: 'Цитат' },
  { section_key: 'admin', language_code: 'sr', content_key: 'addressLabel', content_value: 'Адреса' },
  { section_key: 'admin', language_code: 'sr', content_key: 'phoneLabel', content_value: 'Телефон' },
  { section_key: 'admin', language_code: 'sr', content_key: 'emailLabel', content_value: 'Емаил' },
  { section_key: 'admin', language_code: 'sr', content_key: 'nameLabel', content_value: 'Име' },
  { section_key: 'admin', language_code: 'sr', content_key: 'namePlaceholder', content_value: 'Ваше име' },
  { section_key: 'admin', language_code: 'sr', content_key: 'emailPlaceholder', content_value: 'Ваша емаил адреса' },
  { section_key: 'admin', language_code: 'sr', content_key: 'messageLabel', content_value: 'Порука' },
  { section_key: 'admin', language_code: 'sr', content_key: 'messagePlaceholder', content_value: 'Ваша порука' },
  { section_key: 'admin', language_code: 'sr', content_key: 'sendButton', content_value: 'Пошаљи поруку' },
  { section_key: 'admin', language_code: 'sr', content_key: 'contactInfo', content_value: 'Контакт информације' },
  { section_key: 'admin', language_code: 'sr', content_key: 'sendMessage', content_value: 'Пошаљите нам поруку' }
]

async function addAdminTranslations() {
  try {
    console.log(`Adding ${adminTranslations.length} admin panel translations...`)
    
    // Insert translations one by one to handle duplicates
    let inserted = 0
    let skipped = 0
    
    for (const translation of adminTranslations) {
      // Check if translation already exists
      const { data: existing, error: checkError } = await supabase
        .from('content')
        .select('id')
        .eq('section_key', translation.section_key)
        .eq('language_code', translation.language_code)
        .eq('content_key', translation.content_key)
        .maybeSingle()
      
      if (checkError) {
        console.error(`Error checking existing record:`, checkError)
        continue
      }
      
      if (!existing) {
        // Insert new translation
        const { error: insertError } = await supabase
          .from('content')
          .insert(translation)
        
        if (insertError) {
          console.error(`Error inserting [${translation.language_code}] ${translation.section_key}.${translation.content_key}:`, insertError)
        } else {
          inserted++
          console.log(`  ✓ Inserted: [${translation.language_code}] ${translation.section_key}.${translation.content_key}`)
        }
      } else {
        skipped++
        console.log(`  ○ Skipped (exists): [${translation.language_code}] ${translation.section_key}.${translation.content_key}`)
      }
    }
    
    console.log(`\nAdmin translations insertion completed!`)
    console.log(`  Inserted: ${inserted} records`)
    console.log(`  Skipped: ${skipped} records (already existed)`)
    
  } catch (error) {
    console.error('Error:', error)
  }
}

// Run the translation insertion
addAdminTranslations()