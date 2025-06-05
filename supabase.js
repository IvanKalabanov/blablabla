import { createClient } from '@supabase/supabase-js'

// Проверяем, не существует ли уже клиент в глобальной области видимости
if (!window.__supabase) {
  const SUPABASE_URL = 'https://uvmziprbabbqveimsdsn.supabase.co'
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2bXppcHJiYWJicXZlaW1zZHNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwMTkyMjAsImV4cCI6MjA2NDU5NTIyMH0.19DbvQPNuAz6pxxv-oZfMeKFZtBWneXbV0cpoR8HCS0'

  window.__supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined
    }
  })
}

// Экспортируем единственный экземпляр
export const supabase = window.__supabase