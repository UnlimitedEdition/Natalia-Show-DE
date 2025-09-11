import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

// Validate environment variables
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing required environment variables:')
  if (!SUPABASE_URL) console.error('- SUPABASE_URL')
  if (!SERVICE_KEY) console.error('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// Create a Supabase client with service role for full access
const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

// check-db.js
const { createClient } = require('@supabase/supabase-js');

// Koristimo iste konfiguracione parametre kao u aplikaciji
const SUPABASE_URL = "https://tlhjkjynchwymgfdgybq.supabase.co";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const checkDatabaseConsistency = async () => {
  console.log('Proveravam konzistentnost baze podataka...');
  
  try {
    // Dohvatamo sve sadržaje iz baze
    const { data: contentData, error } = await supabase
      .from('content')
      .select('*');
    
    if (error) {
      console.error('Greška pri dohvatanju sadržaja:', error);
      return;
    }
    
    // Grupisemo podatke po section_key, content_key i language_code
    const contentMap = new Map();
    
    contentData.forEach(item => {
      const key = `${item.section_key}|${item.content_key}|${item.language_code}`;
      if (!contentMap.has(key)) {
        contentMap.set(key, []);
      }
      contentMap.get(key).push(item);
    });
    
    // Pronalazimo duplikate (grupe sa više od jedne stavke)
    const duplicates = [];
    
    contentMap.forEach((items, key) => {
      if (items.length > 1) {
        const [section_key, content_key, language_code] = key.split('|');
        duplicates.push({
          section_key,
          content_key,
          language_code,
          values: items
        });
      }
    });
    
    // Ispisujemo rezultate
    if (duplicates.length > 0) {
      console.log('\n⚠️  PRONADJENI DUPLIKATI U BAZI PODATAKA:');
      console.log('===========================================');
      
      duplicates.forEach((group, index) => {
        console.log(`\n${index + 1}. Sekcija: ${group.section_key}, Ključ: ${group.content_key}, Jezik: ${group.language_code}`);
        group.values.forEach((item, itemIndex) => {
          console.log(`   ${itemIndex + 1}. ID: ${item.id} - Vrednost: "${item.content_value}"`);
        });
      });
    } else {
      console.log('\n✅ Nema duplikata u bazi podataka. Svi podaci su konzistentni.');
    }
    
    // Dodatna provera za nedostajuće prevode
    console.log('\nProveravam nedostajuće prevode...');
    
    // Dohvatamo sve jezike
    const { data: languages, error: languagesError } = await supabase
      .from('languages')
      .select('code');
    
    if (languagesError) {
      console.error('Greška pri dohvatanju jezika:', languagesError);
      return;
    }
    
    const languageCodes = languages.map(lang => lang.code);
    
    // Proveravamo da li postoje svi prevodi za svaku kombinaciju
    const missingTranslations = [];
    
    contentMap.forEach((items, key) => {
      const [section_key, content_key] = key.split('|');
      
      languageCodes.forEach(languageCode => {
        const fullKey = `${section_key}|${content_key}|${languageCode}`;
        if (!contentMap.has(fullKey)) {
          missingTranslations.push(`Sekcija: ${section_key}, Ključ: ${content_key}, Nedostaje prevod za jezik: ${languageCode}`);
        }
      });
    });
    
    if (missingTranslations.length > 0) {
      console.log('\n⚠️  PRONADJENI NEDOSTAJUĆI PREVODI:');
      console.log('==================================');
      missingTranslations.forEach((missing, index) => {
        console.log(`${index + 1}. ${missing}`);
      });
    } else {
      console.log('\n✅ Svi prevodi su prisutni.');
    }
    
    // Provera konzistentnosti struktura tabela
    console.log('\nProveravam strukture tabela...');
    
    // Dohvatamo sve sekcije
    const { data: sections, error: sectionsError } = await supabase
      .from('page_sections')
      .select('section_key');
    
    if (sectionsError) {
      console.error('Greška pri dohvatanju sekcija:', sectionsError);
      return;
    }
    
    const sectionKeys = sections.map(section => section.section_key);
    
    // Proveravamo da li postoje sadržaji za sekcije koje ne postoje
    const orphanedContent = [];
    
    contentMap.forEach((items, key) => {
      const [section_key] = key.split('|');
      if (!sectionKeys.includes(section_key)) {
        orphanedContent.push(`Sekcija "${section_key}" ne postoji ali ima sadržaj u bazi`);
      }
    });
    
    if (orphanedContent.length > 0) {
      console.log('\n⚠️  PRONADJEN SADRŽAJ BEZ ODGOVARAJUĆIH SEKCIJA:');
      console.log('===============================================');
      orphanedContent.forEach((orphan, index) => {
        console.log(`${index + 1}. ${orphan}`);
      });
    } else {
      console.log('\n✅ Svi sadržaji pripadaju postojećim sekcijama.');
    }
    
    console.log('\n✅ Provera konzistentnosti baze podataka je završena.');
    
  } catch (error) {
    console.error('Neočekivana greška:', error);
  }
};

// Pokrećemo proveru ako se skripta pokreće direktno
if (require.main === module) {
  checkDatabaseConsistency();
}

module.exports = checkDatabaseConsistency;