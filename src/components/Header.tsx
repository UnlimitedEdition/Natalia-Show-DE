import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { useHeaderTranslations } from '@/hooks/useHeaderFooterTranslations';
import LanguageSelector from '@/components/LanguageSelector';

const Header = () => {
  const { currentLanguage } = useLanguage();
  const { translations, isLoading, loadTranslations } = useHeaderTranslations();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    loadTranslations(currentLanguage);
  }, [currentLanguage, loadTranslations]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <header className={`fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-90 backdrop-blur-sm transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="h-6 w-32 bg-gray-700 animate-pulse rounded"></div>
          <nav className="hidden md:flex space-x-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-4 w-16 bg-gray-700 animate-pulse rounded"></div>
            ))}
          </nav>
          <div className="h-8 w-8 bg-gray-700 animate-pulse rounded"></div>
        </div>
      </header>
    );
  }

  if (!translations) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-90 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-white">Error loading translations</div>
          <LanguageSelector />
        </div>
      </header>
    );
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-90 backdrop-blur-sm transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <button 
          onClick={() => scrollToSection('hero')}
          className="text-white text-xl font-bold hover:text-yellow-400 transition-colors"
        >
          Наш Емисије
        </button>
        
        <nav className="hidden md:flex space-x-8">
          {translations.navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-white hover:text-yellow-400 transition-colors capitalize"
            >
              {item.label}
            </button>
          ))}
        </nav>
        
        <LanguageSelector />
      </div>
    </header>
  );
};

export default Header;