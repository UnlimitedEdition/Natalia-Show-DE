import { useState, useCallback } from 'react';
import { translationService } from '@/services/translationService';

// Custom hook for managing translations in components
export const useTranslations = (sectionKey: string) => {
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to load translations for a specific section and language
  const loadTranslations = useCallback(async (languageCode: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const content = await translationService.getSectionContent(sectionKey, languageCode);
      setTranslations(content);
      return content;
    } catch (err) {
      setError('Failed to load translations');
      console.error('Translation loading error:', err);
      return {};
    } finally {
      setIsLoading(false);
    }
  }, [sectionKey]);

  // Function to get a specific translation value with fallback
  const t = useCallback((key: string, fallback?: string): string => {
    return translations[key] || fallback || key;
  }, [translations]);

  return {
    translations,
    isLoading,
    error,
    loadTranslations,
    t
  };
};

// Hook for managing media translations
export const useMediaTranslations = (mediaId: string) => {
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to load translations for a specific media item and language
  const loadTranslations = useCallback(async (languageCode: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const content = await translationService.getMediaContent(mediaId, languageCode);
      setTranslations(content);
      return content;
    } catch (err) {
      setError('Failed to load media translations');
      console.error('Media translation loading error:', err);
      return {};
    } finally {
      setIsLoading(false);
    }
  }, [mediaId]);

  // Function to get a specific translation value with fallback
  const t = useCallback((key: string, fallback?: string): string => {
    return translations[key] || fallback || key;
  }, [translations]);

  return {
    translations,
    isLoading,
    error,
    loadTranslations,
    t
  };
};