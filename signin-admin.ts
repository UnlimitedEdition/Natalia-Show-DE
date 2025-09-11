import { supabase } from './src/integrations/supabase/client'

const signInAdmin = async () => {
  console.log('Prijavljujem admin korisnika...')

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@example.com',
      password: 'admin123',
    })

    if (error) {
      console.error('Greška pri prijavi admin korisnika:', error)
      return
    }

    console.log('Admin korisnik uspešno prijavljen:', data)
    
    // Sada kada smo prijavljeni, pokušaćemo da dodamo placeholder sadržaj
    // direktno u bazu (zaobići RLS politike)
  } catch (error) {
    console.error('Greška:', error)
  }
}

signInAdmin()