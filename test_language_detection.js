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

// Test script for language detection implementation
console.log('Testing language detection implementation...');

// Mock the region language map from LanguageProvider
const regionLanguageMap = {
  'RS': 'sr', // Serbia
  'BA': 'sr', // Bosnia and Herzegovina
  'ME': 'sr', // Montenegro
  'HR': 'sr', // Croatia (some regions)
  'MK': 'sr', // North Macedonia
  'SI': 'sr', // Slovenia (some regions)
  'DE': 'de', // Germany
  'AT': 'de', // Austria
  'CH': 'de', // Switzerland (German-speaking)
  'US': 'en', // United States
  'GB': 'en', // United Kingdom
  'CA': 'en', // Canada (English-speaking)
  'AU': 'en', // Australia
  'NZ': 'en', // New Zealand
};

// Test cases
const testCases = [
  { country: 'RS', expected: 'sr', description: 'Serbia should map to Serbian' },
  { country: 'DE', expected: 'de', description: 'Germany should map to German' },
  { country: 'US', expected: 'en', description: 'United States should map to English' },
  { country: 'XX', expected: undefined, description: 'Unknown country should not map to any language' },
  { country: null, expected: undefined, description: 'Null country should not map to any language' }
];

console.log('Running language mapping tests...\n');

let passedTests = 0;
testCases.forEach((testCase, index) => {
  const result = testCase.country ? regionLanguageMap[testCase.country] : undefined;
  const passed = result === testCase.expected;
  
  console.log(`Test ${index + 1}: ${testCase.description}`);
  console.log(`  Country: ${testCase.country}`);
  console.log(`  Expected: ${testCase.expected}`);
  console.log(`  Got: ${result}`);
  console.log(`  Result: ${passed ? 'PASS' : 'FAIL'}\n`);
  
  if (passed) passedTests++;
});

console.log(`Test Summary: ${passedTests}/${testCases.length} tests passed`);

// Test the priority order logic
console.log('\nTesting priority order logic...');

const mockLanguages = [
  { code: 'sr', is_default: false },
  { code: 'en', is_default: false },
  { code: 'de', is_default: true }
];

const urlLanguage = 'en';
const storedLanguage = 'de';
const detectedCountry = 'RS'; // Should map to 'sr'
const browserLanguage = 'en';
const defaultLanguage = mockLanguages.find(lang => lang.is_default);

console.log('Priority order test:');
console.log('1. URL parameter (?lang=en):', urlLanguage);
console.log('2. Stored preference (localStorage):', storedLanguage);
console.log('3. Detected country (RS):', regionLanguageMap[detectedCountry]);
console.log('4. Browser language:', browserLanguage);
console.log('5. Default language from DB:', defaultLanguage?.code);
console.log('6. Fallback: sr');

// Simulate the priority order logic
let selectedLanguage = 'sr'; // fallback

if (mockLanguages.some(lang => lang.code === urlLanguage)) {
  selectedLanguage = urlLanguage;
} else if (mockLanguages.some(lang => lang.code === storedLanguage)) {
  selectedLanguage = storedLanguage;
} else if (regionLanguageMap[detectedCountry] && mockLanguages.some(lang => lang.code === regionLanguageMap[detectedCountry])) {
  selectedLanguage = regionLanguageMap[detectedCountry];
} else if (mockLanguages.some(lang => lang.code === browserLanguage)) {
  selectedLanguage = browserLanguage;
} else if (defaultLanguage) {
  selectedLanguage = defaultLanguage.code;
}

console.log('\nSelected language based on priority:', selectedLanguage);
console.log('Expected: en (URL parameter has highest priority)');
console.log('Result:', selectedLanguage === 'en' ? 'PASS' : 'FAIL');

console.log('\nLanguage detection implementation test completed!');