/**
 * Logger estructurado para la aplicación
 * 
 * En producción, considerar integrar con servicios como:
 * - Sentry (errores)
 * - Datadog (métricas y logs)
 * - CloudWatch (AWS)
 * - LogRocket (sesiones de usuario)
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  // En Vite, usar import.meta.env en lugar de process.env
  private isDevelopment = typeof import.meta !== 'undefined' && import.meta.env?.DEV === true;
  private isProduction = typeof import.meta !== 'undefined' && import.meta.env?.PROD === true;

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...context,
    };

    if (this.isDevelopment) {
      // En desarrollo, formato legible
      return JSON.stringify(logEntry, null, 2);
    }

    // En producción, formato compacto (JSON)
    return JSON.stringify(logEntry);
  }

  private log(level: LogLevel, message: string, context?: LogContext) {
    const formatted = this.formatMessage(level, message, context);

    switch (level) {
      case 'debug':
        if (this.isDevelopment) {
          console.debug(formatted);
        }
        break;
      case 'info':
        console.info(formatted);
        break;
      case 'warn':
        console.warn(formatted);
        break;
      case 'error':
        console.error(formatted);
        // En producción, aquí se enviaría a un servicio de logging
        if (this.isProduction) {
          // TODO: Integrar con servicio de logging
          // sendToLoggingService(formatted);
        }
        break;
    }
  }

  debug(message: string, context?: LogContext) {
    this.log('debug', message, context);
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error | unknown, context?: LogContext) {
    const errorContext: LogContext = {
      ...context,
    };

    if (error instanceof Error) {
      errorContext.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    } else if (error) {
      errorContext.error = error;
    }

    this.log('error', error instanceof Error ? error.message : String(error), errorContext);
  }

  /**
   * Log de performance para operaciones
   */
  performance(operation: string, duration: number, context?: LogContext) {
    this.info(`Performance: ${operation}`, {
      ...context,
      duration: `${duration}ms`,
      operation,
    });
  }

  /**
   * Log de requests HTTP
   */
  request(method: string, path: string, statusCode: number, duration: number, context?: LogContext) {
    this.info(`HTTP ${method} ${path}`, {
      ...context,
      method,
      path,
      statusCode,
      duration: `${duration}ms`,
    });
  }
}

// Singleton instance
export const logger = new Logger();

/**
 * Helper para medir tiempo de ejecución
 */
export async function measureTime<T>(
  operation: string,
  fn: () => Promise<T>,
  context?: LogContext
): Promise<T> {
  const start = Date.now();
  try {
    const result = await fn();
    const duration = Date.now() - start;
    logger.performance(operation, duration, { ...context, success: true });
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    logger.performance(operation, duration, { ...context, success: false });
    throw error;
  }
}
