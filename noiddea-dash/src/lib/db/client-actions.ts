/**
 * Acciones cliente para base de datos usando IPC de Tauri
 * Estas funciones solo funcionan en el cliente Tauri
 */

import { queryOne, query, transaction, execute, generateId } from '@/lib/database';
import { isNative, getNativeAPI } from '@/lib/native';

/**
 * Hashea una contraseña usando IPC de Tauri
 */
async function hashPasswordClient(password: string): Promise<string> {
  // Solo funciona en cliente Tauri
  if (typeof window === 'undefined') {
    throw new Error('hashPasswordClient solo funciona en el cliente');
  }

  if (!isNative()) {
    throw new Error('hashPasswordClient requiere Tauri. Ejecuta la aplicación usando: npm run tauri dev');
  }

  const native = await getNativeAPI();
  if (!native?.auth?.hashPassword) {
    throw new Error('Auth API no está disponible. Asegúrate de que Tauri esté corriendo.');
  }

  const result = await native.auth.hashPassword(password);
  if (!result.success) {
    throw new Error(result.error || 'Error hasheando contraseña');
  }

  return result.data?.hash || '';
}

/**
 * Verifica si existe un business en la base de datos (desde el cliente Tauri)
 * LÓGICA SIMPLIFICADA: Solo consulta vía IPC
 */
export async function checkBusinessExistsClient(): Promise<{
  exists: boolean;
  hasBusiness: boolean;
}> {
  // Verificar si estamos en Tauri
  // Durante SSR, window no está definido, así que retornamos false silenciosamente
  if (typeof window === 'undefined') {
    // SSR: No podemos acceder a la base de datos del cliente durante SSR
    // Retornar false es el comportamiento esperado
    return { exists: false, hasBusiness: false };
  }

  // Verificar si estamos en Tauri
  if (!isNative()) {
    // No estamos en Tauri, retornar false
    // Esto es normal cuando se ejecuta en el navegador sin Tauri
    return { exists: false, hasBusiness: false };
  }

  // Intentar obtener la API nativa de Tauri
  const native = await getNativeAPI();
  if (!native || !native.db) {
    // No podemos acceder a la base de datos, retornar false
    return { exists: false, hasBusiness: false };
  }

  try {
    // Consultar directamente usando IPC de Tauri
    // Usar queryOne que es más simple y directo
    const business = await queryOne<{ id: string; name: string; tax_id: string }>(
      `SELECT id, name, tax_id FROM businesses LIMIT 1`
    );

    if (business && business.id) {
      return { exists: true, hasBusiness: true };
    }

    // No hay business
    return { exists: false, hasBusiness: false };
  } catch (error: any) {
    const errorMsg = error?.message || String(error) || '';
    // Si la tabla no existe, no hay business
    if (errorMsg.includes('no such table') || errorMsg.includes('SQLITE_ERROR') || errorMsg.includes('Database API')) {
      return { exists: false, hasBusiness: false };
    }

    // Otro error, loguear pero retornar false para permitir acceso
    console.warn('[checkBusinessExistsClient] Error querying business:', errorMsg);
    return { exists: false, hasBusiness: false };
  }
}

/**
 * Valida que el nombre del negocio no esté en uso (versión cliente)
 * Solo funciona en modo Tauri usando IPC
 */
export async function validateBusinessNameClient(name: string): Promise<{
  success: boolean;
  available?: boolean;
  error?: string;
}> {
  console.log('🔍 [validateBusinessNameClient] Iniciando validación. Nombre:', name);

  // Solo funciona en cliente Tauri
  if (typeof window === 'undefined') {
    console.error('❌ [validateBusinessNameClient] No está en el cliente');
    return {
      success: false,
      error: 'Esta función solo funciona en el cliente Tauri',
    };
  }

  console.log('🔍 [validateBusinessNameClient] Verificando entorno nativo...');
  const nativeCheck = isNative();
  console.log('🔍 [validateBusinessNameClient] isNative():', nativeCheck);

  if (!nativeCheck) {
    console.error('❌ [validateBusinessNameClient] No está en entorno nativo (Tauri)');
    return {
      success: false,
      error: 'Esta función requiere Tauri. Por favor, ejecuta la aplicación usando: npm run tauri dev',
    };
  }

  try {
    if (!name || !name.trim()) {
      console.error('❌ [validateBusinessNameClient] Nombre vacío');
      return { success: false, error: 'El nombre del negocio es requerido' };
    }

    const trimmedName = name.trim();
    console.log('🔍 [validateBusinessNameClient] Nombre procesado:', trimmedName);

    // Verificar si el nombre ya está en uso usando IPC
    console.log('🔍 [validateBusinessNameClient] Consultando base de datos...');
    const existingBusiness = await queryOne<{ id: string }>(
      `SELECT id FROM businesses WHERE name = ? LIMIT 1`,
      [trimmedName]
    );

    console.log('🔍 [validateBusinessNameClient] Resultado de consulta:', existingBusiness);

    if (existingBusiness) {
      console.log('❌ [validateBusinessNameClient] Nombre ya está en uso');
      return {
        success: false,
        error: 'Este nombre de negocio ya está en uso',
        available: false,
      };
    }

    console.log('✅ [validateBusinessNameClient] Nombre disponible');
    return { success: true, available: true };
  } catch (error) {
    console.error('❌ [validateBusinessNameClient] Error validando nombre de negocio:', error);

    // Provide more helpful error messages
    let errorMessage = 'Error desconocido';
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error('❌ [validateBusinessNameClient] Error details:', {
        message: error.message,
        stack: error.stack,
      });
      // Check for IPC handler errors
      if (error.message.includes('No handler registered') || error.message.includes('handlers de base de datos')) {
        errorMessage = 'Los handlers de base de datos no están registrados. Por favor, reinicia la aplicación Tauri o ejecuta: npm run tauri dev';
      } else if (error.message.includes('Database API no está disponible')) {
        errorMessage = 'La base de datos no está disponible. Asegúrate de que la aplicación Tauri esté corriendo.';
      }
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Valida que el email no esté registrado (versión cliente)
 * Solo funciona en modo Electron usando IPC
 */
export async function validateEmailClient(email: string): Promise<{
  success: boolean;
  error?: string;
}> {
  // Solo funciona en cliente Electron
  if (typeof window === 'undefined' || !isNative()) {
    return {
      success: false,
      error: 'Solo funciona en modo Electron desde el cliente',
    };
  }

  try {
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Email inválido' };
    }

    // Verificar si el email ya está registrado usando IPC
    const existingUser = await queryOne<{ id: string }>(
      `SELECT id FROM users WHERE email = ?`,
      [email]
    );

    if (existingUser) {
      return { success: false, error: 'Este correo ya está registrado' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error validando email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Registra un nuevo usuario con email y contraseña desde el cliente
 * Crea usuario en auth_users, en tabla users y crea el business asociado
 * Solo funciona en modo Tauri usando IPC
 */
export async function signupUserClient(data: {
  email: string;
  name: string;
  phone: string;
  password: string;
  businessName: string;
  taxId?: string;
}): Promise<{
  success: boolean;
  error?: string;
  userId?: string;
  email?: string;
  businessId?: string;
  businessName?: string;
}> {
  // Solo funciona en cliente Tauri
  if (typeof window === 'undefined' || !isNative()) {
    return {
      success: false,
      error: 'Solo funciona en modo Tauri desde el cliente. Ejecuta: npm run tauri dev',
    };
  }

  try {
    console.log('🔍 [signupUserClient] Iniciando registro de usuario...');
    console.log('🔍 [signupUserClient] Datos recibidos:', {
      email: data.email,
      name: data.name,
      phone: data.phone,
      businessName: data.businessName,
    });

    // Validar datos
    if (!data.email || !data.name || !data.phone || !data.password || !data.businessName) {
      return { success: false, error: 'Todos los campos son requeridos' };
    }

    if (data.password.length < 8) {
      return {
        success: false,
        error: 'La contraseña debe tener al menos 8 caracteres',
      };
    }

    // Asegurar que la base de datos esté inicializada
    // Esto se hace automáticamente en query(), pero lo hacemos explícitamente aquí
    console.log('🔍 [signupUserClient] Verificando inicialización de base de datos...');

    // Verificar que el nombre del negocio no esté en uso
    // Esta query también inicializará el esquema si es necesario
    console.log('🔍 [signupUserClient] Verificando nombre de negocio:', data.businessName.trim());
    let existingBusiness;
    try {
      existingBusiness = await queryOne<{ id: string }>(
        `SELECT id FROM businesses WHERE name = ?`,
        [data.businessName.trim()]
      );
      console.log('✅ [signupUserClient] Verificación de nombre completada:', existingBusiness ? 'en uso' : 'disponible');
    } catch (error) {
      console.error('❌ [signupUserClient] Error verificando nombre de negocio:', error);
      throw error;
    }

    if (existingBusiness) {
      return {
        success: false,
        error: 'Este nombre de negocio ya está en uso',
      };
    }

    // Verificar que el email no esté registrado
    const existingUser = await queryOne<{ id: string }>(
      `SELECT id FROM users WHERE email = ?`,
      [data.email]
    );

    if (existingUser) {
      return {
        success: false,
        error: 'Este correo ya está registrado',
      };
    }

    // Generar IDs
    const userId = generateId();
    const businessId = generateId();
    const businessUserId = generateId();

    console.log('🔍 [signupUserClient] IDs generados:', {
      userId,
      businessId,
      businessUserId,
    });

    // Hashear password - usar función del servidor importada dinámicamente
    console.log('🔍 [signupUserClient] Hasheando contraseña...');
    const passwordHash = await hashPasswordClient(data.password);
    console.log('✅ [signupUserClient] Contraseña hasheada correctamente');

    // ELIMINADO: Creación de branch
    // Ahora trabajamos directamente con business, sin branches
    // Crear todo en una transacción usando IPC
    console.log('🔍 [signupUserClient] Ejecutando transacción para crear usuario, business y relación...');
    const transactionResult = await transaction([
      // 1. Crear usuario en tabla users
      {
        sql: `INSERT INTO users (id, email, name, phone) VALUES (?, ?, ?, ?)`,
        params: [userId, data.email, data.name, data.phone],
      },
      // 2. Crear usuario de autenticación con password hasheado
      {
        sql: `INSERT INTO auth_users (user_id, email, password_hash) VALUES (?, ?, ?)`,
        params: [userId, data.email, passwordHash],
      },
      // 3. Crear el negocio
      {
        sql: `INSERT INTO businesses (id, name, tax_id, theme) VALUES (?, ?, ?, ?)`,
        params: [
          businessId,
          data.businessName.trim(),
          data.taxId?.trim() || 'Pendiente',
          null, // theme se puede configurar después
        ],
      },
      // 4. Asignar usuario como owner del negocio
      {
        sql: `INSERT INTO businesses_users (id, business_id, user_id, role, is_active) VALUES (?, ?, ?, ?, ?)`,
        params: [businessUserId, businessId, userId, 'owner', 1],
      },
    ]);

    console.log('✅ [signupUserClient] Transacción ejecutada correctamente');
    console.log('🔍 [signupUserClient] Resultado de transacción:', transactionResult);

    // Verificar que todo se creó correctamente
    console.log('🔍 [signupUserClient] Verificando que todo se creó correctamente...');

    // Verificar usuario
    const verifyUser = await queryOne<{ id: string; email: string }>(
      `SELECT id, email FROM users WHERE id = ?`,
      [userId]
    );

    if (!verifyUser) {
      console.error('❌ [signupUserClient] ERROR: Usuario no se creó correctamente');
      return {
        success: false,
        error: 'Error: Usuario no se creó correctamente',
      };
    }
    console.log('✅ [signupUserClient] Usuario verificado:', verifyUser.email);

    // Verificar business
    const verifyBusiness = await queryOne<{ id: string; name: string; tax_id: string }>(
      `SELECT id, name, tax_id FROM businesses WHERE id = ?`,
      [businessId]
    );

    if (!verifyBusiness) {
      console.error('❌ [signupUserClient] ERROR: Business no se creó correctamente');
      return {
        success: false,
        error: 'Error: Business no se creó correctamente',
      };
    }
    console.log('✅ [signupUserClient] Business verificado:', verifyBusiness.name, verifyBusiness.tax_id);

    // Verificar que el rol se asignó correctamente
    const verifyOwner = await queryOne<{
      id: string;
      business_id: string;
      user_id: string;
      role: string;
      is_active: number;
    }>(
      `SELECT id, business_id, user_id, role, is_active FROM businesses_users WHERE id = ?`,
      [businessUserId]
    );

    if (!verifyOwner) {
      console.error('❌ [signupUserClient] ERROR: No se pudo verificar el rol asignado!');
      return {
        success: false,
        error: 'Error: No se pudo verificar el rol asignado',
      };
    }

    console.log('✅ [signupUserClient] Verificación - Rol asignado correctamente:', {
      id: verifyOwner.id,
      user_id: verifyOwner.user_id,
      business_id: verifyOwner.business_id,
      role: verifyOwner.role,
      is_active: verifyOwner.is_active,
    });

    if (verifyOwner.role !== 'owner' || verifyOwner.is_active !== 1) {
      console.error('❌ [signupUserClient] ERROR: El rol no se asignó correctamente!', verifyOwner);
      return {
        success: false,
        error: 'Error: El rol no se asignó correctamente',
      };
    }

    console.log('✅ [signupUserClient] Usuario registrado:', data.email);
    console.log('✅ [signupUserClient] Negocio creado:', businessId, data.businessName.trim());
    console.log('✅ [signupUserClient] Usuario asignado como owner:', userId, '→', businessId);

    return {
      success: true,
      userId,
      email: data.email,
      businessId,
      businessName: data.businessName.trim(),
    };
  } catch (error) {
    console.error('Error en signupUserClient:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Verifica una contraseña usando IPC de Tauri
 */
async function verifyPasswordClient(password: string, hash: string): Promise<boolean> {
  if (typeof window === 'undefined' || !isNative()) {
    throw new Error('verifyPasswordClient solo funciona en Tauri. Ejecuta: npm run tauri dev');
  }

  const native = await getNativeAPI();
  if (!native?.auth?.verifyPassword) {
    throw new Error('Auth API no está disponible');
  }

  const result = await native.auth.verifyPassword(password, hash);
  if (!result.success) {
    throw new Error(result.error || 'Error verificando contraseña');
  }

  return result.data?.isValid || false;
}

/**
 * Genera un token JWT usando IPC de Tauri
 */
async function generateTokenClient(userId: string, email: string): Promise<string> {
  if (typeof window === 'undefined' || !isNative()) {
    throw new Error('generateTokenClient solo funciona en Tauri. Ejecuta: npm run tauri dev');
  }

  const native = await getNativeAPI();
  if (!native?.auth?.generateToken) {
    throw new Error('Auth API no está disponible');
  }

  const result = await native.auth.generateToken(userId, email);
  if (!result.success) {
    throw new Error(result.error || 'Error generando token');
  }

  return result.data?.token || '';
}

/**
 * Crea una sesión en la base de datos usando IPC
 */
export async function createSessionClient(userId: string, email: string): Promise<string> {
  const token = await generateTokenClient(userId, email);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 días

  const sessionId = generateId();

  // Crear sesión en la base de datos usando IPC
  await execute(
    `INSERT INTO auth_sessions (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)`,
    [sessionId, userId, token, expiresAt.toISOString()]
  );

  return token;
}

/**
 * Autentica un usuario usando IPC de Tauri
 */
export async function authenticateUserClient(
  email: string,
  password: string
): Promise<{ userId: string; email: string } | null> {
  // Obtener usuario de autenticación usando IPC
  const authUser = await queryOne<{
    user_id: string;
    email: string;
    password_hash: string;
  }>(
    `SELECT user_id, email, password_hash FROM auth_users WHERE email = ?`,
    [email]
  );

  if (!authUser) {
    return null;
  }

  // Verificar contraseña usando IPC
  const isValid = await verifyPasswordClient(password, authUser.password_hash);
  if (!isValid) {
    return null;
  }

  // Actualizar último login usando IPC
  await execute(
    `UPDATE auth_users SET last_login = datetime('now') WHERE user_id = ?`,
    [authUser.user_id]
  );

  return {
    userId: authUser.user_id,
    email: authUser.email,
  };
}

/**
 * Inicia sesión con email y contraseña desde el cliente
 * Solo funciona en modo Electron usando IPC
 */
export async function loginUserClient(data: {
  email: string;
  password: string;
}): Promise<{
  success: boolean;
  error?: string;
  userId?: string;
  email?: string;
  hasBusiness?: boolean;
  businessId?: string;
  role?: string;
  branchId?: string;
  isOwner?: boolean;
  isCashier?: boolean;
  token?: string;
}> {
  // Solo funciona en cliente Electron
  if (typeof window === 'undefined' || !isNative()) {
    return {
      success: false,
      error: 'Solo funciona en modo Electron desde el cliente',
    };
  }

  try {
    // Validar datos
    if (!data.email || !data.password) {
      return { success: false, error: 'Email y contraseña son requeridos' };
    }

    // Autenticar usuario usando IPC
    const authResult = await authenticateUserClient(data.email, data.password);

    if (!authResult) {
      return {
        success: false,
        error: 'Email o contraseña incorrectos',
      };
    }


    // Verificar si el usuario es owner (business level) usando IPC
    const businessUser = await queryOne<{
      business_id: string;
      role: string;
      tax_id: string | null;
    }>(
      `SELECT bu.business_id, bu.role, b.tax_id 
       FROM businesses_users bu
       INNER JOIN businesses b ON b.id = bu.business_id
       WHERE bu.user_id = ? AND bu.is_active = 1`,
      [authResult.userId]
    );

    // Si no es owner, verificar si es cashier (branch level)
    if (!businessUser) {
      const branchUser = await queryOne<{
        branch_id: string;
        role: string;
        business_id: string;
      }>(
        `SELECT bu.branch_id, bu.role, b.business_id
         FROM branches_users bu
         INNER JOIN branches b ON b.id = bu.branch_id
         WHERE bu.user_id = ? AND bu.is_active = 1`,
        [authResult.userId]
      );

      if (branchUser) {
        // Usuario es cashier - crear sesión y retornar
        const token = await createSessionClient(authResult.userId, authResult.email);

        // Guardar token en cookie del navegador y localStorage (para Electron)
        if (typeof window !== 'undefined') {
          document.cookie = `kapok-session-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
          // También guardar en localStorage para Electron
          try {
            localStorage.setItem('kapok-session-token', token);
          } catch (e) {
            console.warn('[loginUserClient] No se pudo guardar token en localStorage:', e);
          }
        }

        return {
          success: true,
          userId: authResult.userId,
          email: data.email,
          hasBusiness: true,
          businessId: branchUser.business_id,
          role: branchUser.role,
          branchId: branchUser.branch_id,
          isCashier: branchUser.role === 'cashier',
          token,
        };
      }
    }

    // Usuario es owner o no tiene asignación
    let token: string | undefined;
    if (businessUser) {
      token = await createSessionClient(authResult.userId, authResult.email);

      // Guardar token en cookie del navegador y localStorage (para Electron)
      if (typeof window !== 'undefined') {
        document.cookie = `kapok-session-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        // También guardar en localStorage para Electron
        try {
          localStorage.setItem('kapok-session-token', token);
        } catch (e) {
          console.warn('[loginUserClient] No se pudo guardar token en localStorage:', e);
        }
      }
    }

    return {
      success: true,
      userId: authResult.userId,
      email: data.email,
      hasBusiness: !!businessUser,
      businessId: businessUser?.business_id,
      role: businessUser?.role,
      isOwner: businessUser?.role === 'owner',
      isCashier: false,
      token,
    };
  } catch (error) {
    console.error('Error en loginUserClient:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Obtiene el usuario actual desde el cliente usando IPC
 */
export async function getCurrentUserClient(): Promise<{
  user: {
    id: string;
    email: string;
    name: string;
    phone: string;
    avatar_url?: string | null;
    created_at?: string;
    benefit?: number | null;
  } | null;
  error?: string;
}> {
  // Solo funciona en cliente Electron
  if (typeof window === 'undefined' || !isNative()) {
    return { user: null, error: 'Solo funciona en modo Electron desde el cliente' };
  }

  try {
    // Obtener token de la cookie o localStorage (fallback para Electron)
    let token: string | null = null;

    // Intentar obtener de cookie primero
    const cookies = document.cookie.split(';');
    const sessionCookie = cookies.find(c => c.trim().startsWith('kapok-session-token='));
    token = sessionCookie?.split('=')[1]?.trim() || null;

    // Si encontramos el token en la cookie, también guardarlo en localStorage para futuras referencias
    if (token && typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem('kapok-session-token', token);
      } catch (e) {
        console.warn('[getCurrentUserClient] No se pudo guardar token en localStorage:', e);
      }
    }

    // Si no hay cookie, intentar obtener de localStorage (compatibilidad con Electron)
    if (!token && typeof window !== 'undefined' && window.localStorage) {
      token = localStorage.getItem('kapok-session-token');
    }

    if (!token) {
      console.warn('[getCurrentUserClient] No se encontró token en cookie ni localStorage');
      return { user: null, error: 'No hay sesión activa' };
    }

    // Limpiar el token
    token = token.trim();

    // Intentar obtener userId del token
    // El token puede ser JWT (del servidor) o un token simple de Tauri (uuid-timestamp)
    let userId: string | null = null;

    // Primero intentar decodificar como JWT
    const tokenParts = token.split('.');
    if (tokenParts.length === 3) {
      // Es un JWT, intentar decodificar
      try {
        const payload = JSON.parse(atob(tokenParts[1]));
        // El backend Rust usa user_id (snake_case), pero también verificar userId (camelCase) por compatibilidad
        userId = payload.user_id || payload.userId || null;
      } catch (e) {
        // Si falla la decodificación JWT, continuar con búsqueda en BD
        console.warn('[getCurrentUserClient] No se pudo decodificar JWT, buscando en BD:', e);
      }
    }

    // Si no es JWT o no se pudo decodificar, buscar el token en la base de datos
    if (!userId) {
      try {
        const session = await queryOne<{
          user_id: string;
          expires_at: string;
        }>(
          `SELECT user_id, expires_at FROM auth_sessions WHERE token = ? AND expires_at > datetime('now')`,
          [token]
        );

        if (session) {
          userId = session.user_id;
        } else {
          console.warn('[getCurrentUserClient] Token no encontrado en BD o expirado');
          return { user: null, error: 'Token inválido o expirado' };
        }
      } catch (dbError) {
        console.error('[getCurrentUserClient] Error buscando token en BD:', dbError);
        return { user: null, error: 'Error verificando token' };
      }
    }

    if (!userId) {
      console.warn('[getCurrentUserClient] No se pudo obtener userId del token');
      return { user: null, error: 'Token inválido' };
    }

    // Obtener usuario desde la base de datos usando IPC con benefit de branches_users
    // Priorizar sucursal con sesión activa, sino la más reciente
    const user = await queryOne<{
      id: string;
      email: string;
      name: string;
      phone: string;
      avatar_url: string | null;
      created_at: string;
      benefit: number | null;
    }>(
      `SELECT 
        u.id,
        u.email,
        u.name,
        u.phone,
        u.avatar_url,
        u.created_at,
        COALESCE(
          (SELECT bu.benefit 
           FROM branches_users bu
           INNER JOIN user_sessions us ON us.branch_id = bu.branch_id AND us.user_id = bu.user_id
           WHERE bu.user_id = u.id AND bu.is_active = 1 AND us.closed_at IS NULL
           ORDER BY us.updated_at DESC
           LIMIT 1),
          (SELECT bu.benefit 
           FROM branches_users bu
           WHERE bu.user_id = u.id AND bu.is_active = 1
           ORDER BY bu.created_at DESC
           LIMIT 1)
        ) as benefit
       FROM users u
       WHERE u.id = ?`,
      [userId]
    );

    if (!user) {
      console.error('[getCurrentUserClient] Usuario no encontrado en BD para userId:', userId);
      return { user: null, error: 'Usuario no encontrado' };
    }

    return { user, error: undefined };
  } catch (error) {
    console.error('[getCurrentUserClient] Error inesperado:', error);
    return { user: null, error: error instanceof Error ? error.message : 'Error desconocido' };
  }
}

/**
 * Obtiene las estadísticas del dashboard desde el cliente usando IPC
 */
export async function getDashboardStatsClient(userId: string): Promise<{
  success: boolean;
  error?: string;
  data?: {
    totalRevenue: number;
    newCustomers: number;
    productsSold: number;
    growthRate: number;
    chartData: Array<{ date: string; value: number }>;
    recentSessions: Array<any>;
  };
}> {
  // Solo funciona en cliente Electron
  if (typeof window === 'undefined' || !isNative()) {
    return {
      success: false,
      error: 'Solo funciona en modo Electron desde el cliente',
    };
  }

  try {
    if (!userId) {
      return { success: false, error: 'Debes estar autenticado' };
    }

    // Obtener el business_id del usuario actual
    let targetBusinessId: string | null = null;

    const businessUser = await queryOne<{ business_id: string; role: string }>(
      `SELECT business_id, role FROM businesses_users WHERE user_id = ? AND is_active = 1 LIMIT 1`,
      [userId]
    );

    if (businessUser) {
      targetBusinessId = businessUser.business_id;
    } else {
      const branchUser = await queryOne<{ business_id: string }>(
        `SELECT b.business_id 
         FROM branches_users bu
         INNER JOIN branches b ON b.id = bu.branch_id
         WHERE bu.user_id = ? AND bu.is_active = 1 LIMIT 1`,
        [userId]
      );


      if (branchUser) {
        targetBusinessId = branchUser.business_id;
      }
    }

    if (!targetBusinessId) {
      console.error('[getDashboardStatsClient] No se encontró business_id para userId:', userId);
      return {
        success: false,
        error: 'No tienes un negocio asociado',
      };
    }

    // Obtener todas las sucursales del negocio
    const branches = await query<{ id: string }>(
      `SELECT id FROM branches WHERE business_id = ?`,
      [targetBusinessId]
    );

    if (!branches || branches.length === 0) {
      return {
        success: true,
        data: {
          totalRevenue: 0,
          newCustomers: 0,
          productsSold: 0,
          growthRate: 0,
          chartData: [],
          recentSessions: [],
        },
      };
    }

    const branchIds = branches.map(b => b.id);
    const branchPlaceholders = branchIds.map(() => '?').join(',');

    // Obtener sesiones de los últimos 30 días
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sessions30d = await query<any>(
      `SELECT * FROM user_sessions 
       WHERE branch_id IN (${branchPlaceholders}) 
       AND created_at >= ? 
       ORDER BY created_at DESC`,
      [...branchIds, thirtyDaysAgo.toISOString()]
    );

    // Obtener sesiones del mes anterior para comparar
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const sessionsPreviousMonth = await query<any>(
      `SELECT * FROM user_sessions 
       WHERE branch_id IN (${branchPlaceholders}) 
       AND created_at >= ? 
       AND created_at < ?`,
      [...branchIds, sixtyDaysAgo.toISOString(), thirtyDaysAgo.toISOString()]
    );

    const getNumericValue = (value: any): number => {
      if (typeof value === 'number') return value;
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          if (typeof parsed === 'number') return parsed;
        } catch { }
        return parseFloat(value) || 0;
      }
      return 0;
    };

    const getSessionTotal = (session: any): number => {
      try {
        const paymentTotals = typeof session.payment_totals === 'string'
          ? JSON.parse(session.payment_totals)
          : (session.payment_totals || {});

        if (session.total_sales) {
          return Number(session.total_sales) || 0;
        }

        return (
          getNumericValue(paymentTotals.cash) +
          getNumericValue(paymentTotals.digital_wallet) +
          getNumericValue(paymentTotals.card) +
          getNumericValue(paymentTotals.transfer)
        );
      } catch {
        return Number(session.total_sales) || 0;
      }
    };

    const totalRevenue = (sessions30d || []).reduce((sum: number, session: any) =>
      sum + getSessionTotal(session), 0);

    const previousRevenue = (sessionsPreviousMonth || []).reduce((sum: number, session: any) =>
      sum + getSessionTotal(session), 0);

    const growthRate = previousRevenue > 0
      ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
      : totalRevenue > 0 ? 100 : 0;

    const uniqueUsers = new Set((sessions30d || []).map((s: any) => s.user_id).filter(Boolean));
    const newCustomers = uniqueUsers.size;
    const productsSold = sessions30d?.length || 0;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const sessions7d = await query<any>(
      `SELECT * FROM user_sessions 
       WHERE branch_id IN (${branchPlaceholders}) 
       AND created_at >= ? 
       ORDER BY created_at ASC`,
      [...branchIds, sevenDaysAgo.toISOString()]
    );

    // Agrupar por día
    const chartDataMap = new Map<string, number>();
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
      chartDataMap.set(dateKey, 0);
    }

    (sessions7d || []).forEach((session: any) => {
      const date = new Date(session.created_at);
      const dateKey = date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
      const total = getSessionTotal(session);
      chartDataMap.set(dateKey, (chartDataMap.get(dateKey) || 0) + total);
    });

    const chartData = Array.from(chartDataMap.entries()).map(([date, value]) => ({
      date,
      value: Math.round(value),
    }));

    const recentSessionsData = (sessions30d || []).slice(0, 8);
    const userIds = [...new Set(recentSessionsData.map((s: any) => s.user_id).filter(Boolean))] as string[];
    const branchIdsForSessions = [...new Set(recentSessionsData.map((s: any) => s.branch_id).filter(Boolean))] as string[];

    let recentSessions: any[] = [];

    if (userIds.length > 0 && branchIdsForSessions.length > 0) {
      const userPlaceholders = userIds.map(() => '?').join(',');
      const branchPlaceholdersForSessions = branchIdsForSessions.map(() => '?').join(',');

      const usersData = await query<{ id: string; name: string }>(
        `SELECT id, name FROM users WHERE id IN (${userPlaceholders})`,
        userIds
      );

      const branchesData = await query<{ id: string; name: string }>(
        `SELECT id, name FROM branches WHERE id IN (${branchPlaceholdersForSessions})`,
        branchIdsForSessions
      );

      const usersMap = new Map(usersData.map(u => [u.id, u]));
      const branchesMap = new Map(branchesData.map(b => [b.id, b]));

      recentSessions = recentSessionsData.map((session: any) => ({
        id: session.id,
        header: `${usersMap.get(session.user_id)?.name || 'Usuario'} - ${branchesMap.get(session.branch_id)?.name || 'Sucursal'}`,
        type: session.closed_at ? 'Finalizada' : 'En curso',
        status: session.closed_at ? 'Done' : 'In Process',
        reviewer: usersMap.get(session.user_id)?.name || 'N/A',
        total: getSessionTotal(session),
        created_at: session.created_at,
      }));
    }

    return {
      success: true,
      data: {
        totalRevenue,
        newCustomers,
        productsSold,
        growthRate: Math.round(growthRate * 10) / 10,
        chartData,
        recentSessions,
      },
    };
  } catch (error) {
    console.error('[getDashboardStatsClient] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Obtiene productos desde el cliente usando IPC (para modo Electron)
 */
export async function getProductsClient(
  userId: string,
  branchId?: string,
  options?: {
    page?: number;
    limit?: number;
    search?: string;
  }
): Promise<{
  success: boolean;
  error?: string;
  products?: any[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> {
  // Solo funciona en cliente Electron
  if (typeof window === 'undefined' || !isNative()) {
    return {
      success: false,
      error: 'Solo funciona en modo Electron desde el cliente',
    };
  }

  try {
    if (!userId) {
      return { success: false, error: 'Debes estar autenticado' };
    }

    // Obtener el business_id del usuario actual
    let businessId: string | null = null;

    const businessUser = await queryOne<{ business_id: string; role: string }>(
      `SELECT business_id, role FROM businesses_users WHERE user_id = ? AND is_active = 1 LIMIT 1`,
      [userId]
    );

    if (businessUser) {
      businessId = businessUser.business_id;
    } else {
      const branchUser = await queryOne<{ business_id: string }>(
        `SELECT b.business_id 
         FROM branches_users bu
         INNER JOIN branches b ON b.id = bu.branch_id
         WHERE bu.user_id = ? AND bu.is_active = 1 LIMIT 1`,
        [userId]
      );


      if (branchUser) {
        businessId = branchUser.business_id;
      }
    }

    if (!businessId) {
      console.error('[getProductsClient] No se encontró business_id para userId:', userId);
      return {
        success: false,
        error: 'No tienes un negocio asociado',
      };
    }


    // Verificar que el business existe
    const business = await queryOne<{ id: string; name: string }>(
      `SELECT id, name FROM businesses WHERE id = ? LIMIT 1`,
      [businessId]
    );

    if (!business) {
      return {
        success: false,
        error: 'Negocio no encontrado',
      };
    }

    // MIGRACIÓN: Actualizar productos existentes que tengan branch_id diferente al business_id
    // Buscar productos que pertenezcan a branches de este business y actualizarlos
    // Si la tabla branches existe, migrar productos; si no, continuar (productos ya deberían tener business_id)
    try {
      // Primero verificar si hay productos con branch_id que pertenezcan a branches de este business
      const productsToMigrate = await query<{ id: string }>(
        `SELECT p.id 
         FROM products p 
         INNER JOIN branches b ON b.id = p.branch_id 
         WHERE b.business_id = ? AND p.branch_id != ? LIMIT 100`,
        [businessId, businessId]
      );

      if (productsToMigrate.length > 0) {
        for (const product of productsToMigrate) {
          await execute(`UPDATE products SET branch_id = ? WHERE id = ?`, [businessId, product.id]);
        }
      }
    } catch (error: any) {
      // Si falla (por ejemplo, si la tabla branches no existe o está vacía), continuar
      // Esto es normal si ya no hay branches
      console.log('[getProductsClient] No se pudo migrar productos (puede ser normal si no hay branches):', error?.message);
    }


    // Construir query base - buscar productos de todos los branches del business
    // Usar JOIN con branches para obtener productos que pertenezcan a branches del business
    let sql = `SELECT p.* FROM products p 
               LEFT JOIN branches b ON b.id = p.branch_id
               WHERE p.is_active = 1 AND (p.branch_id = ? OR b.business_id = ?)`;
    let countSql = `SELECT COUNT(*) as total FROM products p 
                    LEFT JOIN branches b ON b.id = p.branch_id
                    WHERE p.is_active = 1 AND (p.branch_id = ? OR b.business_id = ?)`;
    const params: any[] = [businessId, businessId];
    const countParams: any[] = [businessId, businessId];

    // Búsqueda por texto (nombre, descripción, marca)
    if (options?.search) {
      const searchTerm = `%${options.search.toLowerCase()}%`;
      sql += ` AND (LOWER(p.name) LIKE ? OR LOWER(p.description) LIKE ? OR LOWER(p.brand) LIKE ?)`;
      countSql += ` AND (LOWER(p.name) LIKE ? OR LOWER(p.description) LIKE ? OR LOWER(p.brand) LIKE ?)`;
      params.push(searchTerm, searchTerm, searchTerm);
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    // Paginación
    const page = Math.max(1, Math.floor(options?.page || 1));
    const limit = Math.max(1, Math.floor(options?.limit || 10000));
    const offset = Math.max(0, (page - 1) * limit);

    sql += ` ORDER BY p.created_at DESC LIMIT ${limit} OFFSET ${offset}`;

    // Ejecutar queries
    const [products, countResult] = await Promise.all([
      query<any>(sql, params),
      queryOne<{ total: number }>(countSql, countParams),
    ]);

    // Optimización: Obtener todas las presentaciones en una sola query (evita N+1)
    const productIds = (products || []).map((p: any) => p.id);
    const presentationsMap = new Map<string, any[]>();

    if (productIds.length > 0) {
      const placeholders = productIds.map(() => '?').join(',');
      const allPresentations = await query<any>(
        `SELECT * FROM product_presentations WHERE product_id IN (${placeholders}) AND is_active = 1`,
        productIds
      );

      for (const presentation of allPresentations || []) {
        const productId = presentation.product_id;
        if (!presentationsMap.has(productId)) {
          presentationsMap.set(productId, []);
        }
        presentationsMap.get(productId)!.push(presentation);
      }
    }

    const productsWithPresentations = (products || []).map((product: any) => ({
      ...product,
      product_presentations: presentationsMap.get(product.id) || [],
    }));

    const total = countResult?.total || 0;


    return {
      success: true,
      products: productsWithPresentations || [],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('[getProductsClient] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Obtiene branches (ahora es Business) desde el cliente usando IPC (para modo Electron)
 */
export async function getBranchesClient(userId: string): Promise<{
  success: boolean;
  error?: string;
  branches?: any[];
}> {
  // Solo funciona en cliente Electron
  if (typeof window === 'undefined' || !isNative()) {
    return {
      success: false,
      error: 'Solo funciona en modo Electron desde el cliente',
    };
  }

  try {
    if (!userId) {
      return { success: false, error: 'Debes estar autenticado' };
    }

    // Obtener el business_id del usuario actual
    let businessId: string | null = null;

    const businessUser = await queryOne<{ business_id: string; role: string }>(
      `SELECT business_id, role FROM businesses_users WHERE user_id = ? AND is_active = 1 LIMIT 1`,
      [userId]
    );

    if (businessUser) {
      businessId = businessUser.business_id;
    } else {
      const branchUser = await queryOne<{ business_id: string }>(
        `SELECT b.business_id 
         FROM branches_users bu
         INNER JOIN branches b ON b.id = bu.branch_id
         WHERE bu.user_id = ? AND bu.is_active = 1 LIMIT 1`,
        [userId]
      );


      if (branchUser) {
        businessId = branchUser.business_id;
      }
    }

    if (!businessId) {
      console.error('[getBranchesClient] No se encontró business_id para userId:', userId);
      return {
        success: false,
        error: 'No tienes un negocio asociado',
      };
    }

    // Obtener el business y convertirlo a branch (compatibilidad)
    const business = await queryOne<{
      id: string;
      name: string;
      description: string | null;
      tax_id: string;
      category: string | null;
      website: string | null;
      theme: string | null;
      created_at: string;
    }>(
      `SELECT * FROM businesses WHERE id = ? LIMIT 1`,
      [businessId]
    );

    if (!business) {
      return {
        success: false,
        error: 'Negocio no encontrado',
      };
    }

    // Convertir Business a Branch para mantener compatibilidad
    const branch = {
      id: business.id,
      business_id: business.id,
      name: business.name,
      location: business.description || business.name,
      phone: null,
      created_at: business.created_at,
    };


    return {
      success: true,
      branches: [branch],
    };
  } catch (error) {
    console.error('[getBranchesClient] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Obtiene sesiones de usuario desde el cliente usando IPC (para modo Electron)
 */
export async function getUserSessionsClient(
  userId: string,
  branchId?: string
): Promise<{
  success: boolean;
  error?: string;
  sessions?: any[];
}> {
  // Solo funciona en cliente Electron
  if (typeof window === 'undefined' || !isNative()) {
    return {
      success: false,
      error: 'Solo funciona en modo Electron desde el cliente',
    };
  }

  try {
    if (!userId) {
      return { success: false, error: 'Debes estar autenticado' };
    }


    // Obtener el business_id del usuario actual
    let businessId: string | null = null;

    const businessUser = await queryOne<{ business_id: string; role: string }>(
      `SELECT business_id, role FROM businesses_users WHERE user_id = ? AND is_active = 1 LIMIT 1`,
      [userId]
    );

    if (businessUser) {
      businessId = businessUser.business_id;
    } else {
      const branchUser = await queryOne<{ business_id: string }>(
        `SELECT b.business_id 
         FROM branches_users bu
         INNER JOIN branches b ON b.id = bu.branch_id
         WHERE bu.user_id = ? AND bu.is_active = 1 LIMIT 1`,
        [userId]
      );

      if (branchUser) {
        businessId = branchUser.business_id;
      }
    }

    if (!businessId) {
      return {
        success: false,
        error: 'No tienes un negocio asociado',
      };
    }

    // Obtener branches del business
    const branches = await query<{ id: string }>(
      `SELECT id FROM branches WHERE business_id = ?`,
      [businessId]
    );

    if (!branches || branches.length === 0) {
      return { success: true, sessions: [] };
    }

    const businessBranchIds = branches.map(b => b.id);
    const branchPlaceholders = businessBranchIds.map(() => '?').join(',');

    let sql = `SELECT * FROM user_sessions WHERE branch_id IN (${branchPlaceholders}) ORDER BY created_at DESC`;
    let params: any[] = [...businessBranchIds];

    if (branchId && businessBranchIds.includes(branchId)) {
      sql = `SELECT * FROM user_sessions WHERE branch_id = ? ORDER BY created_at DESC`;
      params = [branchId];
    }

    const sessions = await query<any>(sql, params);

    if (!sessions || sessions.length === 0) {
      return { success: true, sessions: [] };
    }

    const userIds = [...new Set(sessions.map((s: any) => s.user_id).filter(Boolean))] as string[];
    const branchIds = [...new Set(sessions.map((s: any) => s.branch_id).filter(Boolean))] as string[];

    let usersData: any[] = [];
    let branchesData: any[] = [];

    if (userIds.length > 0) {
      const userPlaceholders = userIds.map(() => '?').join(',');
      usersData = await query<{ id: string; name: string; email: string; phone: string }>(
        `SELECT id, name, email, phone FROM users WHERE id IN (${userPlaceholders})`,
        userIds
      );
    }

    if (branchIds.length > 0) {
      const branchPlaceholdersForSessions = branchIds.map(() => '?').join(',');
      branchesData = await query<{ id: string; name: string; location: string }>(
        `SELECT id, name, location FROM branches WHERE id IN (${branchPlaceholdersForSessions})`,
        branchIds
      );
    }

    const usersMap = new Map(usersData.map(u => [u.id, u]));
    const branchesMap = new Map(branchesData.map(b => [b.id, b]));

    const getNumericValue = (value: any): number => {
      if (typeof value === 'number') return value;
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          if (typeof parsed === 'number') return parsed;
        } catch { }
        return parseFloat(value) || 0;
      }
      return 0;
    };

    const mappedSessions = sessions.map((session: any) => {
      const user = usersMap.get(session.user_id);
      const branch = branchesMap.get(session.branch_id);

      let paymentTotals: any = {};
      try {
        paymentTotals = typeof session.payment_totals === 'string'
          ? JSON.parse(session.payment_totals)
          : (session.payment_totals || {});
      } catch {
        paymentTotals = {};
      }

      const cashAmount = getNumericValue(paymentTotals.cash);
      const digitalWalletAmount = getNumericValue(paymentTotals.digital_wallet);
      const cardAmount = getNumericValue(paymentTotals.card);
      const transferAmount = getNumericValue(paymentTotals.transfer);
      const totalSales = Number(session.total_sales) || 0;
      const totalAmount = totalSales ||
        (cashAmount + digitalWalletAmount + cardAmount + transferAmount);

      return {
        id: session.id,
        user_id: session.user_id,
        branch_id: session.branch_id,
        started_at: session.created_at,
        closed_at: session.closed_at || null,
        created_at: session.created_at,
        cash_amount: cashAmount,
        digital_wallet_amount: digitalWalletAmount,
        card_amount: cardAmount,
        transfer_amount: transferAmount,
        total_amount: totalAmount,
        user: user ? {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        } : undefined,
        branch: branch ? {
          id: branch.id,
          name: branch.name,
          location: branch.location,
        } : undefined,
      };
    });


    return { success: true, sessions: mappedSessions };
  } catch (error) {
    console.error('[getUserSessionsClient] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Verifica si existen usuarios con rol owner (desde el cliente usando IPC)
 */
export async function checkOwnersClient(userId: string): Promise<{
  success: boolean;
  error?: string;
  activeOwners: number;
  allOwners: number;
  currentUserIsOwner: boolean;
  owners: Array<{
    id: string;
    userId: string;
    email: string;
    name: string;
    businessId: string;
    businessName: string | null;
    role: string;
    isActive: boolean;
    createdAt: string;
  }>;
  allOwnersData: Array<{
    userId: string;
    email: string;
    name: string;
    businessId: string;
    businessName: string | null;
    role: string;
    isActive: boolean;
  }>;
  roleSummary: Array<{
    role: string;
    total: number;
    active: number;
  }>;
}> {
  if (typeof window === 'undefined' || !isNative()) {
    return {
      success: false,
      error: 'Solo funciona en modo Electron desde el cliente',
      activeOwners: 0,
      allOwners: 0,
      currentUserIsOwner: false,
      owners: [],
      allOwnersData: [],
      roleSummary: [],
    };
  }

  try {

    const owners = await query<{
      id: string;
      user_id: string;
      business_id: string;
      role: string;
      is_active: number;
      created_at: string;
      email: string;
      user_name: string;
      business_name: string | null;
    }>(
      `SELECT 
        bu.id,
        bu.user_id,
        bu.business_id,
        bu.role,
        bu.is_active,
        bu.created_at,
        u.email,
        u.name as user_name,
        b.name as business_name
      FROM businesses_users bu
      INNER JOIN users u ON u.id = bu.user_id
      LEFT JOIN businesses b ON b.id = bu.business_id
      WHERE bu.role = 'owner' AND bu.is_active = 1`
    );

    const allOwners = await query<{
      user_id: string;
      business_id: string;
      role: string;
      is_active: number;
      email: string;
      user_name: string;
      business_name: string | null;
    }>(
      `SELECT 
        bu.user_id,
        bu.business_id,
        bu.role,
        bu.is_active,
        u.email,
        u.name as user_name,
        b.name as business_name
      FROM businesses_users bu
      INNER JOIN users u ON u.id = bu.user_id
      LEFT JOIN businesses b ON b.id = bu.business_id
      WHERE bu.role = 'owner'`
    );

    const roleSummary = await query<{
      role: string;
      total: number;
      active: number;
    }>(
      `SELECT 
        role, 
        COUNT(*) as total, 
        SUM(is_active) as active
      FROM businesses_users
      GROUP BY role`
    );

    // Verificar específicamente el usuario actual
    const currentUserOwner = await queryOne<{
      user_id: string;
      business_id: string;
      role: string;
      is_active: number;
      email: string;
      user_name: string;
      business_name: string | null;
    }>(
      `SELECT 
        bu.user_id,
        bu.business_id,
        bu.role,
        bu.is_active,
        u.email,
        u.name as user_name,
        b.name as business_name
      FROM businesses_users bu
      INNER JOIN users u ON u.id = bu.user_id
      LEFT JOIN businesses b ON b.id = bu.business_id
      WHERE bu.user_id = ? AND bu.role = 'owner' AND bu.is_active = 1`,
      [userId]
    );


    return {
      success: true,
      activeOwners: owners.length,
      allOwners: allOwners.length,
      currentUserIsOwner: !!currentUserOwner,
      owners: owners.map(o => ({
        id: o.id,
        userId: o.user_id,
        email: o.email,
        name: o.user_name,
        businessId: o.business_id,
        businessName: o.business_name,
        role: o.role,
        isActive: o.is_active === 1,
        createdAt: o.created_at,
      })),
      allOwnersData: allOwners.map(o => ({
        userId: o.user_id,
        email: o.email,
        name: o.user_name,
        businessId: o.business_id,
        businessName: o.business_name,
        role: o.role,
        isActive: o.is_active === 1,
      })),
      roleSummary: roleSummary.map(r => ({
        role: r.role,
        total: r.total,
        active: r.active,
      })),
    };
  } catch (error) {
    console.error('[checkOwnersClient] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      activeOwners: 0,
      allOwners: 0,
      currentUserIsOwner: false,
      owners: [],
      allOwnersData: [],
      roleSummary: [],
    };
  }
}

/**
 * Verifica si el usuario actual tiene un negocio o sucursal asociada (desde el cliente)
 */
export async function checkUserHasBusinessClient(options?: {
  retries?: number;
  retryDelay?: number;
}): Promise<{
  hasBusiness: boolean;
  authenticated: boolean;
  businessId?: string;
  role?: string;
  branchId?: string;
  isOwner?: boolean;
  isCashier?: boolean;
}> {
  const { retries = 3, retryDelay = 300 } = options || {};

  // Solo funciona en cliente Electron
  if (typeof window === 'undefined' || !isNative()) {
    return { hasBusiness: false, authenticated: false };
  }

  // Obtener token de la cookie o localStorage (fallback para Electron)
  let token: string | null = null;

  // Intentar obtener de cookie primero
  const cookies = document.cookie.split(';');
  const sessionCookie = cookies.find(c => c.trim().startsWith('kapok-session-token='));
  token = sessionCookie?.split('=')[1]?.trim() || null;

  // Si encontramos el token en la cookie, también guardarlo en localStorage para futuras referencias
  if (token && typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem('kapok-session-token', token);
    } catch (e) {
      console.warn('[checkUserHasBusinessClient] No se pudo guardar token en localStorage:', e);
    }
  }

  // Si no hay cookie, intentar obtener de localStorage (compatibilidad con Electron)
  if (!token && typeof window !== 'undefined' && window.localStorage) {
    token = localStorage.getItem('kapok-session-token');
  }

  if (!token) {
    console.warn('[checkUserHasBusinessClient] No se encontró token en cookie ni localStorage');
    return { hasBusiness: false, authenticated: false };
  }

  // Limpiar el token
  token = token.trim();

  // Intentar obtener userId del token
  // El token puede ser JWT (del servidor) o un token simple de Tauri (uuid-timestamp)
  let userId: string | null = null;

  // Primero intentar decodificar como JWT
  const tokenParts = token.split('.');
  if (tokenParts.length === 3) {
    // Es un JWT, intentar decodificar
    try {
      const payload = JSON.parse(atob(tokenParts[1]));
      // El backend Rust usa user_id (snake_case), pero también verificar userId (camelCase) por compatibilidad
      userId = payload.user_id || payload.userId || null;
    } catch (e) {
      // Si falla la decodificación JWT, continuar con búsqueda en BD
      console.warn('[checkUserHasBusinessClient] No se pudo decodificar JWT, buscando en BD:', e);
    }
  }

  // Si no es JWT o no se pudo decodificar, buscar el token en la base de datos
  if (!userId) {
    try {
      const session = await queryOne<{
        user_id: string;
        expires_at: string;
      }>(
        `SELECT user_id, expires_at FROM auth_sessions WHERE token = ? AND expires_at > datetime('now')`,
        [token]
      );

      if (session) {
        userId = session.user_id;
      } else {
        console.warn('[checkUserHasBusinessClient] Token no encontrado en BD o expirado');
        return { hasBusiness: false, authenticated: false };
      }
    } catch (dbError) {
      console.error('[checkUserHasBusinessClient] Error buscando token en BD:', dbError);
      return { hasBusiness: false, authenticated: false };
    }
  }

  if (!userId) {
    console.warn('[checkUserHasBusinessClient] No se pudo obtener userId del token');
    return { hasBusiness: false, authenticated: false };
  }

  console.log('[checkUserHasBusinessClient] userId extraído del token:', userId);

  // Retry logic para las consultas de base de datos
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      // Verificar si es owner (business level) usando IPC
      const businessUser = await queryOne<{ business_id: string; role: string }>(
        `SELECT business_id, role FROM businesses_users WHERE user_id = ? AND is_active = 1`,
        [userId]
      );

      if (businessUser) {
        return {
          hasBusiness: true,
          authenticated: true,
          businessId: businessUser.business_id,
          role: businessUser.role,
          isOwner: businessUser.role === 'owner', // Asegurar que solo 'owner' sea true
          isCashier: false,
        };
      }

      // Si no es owner, verificar si es cashier (branch level)
      const branchUser = await queryOne<{
        branch_id: string;
        role: string;
        business_id: string;
      }>(
        `SELECT bu.branch_id, bu.role, b.business_id
         FROM branches_users bu
         INNER JOIN branches b ON b.id = bu.branch_id
         WHERE bu.user_id = ? AND bu.is_active = 1`,
        [userId]
      );

      if (branchUser) {
        return {
          hasBusiness: true,
          authenticated: true,
          businessId: branchUser.business_id,
          role: branchUser.role,
          branchId: branchUser.branch_id,
          isOwner: false,
          isCashier: branchUser.role === 'cashier',
        };
      }

      // Usuario no tiene negocio ni sucursal asignada (pero está autenticado)
      // No retry en este caso - es un estado válido
      return {
        hasBusiness: false,
        authenticated: true,
      };
    } catch (error) {
      console.error(`[checkUserHasBusinessClient] Error en intento ${attempt + 1}/${retries}:`, error);

      // Si es el último intento, retornar error
      if (attempt === retries - 1) {
        // Si tenemos un token válido pero la consulta falla después de todos los reintentos,
        // asumimos que el usuario está autenticado pero hay un problema temporal con la BD
        // Esto evita que se redirija a /auth cuando hay un token válido
        console.warn('[checkUserHasBusinessClient] Todos los reintentos fallaron, pero token es válido. Retornando authenticated: true para evitar redirect.');
        return {
          hasBusiness: false,
          authenticated: true, // Cambiar a true para evitar redirect cuando hay token válido
        };
      }

      // Esperar antes del siguiente intento
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }

  // Fallback - no debería llegar aquí, pero por si acaso
  return { hasBusiness: false, authenticated: false };
}

/**
 * Crea un nuevo producto desde el cliente usando IPC (para modo Electron)
 */
export async function createProductClient(
  userId: string,
  data: {
    branchId: string;
    name: string;
    description?: string;
    expiration?: string;
    brand?: string;
    barcode?: string;
    sku?: string;
    cost: number;
    price: number;
    stock?: number;
    bonification?: number;
    presentations: Array<{
      variant: string;
      units: number;
      price?: number;
    }>;
  }
): Promise<{
  success: boolean;
  error?: string;
  productId?: string;
  productName?: string;
}> {
  // Solo funciona en cliente Electron
  if (typeof window === 'undefined' || !isNative()) {
    return {
      success: false,
      error: 'Solo funciona en modo Electron desde el cliente',
    };
  }

  try {
    if (!userId) {
      return { success: false, error: 'Debes estar autenticado' };
    }

    // Validar datos básicos
    if (!data.branchId || !data.name) {
      return {
        success: false,
        error: 'Branch ID y nombre del producto son requeridos',
      };
    }

    // Obtener el negocio del usuario
    const businessUser = await queryOne<{ business_id: string; role: string }>(
      `SELECT business_id, role FROM businesses_users WHERE user_id = ? AND is_active = 1 LIMIT 1`,
      [userId]
    );

    if (!businessUser) {
      return { success: false, error: 'No tienes un negocio asociado' };
    }

    // Verificar que tenga permisos
    if (businessUser.role !== 'owner') {
      return {
        success: false,
        error: 'No tienes permisos para crear productos',
      };
    }

    // Verificar que el branchId sea igual al business_id del usuario
    if (data.branchId !== businessUser.business_id) {
      return {
        success: false,
        error: 'El business_id no coincide con tu negocio',
      };
    }

    // Usar business_id directamente como branch_id
    const branchId = businessUser.business_id;

    // Verificar/crear un branch con id = business_id si no existe
    // Esto es necesario porque la tabla products tiene una restricción de clave foránea
    const existingBranch = await queryOne<{ id: string }>(
      `SELECT id FROM branches WHERE id = ? LIMIT 1`,
      [branchId]
    );

    if (!existingBranch) {
      // Obtener información del business para crear el branch
      const business = await queryOne<{
        id: string;
        name: string;
        description: string | null;
      }>(
        `SELECT id, name, description FROM businesses WHERE id = ? LIMIT 1`,
        [branchId]
      );

      if (!business) {
        return {
          success: false,
          error: 'Negocio no encontrado',
        };
      }

      // Crear un branch con id = business_id para satisfacer la restricción de clave foránea
      await execute(
        `INSERT INTO branches (id, business_id, name, location, phone, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          branchId,
          branchId,
          business.name,
          business.description || business.name,
          null,
          new Date().toISOString(),
        ]
      );
    }

    // Crear producto y presentaciones en una transacción
    const productId = generateId();
    const now = new Date().toISOString();

    // Preparar presentaciones
    const presentations = [
      // Presentación base "unidad" con el precio base del producto
      {
        id: generateId(),
        product_id: productId,
        variant: 'unidad',
        units: 1,
        price: data.price,
        is_active: 1,
      },
      // Presentaciones adicionales
      ...data.presentations.map(p => ({
        id: generateId(),
        product_id: productId,
        variant: p.variant.trim(),
        units: p.units,
        price: p.price || data.price,
        is_active: 1,
      })),
    ];

    const presentationOps = presentations.map(p => ({
      sql: `INSERT INTO product_presentations (id, product_id, variant, units, price, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      params: [p.id, p.product_id, p.variant, p.units, p.price, p.is_active, now],
    }));

    await transaction([
      {
        sql: `INSERT INTO products (id, branch_id, name, description, expiration, brand, barcode, sku, cost, price, stock, bonification, created_by_user_id, is_active, created_at) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        params: [
          productId,
          branchId,
          data.name.trim(),
          data.description?.trim() || null,
          data.expiration || null,
          data.brand?.trim() || null,
          data.barcode?.trim() || null,
          data.sku?.trim() || null,
          data.cost,
          data.price,
          data.stock || 0,
          data.bonification || 0,
          userId,
          1,
          now,
        ],
      },
      ...presentationOps,
    ]);

    const product = await queryOne<any>(
      `SELECT * FROM products WHERE id = ? LIMIT 1`,
      [productId]
    );

    return {
      success: true,
      productId: productId,
      productName: product?.name || data.name,
    };
  } catch (error) {
    console.error('[createProductClient] ❌ Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Crea un nuevo empleado (cashier) desde el cliente usando IPC (para modo Electron)
 */
export async function createBranchEmployeeClient(
  userId: string,
  data: {
    email: string;
    name: string;
    phone: string;
    password: string;
    branchId: string;
    role: 'cashier';
    benefit?: number;
  }
): Promise<{
  success: boolean;
  error?: string;
  data?: { id: string; email: string };
}> {
  // Solo funciona en cliente Electron
  if (typeof window === 'undefined' || !isNative()) {
    return {
      success: false,
      error: 'Solo funciona en modo Electron desde el cliente',
    };
  }

  try {
    if (!userId) {
      return { success: false, error: 'Debes estar autenticado' };
    }

    // Obtener business_id del usuario actual
    const businessUser = await queryOne<{ business_id: string; role: string }>(
      `SELECT business_id, role FROM businesses_users WHERE user_id = ? AND is_active = 1 LIMIT 1`,
      [userId]
    );

    if (!businessUser || businessUser.role !== 'owner') {
      return {
        success: false,
        error: 'No tienes permisos para crear empleados',
      };
    }

    const businessId = businessUser.business_id;

    // Función auxiliar para obtener o crear una sucursal por defecto
    const getOrCreateDefaultBranch = async (): Promise<string> => {
      // Buscar la primera sucursal del negocio
      const firstBranch = await queryOne<{ id: string }>(
        `SELECT id FROM branches WHERE business_id = ? LIMIT 1`,
        [businessId]
      );

      if (firstBranch) {
        return firstBranch.id;
      }

      // Si no hay sucursales, crear una por defecto
      const defaultBranchId = generateId();
      const business = await queryOne<{ name: string }>(
        `SELECT name FROM businesses WHERE id = ? LIMIT 1`,
        [businessId]
      );
      const branchName = business?.name || 'Sucursal Principal';
      const now = new Date().toISOString();

      await execute(
        `INSERT INTO branches (id, business_id, name, location, phone, created_at) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [defaultBranchId, businessId, branchName, branchName, null, now]
      );

      return defaultBranchId;
    };

    // Validar y obtener branch_id real
    let branchId: string = data.branchId;

    // Si branchId es igual a businessId, es un business convertido a branch
    if (branchId === businessId) {
      branchId = await getOrCreateDefaultBranch();
    } else {
      // Validar que la sucursal existe y pertenece al negocio
      const branch = await queryOne<{ id: string; business_id: string }>(
        `SELECT id, business_id FROM branches WHERE id = ? AND business_id = ? LIMIT 1`,
        [branchId, businessId]
      );

      if (!branch) {
        // Si no existe, intentar obtener o crear una por defecto
        branchId = await getOrCreateDefaultBranch();
      }
    }

    // Verificar que el email no esté registrado
    const existingUser = await queryOne<{ id: string }>(
      `SELECT id FROM users WHERE email = ?`,
      [data.email]
    );

    if (existingUser) {
      return {
        success: false,
        error: 'Este correo ya está registrado',
      };
    }

    // Generar IDs
    const newUserId = generateId();
    const branchUserId = generateId();

    // Hashear password usando IPC
    const passwordHash = await hashPasswordClient(data.password);

    // Crear todo en una transacción
    await transaction([
      // 1. Crear usuario en tabla users
      {
        sql: `INSERT INTO users (id, email, name, phone) VALUES (?, ?, ?, ?)`,
        params: [newUserId, data.email, data.name, data.phone],
      },
      // 2. Crear usuario de autenticación
      {
        sql: `INSERT INTO auth_users (user_id, email, password_hash) VALUES (?, ?, ?)`,
        params: [newUserId, data.email, passwordHash],
      },
      // 3. Asignar a la sucursal en branches_users
      {
        sql: `INSERT INTO branches_users (id, user_id, branch_id, role, is_active, benefit) VALUES (?, ?, ?, ?, ?, ?)`,
        params: [branchUserId, newUserId, branchId, data.role, 1, data.benefit || null],
      },
    ]);

    return { success: true, data: { id: newUserId, email: data.email } };
  } catch (error) {
    console.error('[createBranchEmployeeClient] ❌ Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Actualiza un producto existente desde el cliente usando IPC (para modo Electron)
 */
export async function updateProductClient(
  userId: string,
  productId: string,
  data: {
    name?: string;
    description?: string;
    expiration?: string;
    brand?: string;
    barcode?: string;
    sku?: string;
    stock?: number;
    cost?: number;
    price?: number;
    bonification?: number;
    is_active?: boolean;
  }
): Promise<{
  success: boolean;
  error?: string;
}> {
  // Solo funciona en cliente Electron
  if (typeof window === 'undefined' || !isNative()) {
    return {
      success: false,
      error: 'Solo funciona en modo Electron desde el cliente',
    };
  }

  try {
    if (!userId) {
      return { success: false, error: 'Debes estar autenticado' };
    }

    // Verificar permisos del usuario
    const businessUser = await queryOne<{ business_id: string; role: string }>(
      `SELECT business_id, role FROM businesses_users WHERE user_id = ? AND is_active = 1 LIMIT 1`,
      [userId]
    );

    if (!businessUser) {
      return { success: false, error: 'No tienes un negocio asociado' };
    }

    if (businessUser.role !== 'owner') {
      return {
        success: false,
        error: 'No tienes permisos para actualizar productos',
      };
    }

    // Construir query de actualización
    const updateFields: string[] = [];
    const updateParams: any[] = [];

    if (data.name !== undefined) {
      updateFields.push('name = ?');
      updateParams.push(data.name.trim());
    }
    if (data.description !== undefined) {
      updateFields.push('description = ?');
      updateParams.push(data.description.trim() || null);
    }
    if (data.expiration !== undefined) {
      updateFields.push('expiration = ?');
      updateParams.push(data.expiration || null);
    }
    if (data.brand !== undefined) {
      updateFields.push('brand = ?');
      updateParams.push(data.brand.trim() || null);
    }
    if (data.barcode !== undefined) {
      updateFields.push('barcode = ?');
      updateParams.push(data.barcode.trim() || null);
    }
    if (data.sku !== undefined) {
      updateFields.push('sku = ?');
      updateParams.push(data.sku.trim() || null);
    }
    if (data.stock !== undefined) {
      updateFields.push('stock = ?');
      updateParams.push(data.stock);
    }
    if (data.cost !== undefined) {
      updateFields.push('cost = ?');
      updateParams.push(data.cost);
    }
    if (data.price !== undefined) {
      updateFields.push('price = ?');
      updateParams.push(data.price);
    }
    if (data.bonification !== undefined) {
      updateFields.push('bonification = ?');
      updateParams.push(data.bonification);
    }
    if (data.is_active !== undefined) {
      updateFields.push('is_active = ?');
      updateParams.push(data.is_active ? 1 : 0);
    }

    if (updateFields.length === 0) {
      return { success: false, error: 'No hay campos para actualizar' };
    }

    updateParams.push(productId);

    await execute(
      `UPDATE products SET ${updateFields.join(', ')} WHERE id = ?`,
      updateParams
    );

    // Si se actualizó el precio base, actualizar también la presentación "unidad"
    if (data.price !== undefined) {
      try {
        await execute(
          `UPDATE product_presentations SET price = ? WHERE product_id = ? AND variant = ?`,
          [data.price, productId, 'unidad']
        );
      } catch (unitPresentationError) {
        // No retornar error, el producto principal ya se actualizó
      }
    }

    return { success: true };
  } catch (error) {
    console.error('[updateProductClient] ❌ Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Elimina un producto (soft delete) desde el cliente usando IPC (para modo Electron)
 */
export async function deleteProductClient(
  userId: string,
  productId: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  // Solo funciona en cliente Electron
  if (typeof window === 'undefined' || !isNative()) {
    return {
      success: false,
      error: 'Solo funciona en modo Electron desde el cliente',
    };
  }

  try {
    if (!userId) {
      return { success: false, error: 'Debes estar autenticado' };
    }

    // Verificar permisos - solo owners pueden gestionar productos
    const businessUser = await queryOne<{ business_id: string; role: string }>(
      `SELECT business_id, role FROM businesses_users WHERE user_id = ? AND is_active = 1 LIMIT 1`,
      [userId]
    );

    let businessId: string | null = null;
    let hasPermission = false;

    if (businessUser && businessUser.role === 'owner') {
      businessId = businessUser.business_id;
      hasPermission = true;
    }

    if (!hasPermission || !businessId) {
      return {
        success: false,
        error: 'No tienes permisos para eliminar productos. Solo los owners pueden eliminar productos.',
      };
    }

    // Verificar que el producto existe
    const product = await queryOne<{ id: string; branch_id: string }>(
      `SELECT id, branch_id FROM products WHERE id = ? LIMIT 1`,
      [productId]
    );

    if (!product) {
      return { success: false, error: 'Producto no encontrado' };
    }

    // Verificar que la sucursal del producto pertenece al negocio del usuario
    // Un producto pertenece al negocio si:
    // 1. branch_id = businessId (productos antiguos/migrados)
    // 2. O existe un branch con ese branch_id que pertenezca al business
    if (product.branch_id !== businessId) {
      const branch = await queryOne<{ id: string; business_id: string }>(
        `SELECT id, business_id FROM branches WHERE id = ? LIMIT 1`,
        [product.branch_id]
      );

      if (!branch || branch.business_id !== businessId) {
        return {
          success: false,
          error: 'No tienes permisos para eliminar este producto',
        };
      }
    }

    // Soft delete: marcar como inactivo en una transacción
    await transaction([
      {
        sql: `UPDATE products SET is_active = ? WHERE id = ?`,
        params: [0, productId],
      },
      {
        sql: `UPDATE product_presentations SET is_active = ? WHERE product_id = ?`,
        params: [0, productId],
      },
    ]);

    return { success: true };
  } catch (error) {
    console.error('[deleteProductClient] ❌ Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Elimina múltiples productos a la vez desde el cliente usando IPC (para modo Electron)
 */
export async function deleteProductsClient(
  userId: string,
  productIds: string[]
): Promise<{
  success: boolean;
  error?: string;
  deletedCount?: number;
}> {
  // Solo funciona en cliente Electron
  if (typeof window === 'undefined' || !isNative()) {
    return {
      success: false,
      error: 'Solo funciona en modo Electron desde el cliente',
    };
  }

  try {
    if (!userId) {
      return { success: false, error: 'Debes estar autenticado' };
    }

    if (!productIds || productIds.length === 0) {
      return { success: false, error: 'No se proporcionaron productos para eliminar' };
    }

    // Verificar permisos - solo owners pueden gestionar productos
    const businessUser = await queryOne<{ business_id: string; role: string }>(
      `SELECT business_id, role FROM businesses_users WHERE user_id = ? AND is_active = 1 LIMIT 1`,
      [userId]
    );

    let businessId: string | null = null;
    let hasPermission = false;

    if (businessUser && businessUser.role === 'owner') {
      businessId = businessUser.business_id;
      hasPermission = true;
    }

    if (!hasPermission || !businessId) {
      return {
        success: false,
        error: 'No tienes permisos para eliminar productos. Solo los owners pueden eliminar productos.',
      };
    }

    // Verificar que todos los productos pertenezcan al negocio del usuario
    const placeholders = productIds.map(() => '?').join(',');
    const products = await query<{ id: string; branch_id: string }>(
      `SELECT id, branch_id FROM products WHERE id IN (${placeholders})`,
      productIds
    );

    if (!products || products.length === 0) {
      return { success: false, error: 'Error verificando productos' };
    }

    // Verificar que todos los productos pertenezcan al negocio
    // Un producto pertenece al negocio si:
    // 1. branch_id = businessId (productos antiguos/migrados)
    // 2. O existe un branch con ese branch_id que pertenezca al business
    const branchIds = [...new Set(products.map(p => p.branch_id).filter(id => id !== businessId))];

    // Obtener todos los branches válidos en una sola consulta
    let validBranchIds: Set<string> = new Set();
    if (branchIds.length > 0) {
      const branchPlaceholders = branchIds.map(() => '?').join(',');
      const branches = await query<{ id: string; business_id: string }>(
        `SELECT id, business_id FROM branches WHERE id IN (${branchPlaceholders})`,
        branchIds
      );
      validBranchIds = new Set(
        branches.filter(b => b.business_id === businessId).map(b => b.id)
      );
    }

    // Verificar cada producto
    const invalidProducts = products.filter(p => {
      // Si branch_id es igual al businessId, es válido (productos antiguos/migrados)
      if (p.branch_id === businessId) {
        return false;
      }
      // Si no, verificar que existe un branch válido con ese ID
      return !validBranchIds.has(p.branch_id);
    });

    if (invalidProducts.length > 0) {
      return {
        success: false,
        error: 'Algunos productos no pertenecen a tu negocio',
      };
    }

    // Eliminar todos los productos (soft delete) en una transacción
    const now = new Date().toISOString();
    const deleteOps: Array<{ sql: string; params: any[] }> = [];

    // Actualizar productos
    for (const productId of productIds) {
      deleteOps.push({
        sql: `UPDATE products SET is_active = ? WHERE id = ?`,
        params: [0, productId],
      });
      // Actualizar presentaciones de cada producto
      deleteOps.push({
        sql: `UPDATE product_presentations SET is_active = ? WHERE product_id = ?`,
        params: [0, productId],
      });
    }

    await transaction(deleteOps);


    return {
      success: true,
      deletedCount: productIds.length,
    };
  } catch (error) {
    console.error('[deleteProductsClient] ❌ Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Importa productos desde un archivo Excel desde el cliente usando IPC (para modo Electron)
 * El archivo debe tener las siguientes columnas:
 * - nombre (requerido)
 * - descripcion (opcional)
 * - marca (opcional)
 * - codigo_barras (opcional)
 * - sku (opcional)
 * - costo (requerido)
 * - precio (requerido)
 * - stock (opcional, default 0)
 * - bonificacion (opcional, default 0)
 * - fecha_vencimiento (opcional, formato: YYYY-MM-DD)
 * - presentaciones (opcional, formato: "variante:unidades:precio" separadas por "|")
 */
export async function importProductsFromExcelClient(
  userId: string,
  file: File,
  branchId: string
): Promise<{
  success: boolean;
  error?: string;
  importedCount?: number;
  errorCount?: number;
  totalRows?: number;
  errors?: string[];
}> {
  // Solo funciona en cliente Electron
  if (typeof window === 'undefined' || !isNative()) {
    return {
      success: false,
      error: 'Solo funciona en modo Electron desde el cliente',
    };
  }

  try {
    if (!userId) {
      return { success: false, error: 'Debes estar autenticado' };
    }

    if (!file) {
      return {
        success: false,
        error: 'No se proporcionó ningún archivo',
      };
    }

    if (!branchId) {
      return {
        success: false,
        error: 'No se proporcionó el ID de la sucursal',
      };
    }

    // Validar que sea un archivo Excel
    const validExtensions = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'application/vnd.ms-excel.sheet.macroEnabled.12', // .xlsm
    ];

    if (!validExtensions.includes(file.type) && !file.name.match(/\.(xlsx|xls|xlsm)$/i)) {
      return {
        success: false,
        error: 'El archivo debe ser un Excel (.xlsx, .xls, .xlsm)',
      };
    }

    // Verificar permisos - solo owners pueden gestionar productos
    const businessUser = await queryOne<{ business_id: string; role: string }>(
      `SELECT business_id, role FROM businesses_users WHERE user_id = ? AND is_active = 1 LIMIT 1`,
      [userId]
    );

    if (!businessUser) {
      return { success: false, error: 'No tienes un negocio asociado' };
    }

    if (businessUser.role !== 'owner') {
      return {
        success: false,
        error: 'No tienes permisos para importar productos',
      };
    }

    // Verificar que el branch pertenezca al negocio
    // Si branchId es igual a business_id, buscar el primer branch del business
    let actualBranchId = branchId;
    let branch = await queryOne<{ id: string; business_id: string }>(
      `SELECT id, business_id FROM branches WHERE id = ? AND business_id = ? LIMIT 1`,
      [branchId, businessUser.business_id]
    );

    // Si no se encontró el branch y branchId es igual a business_id,
    // buscar el primer branch del business
    if (!branch && branchId === businessUser.business_id) {
      const firstBranch = await queryOne<{ id: string; business_id: string }>(
        `SELECT id, business_id FROM branches WHERE business_id = ? LIMIT 1`,
        [businessUser.business_id]
      );
      if (firstBranch) {
        branch = firstBranch;
        actualBranchId = firstBranch.id;
      } else {
        // Si no existe ningún branch, crear uno por defecto usando los datos del business
        const business = await queryOne<{ id: string; name: string; description: string | null }>(
          `SELECT id, name, description FROM businesses WHERE id = ? LIMIT 1`,
          [businessUser.business_id]
        );

        if (business) {
          const defaultBranchId = generateId();
          await execute(
            `INSERT INTO branches (id, business_id, name, location, phone, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
            [
              defaultBranchId,
              business.id,
              business.name,
              business.description || business.name,
              null,
              new Date().toISOString(),
            ]
          );
          branch = { id: defaultBranchId, business_id: business.id };
          actualBranchId = defaultBranchId;
          console.log(`✅ [importProductsFromExcelClient] Branch por defecto creado automáticamente: ${defaultBranchId}`);
        }
      }
    }

    if (!branch) {
      return {
        success: false,
        error: 'La sucursal no existe o no pertenece a tu negocio',
      };
    }

    // Leer el archivo Excel
    const arrayBuffer = await file.arrayBuffer();
    const XLSX = await import('xlsx');
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    // Obtener la primera hoja
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      return {
        success: false,
        error: 'El archivo Excel no contiene hojas',
      };
    }

    const worksheet = workbook.Sheets[firstSheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: null,
      raw: false,
    }) as any[][];

    if (data.length < 2) {
      return {
        success: false,
        error: 'El archivo Excel debe tener al menos una fila de datos (además del encabezado)',
      };
    }

    // Obtener encabezados (primera fila)
    const headers = data[0].map((h: any) =>
      String(h || '').toLowerCase().trim()
    ) as string[];

    // Mapear nombres de columnas comunes
    const columnMap: Record<string, string> = {
      'nombre': 'nombre',
      'name': 'nombre',
      'producto': 'nombre',
      'product': 'nombre',
      'descripcion': 'descripcion',
      'description': 'descripcion',
      'desc': 'descripcion',
      'marca': 'marca',
      'brand': 'marca',
      'codigo_barras': 'codigo_barras',
      'barcode': 'codigo_barras',
      'codigo': 'codigo_barras',
      'sku': 'sku',
      'costo': 'costo',
      'cost': 'costo',
      'precio': 'precio',
      'price': 'precio',
      'stock': 'stock',
      'inventario': 'stock',
      'inventory': 'stock',
      'bonificacion': 'bonificacion',
      'bonification': 'bonificacion',
      'fecha_vencimiento': 'fecha_vencimiento',
      'expiration': 'fecha_vencimiento',
      'exp': 'fecha_vencimiento',
      'vencimiento': 'fecha_vencimiento',
      'presentaciones': 'presentaciones',
      'presentations': 'presentaciones',
      'variantes': 'presentaciones',
      'variants': 'presentaciones',
    };

    // Crear índice de columnas
    const columnIndex: Record<string, number> = {};
    headers.forEach((header, index) => {
      const normalizedHeader = header.toLowerCase().trim();
      const mappedColumn = columnMap[normalizedHeader];
      if (mappedColumn) {
        columnIndex[mappedColumn] = index;
      }
    });

    // Validar columnas requeridas
    if (columnIndex['nombre'] === undefined) {
      return {
        success: false,
        error: 'El archivo debe tener una columna "nombre" o "name"',
      };
    }

    if (columnIndex['costo'] === undefined && columnIndex['precio'] === undefined) {
      return {
        success: false,
        error: 'El archivo debe tener columnas "costo" y "precio" (o "cost" y "price")',
      };
    }

    let importedCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    // Procesar cada fila (empezando desde la fila 2, índice 1)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];

      // Saltar filas vacías
      if (!row || row.every((cell: any) => !cell || String(cell).trim() === '')) {
        continue;
      }

      try {
        // Extraer datos de la fila
        const getValue = (column: string): string | null => {
          const index = columnIndex[column];
          if (index === undefined || index >= row.length) return null;
          const value = row[index];
          return value !== null && value !== undefined ? String(value).trim() : null;
        };

        const nombre = getValue('nombre');
        if (!nombre || nombre === '') {
          errorCount++;
          errors.push(`Fila ${i + 1}: Nombre es requerido`);
          continue;
        }

        const descripcion = getValue('descripcion');
        const marca = getValue('marca');
        const codigoBarras = getValue('codigo_barras');
        const sku = getValue('sku');

        // Parsear números
        const costoStr = getValue('costo') || getValue('precio') || '0';
        const precioStr = getValue('precio') || getValue('costo') || '0';
        const stockStr = getValue('stock') || '0';
        const bonificacionStr = getValue('bonificacion') || '0';

        const costo = parseFloat(String(costoStr).replace(/[^0-9.-]/g, '')) || 0;
        const precio = parseFloat(String(precioStr).replace(/[^0-9.-]/g, '')) || 0;
        const stock = parseFloat(String(stockStr).replace(/[^0-9.-]/g, '')) || 0;
        const bonificacion = parseFloat(String(bonificacionStr).replace(/[^0-9.-]/g, '')) || 0;

        if (costo < 0 || precio < 0) {
          errorCount++;
          errors.push(`Fila ${i + 1} (${nombre}): Costo y precio deben ser números positivos`);
          continue;
        }

        // Parsear fecha de vencimiento
        let fechaVencimiento: string | null = null;
        const fechaStr = getValue('fecha_vencimiento');
        if (fechaStr) {
          try {
            // Intentar parsear diferentes formatos de fecha
            const date = new Date(fechaStr);
            if (!isNaN(date.getTime())) {
              fechaVencimiento = date.toISOString();
            }
          } catch {
            // Si no se puede parsear, se deja como null
          }
        }

        // Parsear presentaciones
        const presentaciones: Array<{ variant: string; units: number; price?: number }> = [];
        const presentacionesStr = getValue('presentaciones');
        if (presentacionesStr) {
          // Formato: "variante:unidades:precio|variante2:unidades2:precio2"
          const presentacionesArray = presentacionesStr.split('|');
          for (const presStr of presentacionesArray) {
            const parts = presStr.split(':').map(p => p.trim());
            if (parts.length >= 2) {
              const variant = parts[0];
              const units = parseInt(parts[1]) || 1;
              const price = parts[2] ? parseFloat(parts[2].replace(/[^0-9.-]/g, '')) : undefined;

              if (variant && units > 0) {
                presentaciones.push({ variant, units, price });
              }
            }
          }
        }

        // Crear el producto y presentaciones en una transacción
        const productId = generateId();
        const now = new Date().toISOString();

        // Preparar presentaciones
        const presentationsData = [
          // Presentación base "unidad"
          {
            id: generateId(),
            product_id: productId,
            variant: 'unidad',
            units: 1,
            price: precio,
            is_active: 1,
            created_at: now,
          },
          // Presentaciones adicionales
          ...presentaciones.map(p => ({
            id: generateId(),
            product_id: productId,
            variant: p.variant,
            units: p.units,
            price: p.price || precio,
            is_active: 1,
            created_at: now,
          })),
        ];

        const presentationOps = presentationsData.map(p => ({
          sql: `INSERT INTO product_presentations (id, product_id, variant, units, price, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          params: [p.id, p.product_id, p.variant, p.units, p.price, p.is_active, p.created_at],
        }));

        try {
          await transaction([
            {
              sql: `INSERT INTO products (id, branch_id, name, description, expiration, brand, barcode, sku, cost, price, stock, bonification, created_by_user_id, is_active, created_at) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              params: [
                productId,
                actualBranchId,
                nombre,
                descripcion || null,
                fechaVencimiento,
                marca || null,
                codigoBarras || null,
                sku || null,
                costo,
                precio,
                stock,
                bonificacion,
                userId,
                1,
                now,
              ],
            },
            ...presentationOps,
          ]);
        } catch (productError) {
          console.error(`❌ Error creando producto ${nombre}:`, productError);
          errorCount++;
          errors.push(`Fila ${i + 1} (${nombre}): ${productError instanceof Error ? productError.message : 'Error desconocido'}`);
          continue;
        }

        importedCount++;
      } catch (error) {
        console.error(`❌ Error procesando fila ${i + 1}:`, error);
        errorCount++;
        errors.push(`Fila ${i + 1}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      }
    }

    console.log(
      `✅ [importProductsFromExcelClient] Importación desde Excel completada: ${importedCount} productos importados, ${errorCount} errores`
    );

    return {
      success: true,
      importedCount,
      errorCount,
      totalRows: data.length - 1,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    console.error('❌ [importProductsFromExcelClient] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Actualiza las presentaciones de un producto desde el cliente usando IPC (para modo Electron)
 */
export async function updateProductPresentationsClient(
  userId: string,
  productId: string,
  presentations: Array<{
    id?: string;
    variant: string;
    units: number;
    price?: number;
  }>
): Promise<{
  success: boolean;
  error?: string;
}> {
  // Solo funciona en cliente Electron
  if (typeof window === 'undefined' || !isNative()) {
    return {
      success: false,
      error: 'Solo funciona en modo Electron desde el cliente',
    };
  }

  try {
    if (!userId) {
      return { success: false, error: 'Debes estar autenticado' };
    }

    // Verificar permisos
    const businessUser = await queryOne<{ business_id: string; role: string }>(
      `SELECT business_id, role FROM businesses_users WHERE user_id = ? AND is_active = 1 LIMIT 1`,
      [userId]
    );

    if (!businessUser) {
      return { success: false, error: 'No tienes un negocio asociado' };
    }

    if (businessUser.role !== 'owner') {
      return {
        success: false,
        error: 'No tienes permisos para actualizar presentaciones',
      };
    }

    // 1. Obtener presentaciones existentes (excluyendo "unidad")
    // La presentación "unidad" nunca se edita ni elimina
    const existingPresentations = await query<{ id: string; variant: string }>(
      `SELECT id, variant FROM product_presentations WHERE product_id = ? AND variant != ?`,
      [productId, 'unidad']
    );

    const existingIds = existingPresentations?.map(p => p.id) || [];
    const updatingIds = presentations.filter(p => p.id).map(p => p.id!);

    // 2. Eliminar presentaciones que ya no están en la lista
    const toDelete = existingIds.filter(id => !updatingIds.includes(id));
    if (toDelete.length > 0) {
      const deletePlaceholders = toDelete.map(() => '?').join(',');
      await execute(
        `DELETE FROM product_presentations WHERE id IN (${deletePlaceholders})`,
        toDelete
      );
    }

    // 3. Actualizar o crear presentaciones usando transacción
    const toUpdate = presentations.filter(p => p.id);
    const toInsert = presentations.filter(p => !p.id);

    const updateOps: Array<{ sql: string; params: any[] }> = [];
    const insertOps: Array<{ sql: string; params: any[] }> = [];
    const now = new Date().toISOString();

    // Actualizar todas las presentaciones existentes (sin updated_at)
    for (const presentation of toUpdate) {
      updateOps.push({
        sql: `UPDATE product_presentations SET variant = ?, units = ?, price = ? WHERE id = ?`,
        params: [
          presentation.variant,
          presentation.units,
          presentation.price || null,
          presentation.id!,
        ],
      });
    }

    // Insertar todas las nuevas presentaciones (sin updated_at)
    for (const presentation of toInsert) {
      const presentationId = generateId();
      insertOps.push({
        sql: `INSERT INTO product_presentations (id, product_id, variant, units, price, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        params: [
          presentationId,
          productId,
          presentation.variant,
          presentation.units,
          presentation.price || null,
          1,
          now,
        ],
      });
    }

    // Ejecutar todas las operaciones en una transacción
    if (updateOps.length > 0 || insertOps.length > 0) {
      await transaction([...updateOps, ...insertOps]);
    }

    return { success: true };
  } catch (error) {
    console.error('[updateProductPresentationsClient] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Obtiene todos los usuarios de branches_users (solo cashiers) desde el cliente usando IPC (para modo Electron)
 */
export async function getBusinessUsersClient(
  userId: string,
  branchId?: string
): Promise<{
  success: boolean;
  error?: string;
  users?: Array<{
    id: string;
    userId: string;
    name: string;
    email: string;
    phone: string | null;
    role: string;
    branchId?: string;
    branchName?: string;
    benefit?: number;
    isActive: boolean;
    level: 'business' | 'branch';
  }>;
}> {
  // Solo funciona en cliente Electron
  if (typeof window === 'undefined' || !isNative()) {
    return {
      success: false,
      error: 'Solo funciona en modo Electron desde el cliente',
      users: [],
    };
  }

  try {
    if (!userId) {
      return { success: false, error: 'Debes estar autenticado', users: [] };
    }

    // Obtener el business_id del usuario actual
    let targetBusinessId: string | null = null;

    // Primero intentar buscar en businesses_users (owner)
    const businessUser = await queryOne<{ business_id: string; role: string }>(
      `SELECT business_id, role FROM businesses_users WHERE user_id = ? AND is_active = 1 LIMIT 1`,
      [userId]
    );

    if (businessUser) {
      targetBusinessId = businessUser.business_id;
    } else {
      // Si no está en businesses_users, buscar en branches_users (cashier)
      const branchUser = await queryOne<{ business_id: string }>(
        `SELECT b.business_id 
         FROM branches_users bu
         INNER JOIN branches b ON b.id = bu.branch_id
         WHERE bu.user_id = ? AND bu.is_active = 1 LIMIT 1`,
        [userId]
      );

      if (branchUser) {
        targetBusinessId = branchUser.business_id;
      }
    }

    if (!targetBusinessId) {
      return { success: false, error: 'No tienes un negocio asociado', users: [] };
    }

    // Normalizar branchId si es necesario (si es igual a businessId, obtener la primera sucursal real)
    let normalizedBranchId: string | undefined = branchId;
    if (branchId && branchId === targetBusinessId) {
      // Es un business convertido, buscar la primera sucursal real
      const firstBranch = await queryOne<{ id: string }>(
        `SELECT id FROM branches WHERE business_id = ? LIMIT 1`,
        [targetBusinessId]
      );
      if (firstBranch) {
        normalizedBranchId = firstBranch.id;
      } else {
        // Si no hay sucursales, no hay usuarios que mostrar
        normalizedBranchId = undefined;
      }
    } else if (branchId) {
      // Validar que el branchId existe y pertenece al negocio
      const branch = await queryOne<{ id: string }>(
        `SELECT id FROM branches WHERE id = ? AND business_id = ? LIMIT 1`,
        [branchId, targetBusinessId]
      );
      if (!branch) {
        // Si el branchId no existe, buscar la primera sucursal real
        const firstBranch = await queryOne<{ id: string }>(
          `SELECT id FROM branches WHERE business_id = ? LIMIT 1`,
          [targetBusinessId]
        );
        normalizedBranchId = firstBranch?.id;
      }
    }

    // Construir query base
    let sql = `
      SELECT 
        bu.id,
        bu.user_id,
        bu.role,
        bu.branch_id,
        bu.benefit,
        bu.is_active,
        u.id as user_table_id,
        u.email,
        u.name,
        u.phone,
        b.id as branch_table_id,
        b.name as branch_name
      FROM branches_users bu
      INNER JOIN users u ON u.id = bu.user_id
      INNER JOIN branches b ON b.id = bu.branch_id
      WHERE b.business_id = ? AND bu.is_active = 1 AND bu.role = 'cashier'
    `;
    const params: any[] = [targetBusinessId];

    // Si se proporciona branchId normalizado, filtrar por esa sucursal
    if (normalizedBranchId) {
      sql += ` AND bu.branch_id = ?`;
      params.push(normalizedBranchId);
    }

    const branchUsers = await query<{
      id: string;
      user_id: string;
      role: string;
      branch_id: string;
      benefit: number | null;
      is_active: number;
      user_table_id: string;
      email: string;
      name: string;
      phone: string;
      branch_table_id: string;
      branch_name: string;
    }>(sql, params);

    // Formatear usuarios
    const allUsers = branchUsers.map((bu) => ({
      id: bu.id,
      userId: bu.user_id,
      name: bu.name,
      email: bu.email,
      phone: bu.phone,
      role: bu.role,
      branchId: bu.branch_id,
      branchName: bu.branch_name,
      benefit: bu.benefit ?? undefined,
      isActive: bu.is_active === 1,
      level: 'branch' as const,
    }));

    return { success: true, users: allUsers };
  } catch (error) {
    console.error('[getBusinessUsersClient] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      users: [],
    };
  }
}

/**
 * Actualiza la información de un negocio desde el cliente usando IPC (para modo Electron)
 */
export async function updateBusinessClient(
  userId: string,
  businessId: string,
  data: {
    name?: string;
    tax_id?: string;
    description?: string | null;
    website?: string | null;
    theme?: string | null;
    location?: string | null;
  }
): Promise<{
  success: boolean;
  error?: string;
  business?: any;
}> {
  // Solo funciona en cliente Electron
  if (typeof window === 'undefined' || !isNative()) {
    return {
      success: false,
      error: 'Solo funciona en modo Electron desde el cliente',
    };
  }

  try {
    if (!userId) {
      return { success: false, error: 'Debes estar autenticado' };
    }

    // Verificar que el usuario tenga permisos (owner del negocio)
    const businessUser = await queryOne<{ role: string }>(
      `SELECT role FROM businesses_users WHERE user_id = ? AND business_id = ? AND is_active = 1 LIMIT 1`,
      [userId, businessId]
    );

    if (!businessUser || businessUser.role !== 'owner') {
      return {
        success: false,
        error: 'No tienes permisos para editar este negocio',
      };
    }

    // Si se está actualizando el nombre, validar que no esté en uso (excepto por el negocio actual)
    if (data.name !== undefined) {
      const trimmedName = data.name.trim();
      if (!trimmedName) {
        return { success: false, error: 'El nombre del negocio es requerido' };
      }

      const existingBusiness = await queryOne<{ id: string }>(
        `SELECT id FROM businesses WHERE name = ? AND id != ? LIMIT 1`,
        [trimmedName, businessId]
      );

      if (existingBusiness) {
        return {
          success: false,
          error: 'Este nombre de negocio ya está en uso',
        };
      }
    }

    // Preparar datos para actualizar
    const updates: string[] = [];
    const params: (string | null)[] = [];

    if (data.name !== undefined) {
      updates.push('name = ?');
      params.push(data.name.trim());
    }
    if (data.tax_id !== undefined) {
      updates.push('tax_id = ?');
      params.push(data.tax_id.trim());
    }
    if (data.description !== undefined) {
      updates.push('description = ?');
      params.push(data.description?.trim() || null);
    }
    if (data.website !== undefined) {
      updates.push('website = ?');
      params.push(data.website?.trim() || null);
    }
    if (data.theme !== undefined) {
      updates.push('theme = ?');
      params.push(data.theme || null);
    }
    if (data.location !== undefined) {
      updates.push('location = ?');
      params.push(data.location?.trim() || null);
    }

    if (updates.length === 0) {
      return { success: false, error: 'No hay datos para actualizar' };
    }

    params.push(businessId);

    // Actualizar el negocio
    await execute(
      `UPDATE businesses SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    // Obtener el negocio actualizado
    interface BusinessRow {
      id: string;
      name: string;
      tax_id: string;
      description: string | null;
      website: string | null;
      theme: string | null;
      location: string | null;
      created_at: string;
    }

    const updatedBusiness = await queryOne<BusinessRow>(
      `SELECT * FROM businesses WHERE id = ?`,
      [businessId]
    );

    return {
      success: true,
      business: updatedBusiness,
    };
  } catch (error) {
    console.error('[updateBusinessClient] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Restablece el beneficio de un usuario a 0 desde el cliente usando IPC (para modo Electron)
 */
export async function resetUserBenefitClient(
  userId: string,
  relationId: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  // Solo funciona en cliente Electron
  if (typeof window === 'undefined' || !isNative()) {
    return {
      success: false,
      error: 'Solo funciona en modo Electron desde el cliente',
    };
  }

  try {
    if (!userId || !relationId) {
      return { success: false, error: 'Usuario y relación ID son requeridos' };
    }

    // Verificar permisos - solo owners pueden gestionar usuarios
    const businessUser = await queryOne<{ business_id: string; role: string }>(
      `SELECT business_id, role FROM businesses_users WHERE user_id = ? AND is_active = 1 LIMIT 1`,
      [userId]
    );

    if (!businessUser || businessUser.role !== 'owner') {
      return {
        success: false,
        error: 'No tienes permisos para restablecer beneficios',
      };
    }

    // Resetear el beneficio a 0
    await execute(
      `UPDATE branches_users SET benefit = 0 WHERE id = ?`,
      [relationId]
    );

    return { success: true };
  } catch (error) {
    console.error('[resetUserBenefitClient] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Elimina (desactiva) un usuario desde el cliente usando IPC (para modo Electron)
 */
export async function deleteUserClient(
  userId: string,
  relationId: string,
  level: 'business' | 'branch'
): Promise<{
  success: boolean;
  error?: string;
}> {
  // Solo funciona en cliente Electron
  if (typeof window === 'undefined' || !isNative()) {
    return {
      success: false,
      error: 'Solo funciona en modo Electron desde el cliente',
    };
  }

  try {
    if (!userId || !relationId) {
      return { success: false, error: 'Usuario y relación ID son requeridos' };
    }

    // Verificar permisos - solo owners pueden gestionar usuarios
    const businessUser = await queryOne<{ business_id: string; role: string }>(
      `SELECT business_id, role FROM businesses_users WHERE user_id = ? AND is_active = 1 LIMIT 1`,
      [userId]
    );

    if (!businessUser || businessUser.role !== 'owner') {
      return {
        success: false,
        error: 'No tienes permisos para eliminar usuarios',
      };
    }

    // Obtener el user_id antes de eliminar la relación
    let targetUserId: string | null = null;

    if (level === 'business') {
      const businessUserRel = await queryOne<{ user_id: string }>(
        `SELECT user_id FROM businesses_users WHERE id = ?`,
        [relationId]
      );

      targetUserId = businessUserRel?.user_id || null;

      // Eliminar la relación en businesses_users
      await execute(
        `DELETE FROM businesses_users WHERE id = ?`,
        [relationId]
      );
    } else {
      const branchUserRel = await queryOne<{ user_id: string }>(
        `SELECT user_id FROM branches_users WHERE id = ?`,
        [relationId]
      );

      targetUserId = branchUserRel?.user_id || null;

      // Eliminar la relación en branches_users
      await execute(
        `DELETE FROM branches_users WHERE id = ?`,
        [relationId]
      );
    }

    // Si se obtuvo el userId, eliminar también el usuario de todas las tablas relacionadas
    // Si se obtuvo el userId, eliminar también el usuario de todas las tablas relacionadas
    if (targetUserId) {
      try {
        await transaction([
          // Eliminar sesiones de autenticación
          {
            sql: `DELETE FROM auth_sessions WHERE user_id = ?`,
            params: [targetUserId],
          },
          // Eliminar usuario de autenticación
          {
            sql: `DELETE FROM auth_users WHERE user_id = ?`,
            params: [targetUserId],
          },
          // Eliminar de la tabla users (esto eliminará en cascada las relaciones restantes)
          {
            sql: `DELETE FROM users WHERE id = ?`,
            params: [targetUserId],
          },
        ]);
      } catch (cleanupError: any) {
        // Ignorar error de FK (usuario tiene historial) ya que el acceso fue removido arriba
        const isConstraintError =
          cleanupError?.message?.includes('FOREIGN KEY constraint failed') ||
          String(cleanupError).includes('FOREIGN KEY constraint failed');

        if (isConstraintError) {
          console.log(
            '[deleteUserClient] ℹ️ Usuario conservado por historial, acceso eliminado.'
          );
          // Intentar limpiar credenciales para prevenir login futuro
          try {
            await transaction([
              {
                sql: `DELETE FROM auth_sessions WHERE user_id = ?`,
                params: [targetUserId],
              },
              {
                sql: `DELETE FROM auth_users WHERE user_id = ?`,
                params: [targetUserId],
              },
            ]);
          } catch (e) {
            console.warn('[deleteUserClient] Warning cleaning auth:', e);
          }
        } else {
          throw cleanupError;
        }
      }
    }

    return { success: true };
  } catch (error) {
    console.error('[deleteUserClient] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Obtiene la sesión activa de un usuario en una sucursal (desde el cliente usando IPC)
 */
export async function getActiveSessionClient(
  userId: string,
  branchId: string
): Promise<{ data: any | null; error: string | null }> {
  // Solo funciona en cliente Electron
  if (typeof window === 'undefined' || !isNative()) {
    return {
      data: null,
      error: 'Solo funciona en modo Electron desde el cliente',
    };
  }

  try {
    // Obtener el business_id del usuario para validar el branch
    const businessUser = await queryOne<{ business_id: string }>(
      `SELECT business_id FROM businesses_users WHERE user_id = ? AND is_active = 1 LIMIT 1`,
      [userId]
    );

    let businessId: string | null = null;
    if (businessUser) {
      businessId = businessUser.business_id;
    } else {
      // Si no es owner, buscar a través de branches_users
      const branchUser = await queryOne<{ business_id: string }>(
        `SELECT b.business_id 
         FROM branches_users bu
         INNER JOIN branches b ON b.id = bu.branch_id
         WHERE bu.user_id = ? AND bu.is_active = 1 LIMIT 1`,
        [userId]
      );
      if (branchUser) {
        businessId = branchUser.business_id;
      }
    }

    // Función auxiliar para obtener o crear una sucursal por defecto
    const getOrCreateDefaultBranch = async (): Promise<string> => {
      if (!businessId) {
        throw new Error('No se pudo identificar el negocio del usuario');
      }

      // Buscar la primera sucursal del negocio
      const firstBranch = await queryOne<{ id: string }>(
        `SELECT id FROM branches WHERE business_id = ? LIMIT 1`,
        [businessId]
      );

      if (firstBranch) {
        return firstBranch.id;
      }

      // Si no hay sucursales, crear una por defecto
      const defaultBranchId = generateId();
      const business = await queryOne<{ name: string; description: string | null }>(
        `SELECT name, description FROM businesses WHERE id = ? LIMIT 1`,
        [businessId]
      );
      const branchName = business?.name || 'Sucursal Principal';
      const branchLocation = business?.description || business?.name || 'Sucursal Principal';
      const now = new Date().toISOString();

      await execute(
        `INSERT INTO branches (id, business_id, name, location, phone, created_at) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [defaultBranchId, businessId, branchName, branchLocation, null, now]
      );

      return defaultBranchId;
    };

    // Validar y obtener branch_id real (misma lógica que startUserSessionClient)
    let actualBranchId: string = branchId;

    if (businessId) {
      // Si branchId es igual a businessId, es un business convertido a branch
      if (actualBranchId === businessId) {
        actualBranchId = await getOrCreateDefaultBranch();
      } else {
        // Validar que la sucursal existe y pertenece al negocio
        const branch = await queryOne<{ id: string; business_id: string }>(
          `SELECT id, business_id FROM branches WHERE id = ? AND business_id = ? LIMIT 1`,
          [actualBranchId, businessId]
        );

        if (!branch) {
          // Si no existe, intentar obtener o crear una por defecto
          actualBranchId = await getOrCreateDefaultBranch();
        }
      }
    } else {
      // Si no hay businessId, validar que el branch existe
      const branch = await queryOne<{ id: string }>(
        `SELECT id FROM branches WHERE id = ? LIMIT 1`,
        [actualBranchId]
      );

      if (!branch) {
        return {
          data: null,
          error: 'La sucursal especificada no existe'
        };
      }
    }

    const session = await queryOne<any>(
      `SELECT * FROM user_sessions WHERE user_id = ? AND branch_id = ? AND closed_at IS NULL ORDER BY created_at DESC LIMIT 1`,
      [userId, actualBranchId]
    );

    return { data: session || null, error: null };
  } catch (error) {
    console.error('[getActiveSessionClient] Error:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Crea una nueva sesión de usuario (desde el cliente usando IPC)
 */
export async function startUserSessionClient(
  userId: string,
  branchId: string
): Promise<{ success: boolean; sessionId?: string; error?: string }> {
  // Solo funciona en cliente Electron
  if (typeof window === 'undefined' || !isNative()) {
    return {
      success: false,
      error: 'Solo funciona en modo Electron desde el cliente',
    };
  }

  try {
    // Obtener el business_id del usuario para validar el branch
    const businessUser = await queryOne<{ business_id: string }>(
      `SELECT business_id FROM businesses_users WHERE user_id = ? AND is_active = 1 LIMIT 1`,
      [userId]
    );

    let businessId: string | null = null;
    if (businessUser) {
      businessId = businessUser.business_id;
    } else {
      // Si no es owner, buscar a través de branches_users
      const branchUser = await queryOne<{ business_id: string }>(
        `SELECT b.business_id 
         FROM branches_users bu
         INNER JOIN branches b ON b.id = bu.branch_id
         WHERE bu.user_id = ? AND bu.is_active = 1 LIMIT 1`,
        [userId]
      );
      if (branchUser) {
        businessId = branchUser.business_id;
      }
    }

    // Función auxiliar para obtener o crear una sucursal por defecto
    const getOrCreateDefaultBranch = async (): Promise<string> => {
      if (!businessId) {
        throw new Error('No se pudo identificar el negocio del usuario');
      }

      // Buscar la primera sucursal del negocio
      const firstBranch = await queryOne<{ id: string }>(
        `SELECT id FROM branches WHERE business_id = ? LIMIT 1`,
        [businessId]
      );

      if (firstBranch) {
        return firstBranch.id;
      }

      // Si no hay sucursales, crear una por defecto
      const defaultBranchId = generateId();
      const business = await queryOne<{ name: string; description: string | null }>(
        `SELECT name, description FROM businesses WHERE id = ? LIMIT 1`,
        [businessId]
      );
      const branchName = business?.name || 'Sucursal Principal';
      const branchLocation = business?.description || business?.name || 'Sucursal Principal';
      const now = new Date().toISOString();

      await execute(
        `INSERT INTO branches (id, business_id, name, location, phone, created_at) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [defaultBranchId, businessId, branchName, branchLocation, null, now]
      );

      return defaultBranchId;
    };

    // Validar y obtener branch_id real
    let actualBranchId: string = branchId;

    if (businessId) {
      // Si branchId es igual a businessId, es un business convertido a branch
      if (actualBranchId === businessId) {
        actualBranchId = await getOrCreateDefaultBranch();
      } else {
        // Validar que la sucursal existe y pertenece al negocio
        const branch = await queryOne<{ id: string; business_id: string }>(
          `SELECT id, business_id FROM branches WHERE id = ? AND business_id = ? LIMIT 1`,
          [actualBranchId, businessId]
        );

        if (!branch) {
          // Si no existe, intentar obtener o crear una por defecto
          actualBranchId = await getOrCreateDefaultBranch();
        }
      }
    }

    // Verificar si ya existe una sesión activa para este usuario en esta sucursal
    const existingSession = await queryOne<{ id: string }>(
      `SELECT id FROM user_sessions WHERE user_id = ? AND branch_id = ? AND closed_at IS NULL LIMIT 1`,
      [userId, actualBranchId]
    );

    if (existingSession) {
      // Si ya existe una sesión activa, retornar su ID
      return {
        success: true,
        sessionId: existingSession.id
      };
    }

    // Crear nueva sesión con valores iniciales
    const initialPaymentTotals = {
      cash: 0,
      card: 0,
      transfer: 0,
      digital_wallet: 0
    };

    const sessionId = generateId();
    const now = new Date().toISOString();

    try {
      console.log('[startUserSessionClient] Intentando crear sesión:', {
        sessionId,
        userId,
        actualBranchId,
        now
      });

      await execute(
        `INSERT INTO user_sessions (id, user_id, branch_id, total_bonus, total_sales, payment_totals, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          sessionId,
          userId,
          actualBranchId,
          0,
          0,
          JSON.stringify(initialPaymentTotals),
          now,
          now,
        ]
      );

      // Verificar que la sesión se creó correctamente
      const createdSession = await queryOne<{ id: string }>(
        `SELECT id FROM user_sessions WHERE id = ? LIMIT 1`,
        [sessionId]
      );

      if (!createdSession) {
        console.error('[startUserSessionClient] La sesión no se creó correctamente después de la inserción');
        return {
          success: false,
          error: 'La sesión no se creó correctamente'
        };
      }

      console.log('[startUserSessionClient] Sesión creada exitosamente:', sessionId);
    } catch (insertError) {
      console.error('[startUserSessionClient] Error al insertar sesión en la base de datos:', insertError);
      return {
        success: false,
        error: `Error al insertar sesión: ${insertError instanceof Error ? insertError.message : 'Error desconocido'}`
      };
    }

    return {
      success: true,
      sessionId
    };
  } catch (error) {
    console.error('[startUserSessionClient] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error inesperado al crear la sesión';
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Cierra la sesión activa de un usuario (desde el cliente usando IPC)
 */
export async function closeUserSessionClient(
  userId: string,
  branchId?: string
): Promise<{ success: boolean; error?: string }> {
  // Solo funciona en cliente Electron
  if (typeof window === 'undefined' || !isNative()) {
    return {
      success: false,
      error: 'Solo funciona en modo Electron desde el cliente',
    };
  }

  try {
    const now = new Date().toISOString();

    if (branchId) {
      // Obtener el business_id del usuario para validar el branch
      const businessUser = await queryOne<{ business_id: string }>(
        `SELECT business_id FROM businesses_users WHERE user_id = ? AND is_active = 1 LIMIT 1`,
        [userId]
      );

      let businessId: string | null = null;
      if (businessUser) {
        businessId = businessUser.business_id;
      } else {
        // Si no es owner, buscar a través de branches_users
        const branchUser = await queryOne<{ business_id: string }>(
          `SELECT b.business_id 
           FROM branches_users bu
           INNER JOIN branches b ON b.id = bu.branch_id
           WHERE bu.user_id = ? AND bu.is_active = 1 LIMIT 1`,
          [userId]
        );
        if (branchUser) {
          businessId = branchUser.business_id;
        }
      }

      // Función auxiliar para obtener o crear una sucursal por defecto
      const getOrCreateDefaultBranch = async (): Promise<string> => {
        if (!businessId) {
          throw new Error('No se pudo identificar el negocio del usuario');
        }

        // Buscar la primera sucursal del negocio
        const firstBranch = await queryOne<{ id: string }>(
          `SELECT id FROM branches WHERE business_id = ? LIMIT 1`,
          [businessId]
        );

        if (firstBranch) {
          return firstBranch.id;
        }

        // Si no hay sucursales, crear una por defecto
        const defaultBranchId = generateId();
        const business = await queryOne<{ name: string; description: string | null }>(
          `SELECT name, description FROM businesses WHERE id = ? LIMIT 1`,
          [businessId]
        );
        const branchName = business?.name || 'Sucursal Principal';
        const branchLocation = business?.description || business?.name || 'Sucursal Principal';
        const now = new Date().toISOString();

        await execute(
          `INSERT INTO branches (id, business_id, name, location, phone, created_at) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [defaultBranchId, businessId, branchName, branchLocation, null, now]
        );

        return defaultBranchId;
      };

      // Validar y obtener branch_id real (misma lógica que startUserSessionClient)
      let actualBranchId: string = branchId;

      if (businessId) {
        // Si branchId es igual a businessId, es un business convertido a branch
        if (actualBranchId === businessId) {
          actualBranchId = await getOrCreateDefaultBranch();
        } else {
          // Validar que la sucursal existe y pertenece al negocio
          const branch = await queryOne<{ id: string; business_id: string }>(
            `SELECT id, business_id FROM branches WHERE id = ? AND business_id = ? LIMIT 1`,
            [actualBranchId, businessId]
          );

          if (!branch) {
            // Si no existe, intentar obtener o crear una por defecto
            actualBranchId = await getOrCreateDefaultBranch();
          }
        }
      } else {
        // Si no hay businessId, validar que el branch existe
        const branch = await queryOne<{ id: string }>(
          `SELECT id FROM branches WHERE id = ? LIMIT 1`,
          [actualBranchId]
        );

        if (!branch) {
          return {
            success: false,
            error: 'La sucursal especificada no existe'
          };
        }
      }

      // Cerrar sesión específica de la sucursal usando el actualBranchId
      await execute(
        `UPDATE user_sessions SET closed_at = ?, updated_at = ? WHERE user_id = ? AND branch_id = ? AND closed_at IS NULL`,
        [now, now, userId, actualBranchId]
      );
    } else {
      // Cerrar todas las sesiones activas del usuario
      await execute(
        `UPDATE user_sessions SET closed_at = ?, updated_at = ? WHERE user_id = ? AND closed_at IS NULL`,
        [now, now, userId]
      );
    }

    return {
      success: true
    };
  } catch (error) {
    console.error('[closeUserSessionClient] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Obtiene las ventas realizadas durante la sesión activa (desde el cliente usando IPC)
 */
export async function getSessionSalesClient(
  userId: string,
  branchId: string
): Promise<{ data: any[] | null; error: string | null }> {
  // Solo funciona en cliente Electron
  if (typeof window === 'undefined' || !isNative()) {
    return {
      data: null,
      error: 'Solo funciona en modo Electron desde el cliente',
    };
  }

  try {
    // Obtener el business_id del usuario para validar el branch
    const businessUser = await queryOne<{ business_id: string }>(
      `SELECT business_id FROM businesses_users WHERE user_id = ? AND is_active = 1 LIMIT 1`,
      [userId]
    );

    let businessId: string | null = null;
    if (businessUser) {
      businessId = businessUser.business_id;
    } else {
      // Si no es owner, buscar a través de branches_users
      const branchUser = await queryOne<{ business_id: string }>(
        `SELECT b.business_id 
         FROM branches_users bu
         INNER JOIN branches b ON b.id = bu.branch_id
         WHERE bu.user_id = ? AND bu.is_active = 1 LIMIT 1`,
        [userId]
      );
      if (branchUser) {
        businessId = branchUser.business_id;
      }
    }

    // Función auxiliar para obtener o crear una sucursal por defecto
    const getOrCreateDefaultBranch = async (): Promise<string> => {
      if (!businessId) {
        throw new Error('No se pudo identificar el negocio del usuario');
      }

      // Buscar la primera sucursal del negocio
      const firstBranch = await queryOne<{ id: string }>(
        `SELECT id FROM branches WHERE business_id = ? LIMIT 1`,
        [businessId]
      );

      if (firstBranch) {
        return firstBranch.id;
      }

      // Si no hay sucursales, crear una por defecto
      const defaultBranchId = generateId();
      const business = await queryOne<{ name: string; description: string | null }>(
        `SELECT name, description FROM businesses WHERE id = ? LIMIT 1`,
        [businessId]
      );
      const branchName = business?.name || 'Sucursal Principal';
      const branchLocation = business?.description || business?.name || 'Sucursal Principal';
      const now = new Date().toISOString();

      await execute(
        `INSERT INTO branches (id, business_id, name, location, phone, created_at) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [defaultBranchId, businessId, branchName, branchLocation, null, now]
      );

      return defaultBranchId;
    };

    // Validar y obtener branch_id real
    let actualBranchId: string = branchId;

    if (businessId) {
      // Si branchId es igual a businessId, es un business convertido a branch
      if (actualBranchId === businessId) {
        actualBranchId = await getOrCreateDefaultBranch();
      } else {
        // Validar que la sucursal existe y pertenece al negocio
        const branch = await queryOne<{ id: string; business_id: string }>(
          `SELECT id, business_id FROM branches WHERE id = ? AND business_id = ? LIMIT 1`,
          [actualBranchId, businessId]
        );

        if (!branch) {
          // Si no existe, intentar obtener o crear una por defecto
          actualBranchId = await getOrCreateDefaultBranch();
        }
      }
    }

    // Obtener la sesión activa usando el branch_id real
    const { data: session, error: sessionError } = await getActiveSessionClient(userId, actualBranchId);

    if (sessionError || !session) {
      return { data: [], error: null }; // Si no hay sesión, retornar array vacío
    }

    // Obtener ventas desde que se creó la sesión
    // La sesión se crea cuando se hace la primera venta, pero puede haber un pequeño desfase de milisegundos
    // Restar 1 segundo de la fecha de creación de la sesión para asegurar que se incluyan todas las ventas
    const sessionCreatedAt = new Date(session.created_at);
    const oneSecondBefore = new Date(sessionCreatedAt.getTime() - 1000).toISOString();

    const sales = await query<any>(
      `SELECT * FROM sales 
       WHERE user_id = ? AND branch_id = ? AND created_at >= ? 
       ORDER BY created_at DESC`,
      [userId, actualBranchId, oneSecondBefore]
    );

    // Para cada venta, obtener sus items
    const salesWithItems = await Promise.all(
      sales.map(async (sale) => {
        const items = await query<{
          id: string;
          product_presentation_id: string;
          quantity: number;
          unit_price: number;
          subtotal: number | null;
          variant: string;
          product_name: string;
        }>(
          `SELECT 
            si.id,
            si.product_presentation_id,
            si.quantity,
            si.unit_price,
            si.subtotal,
            pp.variant,
            p.name as product_name
           FROM sale_items si
           INNER JOIN product_presentations pp ON pp.id = si.product_presentation_id
           INNER JOIN products p ON p.id = pp.product_id
           WHERE si.sale_id = ?`,
          [sale.id]
        );

        return {
          ...sale,
          sale_items: items.map(item => ({
            ...item,
            product_presentation: {
              id: item.product_presentation_id,
              variant: item.variant,
              product: {
                name: item.product_name,
              },
            },
          })),
        };
      })
    );

    return { data: salesWithItems || [], error: null };
  } catch (error) {
    console.error('[getSessionSalesClient] Error:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Cierra una sesión específica por su ID (desde el cliente usando IPC)
 */
export async function closeSessionByIdClient(
  sessionId: string
): Promise<{ success: boolean; error?: string }> {
  // Solo funciona en cliente Electron
  if (typeof window === 'undefined' || !isNative()) {
    return {
      success: false,
      error: 'Solo funciona en modo Electron desde el cliente',
    };
  }

  try {
    const now = new Date().toISOString();

    // Verificar que la sesión existe
    const sessionData = await queryOne<{ id: string; branch_id: string }>(
      `SELECT id, branch_id FROM user_sessions WHERE id = ? LIMIT 1`,
      [sessionId]
    );

    if (!sessionData) {
      return { success: false, error: 'Sesión no encontrada' };
    }

    // Cerrar la sesión
    await execute(
      `UPDATE user_sessions SET closed_at = ?, updated_at = ? WHERE id = ? AND closed_at IS NULL`,
      [now, now, sessionId]
    );

    return { success: true };
  } catch (error) {
    console.error('[closeSessionByIdClient] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Elimina (archiva) una sesión específica por su ID (desde el cliente usando IPC)
 */
export async function deleteSessionByIdClient(
  sessionId: string
): Promise<{ success: boolean; error?: string }> {
  console.log('[deleteSessionByIdClient] Iniciando eliminación de sesión:', sessionId);
  // Solo funciona en cliente Electron
  if (typeof window === 'undefined' || !isNative()) {
    console.error('[deleteSessionByIdClient] No está en modo Electron');
    return {
      success: false,
      error: 'Solo funciona en modo Electron desde el cliente',
    };
  }

  try {
    // Verificar que la sesión existe y está cerrada
    console.log('[deleteSessionByIdClient] Buscando sesión en BD...');
    const sessionData = await queryOne<{ id: string; closed_at: string | null }>(
      `SELECT id, closed_at FROM user_sessions WHERE id = ? LIMIT 1`,
      [sessionId]
    );

    console.log('[deleteSessionByIdClient] Datos de sesión encontrados:', sessionData);

    if (!sessionData) {
      console.error('[deleteSessionByIdClient] Sesión no encontrada en BD');
      return { success: false, error: 'Sesión no encontrada' };
    }

    // Verificar que la sesión esté cerrada antes de eliminarla
    console.log('[deleteSessionByIdClient] closed_at:', sessionData.closed_at);
    if (!sessionData.closed_at) {
      console.error('[deleteSessionByIdClient] Sesión no está cerrada, no se puede eliminar');
      return { success: false, error: 'Solo se pueden archivar sesiones cerradas' };
    }

    // Eliminar la sesión
    console.log('[deleteSessionByIdClient] Ejecutando DELETE para sesión:', sessionId);
    await execute(
      `DELETE FROM user_sessions WHERE id = ?`,
      [sessionId]
    );

    console.log('[deleteSessionByIdClient] Sesión eliminada exitosamente');
    return { success: true };
  } catch (error) {
    console.error('[deleteSessionByIdClient] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Busca o crea un proveedor por nombre y RUC (desde cliente)
 */
async function findOrCreateSupplierClient(
  userId: string,
  businessId: string,
  name: string,
  taxId?: string
): Promise<string> {
  // Buscar proveedor existente por nombre o RUC
  let supplier = null;

  if (taxId) {
    supplier = await queryOne<any>(
      `SELECT id FROM suppliers WHERE business_id = ? AND (name = ? OR ruc = ?) AND is_active = 1 LIMIT 1`,
      [businessId, name.trim(), taxId.trim()]
    );
  } else {
    supplier = await queryOne<any>(
      `SELECT id FROM suppliers WHERE business_id = ? AND name = ? AND is_active = 1 LIMIT 1`,
      [businessId, name.trim()]
    );
  }

  if (supplier) {
    return supplier.id;
  }

  // Crear nuevo proveedor
  const supplierId = generateId();
  const now = new Date().toISOString();

  await execute(
    `INSERT INTO suppliers (id, business_id, name, phone, ruc, address, is_active, created_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      supplierId,
      businessId,
      name.trim(),
      '', // Phone vacío por defecto
      taxId?.trim() || null, // RUC
      null, // Address
      1, // is_active
      now,
    ]
  );

  return supplierId;
}

/**
 * Busca o crea un producto y retorna su presentación "unidad" (desde cliente)
 * @param createIfNotExists - Si es false, solo busca productos existentes y retorna null si no existe
 */
async function findOrCreateProductClient(
  userId: string,
  businessId: string,
  branchId: string,
  productData: {
    name: string;
    brand?: string;
    cost: number;
    price: number;
    expiration?: string;
    barcode?: string;
  },
  createIfNotExists: boolean = true
): Promise<string | null> {
  const { name, brand, cost, price, expiration, barcode } = productData;

  // Buscar producto existente por nombre o barcode
  let product = null;

  if (barcode) {
    product = await queryOne<any>(
      `SELECT id FROM products WHERE branch_id = ? AND (name = ? OR barcode = ?) AND is_active = 1 LIMIT 1`,
      [branchId, name.trim(), barcode.trim()]
    );
  } else {
    product = await queryOne<any>(
      `SELECT id FROM products WHERE branch_id = ? AND name = ? AND is_active = 1 LIMIT 1`,
      [branchId, name.trim()]
    );
  }

  let productId: string;
  let presentationId: string;
  const now = new Date().toISOString();

  if (product) {
    // Producto existe - actualizar costo, precio y expiración
    productId = product.id;

    const updateFields: string[] = [];
    const updateParams: any[] = [];

    updateFields.push('cost = ?');
    updateParams.push(cost);

    updateFields.push('price = ?');
    updateParams.push(price);

    // Normalizar expiration: convertir cadena vacía a null y validar formato
    let expirationValue: string | null = null;
    if (expiration && expiration.trim() !== '') {
      try {
        // Si es formato YYYY-MM-DD, convertir a ISO string completo
        const dateMatch = expiration.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (dateMatch) {
          const date = new Date(expiration + 'T00:00:00.000Z');
          if (!isNaN(date.getTime())) {
            expirationValue = date.toISOString();
          }
        } else {
          // Si ya es un ISO string, validarlo
          const date = new Date(expiration);
          if (!isNaN(date.getTime())) {
            expirationValue = date.toISOString();
          }
        }
      } catch (e) {
        // Si hay error, dejar como null
        expirationValue = null;
      }
    }

    updateFields.push('expiration = ?');
    updateParams.push(expirationValue);

    updateParams.push(productId);

    await execute(
      `UPDATE products SET ${updateFields.join(', ')} WHERE id = ?`,
      updateParams
    );

    // Actualizar también la presentación "unidad"
    await execute(
      `UPDATE product_presentations SET price = ? WHERE product_id = ? AND variant = 'unidad'`,
      [price, productId]
    );

    // Obtener la presentación "unidad"
    const presentation = await queryOne<{ id: string }>(
      `SELECT id FROM product_presentations WHERE product_id = ? AND variant = 'unidad' AND is_active = 1 LIMIT 1`,
      [productId]
    );

    if (!presentation) {
      // Si no existe la presentación "unidad", crearla
      presentationId = generateId();
      await execute(
        `INSERT INTO product_presentations (id, product_id, variant, units, price, is_active, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [presentationId, productId, 'unidad', 1, price, 1, now]
      );
    } else {
      presentationId = presentation.id;
    }
  } else {
    // Producto no existe
    if (!createIfNotExists) {
      // Si no se debe crear, retornar null
      return null;
    }

    // Crear nuevo con información básica
    productId = generateId();
    presentationId = generateId();

    // Normalizar expiration: convertir cadena vacía a null y validar formato
    let expirationValue: string | null = null;
    if (expiration && expiration.trim() !== '') {
      try {
        // Si es formato YYYY-MM-DD, convertir a ISO string completo
        const dateMatch = expiration.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (dateMatch) {
          const date = new Date(expiration + 'T00:00:00.000Z');
          if (!isNaN(date.getTime())) {
            expirationValue = date.toISOString();
          }
        } else {
          // Si ya es un ISO string, validarlo
          const date = new Date(expiration);
          if (!isNaN(date.getTime())) {
            expirationValue = date.toISOString();
          }
        }
      } catch (e) {
        // Si hay error, dejar como null
        expirationValue = null;
      }
    }

    // Crear producto solo con presentación "unidad" (sin presentaciones adicionales)
    await transaction([
      {
        sql: `INSERT INTO products (id, branch_id, name, description, expiration, brand, barcode, sku, cost, price, stock, bonification, created_by_user_id, is_active, created_at) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        params: [
          productId,
          branchId,
          name.trim(),
          null, // description
          expirationValue,
          brand?.trim() || null,
          barcode?.trim() || null,
          null, // sku
          cost,
          price,
          0, // stock inicial 0
          0, // bonification
          userId,
          1, // is_active
          now,
        ],
      },
      {
        sql: `INSERT INTO product_presentations (id, product_id, variant, units, price, is_active, created_at) 
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
        params: [presentationId, productId, 'unidad', 1, price, 1, now],
      },
    ]);
  }

  return presentationId;
}

/**
 * Obtiene todos los proveedores de un negocio desde el cliente usando IPC
 */
export async function getSuppliersClient(
  userId: string,
  businessId: string
): Promise<{
  success: boolean;
  error?: string;
  data?: any[];
}> {
  // Solo funciona en cliente Electron
  if (typeof window === 'undefined' || !isNative()) {
    return {
      success: false,
      error: 'Solo funciona en modo Electron desde el cliente',
    };
  }

  try {
    if (!userId) {
      return { success: false, error: 'No autenticado' };
    }

    const suppliers = await query<any>(
      `SELECT * FROM suppliers WHERE business_id = ? AND is_active = 1 ORDER BY name ASC`,
      [businessId]
    );

    return { success: true, data: suppliers || [] };
  } catch (error) {
    console.error('[getSuppliersClient] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Crea un nuevo proveedor desde el cliente usando IPC (para modo Electron)
 */
export async function createSupplierClient(
  userId: string,
  supplier: {
    business_id: string;
    name: string;
    ruc?: string | null;
    phone?: string | null;
    address?: string | null;
    is_active?: boolean;
  }
): Promise<{
  success: boolean;
  error?: string;
  data?: any;
}> {
  // Solo funciona en cliente Electron
  if (typeof window === 'undefined' || !isNative()) {
    return {
      success: false,
      error: 'Solo funciona en modo Electron desde el cliente',
    };
  }

  try {
    if (!userId) {
      return { success: false, error: 'No autenticado' };
    }

    // Verificar que el usuario tenga permisos (owner)
    const businessUser = await queryOne<{ role: string }>(
      `SELECT role FROM businesses_users WHERE user_id = ? AND business_id = ? AND is_active = 1 LIMIT 1`,
      [userId, supplier.business_id]
    );

    if (!businessUser || businessUser.role !== 'owner') {
      return {
        success: false,
        error: 'No tienes permisos para crear proveedores',
      };
    }

    const supplierId = generateId();
    const now = new Date().toISOString();

    await execute(
      `INSERT INTO suppliers (id, business_id, name, ruc, phone, address, is_active, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        supplierId,
        supplier.business_id,
        supplier.name,
        supplier.ruc || null,
        supplier.phone || null,
        supplier.address || null,
        supplier.is_active !== undefined ? (supplier.is_active ? 1 : 0) : 1,
        now,
      ]
    );

    const createdSupplier = await queryOne<any>(
      `SELECT * FROM suppliers WHERE id = ? LIMIT 1`,
      [supplierId]
    );

    return { success: true, data: createdSupplier };
  } catch (error) {
    console.error('[createSupplierClient] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Desactiva un proveedor (soft delete) desde el cliente usando IPC (para modo Electron)
 */
export async function deactivateSupplierClient(
  userId: string,
  supplierId: string
): Promise<{
  success: boolean;
  error?: string;
  data?: any;
}> {
  // Solo funciona en cliente Electron
  if (typeof window === 'undefined' || !isNative()) {
    return {
      success: false,
      error: 'Solo funciona en modo Electron desde el cliente',
    };
  }

  try {
    if (!userId) {
      return { success: false, error: 'No autenticado' };
    }

    // Obtener el business_id del proveedor para verificar permisos
    const supplier = await queryOne<{ business_id: string }>(
      `SELECT business_id FROM suppliers WHERE id = ? LIMIT 1`,
      [supplierId]
    );

    if (!supplier) {
      return { success: false, error: 'Proveedor no encontrado' };
    }

    // Verificar que el usuario tenga permisos (owner)
    const businessUser = await queryOne<{ role: string }>(
      `SELECT role FROM businesses_users WHERE user_id = ? AND business_id = ? AND is_active = 1 LIMIT 1`,
      [userId, supplier.business_id]
    );

    if (!businessUser || businessUser.role !== 'owner') {
      return {
        success: false,
        error: 'No tienes permisos para desactivar proveedores',
      };
    }

    // Actualizar el proveedor a inactivo
    await execute(
      `UPDATE suppliers SET is_active = 0 WHERE id = ?`,
      [supplierId]
    );

    const updatedSupplier = await queryOne<any>(
      `SELECT * FROM suppliers WHERE id = ? LIMIT 1`,
      [supplierId]
    );

    return { success: true, data: updatedSupplier };
  } catch (error) {
    console.error('[deactivateSupplierClient] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Actualiza un proveedor desde el cliente usando IPC (para modo Electron)
 */
export async function updateSupplierClient(
  userId: string,
  supplierId: string,
  updates: {
    name?: string;
    ruc?: string | null;
    phone?: string | null;
    address?: string | null;
    is_active?: boolean;
  }
): Promise<{
  success: boolean;
  error?: string;
  data?: any;
}> {
  // Solo funciona en cliente Electron
  if (typeof window === 'undefined' || !isNative()) {
    return {
      success: false,
      error: 'Solo funciona en modo Electron desde el cliente',
    };
  }

  try {
    if (!userId) {
      return { success: false, error: 'No autenticado' };
    }

    // Obtener el business_id del proveedor para verificar permisos
    const supplier = await queryOne<{ business_id: string }>(
      `SELECT business_id FROM suppliers WHERE id = ? LIMIT 1`,
      [supplierId]
    );

    if (!supplier) {
      return { success: false, error: 'Proveedor no encontrado' };
    }

    // Verificar que el usuario tenga permisos (owner)
    const businessUser = await queryOne<{ role: string }>(
      `SELECT role FROM businesses_users WHERE user_id = ? AND business_id = ? AND is_active = 1 LIMIT 1`,
      [userId, supplier.business_id]
    );

    if (!businessUser || businessUser.role !== 'owner') {
      return {
        success: false,
        error: 'No tienes permisos para actualizar proveedores',
      };
    }

    // Construir query de actualización
    const updateFields: string[] = [];
    const updateParams: any[] = [];

    if (updates.name !== undefined) {
      updateFields.push('name = ?');
      updateParams.push(updates.name);
    }
    if (updates.ruc !== undefined) {
      updateFields.push('ruc = ?');
      updateParams.push(updates.ruc);
    }
    if (updates.phone !== undefined) {
      updateFields.push('phone = ?');
      updateParams.push(updates.phone);
    }
    if (updates.address !== undefined) {
      updateFields.push('address = ?');
      updateParams.push(updates.address);
    }
    if (updates.is_active !== undefined) {
      updateFields.push('is_active = ?');
      updateParams.push(updates.is_active ? 1 : 0);
    }

    if (updateFields.length === 0) {
      return { success: false, error: 'No hay campos para actualizar' };
    }
    updateParams.push(supplierId);

    // Actualizar el proveedor
    await execute(
      `UPDATE suppliers SET ${updateFields.join(', ')} WHERE id = ?`,
      updateParams
    );

    const updatedSupplier = await queryOne<any>(
      `SELECT * FROM suppliers WHERE id = ? LIMIT 1`,
      [supplierId]
    );

    return { success: true, data: updatedSupplier };
  } catch (error) {
    console.error('[updateSupplierClient] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Crea una nueva compra con sus items desde el cliente usando IPC (para modo Electron)
 */
export async function createPurchaseClient(
  userId: string,
  purchase: {
    business_id: string;
    branch_id?: string;
    supplier_id?: string;
    supplier_name?: string;
    supplier_tax_id?: string;
    status?: string;
    notes?: string | null;
    type?: string;
    items: Array<{
      product_name: string;
      product_brand?: string;
      product_barcode?: string;
      quantity: number;
      unit_cost: number;
      sale_price: number;
      expiration?: string;
    }>;
  }
): Promise<{
  success: boolean;
  error?: string;
  data?: any;
}> {
  // Solo funciona en cliente Electron
  if (typeof window === 'undefined' || !isNative()) {
    return {
      success: false,
      error: 'Solo funciona en modo Electron desde el cliente',
    };
  }

  try {
    if (!userId) {
      return { success: false, error: 'No autenticado' };
    }

    // Obtener business_id del usuario
    const businessUser = await queryOne<{ business_id: string }>(
      `SELECT business_id FROM businesses_users WHERE user_id = ? AND is_active = 1 LIMIT 1`,
      [userId]
    );

    if (!businessUser) {
      return { success: false, error: 'No tienes un negocio asociado' };
    }

    const businessId = businessUser.business_id;

    // Validar que el business_id proporcionado coincide con el del usuario
    if (purchase.business_id && purchase.business_id !== businessId) {
      return { success: false, error: 'El negocio especificado no coincide con tu negocio' };
    }

    // Función auxiliar para obtener o crear una sucursal por defecto
    const getOrCreateDefaultBranch = async (): Promise<string> => {
      // Buscar la primera sucursal del negocio
      const firstBranch = await queryOne<{ id: string }>(
        `SELECT id FROM branches WHERE business_id = ? LIMIT 1`,
        [businessId]
      );

      if (firstBranch) {
        return firstBranch.id;
      }

      // Si no hay sucursales, crear una por defecto
      const defaultBranchId = generateId();
      const business = await queryOne<{ name: string }>(
        `SELECT name FROM businesses WHERE id = ? LIMIT 1`,
        [businessId]
      );
      const branchName = business?.name || 'Sucursal Principal';
      const now = new Date().toISOString();

      await execute(
        `INSERT INTO branches (id, business_id, name, location, phone, created_at) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [defaultBranchId, businessId, branchName, branchName, null, now]
      );

      return defaultBranchId;
    };

    // Validar y obtener branch_id - si no se proporciona, buscar la primera sucursal del negocio
    let branchId: string | null = purchase.branch_id || null;

    // Si no hay branch_id, obtener o crear una sucursal por defecto
    if (!branchId) {
      branchId = await getOrCreateDefaultBranch();
    } else {
      // Validar que el branch_id existe y pertenece al negocio
      // Nota: Si branch_id es igual a business_id, puede ser un business convertido a branch (caso especial)
      if (branchId === businessId) {
        // En este caso, es un business convertido, obtener o crear una sucursal real
        branchId = await getOrCreateDefaultBranch();
      } else {
        // Validar que existe en la tabla branches
        const branch = await queryOne<{ id: string }>(
          `SELECT id FROM branches WHERE id = ? AND business_id = ? LIMIT 1`,
          [branchId, businessId]
        );
        if (!branch) {
          return { success: false, error: 'La sucursal especificada no existe o no pertenece al negocio' };
        }
      }
    }

    // Buscar o crear proveedor
    let supplierId: string;
    if (purchase.supplier_id) {
      // Validar que el proveedor existe
      const supplier = await queryOne<{ id: string }>(
        `SELECT id FROM suppliers WHERE id = ? AND business_id = ? AND is_active = 1 LIMIT 1`,
        [purchase.supplier_id, businessId]
      );
      if (!supplier) {
        return { success: false, error: 'El proveedor especificado no existe' };
      }
      supplierId = purchase.supplier_id;
    } else if (purchase.supplier_name) {
      supplierId = await findOrCreateSupplierClient(
        userId,
        businessId,
        purchase.supplier_name,
        purchase.supplier_tax_id
      );
    } else {
      return { success: false, error: 'Debe proporcionar un proveedor' };
    }

    // Validar que hay al menos un item
    if (!purchase.items || purchase.items.length === 0) {
      return { success: false, error: 'Debe agregar al menos un producto al pedido' };
    }

    // Validar que hay branch_id si se van a crear productos
    if (!branchId) {
      return { success: false, error: 'No hay sucursal disponible. Debe crear una sucursal primero.' };
    }

    // Procesar items: buscar/crear productos y obtener sus presentaciones
    const purchaseItemsOps: Array<{ sql: string; params: any[] }> = [];
    const productUpdateOps: Array<{ sql: string; params: any[] }> = [];
    let total = 0;
    const now = new Date().toISOString();
    const purchaseId = generateId();
    const purchaseStatus = purchase.status || 'pending';
    const isReceived = purchaseStatus === 'received';

    // Guardar información de items para actualizar stock si es necesario
    const itemsForStockUpdate: Array<{ presentationId: string; quantity: number }> = [];

    for (const item of purchase.items) {
      // Validar item
      if (!item.product_name || item.product_name.trim() === '') {
        return { success: false, error: 'Todos los productos deben tener un nombre' };
      }
      if (!item.quantity || item.quantity <= 0) {
        return { success: false, error: 'La cantidad debe ser mayor a 0' };
      }
      if (!item.unit_cost || item.unit_cost <= 0) {
        return { success: false, error: 'El costo unitario debe ser mayor a 0' };
      }
      if (!item.sale_price || item.sale_price <= 0) {
        return { success: false, error: 'El precio de venta debe ser mayor a 0' };
      }

      // Para pedidos programados, solo buscar productos existentes (no crear nuevos)
      // Para pedidos recibidos inmediatamente, buscar o crear productos
      const presentationId = await findOrCreateProductClient(
        userId,
        businessId,
        branchId,
        {
          name: item.product_name,
          brand: item.product_brand,
          cost: item.unit_cost,
          price: item.sale_price,
          expiration: item.expiration,
          barcode: item.product_barcode,
        },
        isReceived // Solo crear productos nuevos si el pedido es recibido inmediatamente
      );

      // Si el producto no existe y es un pedido programado, crear el producto como INACTIVO
      // (necesitamos el presentation_id para purchase_items, pero el producto no aparecerá en inventario hasta recibirse)
      let finalPresentationId = presentationId;
      if (!presentationId && !isReceived) {
        // Crear producto INACTIVO para pedidos programados (no aparecerá en inventario hasta recibirse)
        const tempProductId = generateId();
        const tempPresentationId = generateId();

        // Normalizar expiration
        let expirationValue: string | null = null;
        if (item.expiration && item.expiration.trim() !== '') {
          try {
            const dateMatch = item.expiration.match(/^(\d{4})-(\d{2})-(\d{2})$/);
            if (dateMatch) {
              const date = new Date(item.expiration + 'T00:00:00.000Z');
              if (!isNaN(date.getTime())) {
                expirationValue = date.toISOString();
              }
            } else {
              const date = new Date(item.expiration);
              if (!isNaN(date.getTime())) {
                expirationValue = date.toISOString();
              }
            }
          } catch (e) {
            expirationValue = null;
          }
        }

        await transaction([
          {
            sql: `INSERT INTO products (id, branch_id, name, description, expiration, brand, barcode, sku, cost, price, stock, bonification, created_by_user_id, is_active, created_at) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            params: [
              tempProductId,
              branchId,
              item.product_name.trim(),
              null, // description
              expirationValue,
              item.product_brand?.trim() || null,
              item.product_barcode?.trim() || null,
              null, // sku
              item.unit_cost,
              item.sale_price,
              0, // stock inicial 0 (solo se actualizará cuando se reciba el pedido)
              0, // bonification
              userId,
              0, // is_active = 0 (INACTIVO - no aparecerá en inventario hasta recibirse)
              now,
            ],
          },
          {
            sql: `INSERT INTO product_presentations (id, product_id, variant, units, price, is_active, created_at) 
                  VALUES (?, ?, ?, ?, ?, ?, ?)`,
            params: [tempPresentationId, tempProductId, 'unidad', 1, item.sale_price, 0, now], // is_active = 0
          },
        ]);

        finalPresentationId = tempPresentationId;
      }

      if (!finalPresentationId) {
        return { success: false, error: `No se pudo encontrar o crear el producto: ${item.product_name}` };
      }

      const subtotal = item.quantity * item.unit_cost;
      total += subtotal;

      purchaseItemsOps.push({
        sql: `INSERT INTO purchase_items (id, purchase_id, product_presentation_id, quantity, unit_cost, subtotal) 
              VALUES (?, ?, ?, ?, ?, ?)`,
        params: [
          generateId(),
          purchaseId,
          finalPresentationId,
          item.quantity,
          item.unit_cost,
          subtotal,
        ],
      });

      // Guardar para actualizar stock si el pedido es recibido inmediatamente
      if (isReceived && finalPresentationId) {
        itemsForStockUpdate.push({ presentationId: finalPresentationId, quantity: item.quantity });
      }
    }

    // Si el pedido es recibido inmediatamente, preparar actualizaciones de stock
    if (isReceived && itemsForStockUpdate.length > 0) {
      for (const item of itemsForStockUpdate) {
        try {
          // Obtener el producto asociado a la presentación
          const presentation = await queryOne<{ product_id: string }>(
            `SELECT product_id FROM product_presentations WHERE id = ? LIMIT 1`,
            [item.presentationId]
          );

          if (!presentation) {
            console.error(`[createPurchaseClient] No se encontró la presentación para el item con presentationId ${item.presentationId}`);
            continue;
          }

          // Obtener el stock actual del producto
          const product = await queryOne<{ stock: number | null }>(
            `SELECT stock FROM products WHERE id = ? LIMIT 1`,
            [presentation.product_id]
          );

          if (!product) {
            console.error(`[createPurchaseClient] No se encontró el producto con ID ${presentation.product_id}`);
            continue;
          }

          const currentStock = product.stock || 0;
          const newStock = currentStock + item.quantity;
          productUpdateOps.push({
            sql: `UPDATE products SET stock = ? WHERE id = ?`,
            params: [newStock, presentation.product_id],
          });
        } catch (itemError) {
          console.error(`[createPurchaseClient] Error procesando item para stock update:`, itemError);
        }
      }
    }

    // Crear la compra y items en una transacción (incluir actualizaciones de stock si es recibido)
    try {
      await transaction([
        {
          sql: `INSERT INTO purchases (id, business_id, branch_id, supplier_id, type, status, total, notes, created_by, created_at${isReceived ? ', received_at' : ''}) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?${isReceived ? ', ?' : ''})`,
          params: [
            purchaseId,
            businessId,
            branchId,
            supplierId,
            purchase.type || 'purchase',
            purchaseStatus,
            total,
            purchase.notes || null,
            userId,
            now,
            ...(isReceived ? [now] : []),
          ],
        },
        ...purchaseItemsOps,
        ...productUpdateOps,
      ]);
    } catch (transactionError) {
      const errorMessage = transactionError instanceof Error ? transactionError.message : 'Error desconocido en transacción';
      console.error('[createPurchaseClient] Error en transacción:', {
        error: errorMessage,
        purchaseId,
        businessId,
        branchId,
        supplierId,
        itemsCount: purchaseItemsOps.length,
        total,
      });
      return {
        success: false,
        error: `Error al crear el pedido: ${errorMessage}`
      };
    }

    // Obtener la compra creada
    const purchaseData = await queryOne<any>(
      `SELECT * FROM purchases WHERE id = ? LIMIT 1`,
      [purchaseId]
    );

    return { success: true, data: purchaseData };
  } catch (error) {
    console.error('[createPurchaseClient] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Obtiene todas las compras de un negocio desde el cliente usando IPC
 */
export async function getPurchasesClient(
  userId: string,
  businessId: string
): Promise<{
  success: boolean;
  error?: string;
  data?: any[];
}> {
  // Solo funciona en cliente Electron
  if (typeof window === 'undefined' || !isNative()) {
    return {
      success: false,
      error: 'Solo funciona en modo Electron desde el cliente',
    };
  }

  try {
    if (!userId) {
      return { success: false, error: 'No autenticado' };
    }

    const purchases = await query<any>(
      `SELECT * FROM purchases WHERE business_id = ? ORDER BY created_at DESC`,
      [businessId]
    );

    // Enriquecer con datos relacionados
    const enrichedPurchases = await Promise.all(
      purchases.map(async (purchase: any) => {
        const [supplier, branch, createdByUser, approvedByUser] = await Promise.all([
          purchase.supplier_id
            ? queryOne<any>(`SELECT * FROM suppliers WHERE id = ? LIMIT 1`, [purchase.supplier_id])
            : null,
          purchase.branch_id
            ? queryOne<any>(`SELECT * FROM branches WHERE id = ? LIMIT 1`, [purchase.branch_id])
            : null,
          purchase.created_by
            ? queryOne<{ id: string; name: string; email: string }>(
              `SELECT id, name, email FROM users WHERE id = ? LIMIT 1`,
              [purchase.created_by]
            )
            : null,
          purchase.approved_by
            ? queryOne<{ id: string; name: string; email: string }>(
              `SELECT id, name, email FROM users WHERE id = ? LIMIT 1`,
              [purchase.approved_by]
            )
            : null,
        ]);

        return {
          ...purchase,
          supplier: supplier || null,
          branch: branch || null,
          created_by_user: createdByUser || null,
          approved_by_user: approvedByUser || null,
        };
      })
    );

    return { success: true, data: enrichedPurchases || [] };
  } catch (error) {
    console.error('[getPurchasesClient] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Obtiene las compras de una sucursal específica desde el cliente usando IPC
 */
export async function getBranchPurchasesClient(
  userId: string,
  branchId: string
): Promise<{
  success: boolean;
  error?: string;
  data?: any[];
}> {
  // Solo funciona en cliente Electron
  if (typeof window === 'undefined' || !isNative()) {
    return {
      success: false,
      error: 'Solo funciona en modo Electron desde el cliente',
    };
  }

  try {
    if (!userId) {
      return { success: false, error: 'No autenticado' };
    }

    const purchases = await query<any>(
      `SELECT * FROM purchases WHERE branch_id = ? ORDER BY created_at DESC`,
      [branchId]
    );

    // Enriquecer con datos relacionados
    const enrichedPurchases = await Promise.all(
      purchases.map(async (purchase: any) => {
        const [supplier, createdByUser, approvedByUser] = await Promise.all([
          purchase.supplier_id
            ? queryOne<any>(`SELECT * FROM suppliers WHERE id = ? LIMIT 1`, [purchase.supplier_id])
            : null,
          purchase.created_by
            ? queryOne<{ id: string; name: string; email: string }>(
              `SELECT id, name, email FROM users WHERE id = ? LIMIT 1`,
              [purchase.created_by]
            )
            : null,
          purchase.approved_by
            ? queryOne<{ id: string; name: string; email: string }>(
              `SELECT id, name, email FROM users WHERE id = ? LIMIT 1`,
              [purchase.approved_by]
            )
            : null,
        ]);

        return {
          ...purchase,
          supplier: supplier || null,
          created_by_user: createdByUser || null,
          approved_by_user: approvedByUser || null,
        };
      })
    );

    return { success: true, data: enrichedPurchases || [] };
  } catch (error) {
    console.error('[getBranchPurchasesClient] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Marca una compra como recibida y actualiza el inventario desde el cliente usando IPC
 */
export async function receivePurchaseClient(
  userId: string,
  purchaseId: string
): Promise<{
  success: boolean;
  error?: string;
  data?: any;
}> {
  // Solo funciona en cliente Electron
  if (typeof window === 'undefined' || !isNative()) {
    return {
      success: false,
      error: 'Solo funciona en modo Electron desde el cliente',
    };
  }

  try {
    if (!userId) {
      return { success: false, error: 'No autenticado' };
    }

    // Obtener la compra con sus items
    const purchase = await queryOne<any>(
      `SELECT * FROM purchases WHERE id = ? LIMIT 1`,
      [purchaseId]
    );

    if (!purchase) {
      return { success: false, error: 'Compra no encontrada' };
    }

    if (!purchase.branch_id) {
      return { success: false, error: 'La compra no tiene sucursal asignada' };
    }

    const items = await query<any>(
      `SELECT * FROM purchase_items WHERE purchase_id = ?`,
      [purchaseId]
    );

    console.log('[receivePurchaseClient] Items encontrados:', items?.length || 0);

    if (!items || items.length === 0) {
      return { success: false, error: 'El pedido no tiene items' };
    }

    // Actualizar el stock del producto y activar productos inactivos
    const stockUpdateOps: Array<{ sql: string; params: any[] }> = [];
    const errors: string[] = [];

    for (const item of items) {
      console.log('[receivePurchaseClient] Procesando item:', {
        id: item.id,
        presentation_id: item.product_presentation_id,
        quantity: item.quantity,
      });
      try {
        // Obtener el producto asociado a la presentación
        const presentation = await queryOne<{ product_id: string }>(
          `SELECT product_id FROM product_presentations WHERE id = ? LIMIT 1`,
          [item.product_presentation_id]
        );

        if (!presentation) {
          errors.push(`No se encontró la presentación para el item con ID ${item.id}`);
          continue;
        }

        // Obtener el stock actual y estado del producto
        const product = await queryOne<{ stock: number | null; is_active: number }>(
          `SELECT stock, is_active FROM products WHERE id = ? LIMIT 1`,
          [presentation.product_id]
        );

        if (!product) {
          errors.push(`No se encontró el producto con ID ${presentation.product_id}`);
          continue;
        }

        const currentStock = product.stock || 0;
        const newStock = currentStock + item.quantity;
        console.log('[receivePurchaseClient] Actualizando stock:', {
          product_id: presentation.product_id,
          current_stock: currentStock,
          quantity: item.quantity,
          new_stock: newStock,
          is_active: product.is_active,
        });

        // Si el producto está inactivo, activarlo y actualizar stock
        // Si está activo, solo actualizar stock
        if (product.is_active === 0) {
          // Activar el producto y actualizar stock
          stockUpdateOps.push({
            sql: `UPDATE products SET stock = ?, is_active = 1 WHERE id = ?`,
            params: [newStock, presentation.product_id],
          });

          // También activar la presentación
          stockUpdateOps.push({
            sql: `UPDATE product_presentations SET is_active = 1 WHERE id = ?`,
            params: [item.product_presentation_id],
          });
        } else {
          // Solo actualizar stock
          stockUpdateOps.push({
            sql: `UPDATE products SET stock = ? WHERE id = ?`,
            params: [newStock, presentation.product_id],
          });
        }
      } catch (itemError) {
        console.error(`[receivePurchaseClient] Error procesando item ${item.id}:`, itemError);
        errors.push(`Error procesando item: ${itemError instanceof Error ? itemError.message : 'Error desconocido'}`);
      }
    }

    if (stockUpdateOps.length === 0) {
      return {
        success: false,
        error: `No se pudo actualizar ningún producto. Errores: ${errors.join('; ')}`
      };
    }

    // Ejecutar actualización de stock y marca como recibida en una transacción
    const now = new Date().toISOString();
    console.log('[receivePurchaseClient] Ejecutando transacción con', stockUpdateOps.length, 'actualizaciones de stock');
    console.log('[receivePurchaseClient] Operaciones de stock:', stockUpdateOps.map(op => ({
      sql: op.sql,
      params: op.params,
    })));

    let transactionResult;
    try {
      transactionResult = await transaction([
        ...stockUpdateOps,
        {
          sql: `UPDATE purchases SET status = ?, received_at = ? WHERE id = ?`,
          params: ['received', now, purchaseId],
        },
      ]);
      console.log('[receivePurchaseClient] Transacción completada exitosamente. Resultado:', transactionResult);
    } catch (transactionError) {
      console.error('[receivePurchaseClient] Error en transacción:', transactionError);
      return {
        success: false,
        error: `Error al ejecutar la transacción: ${transactionError instanceof Error ? transactionError.message : 'Error desconocido'}`,
      };
    }

    // Verificar que el estado se actualizó correctamente
    const updatedPurchase = await queryOne<any>(
      `SELECT * FROM purchases WHERE id = ? LIMIT 1`,
      [purchaseId]
    );

    if (!updatedPurchase) {
      console.error('[receivePurchaseClient] No se pudo obtener el pedido actualizado');
      return { success: false, error: 'No se pudo verificar el estado del pedido después de la transacción' };
    }

    if (updatedPurchase.status !== 'received') {
      console.error('[receivePurchaseClient] El estado del pedido no se actualizó correctamente. Estado actual:', updatedPurchase.status);
      return {
        success: false,
        error: `El estado del pedido no se actualizó correctamente. Estado actual: ${updatedPurchase.status}`
      };
    }

    // Verificar que el stock se actualizó correctamente
    console.log('[receivePurchaseClient] Verificando actualización de stock...');
    for (const item of items) {
      const presentation = await queryOne<{ product_id: string }>(
        `SELECT product_id FROM product_presentations WHERE id = ? LIMIT 1`,
        [item.product_presentation_id]
      );

      if (presentation) {
        const product = await queryOne<{ stock: number | null }>(
          `SELECT stock FROM products WHERE id = ? LIMIT 1`,
          [presentation.product_id]
        );
        console.log('[receivePurchaseClient] Stock verificado para producto', presentation.product_id, ':', product?.stock);
      }
    }

    console.log('[receivePurchaseClient] Pedido recibido exitosamente. Estado:', updatedPurchase.status);
    return { success: true, data: updatedPurchase };
  } catch (error) {
    console.error('[receivePurchaseClient] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Obtiene un proveedor por ID desde el cliente usando IPC
 */
export async function getSupplierByIdClient(
  supplierId: string
): Promise<{
  success: boolean;
  error?: string;
  data?: any;
}> {
  // Solo funciona en cliente Electron
  if (typeof window === 'undefined' || !isNative()) {
    return {
      success: false,
      error: 'Solo funciona en modo Electron desde el cliente',
    };
  }

  try {
    const supplier = await queryOne<any>(
      `SELECT * FROM suppliers WHERE id = ? LIMIT 1`,
      [supplierId]
    );

    if (!supplier) {
      return { success: false, error: 'Proveedor no encontrado' };
    }

    return { success: true, data: supplier };
  } catch (error) {
    console.error('[getSupplierByIdClient] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Crea una nueva sucursal desde el cliente usando IPC (para modo Electron)
 */
export async function createBranchClient(
  userId: string,
  data: {
    name: string;
    location: string;
    phone?: string;
  }
): Promise<{
  success: boolean;
  error?: string;
  branchId?: string;
  branchName?: string;
}> {
  // Solo funciona en cliente Electron
  if (typeof window === 'undefined' || !isNative()) {
    return {
      success: false,
      error: 'Solo funciona en modo Electron desde el cliente',
    };
  }

  try {
    // Validar datos
    if (!data.name || !data.location) {
      return { success: false, error: 'Nombre y ubicación son requeridos' };
    }

    if (!userId) {
      return { success: false, error: 'Debes estar autenticado' };
    }

    // Obtener el negocio del usuario
    const businessUser = await queryOne<{ business_id: string; role: string }>(
      `SELECT business_id, role FROM businesses_users WHERE user_id = ? AND is_active = 1 LIMIT 1`,
      [userId]
    );

    if (!businessUser) {
      return { success: false, error: 'No tienes un negocio asociado' };
    }

    // Verificar que tenga permisos (owner)
    if (businessUser.role !== 'owner') {
      return {
        success: false,
        error: 'No tienes permisos para crear sucursales',
      };
    }

    // Generar ID para la sucursal
    const branchId = generateId();

    // Crear la sucursal
    await execute(
      `INSERT INTO branches (id, business_id, name, location, phone) VALUES (?, ?, ?, ?, ?)`,
      [
        branchId,
        businessUser.business_id,
        data.name.trim(),
        data.location.trim(),
        data.phone?.trim() || null,
      ]
    );

    console.log('✅ Sucursal creada:', branchId, data.name.trim());

    return {
      success: true,
      branchId,
      branchName: data.name.trim(),
    };
  } catch (error) {
    console.error('[createBranchClient] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Obtiene una compra por ID con sus items desde el cliente usando IPC
 */
export async function getPurchaseByIdClient(
  userId: string,
  purchaseId: string
): Promise<{
  success: boolean;
  error?: string;
  data?: any;
}> {
  // Solo funciona en cliente Electron
  if (typeof window === 'undefined' || !isNative()) {
    return {
      success: false,
      error: 'Solo funciona en modo Electron desde el cliente',
    };
  }

  try {
    if (!userId) {
      return { success: false, error: 'No autenticado' };
    }

    const purchase = await queryOne<any>(
      `SELECT * FROM purchases WHERE id = ? LIMIT 1`,
      [purchaseId]
    );

    if (!purchase) {
      return { success: false, error: 'Compra no encontrada' };
    }

    // Obtener datos relacionados
    const [supplier, branch, createdByUser, approvedByUser, items] = await Promise.all([
      purchase.supplier_id
        ? queryOne<any>(`SELECT * FROM suppliers WHERE id = ? LIMIT 1`, [purchase.supplier_id])
        : null,
      purchase.branch_id
        ? queryOne<any>(`SELECT * FROM branches WHERE id = ? LIMIT 1`, [purchase.branch_id])
        : null,
      purchase.created_by
        ? queryOne<{ id: string; name: string; email: string }>(
          `SELECT id, name, email FROM users WHERE id = ? LIMIT 1`,
          [purchase.created_by]
        )
        : null,
      purchase.approved_by
        ? queryOne<{ id: string; name: string; email: string }>(
          `SELECT id, name, email FROM users WHERE id = ? LIMIT 1`,
          [purchase.approved_by]
        )
        : null,
      query<any>(
        `SELECT * FROM purchase_items WHERE purchase_id = ?`,
        [purchaseId]
      ),
    ]);

    // Enriquecer items con presentaciones y productos
    const enrichedItems = await Promise.all(
      (items || []).map(async (item: any) => {
        const presentation = await queryOne<any>(
          `SELECT * FROM product_presentations WHERE id = ? LIMIT 1`,
          [item.product_presentation_id]
        );

        if (!presentation) {
          return { ...item, product_presentation: null };
        }

        const product = await queryOne<any>(
          `SELECT * FROM products WHERE id = ? LIMIT 1`,
          [presentation.product_id]
        );

        return {
          ...item,
          product_presentation: {
            ...presentation,
            product: product || null,
          },
        };
      })
    );

    return {
      success: true,
      data: {
        ...purchase,
        supplier: supplier || null,
        branch: branch || null,
        created_by_user: createdByUser || null,
        approved_by_user: approvedByUser || null,
        purchase_items: enrichedItems,
      },
    };
  } catch (error) {
    console.error('[getPurchaseByIdClient] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Actualiza el estado de una compra desde el cliente usando IPC
 */
export async function updatePurchaseStatusClient(
  userId: string,
  purchaseId: string,
  status: string,
  notes?: string
): Promise<{
  success: boolean;
  error?: string;
  data?: any;
}> {
  // Solo funciona en cliente Electron
  if (typeof window === 'undefined' || !isNative()) {
    return {
      success: false,
      error: 'Solo funciona en modo Electron desde el cliente',
    };
  }

  try {
    if (!userId) {
      return { success: false, error: 'No autenticado' };
    }

    const now = new Date().toISOString();
    const updateFields: string[] = ['status = ?'];
    const updateParams: any[] = [status];

    // Si se aprueba, registrar quién aprobó y cuándo
    if (status === 'approved') {
      updateFields.push('approved_by = ?', 'approved_at = ?');
      updateParams.push(userId, now);
    }

    // Si se marca como recibida, registrar cuándo
    if (status === 'received') {
      updateFields.push('received_at = ?');
      updateParams.push(now);
    }

    // Agregar notas si se proporcionan
    if (notes !== undefined) {
      updateFields.push('notes = ?');
      updateParams.push(notes);
    }

    updateParams.push(purchaseId);

    await execute(
      `UPDATE purchases SET ${updateFields.join(', ')} WHERE id = ?`,
      updateParams
    );

    const updatedPurchase = await queryOne<any>(
      `SELECT * FROM purchases WHERE id = ? LIMIT 1`,
      [purchaseId]
    );

    return { success: true, data: updatedPurchase };
  } catch (error) {
    console.error('[updatePurchaseStatusClient] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Exporta productos a un archivo Excel desde el cliente
 * El formato es el mismo que la plantilla de importación
 */
export async function exportProductsToExcelClient(
  userId: string,
  branchId?: string
): Promise<{
  success: boolean;
  error?: string;
  base64?: string;
  filename?: string;
  productCount?: number;
}> {
  // Solo funciona en cliente Electron
  if (typeof window === 'undefined' || !isNative()) {
    return {
      success: false,
      error: 'Solo funciona en modo Electron desde el cliente',
    };
  }

  try {
    if (!userId) {
      return { success: false, error: 'Debes estar autenticado' };
    }

    // Obtener productos usando la función cliente
    const productsResult = await getProductsClient(userId, branchId);

    if (!productsResult.success) {
      return {
        success: false,
        error: productsResult.error || 'Error al obtener productos',
      };
    }

    const products = productsResult.products || [];

    if (products.length === 0) {
      return {
        success: false,
        error: 'No hay productos para exportar',
      };
    }

    const XLSX = await import('xlsx');

    // Crear encabezados (igual que la plantilla)
    const headers = [
      'nombre',
      'descripcion',
      'marca',
      'codigo_barras',
      'sku',
      'costo',
      'precio',
      'stock',
      'bonificacion',
      'fecha_vencimiento',
      'presentaciones',
    ];

    // Preparar datos
    const data: any[][] = [headers];

    // Procesar cada producto
    for (const product of products) {
      // Formatear fecha de vencimiento
      let fechaVencimiento = '';
      if (product.expiration) {
        try {
          const date = new Date(product.expiration);
          if (!isNaN(date.getTime())) {
            // Formato YYYY-MM-DD
            fechaVencimiento = date.toISOString().split('T')[0];
          }
        } catch {
          // Si no se puede parsear, dejar vacío
        }
      }

      // Formatear presentaciones (excluyendo "unidad" que es la base)
      const presentations: string[] = [];
      if (product.product_presentations && Array.isArray(product.product_presentations)) {
        for (const pres of product.product_presentations) {
          // Excluir la presentación "unidad" ya que es la base
          if (pres.variant && pres.variant !== 'unidad' && pres.is_active !== false) {
            const units = pres.units || 1;
            const price = pres.price !== null && pres.price !== undefined ? pres.price : '';
            presentations.push(`${pres.variant}:${units}:${price}`);
          }
        }
      }
      const presentacionesStr = presentations.join('|');

      // Crear fila con los datos del producto
      const row = [
        product.name || '',
        product.description || '',
        product.brand || '',
        product.barcode || '',
        product.sku || '',
        product.cost || 0,
        product.price || 0,
        product.stock || 0,
        product.bonification || 0,
        fechaVencimiento,
        presentacionesStr,
      ];

      data.push(row);
    }

    // Crear workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(data);

    // Ajustar ancho de columnas (igual que la plantilla)
    const columnWidths = [
      { wch: 20 }, // nombre
      { wch: 30 }, // descripcion
      { wch: 15 }, // marca
      { wch: 15 }, // codigo_barras
      { wch: 15 }, // sku
      { wch: 12 }, // costo
      { wch: 12 }, // precio
      { wch: 10 }, // stock
      { wch: 12 }, // bonificacion
      { wch: 18 }, // fecha_vencimiento
      { wch: 40 }, // presentaciones
    ];
    worksheet['!cols'] = columnWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos');

    // Generar buffer usando 'array' en lugar de 'buffer' para el navegador
    const arrayBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });

    // Convertir ArrayBuffer a base64
    const bytes = new Uint8Array(arrayBuffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);

    // Obtener nombre de la sucursal para el nombre del archivo
    let filename = 'reporte-productos.xlsx';
    if (branchId) {
      const branch = await queryOne<{ name: string }>(
        `SELECT name FROM branches WHERE id = ? LIMIT 1`,
        [branchId]
      );

      if (branch?.name) {
        // Limpiar el nombre de la sucursal para usarlo en el nombre del archivo
        const branchName = branch.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        filename = `reporte-productos-${branchName}.xlsx`;
      }
    }

    return {
      success: true,
      base64,
      filename,
      productCount: products.length,
    };
  } catch (error) {
    console.error('❌ [exportProductsToExcelClient] Error exportando productos a Excel:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Exporta sesiones a un archivo Excel (versión cliente)
 */
export async function exportSessionsToExcelClient(
  userId: string,
  branchId?: string
): Promise<{
  success: boolean;
  error?: string;
  base64?: string;
  filename?: string;
  sessionCount?: number;
}> {
  // Solo funciona en cliente Electron
  if (typeof window === 'undefined' || !isNative()) {
    return {
      success: false,
      error: 'Solo funciona en modo Electron desde el cliente',
    };
  }

  try {
    if (!userId) {
      return { success: false, error: 'Debes estar autenticado' };
    }

    // Obtener sesiones usando la función cliente
    const sessionsResult = await getUserSessionsClient(userId, branchId);

    if (!sessionsResult.success) {
      return {
        success: false,
        error: sessionsResult.error || 'Error al obtener sesiones',
      };
    }

    const sessions = sessionsResult.sessions || [];

    if (sessions.length === 0) {
      return {
        success: false,
        error: 'No hay sesiones para exportar',
      };
    }

    const XLSX = await import('xlsx');

    // Crear encabezados
    const headers = [
      'Usuario',
      'Sucursal',
      'Inicio',
      'Fin',
      'Duración',
      'Efectivo',
      'Billetera Digital',
      'Tarjeta',
      'Transferencia',
      'Total',
      'Estado',
    ];

    // Preparar datos
    const data: any[][] = [headers];

    // Función auxiliar para formatear fechas
    const formatDate = (dateString: string | null): string => {
      if (!dateString) return '-';
      try {
        return new Date(dateString).toLocaleString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        });
      } catch {
        return '-';
      }
    };

    // Función auxiliar para calcular duración
    const formatDuration = (startedAt: string, closedAt: string | null): string => {
      if (!closedAt) return 'En curso';

      try {
        const start = new Date(startedAt);
        const end = new Date(closedAt);
        const diffMs = end.getTime() - start.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const hours = Math.floor(diffMins / 60);
        const mins = diffMins % 60;

        if (hours > 0) {
          return `${hours}h ${mins}m`;
        }
        return `${mins}m`;
      } catch {
        return '-';
      }
    };

    // Procesar cada sesión
    for (const session of sessions) {
      const row = [
        session.user?.name || '-',
        session.branch?.name || '-',
        formatDate(session.started_at),
        formatDate(session.closed_at),
        formatDuration(session.started_at, session.closed_at),
        session.cash_amount || 0,
        session.digital_wallet_amount || 0,
        session.card_amount || 0,
        session.transfer_amount || 0,
        session.total_amount || 0,
        session.closed_at ? 'Finalizada' : 'Activa',
      ];

      data.push(row);
    }

    // Crear workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(data);

    // Ajustar ancho de columnas
    const columnWidths = [
      { wch: 20 }, // Usuario
      { wch: 20 }, // Sucursal
      { wch: 18 }, // Inicio
      { wch: 18 }, // Fin
      { wch: 12 }, // Duración
      { wch: 12 }, // Efectivo
      { wch: 18 }, // Billetera Digital
      { wch: 12 }, // Tarjeta
      { wch: 15 }, // Transferencia
      { wch: 12 }, // Total
      { wch: 12 }, // Estado
    ];
    worksheet['!cols'] = columnWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sesiones');

    // Generar buffer usando 'array' en lugar de 'buffer' para el navegador
    const arrayBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });

    // Convertir ArrayBuffer a base64
    const bytes = new Uint8Array(arrayBuffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);

    // Obtener nombre de la sucursal para el nombre del archivo
    let filename = 'reporte-sesiones.xlsx';
    if (branchId) {
      const branch = await queryOne<{ name: string }>(
        `SELECT name FROM branches WHERE id = ? LIMIT 1`,
        [branchId]
      );

      if (branch?.name) {
        // Limpiar el nombre de la sucursal para usarlo en el nombre del archivo
        const branchName = branch.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        filename = `reporte-sesiones-${branchName}.xlsx`;
      }
    }

    return {
      success: true,
      base64,
      filename,
      sessionCount: sessions.length,
    };
  } catch (error) {
    console.error('❌ [exportSessionsToExcelClient] Error exportando sesiones a Excel:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}
