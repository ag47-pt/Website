import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTable() {
  const { data, error } = await supabase
    .from('labs_projects')
    .select('sandbox_url')
    .limit(1)

  if (error) {
    console.error('Column sandbox_url might be missing:', error.message)
  } else {
    console.log('Column sandbox_url exists')
  }
}

checkTable()
