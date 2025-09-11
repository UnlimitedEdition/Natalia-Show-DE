-- Complete Translation System Implementation
-- This script sets up a professional translation system in the database

-- First, let's ensure we have the correct structure for the content table
-- The content table already exists with the correct structure, so we just need to add data

-- Insert default translations for page sections
-- These will be used as fallback translations when no database translations exist

-- Hero Section translations
INSERT INTO content (section_key, language_code, content_key, content_value, is_active) VALUES
  ('hero', 'sr', 'title', 'Добродошли у Наш Емисије', true),
  ('hero', 'sr', 'subtitle', 'Откријте свет нашег емисија и прича', true),
  ('hero', 'sr', 'description', 'Причамо приче које би требало да се чују, са људима који би требало да их чују', true),
  ('hero', 'en', 'title', 'Welcome to Our Shows', true),
  ('hero', 'en', 'subtitle', 'Discover the world of our shows and stories', true),
  ('hero', 'en', 'description', 'We tell stories that need to be heard, to people who need to hear them', true),
  ('hero', 'de', 'title', 'Willkommen bei unseren Sendungen', true),
  ('hero', 'de', 'subtitle', 'Entdecken Sie die Welt unserer Sendungen und Geschichten', true),
  ('hero', 'de', 'description', 'Wir erzählen Geschichten, die gehört werden müssen, an Menschen, die sie hören müssen', true)
ON CONFLICT DO NOTHING;

-- Podcast Section translations
INSERT INTO content (section_key, language_code, content_key, content_value, is_active) VALUES
  ('podcast', 'sr', 'title', 'Подкаст', true),
  ('podcast', 'sr', 'description', 'Слушајте наше најновије епизоде', true),
  ('podcast', 'en', 'title', 'Podcast', true),
  ('podcast', 'en', 'description', 'Listen to our latest episodes', true),
  ('podcast', 'de', 'title', 'Podcast', true),
  ('podcast', 'de', 'description', 'Hören Sie sich unsere neuesten Episoden an', true)
ON CONFLICT DO NOTHING;

-- Kitchen Talk Show translations
INSERT INTO content (section_key, language_code, content_key, content_value, is_active) VALUES
  ('kitchen', 'sr', 'title', 'Кухиња са гостима', true),
  ('kitchen', 'sr', 'description', 'Разговори са занимљивим личностима у неформалној атмосфери', true),
  ('kitchen', 'en', 'title', 'Kitchen with Guests', true),
  ('kitchen', 'en', 'description', 'Conversations with interesting personalities in an informal atmosphere', true),
  ('kitchen', 'de', 'title', 'Küche mit Gästen', true),
  ('kitchen', 'de', 'description', 'Gespräche mit interessanten Persönlichkeiten in einer informellen Atmosphäre', true)
ON CONFLICT DO NOTHING;

-- Cultural Section translations
INSERT INTO content (section_key, language_code, content_key, content_value, is_active) VALUES
  ('cultural', 'sr', 'title', 'Ромска весеља', true),
  ('cultural', 'sr', 'description', 'Културне приче и традиције нашег народа', true),
  ('cultural', 'en', 'title', 'Romani Celebrations', true),
  ('cultural', 'en', 'description', 'Cultural stories and traditions of our people', true),
  ('cultural', 'de', 'title', 'Romani Feierlichkeiten', true),
  ('cultural', 'de', 'description', 'Kulturelle Geschichten und Traditionen unseres Volkes', true)
ON CONFLICT DO NOTHING;

-- Diaspora Section translations
INSERT INTO content (section_key, language_code, content_key, content_value, is_active) VALUES
  ('diaspora', 'sr', 'title', 'Дијаспора и Балкан', true),
  ('diaspora', 'sr', 'description', 'Вести и приче из дијаспоре и са Балкана', true),
  ('diaspora', 'en', 'title', 'Diaspora and Balkans', true),
  ('diaspora', 'en', 'description', 'News and stories from the diaspora and the Balkans', true),
  ('diaspora', 'de', 'title', 'Diaspora und Balkan', true),
  ('diaspora', 'de', 'description', 'Nachrichten und Geschichten aus der Diaspora und vom Balkan', true)
ON CONFLICT DO NOTHING;

-- Posts Section translations
INSERT INTO content (section_key, language_code, content_key, content_value, is_active) VALUES
  ('posts', 'sr', 'title', 'Објаве', true),
  ('posts', 'sr', 'description', 'Најновије вести и обавештења', true),
  ('posts', 'en', 'title', 'Posts', true),
  ('posts', 'en', 'description', 'Latest news and announcements', true),
  ('posts', 'de', 'title', 'Beiträge', true),
  ('posts', 'de', 'description', 'Neueste Nachrichten und Ankündigungen', true)
ON CONFLICT DO NOTHING;

-- Contact Section translations
INSERT INTO content (section_key, language_code, content_key, content_value, is_active) VALUES
  ('contact', 'sr', 'title', 'Контакт', true),
  ('contact', 'sr', 'description', 'Ступите у контакт са нама', true),
  ('contact', 'sr', 'addressLabel', 'Адреса', true),
  ('contact', 'sr', 'phoneLabel', 'Телефон', true),
  ('contact', 'sr', 'emailLabel', 'Емаил', true),
  ('contact', 'sr', 'nameLabel', 'Име', true),
  ('contact', 'sr', 'namePlaceholder', 'Ваше име', true),
  ('contact', 'sr', 'emailPlaceholder', 'Ваша емаил адреса', true),
  ('contact', 'sr', 'messageLabel', 'Порука', true),
  ('contact', 'sr', 'messagePlaceholder', 'Ваша порука', true),
  ('contact', 'sr', 'sendButton', 'Пошаљи поруку', true),
  ('contact', 'sr', 'contactInfo', 'Контакт информације', true),
  ('contact', 'sr', 'sendMessage', 'Пошаљите нам поруку', true),
  ('contact', 'en', 'title', 'Contact', true),
  ('contact', 'en', 'description', 'Get in touch with us', true),
  ('contact', 'en', 'addressLabel', 'Address', true),
  ('contact', 'en', 'phoneLabel', 'Phone', true),
  ('contact', 'en', 'emailLabel', 'Email', true),
  ('contact', 'en', 'nameLabel', 'Name', true),
  ('contact', 'en', 'namePlaceholder', 'Your name', true),
  ('contact', 'en', 'emailPlaceholder', 'Your email address', true),
  ('contact', 'en', 'messageLabel', 'Message', true),
  ('contact', 'en', 'messagePlaceholder', 'Your message', true),
  ('contact', 'en', 'sendButton', 'Send message', true),
  ('contact', 'en', 'contactInfo', 'Contact Information', true),
  ('contact', 'en', 'sendMessage', 'Send us a message', true),
  ('contact', 'de', 'title', 'Kontakt', true),
  ('contact', 'de', 'description', 'Kontaktieren Sie uns', true),
  ('contact', 'de', 'addressLabel', 'Adresse', true),
  ('contact', 'de', 'phoneLabel', 'Telefon', true),
  ('contact', 'de', 'emailLabel', 'E-Mail', true),
  ('contact', 'de', 'nameLabel', 'Name', true),
  ('contact', 'de', 'namePlaceholder', 'Ihr Name', true),
  ('contact', 'de', 'emailPlaceholder', 'Ihre E-Mail-Adresse', true),
  ('contact', 'de', 'messageLabel', 'Nachricht', true),
  ('contact', 'de', 'messagePlaceholder', 'Ihre Nachricht', true),
  ('contact', 'de', 'sendButton', 'Nachricht senden', true),
  ('contact', 'de', 'contactInfo', 'Kontaktinformationen', true),
  ('contact', 'de', 'sendMessage', 'Senden Sie uns eine Nachricht', true)
ON CONFLICT DO NOTHING;

-- Add indexes for better performance on content queries
CREATE INDEX IF NOT EXISTS idx_content_section_key ON content(section_key);
CREATE INDEX IF NOT EXISTS idx_content_language_code ON content(language_code);
CREATE INDEX IF NOT EXISTS idx_content_content_key ON content(content_key);
CREATE INDEX IF NOT EXISTS idx_content_media_id ON content(media_id);

-- Add comments to describe the content table usage
COMMENT ON TABLE content IS 'Stores multilingual content for different sections and media items';
COMMENT ON COLUMN content.section_key IS 'Identifies the section this content belongs to (e.g., hero, podcast, etc.)';
COMMENT ON COLUMN content.media_id IS 'References a specific media item this content belongs to (nullable)';
COMMENT ON COLUMN content.language_code IS 'Language code for this translation (sr, en, de)';
COMMENT ON COLUMN content.content_key IS 'Key identifying the type of content (e.g., title, description)';
COMMENT ON COLUMN content.content_value IS 'Actual translated content text';