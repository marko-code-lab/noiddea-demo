'use client';

import { useEffect, useRef } from 'react';
import { usePurchasesQuery } from './use-purchases-query';
import { useReceivePurchase } from './use-purchases-query';
import type { PurchaseWithItems } from '@/types';

/**
 * Parsea la fecha y hora de las notas del pedido programado
 * Formato esperado: "Pedido programado - Fecha de entrega: DD/MM/YYYY a las HH:MM"
 */
function parseScheduledDeliveryDate(notes: string | null | undefined): Date | null {
  if (!notes || !notes.includes('Pedido programado')) {
    return null;
  }

  try {
    // Extraer fecha y hora del formato: "Pedido programado - Fecha de entrega: DD/MM/YYYY a las HH:MM"
    const match = notes.match(/Fecha de entrega: (\d{1,2}\/\d{1,2}\/\d{4}) a las (\d{1,2}:\d{2})/);
    if (!match) {
      return null;
    }

    const [, dateStr, timeStr] = match;
    
    // Parsear fecha DD/MM/YYYY
    const [day, month, year] = dateStr.split('/').map(Number);
    
    // Parsear hora HH:MM
    const [hours, minutes] = timeStr.split(':').map(Number);
    
    // Crear objeto Date
    const deliveryDate = new Date(year, month - 1, day, hours, minutes, 0, 0);
    
    // Validar que la fecha sea válida
    if (isNaN(deliveryDate.getTime())) {
      return null;
    }
    
    return deliveryDate;
  } catch (error) {
    console.error('[parseScheduledDeliveryDate] Error parseando fecha:', error);
    return null;
  }
}

/**
 * Hook para recibir automáticamente pedidos programados cuando llegue su fecha/hora
 */
export function useAutoReceiveScheduledPurchases(businessId?: string) {
  const { data: purchases = [] } = usePurchasesQuery(businessId);
  const receivePurchaseMutation = useReceivePurchase();
  const processedPurchasesRef = useRef<Set<string>>(new Set());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!purchases || purchases.length === 0) {
      return;
    }

    const checkAndReceiveScheduledPurchases = async () => {
      const now = new Date();
      
      // Filtrar pedidos programados pendientes
      const scheduledPurchases = purchases.filter((purchase: PurchaseWithItems) => {
        // Solo procesar pedidos pendientes que sean programados
        if (purchase.status !== 'pending') {
          return false;
        }
        
        // Verificar que tenga notas de pedido programado
        if (!purchase.notes || !purchase.notes.includes('Pedido programado')) {
          return false;
        }
        
        // Verificar que no haya sido procesado ya
        if (processedPurchasesRef.current.has(purchase.id)) {
          return false;
        }
        
        return true;
      });

      // Procesar cada pedido programado
      for (const purchase of scheduledPurchases) {
        const deliveryDate = parseScheduledDeliveryDate(purchase.notes);
        
        if (!deliveryDate) {
          console.warn(`[useAutoReceiveScheduledPurchases] No se pudo parsear la fecha del pedido ${purchase.id}`);
          continue;
        }
        
        // Si la fecha/hora programada ya pasó, recibir el pedido automáticamente
        if (deliveryDate <= now) {
          console.log(`[useAutoReceiveScheduledPurchases] Recibiendo automáticamente pedido programado ${purchase.id} (fecha programada: ${deliveryDate.toLocaleString()})`);
          
          // Marcar como procesado antes de intentar recibirlo para evitar procesamientos duplicados
          processedPurchasesRef.current.add(purchase.id);
          
          try {
            await receivePurchaseMutation.mutateAsync(purchase.id);
            console.log(`[useAutoReceiveScheduledPurchases] Pedido ${purchase.id} recibido exitosamente`);
          } catch (error) {
            console.error(`[useAutoReceiveScheduledPurchases] Error recibiendo pedido ${purchase.id}:`, error);
            // Remover del set de procesados para intentar de nuevo en la próxima verificación
            processedPurchasesRef.current.delete(purchase.id);
          }
        }
      }
    };

    // Ejecutar inmediatamente al montar o cuando cambien los pedidos
    checkAndReceiveScheduledPurchases();

    // Configurar intervalo para verificar cada minuto
    intervalRef.current = setInterval(checkAndReceiveScheduledPurchases, 60000); // 60000ms = 1 minuto

    // Limpiar intervalo al desmontar
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [purchases, receivePurchaseMutation]);

  // Limpiar el set de procesados cuando cambian los pedidos (para permitir reprocesamiento si es necesario)
  useEffect(() => {
    const purchaseIds = new Set(purchases.map((p: PurchaseWithItems) => p.id));
    // Remover IDs que ya no existen en la lista actual
    processedPurchasesRef.current.forEach((id) => {
      if (!purchaseIds.has(id)) {
        processedPurchasesRef.current.delete(id);
      }
    });
  }, [purchases]);
}
