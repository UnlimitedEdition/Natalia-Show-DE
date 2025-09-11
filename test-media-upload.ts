import { supabase } from './src/integrations/supabase/client.ts'

const testMediaUpload = async () => {
  try {
    console.log('Pokušavam autentifikaciju kao admin korisnik...')
    
    // Autentifikacija kao admin korisnik
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'admin@example.com',
      password: 'admin123',
    })
    
    if (authError) {
      console.error('Greška pri autentifikaciji:', authError)
      return
    }
    
    console.log('Uspešna autentifikacija:', authData.user.email)
    
    console.log('Testiram upload fajla u media bucket...')
    
    // Kreiramo test fajl
    const testFile = new File(['Ovo je test sadržaj'], 'test.txt', { type: 'text/plain' })
    
    // Upload fajla
    const { data, error } = await supabase
      .storage
      .from('media')
      .upload(`test-${Date.now()}.txt`, testFile)
    
    if (error) {
      console.error('Greška pri uploadu:', error)
      return
    }
    
    console.log('Upload uspešan:', data)
    
    // Dobijanje javnog URL-a
    const { data: { publicUrl } } = supabase
      .storage
      .from('media')
      .getPublicUrl(data.path)
    
    console.log('Javni URL:', publicUrl)
  } catch (error) {
    console.error('Neočekivana greška:', error)
  }
}

testMediaUpload()