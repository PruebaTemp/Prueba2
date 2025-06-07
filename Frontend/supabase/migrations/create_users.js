// Script para crear usuarios en Supabase (ejecutar desde el dashboard de Supabase o con el CLI)
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = ''
const supabaseServiceKey = '' // ¡Importante: usar service role key!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Datos de usuarios a crear
const usuariosData = [
  { id_persona: 1, nombre_usuario: 'pdominguez', email: 'pdominguez@essalud.gob.pe' },
  { id_persona: 2, nombre_usuario: 'mmanzaneda', email: 'mmanzaneda@essalud.gob.pe' },
  { id_persona: 3, nombre_usuario: 'cgarcia', email: 'cgarcia@essalud.gob.pe' },
  { id_persona: 4, nombre_usuario: 'abarrenechea', email: 'abarrenechea@essalud.gob.pe' },
  { id_persona: 5, nombre_usuario: 'ldiaz', email: 'ldiaz@essalud.gob.pe' },
  { id_persona: 6, nombre_usuario: 'pruiz', email: 'pruiz@essalud.gob.pe' },
  { id_persona: 7, nombre_usuario: 'jhernandez', email: 'jhernandez@essalud.gob.pe' },
  { id_persona: 8, nombre_usuario: 'sbermudez', email: 'sbermudez@essalud.gob.pe' },
  { id_persona: 9, nombre_usuario: 'rflores', email: 'rflores@essalud.gob.pe' },
  { id_persona: 10, nombre_usuario: 'cvega', email: 'cvega@essalud.gob.pe' },
  { id_persona: 11, nombre_usuario: 'pcastillo', email: 'pcastillo@essalud.gob.pe' },
  { id_persona: 12, nombre_usuario: 'lromero', email: 'lromero@essalud.gob.pe' },
  { id_persona: 13, nombre_usuario: 'msanchez', email: 'msanchez@essalud.gob.pe' },
  { id_persona: 14, nombre_usuario: 'dcruz', email: 'dcruz@essalud.gob.pe' },
  { id_persona: 15, nombre_usuario: 'ogomez', email: 'ogomez@essalud.gob.pe' },
  { id_persona: 16, nombre_usuario: 'vmendoza', email: 'vmendoza@essalud.gob.pe' },
  { id_persona: 17, nombre_usuario: 'raguilar', email: 'raguilar@essalud.gob.pe' },
  { id_persona: 18, nombre_usuario: 'crios', email: 'crios@essalud.gob.pe' },
  { id_persona: 19, nombre_usuario: 'fdelgado', email: 'fdelgado@essalud.gob.pe' },
  { id_persona: 20, nombre_usuario: 'gparedes', email: 'gparedes@essalud.gob.pe' },
  { id_persona: 21, nombre_usuario: 'hcordova', email: 'hcordova@essalud.gob.pe' },
  { id_persona: 22, nombre_usuario: 'squispe', email: 'squispe@essalud.gob.pe' },
  { id_persona: 23, nombre_usuario: 'rvillanueva', email: 'rvillanueva@essalud.gob.pe' },
  { id_persona: 24, nombre_usuario: 'lespinoza', email: 'lespinoza@essalud.gob.pe' },
  { id_persona: 25, nombre_usuario: 'abarrios', email: 'abarrios@essalud.gob.pe' },
  { id_persona: 26, nombre_usuario: 'ecarrasco', email: 'ecarrasco@essalud.gob.pe' },
  { id_persona: 27, nombre_usuario: 'jnunez', email: 'jnunez@essalud.gob.pe' },
  { id_persona: 28, nombre_usuario: 'mponce', email: 'mponce@essalud.gob.pe' },
  { id_persona: 29, nombre_usuario: 'asalas', email: 'asalas@essalud.gob.pe' },
  { id_persona: 30, nombre_usuario: 'rtapia', email: 'rtapia@essalud.gob.pe' },
  { id_persona: 31, nombre_usuario: 'gluna', email: 'gluna@essalud.gob.pe' },
  { id_persona: 32, nombre_usuario: 'ncastro', email: 'ncastro@essalud.gob.pe' },
  { id_persona: 33, nombre_usuario: 'framos', email: 'framos@essalud.gob.pe' },
  { id_persona: 34, nombre_usuario: 'avargas', email: 'avargas@essalud.gob.pe' },
  { id_persona: 35, nombre_usuario: 'mjimenez', email: 'mjimenez@essalud.gob.pe' },
  { id_persona: 36, nombre_usuario: 'laliaga', email: 'laliaga@essalud.gob.pe' },
  { id_persona: 37, nombre_usuario: 'rcabrera', email: 'rcabrera@essalud.gob.pe' },
  { id_persona: 38, nombre_usuario: 'dzuniga', email: 'dzuniga@essalud.gob.pe' },
  { id_persona: 39, nombre_usuario: 'hmesa', email: 'hmesa@essalud.gob.pe' },
  { id_persona: 40, nombre_usuario: 'cvaldivia', email: 'cvaldivia@essalud.gob.pe' },
  { id_persona: 41, nombre_usuario: 'eparedes', email: 'eparedes@essalud.gob.pe' },
  { id_persona: 42, nombre_usuario: 'mrojas', email: 'mrojas@essalud.gob.pe' },
  { id_persona: 43, nombre_usuario: 'ssilva', email: 'ssilva@essalud.gob.pe' },
  { id_persona: 44, nombre_usuario: 'pmunoz', email: 'pmunoz@essalud.gob.pe' },
  { id_persona: 45, nombre_usuario: 'jcaceres', email: 'jcaceres@essalud.gob.pe' },
  { id_persona: 46, nombre_usuario: 'tdavila', email: 'tdavila@essalud.gob.pe' },
  { id_persona: 47, nombre_usuario: 'acampos', email: 'acampos@essalud.gob.pe' },
  { id_persona: 48, nombre_usuario: 'cvaldez', email: 'cvaldez@essalud.gob.pe' },
  { id_persona: 49, nombre_usuario: 'lacosta', email: 'lacosta@essalud.gob.pe' },
  { id_persona: 50, nombre_usuario: 'pleon', email: 'pleon@essalud.gob.pe' },
  { id_persona: 51, nombre_usuario: 'rtorres', email: 'rtorres@essalud.gob.pe' },
  { id_persona: 52, nombre_usuario: 'msoto', email: 'msoto@essalud.gob.pe' },
  { id_persona: 53, nombre_usuario: 'dmedina', email: 'dmedina@essalud.gob.pe' },
  { id_persona: 54, nombre_usuario: 'yguerrero', email: 'yguerrero@essalud.gob.pe' },
  { id_persona: 55, nombre_usuario: 'alopez', email: 'alopez@essalud.gob.pe' },
  { id_persona: 56, nombre_usuario: 'bmedina', email: 'bmedina@essalud.gob.pe' },
  { id_persona: 57, nombre_usuario: 'fchavez', email: 'fchavez@essalud.gob.pe' },
  { id_persona: 58, nombre_usuario: 'idavila', email: 'idavila@essalud.gob.pe' },
  { id_persona: 59, nombre_usuario: 'ecampos', email: 'ecampos@essalud.gob.pe' },
  { id_persona: 60, nombre_usuario: 'erios', email: 'erios@essalud.gob.pe' },
  { id_persona: 61, nombre_usuario: 'vaguilar', email: 'vaguilar@essalud.gob.pe' },
  { id_persona: 62, nombre_usuario: 'rvaldez', email: 'rvaldez@essalud.gob.pe' },
  { id_persona: 63, nombre_usuario: 'gacosta', email: 'gacosta@essalud.gob.pe' },
  { id_persona: 64, nombre_usuario: 'xdelgado', email: 'xdelgado@essalud.gob.pe' },
  { id_persona: 65, nombre_usuario: 'rparedes', email: 'rparedes@essalud.gob.pe' },
  { id_persona: 66, nombre_usuario: 'vleon', email: 'vleon@essalud.gob.pe' },
  { id_persona: 67, nombre_usuario: 'mcordova', email: 'mcordova@essalud.gob.pe' },
  { id_persona: 68, nombre_usuario: 'lquispe', email: 'lquispe@essalud.gob.pe' },
  { id_persona: 69, nombre_usuario: 'svillanueva', email: 'svillanueva@essalud.gob.pe' },
  { id_persona: 70, nombre_usuario: 'aespinoza', email: 'aespinoza@essalud.gob.pe' },
  { id_persona: 71, nombre_usuario: 'rbarrios', email: 'rbarrios@essalud.gob.pe' },
  { id_persona: 72, nombre_usuario: 'icarrasco', email: 'icarrasco@essalud.gob.pe' },
  { id_persona: 73, nombre_usuario: 'onunez', email: 'onunez@essalud.gob.pe' },
  { id_persona: 74, nombre_usuario: 'fponce', email: 'fponce@essalud.gob.pe' },
  { id_persona: 75, nombre_usuario: 'esalas', email: 'esalas@essalud.gob.pe' },
  { id_persona: 76, nombre_usuario: 'gtapia', email: 'gtapia@essalud.gob.pe' },
  { id_persona: 77, nombre_usuario: 'iluna', email: 'iluna@essalud.gob.pe' },
  { id_persona: 78, nombre_usuario: 'pcastro', email: 'pcastro@essalud.gob.pe' },
  { id_persona: 79, nombre_usuario: 'mramos', email: 'mramos@essalud.gob.pe' },
  { id_persona: 80, nombre_usuario: 'nvargas', email: 'nvargas@essalud.gob.pe' },
  { id_persona: 81, nombre_usuario: 'ajimenez', email: 'ajimenez@essalud.gob.pe' },
  { id_persona: 82, nombre_usuario: 'maliaga', email: 'maliaga@essalud.gob.pe' },
  { id_persona: 83, nombre_usuario: 'ccabrera', email: 'ccabrera@essalud.gob.pe' },
  { id_persona: 84, nombre_usuario: 'szuniga', email: 'szuniga@essalud.gob.pe' },
  { id_persona: 85, nombre_usuario: 'pmesa', email: 'pmesa@essalud.gob.pe' },
  { id_persona: 86, nombre_usuario: 'kvaldivia', email: 'kvaldivia@essalud.gob.pe' },
  { id_persona: 87, nombre_usuario: 'aparedes', email: 'aparedes@essalud.gob.pe' },
  { id_persona: 88, nombre_usuario: 'trojas', email: 'trojas@essalud.gob.pe' },
  { id_persona: 89, nombre_usuario: 'gsilva', email: 'gsilva@essalud.gob.pe' },
  { id_persona: 90, nombre_usuario: 'lmunoz', email: 'lmunoz@essalud.gob.pe' },
  { id_persona: 91, nombre_usuario: 'gcaceres', email: 'gcaceres@essalud.gob.pe' },
  { id_persona: 92, nombre_usuario: 'vdavila', email: 'vdavila@essalud.gob.pe' },
  { id_persona: 93, nombre_usuario: 'pcampos', email: 'pcampos@essalud.gob.pe' },
  { id_persona: 94, nombre_usuario: 'mvaldez', email: 'mvaldez@essalud.gob.pe' },
  { id_persona: 95, nombre_usuario: 'hacosta', email: 'hacosta@essalud.gob.pe' },
  { id_persona: 96, nombre_usuario: 'aleon', email: 'aleon@essalud.gob.pe' },
  { id_persona: 97, nombre_usuario: 'btorres', email: 'btorres@essalud.gob.pe' },
  { id_persona: 98, nombre_usuario: 'csoto', email: 'csoto@essalud.gob.pe' },
  { id_persona: 99, nombre_usuario: 'amedina', email: 'amedina@essalud.gob.pe' },
  { id_persona: 100, nombre_usuario: 'eguerrero', email: 'eguerrero@essalud.gob.pe' }
];

async function createUsersAndPopulateTable() {
  console.log('Iniciando creación de usuarios...')
  
  for (const userData of usuariosData) {
    try {
      // 1. Crear usuario en Supabase Auth
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: 'TempPass123!', // Contraseña temporal
        email_confirm: true, // Confirmar email automáticamente
        user_metadata: {
          nombre_usuario: userData.nombre_usuario,
          id_persona: userData.id_persona
        }
      })

      if (authError) {
        console.error(`Error creando usuario ${userData.nombre_usuario}:`, authError)
        continue
      }

      console.log(`Usuario ${userData.nombre_usuario} creado en Auth con ID: ${authUser.user.id}`)

    } catch (error) {
      console.error(`Error general para usuario ${userData.nombre_usuario}:`, error)
    }
  }

  console.log('Proceso completado!')
}

// Ejecutar la función
createUsersAndPopulateTable()