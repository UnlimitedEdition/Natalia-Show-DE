import { useState, useEffect, useCallback } from 'react';
import { translationService } from '@/services/translationService';

// Define translations type
interface HeaderTranslations {
  navItems: {
    id: string;
    label: string;
  }[];
}

interface FooterTranslations {
  sectionsTitle: string;
  podcastSection: string;
  culturalSection: string;
  kitchenSection: string;
  diasporaSection: string;
  contactSection: string;
  emailLabel: string;
  phoneLabel: string;
  copyright: string;
  description: string;
}

export const useHeaderTranslations = () => {
  const [translations, setTranslations] = useState<HeaderTranslations>({
    navItems: []
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadTranslations = useCallback(async (languageCode: string) => {
    try {
      setIsLoading(true);
      
      // Load navigation translations from database
      const navTranslations = await translationService.getSectionContent('navigation', languageCode);
      
      // Define default navigation structure
      const defaultNavItems = [
        { id: 'hero', key: 'home' },
        { id: 'podcast', key: 'podcast' },
        { id: 'cultural', key: 'cultural' },
        { id: 'kitchen', key: 'kitchen' },
        { id: 'diaspora', key: 'diaspora' },
        { id: 'contact', key: 'contact' },
      ];
      
      // Map translations to navigation items
      const navItems = defaultNavItems.map(item => ({
        id: item.id,
        label: navTranslations[item.key] || item.key
      }));
      
      setTranslations({ navItems });
    } catch (error) {
      console.error('Error loading header translations:', error);
      // Fallback to default navigation
      const fallbackNavItems = [
        { id: 'hero', label: 'Home' },
        { id: 'podcast', label: 'Podcast' },
        { id: 'cultural', label: 'Cultural' },
        { id: 'kitchen', label: 'Kitchen' },
        { id: 'diaspora', label: 'Diaspora' },
        { id: 'contact', label: 'Contact' },
      ];
      
      setTranslations({ navItems: fallbackNavItems });
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { translations, isLoading, loadTranslations };
};

export const useFooterTranslations = () => {
  const [translations, setTranslations] = useState<FooterTranslations>({
    sectionsTitle: 'Sections',
    podcastSection: 'Podcast',
    culturalSection: 'Cultural',
    kitchenSection: 'Kitchen',
    diasporaSection: 'Diaspora',
    contactSection: 'Contact',
    emailLabel: 'Email',
    phoneLabel: 'Phone',
    copyright: '© {year} Podcast Studio. All rights reserved.',
    description: 'Professional Podcasts & Cultural Reporting'
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadTranslations = useCallback(async (languageCode: string) => {
    try {
      setIsLoading(true);
      
      // Load footer translations from database
      const footerTranslations = await translationService.getSectionContent('footer', languageCode);
      
      setTranslations({
        sectionsTitle: footerTranslations.sectionsTitle || 'Sections',
        podcastSection: footerTranslations.podcastSection || 'Podcast',
        culturalSection: footerTranslations.culturalSection || 'Cultural',
        kitchenSection: footerTranslations.kitchenSection || 'Kitchen',
        diasporaSection: footerTranslations.diasporaSection || 'Diaspora',
        contactSection: footerTranslations.contactSection || 'Contact',
        emailLabel: footerTranslations.emailLabel || 'Email',
        phoneLabel: footerTranslations.phoneLabel || 'Phone',
        copyright: footerTranslations.copyright || '© {year} Podcast Studio. All rights reserved.',
        description: footerTranslations.description || 'Professional Podcasts & Cultural Reporting'
      });
    } catch (error) {
      console.error('Error loading footer translations:', error);
      // Keep default translations
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { translations, isLoading, loadTranslations };
};
