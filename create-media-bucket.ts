import { supabase } from './src/integrations/supabase/client.ts'

const createMediaBucket = async () => {
  try {
    console.log('Proveravam postojeće buckete...')
    
    // Provera postojećih bucket-a
    const { data: buckets, error: listError } = await supabase
      .storage
      .listBuckets()
    
    if (listError) {
      console.error('Greška pri listanju bucket-a:', listError)
      return
    }
    
    console.log('Postojeći bucketi:', buckets)
    
    // Provera da li postoji media bucket
    const mediaBucketExists = buckets?.some(bucket => bucket.name === 'media')
    
    if (!mediaBucketExists) {
      console.log('Kreiram media bucket...')
      
      // Kreiranje media bucketa sa minimalnim parametrima
      const { data, error } = await supabase
        .storage
        .createBucket('media')
      
      if (error) {
        console.error('Greška pri kreiranju media bucketa:', error)
        return
      }
      
      console.log('Media bucket uspešno kreiran:', data)
      
      // Postavljanje bucket-a kao javnog
      const { error: updateError } = await supabase
        .storage
        .updateBucket('media', {
          public: true
        })
      
      if (updateError) {
        console.error('Greška pri ažuriranju media bucketa:', updateError)
        return
      }
      
      console.log('Media bucket ažuriran kao javni')
    } else {
      console.log('Media bucket već postoji')
    }
  } catch (error) {
    console.error('Neočekivana greška:', error)
  }
}

createMediaBucket()