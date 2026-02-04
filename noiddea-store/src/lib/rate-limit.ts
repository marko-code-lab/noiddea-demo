/**
 * Rate Limiting básico en memoria
 * 
 * ⚠️ NOTA: Para producción con múltiples instancias, usar Redis o un servicio dedicado
 * Este es un rate limiter simple para desarrollo y pequeñas aplicaciones
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

/**
 * Limpia entradas expiradas del store periódicamente
 */
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 60000); // Limpiar cada minuto

/**
 * Verifica si una request excede el rate limit
 * @param identifier - Identificador único (IP, user ID, etc.)
 * @param maxRequests - Número máximo de requests
 * @param windowMs - Ventana de tiempo en milisegundos
 * @returns true si está dentro del límite, false si excedió
 */
export function checkRateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 60000 // 1 minuto por defecto
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const key = identifier;

  if (!store[key] || store[key].resetTime < now) {
    // Nueva ventana de tiempo
    store[key] = {
      count: 1,
      resetTime: now + windowMs,
    };
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: store[key].resetTime,
    };
  }

  if (store[key].count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: store[key].resetTime,
    };
  }

  store[key].count += 1;
  return {
    allowed: true,
    remaining: maxRequests - store[key].count,
    resetTime: store[key].resetTime,
  };
}

/**
 * Obtiene el IP del cliente desde el request
 */
export function getClientIP(request: Request): string {
  // Intentar obtener IP de headers (útil cuando hay proxy/load balancer)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Fallback (no disponible en Edge Runtime)
  return 'unknown';
}
