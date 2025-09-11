import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Content = Database['public']['Tables']['content']['Row'];
type Language = Database['public']['Tables']['languages']['Row'];

// Translation service to handle automatic translations and content management
class TranslationService {
  // Get translated content for a specific section and language
  async getSectionContent(sectionKey: string, languageCode: string): Promise<Record<string, string>> {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('content_key, content_value')
        .eq('section_key', sectionKey)
        .eq('language_code', languageCode)
        .eq('is_active', true);

      if (error) throw error;

      // Convert array to object for easier access
      const contentMap: Record<string, string> = {};
      data.forEach(item => {
        contentMap[item.content_key] = item.content_value || '';
      });

      return contentMap;
    } catch (error) {
      console.error('Error fetching section content:', error);
      return {};
    }
  }

  // Get translated content for a specific media item and language
  async getMediaContent(mediaId: string, languageCode: string): Promise<Record<string, string>> {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('content_key, content_value')
        .eq('media_id', mediaId)
        .eq('language_code', languageCode)
        .eq('is_active', true);

      if (error) throw error;

      // Convert array to object for easier access
      const contentMap: Record<string, string> = {};
      data.forEach(item => {
        contentMap[item.content_key] = item.content_value || '';
      });

      return contentMap;
    } catch (error) {
      console.error('Error fetching media content:', error);
      return {};
    }
  }

  // Get all translations for a specific section
  async getAllSectionTranslations(sectionKey: string): Promise<Record<string, Record<string, string>>> {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('language_code, content_key, content_value')
        .eq('section_key', sectionKey)
        .eq('is_active', true);

      if (error) throw error;

      // Group translations by language
      const translations: Record<string, Record<string, string>> = {};
      data.forEach(item => {
        if (!translations[item.language_code]) {
          translations[item.language_code] = {};
        }
        translations[item.language_code][item.content_key] = item.content_value || '';
      });

      return translations;
    } catch (error) {
      console.error('Error fetching all section translations:', error);
      return {};
    }
  }

  // Save or update section content translations
  async saveSectionContent(
    sectionKey: string,
    languageCode: string,
    content: Record<string, string>
  ): Promise<boolean> {
    try {
      // For each content key, either update existing or insert new
      for (const [contentKey, contentValue] of Object.entries(content)) {
        // Check if content already exists
        const { data: existingContent, error: fetchError } = await supabase
          .from('content')
          .select('id')
          .eq('section_key', sectionKey)
          .eq('language_code', languageCode)
          .eq('content_key', contentKey)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          throw fetchError;
        }

        if (existingContent) {
          // Update existing content
          const { error: updateError } = await supabase
            .from('content')
            .update({
              content_value: contentValue,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingContent.id);

          if (updateError) throw updateError;
        } else {
          // Insert new content
          const { error: insertError } = await supabase
            .from('content')
            .insert({
              section_key: sectionKey,
              language_code: languageCode,
              content_key: contentKey,
              content_value: contentValue,
              is_active: true
            });

          if (insertError) throw insertError;
        }
      }

      return true;
    } catch (error) {
      console.error('Error saving section content:', error);
      return false;
    }
  }

  // Save or update media content translations
  async saveMediaContent(
    mediaId: string,
    languageCode: string,
    content: Record<string, string>
  ): Promise<boolean> {
    try {
      // For each content key, either update existing or insert new
      for (const [contentKey, contentValue] of Object.entries(content)) {
        // Check if content already exists
        const { data: existingContent, error: fetchError } = await supabase
          .from('content')
          .select('id')
          .eq('media_id', mediaId)
          .eq('language_code', languageCode)
          .eq('content_key', contentKey)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          throw fetchError;
        }

        if (existingContent) {
          // Update existing content
          const { error: updateError } = await supabase
            .from('content')
            .update({
              content_value: contentValue,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingContent.id);

          if (updateError) throw updateError;
        } else {
          // Insert new content
          const { error: insertError } = await supabase
            .from('content')
            .insert({
              media_id: mediaId,
              language_code: languageCode,
              content_key: contentKey,
              content_value: contentValue,
              is_active: true
            });

          if (insertError) throw insertError;
        }
      }

      return true;
    } catch (error) {
      console.error('Error saving media content:', error);
      return false;
    }
  }

  // Get all available languages
  async getLanguages(): Promise<Language[]> {
    try {
      const { data, error } = await supabase
        .from('languages')
        .select('*')
        .eq('is_active', true)
        .order('is_default', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching languages:', error);
      return [];
    }
  }

  // Get default language
  async getDefaultLanguage(): Promise<Language | null> {
    try {
      const { data, error } = await supabase
        .from('languages')
        .select('*')
        .eq('is_default', true)
        .single();

      if (error) throw error;
      return data || null;
    } catch (error) {
      console.error('Error fetching default language:', error);
      return null;
    }
  }

  // Automatically translate content using a translation API (simplified implementation)
  async autoTranslate(text: string, targetLanguage: string): Promise<string> {
    // In a real implementation, you would integrate with a translation API like Google Translate
    // For this example, we'll just return the original text with a prefix
    // indicating it's been "translated"
    
    // This is a placeholder implementation - in a real app, you would:
    // 1. Call a translation API
    // 2. Handle API responses and errors
    // 3. Cache translations
    // 4. Handle rate limiting
    
    const translations: Record<string, string> = {
      'sr': `[SR] ${text}`,
      'en': `[EN] ${text}`,
      'de': `[DE] ${text}`
    };
    
    return translations[targetLanguage] || text;
  }
}

// Export a singleton instance of the translation service
export const translationService = new TranslationService();

// Hook for using translations in React components
export const useTranslations = () => {
  return translationService;
};