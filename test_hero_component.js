import { translationService } from './src/services/translationService.js';

async function testHeroComponent() {
  try {
    console.log('Testing Hero component translation loading...');
    
    // Test loading hero translations
    const translations = await translationService.getSectionContent('hero', 'sr');
    console.log('Hero translations in Serbian:', translations);
    
    // Test with different language
    const enTranslations = await translationService.getSectionContent('hero', 'en');
    console.log('Hero translations in English:', enTranslations);
    
    // Test with German
    const deTranslations = await translationService.getSectionContent('hero', 'de');
    console.log('Hero translations in German:', deTranslations);
    
  } catch (error) {
    console.error('Error testing Hero component:', error);
  }
}

// Run the test
testHeroComponent();