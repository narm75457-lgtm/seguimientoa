
import { createClient } from '@supabase/supabase-js';

// Credenciales proporcionadas por el usuario
const supabaseUrl = 'https://sdpcyvpucoboagrswfvh.supabase.co';
const supabaseAnonKey = 'sb_publishable_KRyFghvta6bQTaKT3CsV-A_kwIsasvF';

/**
 * NOTA PARA EL USUARIO:
 * Si recibes un error 401 o 403, es porque la clave 'sb_publishable_' 
 * no es la clave 'anon' pública correcta de Supabase.
 * La clave correcta suele ser un texto muy largo que empieza por 'eyJ...'.
 * Puedes encontrarla en Supabase -> Project Settings -> API -> anon public key.
 */

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  }
});
