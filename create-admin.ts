import { supabase } from './src/integrations/supabase/client'

const createAdminUser = async () => {
  console.log('Kreiram admin korisnika...')

  try {
    // Prvo kreiramo korisnika u auth sistemu
    const { data, error } = await supabase.auth.signUp({
      email: 'admin@example.com',
      password: 'admin123',
    })

    if (error) {
      console.error('Greška pri kreiranju admin korisnika:', error)
      return
    }

    console.log('Admin korisnik kreiran:', data)

    // Zatim dodajemo korisnika u admin_users tabelu
    const { error: insertError } = await supabase
      .from('admin_users')
      .insert({
        email: 'admin@example.com',
        password_hash: 'admin123', // Ovo je samo placeholder, prava lozinka je u auth sistemu
        full_name: 'Admin User',
        is_active: true
      })

    if (insertError) {
      console.error('Greška pri dodavanju u admin_users tabelu:', insertError)
      return
    }

    console.log('Admin korisnik uspešno dodat u admin_users tabelu!')
  } catch (error) {
    console.error('Greška:', error)
  }
}

createAdminUser()