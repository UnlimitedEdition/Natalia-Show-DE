import { supabase } from './src/integrations/supabase/client'

const setupPlaceholderContent = async () => {
  console.log('Podešavam placeholder sadržaj...')

  try {
    // Prvo se prijavljujemo kao admin korisnik
    console.log('Prijavljujem se kao admin korisnik...')
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'admin@example.com',
      password: 'admin123',
    })

    if (signInError) {
      console.error('Greška pri prijavi admin korisnika:', signInError)
      return
    }

    console.log('Uspešno prijavljen kao:', signInData.user.email)

    // Sada dodajemo placeholder tekstualni sadržaj za sve sekcije na svim jezicima
    const contentData = [
      // Hero sekcija
      {
        section_key: 'hero',
        content_key: 'title',
        language_code: 'de',
        content_value: 'Professionelle Podcasts & Kulturelle Berichterstattung'
      },
      {
        section_key: 'hero',
        content_key: 'subtitle',
        language_code: 'de',
        content_value: 'Authentische Geschichten aus der Roma-Gemeinschaft'
      },
      {
        section_key: 'hero',
        content_key: 'description',
        language_code: 'de',
        content_value: 'Authentische Geschichten aus der Roma-Gemeinschaft'
      },
      {
        section_key: 'hero',
        content_key: 'button_text',
        language_code: 'de',
        content_value: 'Entdecken Sie professionelle Podcasts, kulturelle Ereignisse und inspirierende Geschichten aus der Diaspora'
      },
      {
        section_key: 'hero',
        content_key: 'title',
        language_code: 'en',
        content_value: 'Professional Podcasts & Cultural Reporting'
      },
      {
        section_key: 'hero',
        content_key: 'subtitle',
        language_code: 'en',
        content_value: 'Authentic Stories from the Roma Community'
      },
      {
        section_key: 'hero',
        content_key: 'description',
        language_code: 'en',
        content_value: 'Authentic Stories from the Roma Community'
      },
      {
        section_key: 'hero',
        content_key: 'button_text',
        language_code: 'en',
        content_value: 'Discover professional podcasts, cultural events and inspiring stories from the diaspora'
      },
      {
        section_key: 'hero',
        content_key: 'title',
        language_code: 'sr',
        content_value: 'Професионални подкасти и културно извештавање'
      },
      {
        section_key: 'hero',
        content_key: 'subtitle',
        language_code: 'sr',
        content_value: 'Аутентичне приче из ромске заједнице'
      },
      {
        section_key: 'hero',
        content_key: 'description',
        language_code: 'sr',
        content_value: 'Аутентичне приче из ромске заједнице'
      },
      {
        section_key: 'hero',
        content_key: 'button_text',
        language_code: 'sr',
        content_value: 'Откријте професионалне подкасте, културне догађаје и инспиративне приче из дијаспоре'
      },

      // Podcast sekcija
      {
        section_key: 'podcast',
        content_key: 'title',
        language_code: 'de',
        content_value: 'Podcasts & Berichte'
      },
      {
        section_key: 'podcast',
        content_key: 'description',
        language_code: 'de',
        content_value: 'Professionelle Podcasts und Berichte über wichtige Themen der Roma-Gemeinschaft'
      },
      {
        section_key: 'podcast',
        content_key: 'title',
        language_code: 'en',
        content_value: 'Podcasts & Reports'
      },
      {
        section_key: 'podcast',
        content_key: 'description',
        language_code: 'en',
        content_value: 'Professional podcasts and reports on important topics in the Roma community'
      },
      {
        section_key: 'podcast',
        content_key: 'title',
        language_code: 'sr',
        content_value: 'Подкасти и извештаји'
      },
      {
        section_key: 'podcast',
        content_key: 'description',
        language_code: 'sr',
        content_value: 'Професионални подкасти и извештаји о важним темама у ромској заједници'
      },

      // Cultural sekcija
      {
        section_key: 'cultural',
        content_key: 'title',
        language_code: 'de',
        content_value: 'Romska Veselja'
      },
      {
        section_key: 'cultural',
        content_key: 'description',
        language_code: 'de',
        content_value: 'Feiern und kulturelle Ereignisse der Roma-Gemeinschaft'
      },
      {
        section_key: 'cultural',
        content_key: 'title',
        language_code: 'en',
        content_value: 'Romani Celebrations'
      },
      {
        section_key: 'cultural',
        content_key: 'description',
        language_code: 'en',
        content_value: 'Celebrations and cultural events of the Roma community'
      },
      {
        section_key: 'cultural',
        content_key: 'title',
        language_code: 'sr',
        content_value: 'Ромска весеља'
      },
      {
        section_key: 'cultural',
        content_key: 'description',
        language_code: 'sr',
        content_value: 'Прославе и културни догађаји ромске заједнице'
      },

      // Kitchen sekcija
      {
        section_key: 'kitchen',
        content_key: 'title',
        language_code: 'de',
        content_value: 'Küche mit Gästen'
      },
      {
        section_key: 'kitchen',
        content_key: 'description',
        language_code: 'de',
        content_value: 'Interviews mit Persönlichkeiten aus Politik, Kultur und Wissenschaft'
      },
      {
        section_key: 'kitchen',
        content_key: 'title',
        language_code: 'en',
        content_value: 'Kitchen with Guests'
      },
      {
        section_key: 'kitchen',
        content_key: 'description',
        language_code: 'en',
        content_value: 'Interviews with personalities from politics, culture and science'
      },
      {
        section_key: 'kitchen',
        content_key: 'title',
        language_code: 'sr',
        content_value: 'Кухиња са гостима'
      },
      {
        section_key: 'kitchen',
        content_key: 'description',
        language_code: 'sr',
        content_value: 'Интервјуи са личностима из политике, културе и науке'
      },

      // Diaspora sekcija
      {
        section_key: 'diaspora',
        content_key: 'title',
        language_code: 'de',
        content_value: 'Diaspora & Balkan'
      },
      {
        section_key: 'diaspora',
        content_key: 'description',
        language_code: 'de',
        content_value: 'Verbindungen zwischen der Roma-Diaspora in Deutschland und den Balkanländern'
      },
      {
        section_key: 'diaspora',
        content_key: 'title',
        language_code: 'en',
        content_value: 'Diaspora & Balkans'
      },
      {
        section_key: 'diaspora',
        content_key: 'description',
        language_code: 'en',
        content_value: 'Connections between the Roma diaspora in Germany and the Balkan countries'
      },
      {
        section_key: 'diaspora',
        content_key: 'title',
        language_code: 'sr',
        content_value: 'Дијаспора и Балкан'
      },
      {
        section_key: 'diaspora',
        content_key: 'description',
        language_code: 'sr',
        content_value: 'Повезаност ромске дијаспоре у Немачкој и земаља Балкана'
      },

      // Contact sekcija
      {
        section_key: 'contact',
        content_key: 'title',
        language_code: 'de',
        content_value: 'Kontaktieren Sie uns für Zusammenarbeit und Interviews'
      },
      {
        section_key: 'contact',
        content_key: 'description',
        language_code: 'de',
        content_value: 'Für alle Vorschläge, Zusammenarbeit und Interviews können Sie uns gerne per E-Mail kontaktieren.'
      },
      {
        section_key: 'contact',
        content_key: 'title',
        language_code: 'en',
        content_value: 'Contact us for collaborations and interviews'
      },
      {
        section_key: 'contact',
        content_key: 'description',
        language_code: 'en',
        content_value: 'For all suggestions, collaborations and interviews, feel free to contact us via email.'
      },
      {
        section_key: 'contact',
        content_key: 'title',
        language_code: 'sr',
        content_value: 'Контактирајте нас за сарадњу и интервјуе'
      },
      {
        section_key: 'contact',
        content_key: 'description',
        language_code: 'sr',
        content_value: 'За све приједлоге, сарадње и интервјуе, слободно нас контактирајте путем е-маила.'
      }
    ]

    // Dodajemo placeholder media sadržaj
    const mediaData = [
      // Podcast media
      {
        section_key: 'podcast',
        media_type: 'youtube',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        title: 'Placeholder Podcast Video 1',
        description: 'This is a placeholder video showing where actual podcast content will be displayed',
        language_code: 'de',
        is_active: true
      },
      {
        section_key: 'podcast',
        media_type: 'youtube',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        title: 'Placeholder Podcast Video 2',
        description: 'This is a placeholder video showing where actual podcast content will be displayed',
        language_code: 'de',
        is_active: true
      },
      // Cultural media
      {
        section_key: 'cultural',
        media_type: 'image',
        url: 'https://placehold.co/600x400/orange/white?text=Cultural+Event+1',
        title: 'Placeholder Cultural Image 1',
        description: 'This is a placeholder image showing where actual cultural event photos will be displayed',
        language_code: 'de',
        is_active: true
      },
      {
        section_key: 'cultural',
        media_type: 'image',
        url: 'https://placehold.co/600x400/orange/white?text=Cultural+Event+2',
        title: 'Placeholder Cultural Image 2',
        description: 'This is a placeholder image showing where actual cultural event photos will be displayed',
        language_code: 'de',
        is_active: true
      },
      // Kitchen media
      {
        section_key: 'kitchen',
        media_type: 'image',
        url: 'https://placehold.co/600x400/black/white?text=Guest+Interview+1',
        title: 'Placeholder Guest Image 1',
        description: 'This is a placeholder image showing where actual guest photos will be displayed',
        language_code: 'de',
        is_active: true
      },
      // Diaspora media
      {
        section_key: 'diaspora',
        media_type: 'image',
        url: 'https://placehold.co/600x400/blue/white?text=Diaspora+Connection',
        title: 'Placeholder Diaspora Image',
        description: 'This is a placeholder image showing where actual diaspora connection photos will be displayed',
        language_code: 'de',
        is_active: true
      }
    ]

    // Ubacujemo tekstualni sadržaj
    console.log('Dodajem tekstualni sadržaj...')
    const { error: contentError } = await supabase
      .from('content')
      .upsert(contentData, { onConflict: 'section_key, content_key, language_code' })

    if (contentError) {
      console.error('Greška pri dodavanju tekstualnog sadržaja:', contentError)
      return
    }

    console.log('Tekstualni sadržaj uspešno dodat!')

    // Ubacujemo media sadržaj
    console.log('Dodajem media sadržaj...')
    const { error: mediaError } = await supabase
      .from('media')
      .insert(mediaData)

    if (mediaError) {
      console.error('Greška pri dodavanju media sadržaja:', mediaError)
      return
    }

    console.log('Media sadržaj uspešno dodat!')
    console.log('Placeholder sadržaj je uspešno dodat u bazu podataka!')

  } catch (error) {
    console.error('Greška pri podešavanju placeholder sadržaja:', error)
  }
}

setupPlaceholderContent()