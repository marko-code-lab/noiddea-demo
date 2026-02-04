'use client';

import { useEffect, useState, useCallback } from 'react';
import { useUser } from './use-user';
import { getDatabaseClient } from '@/lib/db/client';
import type { Business, BusinessUser, BusinessUserRole } from '@/types';

interface BusinessData {
  business: Business;
  role: BusinessUserRole | null;
  businessUser: BusinessUser | null;
}

export function useBusiness() {
  const { user, isLoading: isLoadingUser } = useUser();
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchBusiness = useCallback(async () => {
    // Si no hay usuario o aún está cargando, esperar
    if (isLoadingUser) {
      return;
    }

    if (!user) {
      setBusinessData(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const db = getDatabaseClient();

      // Primero intentar obtener el negocio desde businesses_users (owner)
      const businessUserData = await db.selectOne<{
        id: string;
        user_id: string;
        business_id: string;
        role: string;
        is_active: number;
        created_at: string;
        business_name: string;
        business_description: string | null;
        business_tax_id: string;
        business_website: string | null;
        business_location: string | null;
        business_created_at: string;
      }>(
        `SELECT 
          bu.id,
          bu.user_id,
          bu.business_id,
          bu.role,
          bu.is_active,
          bu.created_at,
          b.name as business_name,
          b.description as business_description,
          b.tax_id as business_tax_id,
          b.website as business_website,
          b.location as business_location,
          b.created_at as business_created_at
         FROM businesses_users bu
         INNER JOIN businesses b ON b.id = bu.business_id
         WHERE bu.user_id = ? AND bu.is_active = 1 LIMIT 1`,
        [user.id]
      );

      if (businessUserData) {
        // Usuario es owner
        setBusinessData({
          business: {
            id: businessUserData.business_id,
            name: businessUserData.business_name,
            description: businessUserData.business_description,
            tax_id: businessUserData.business_tax_id,
            website: businessUserData.business_website,
            location: businessUserData.business_location,
            created_at: businessUserData.business_created_at,
          } as Business,
          role: businessUserData.role as BusinessUserRole,
          businessUser: {
            id: businessUserData.id,
            user_id: businessUserData.user_id,
            business_id: businessUserData.business_id,
            role: businessUserData.role as BusinessUserRole,
            is_active: businessUserData.is_active,
            created_at: businessUserData.created_at,
          } as BusinessUser,
        });
      } else {
        // Si no está en businesses_users, intentar obtener desde branches_users (cashier)
        const branchUserData = await db.selectOne<{
          id: string;
          user_id: string;
          branch_id: string;
          role: string;
          is_active: number;
          created_at: string;
          business_id: string;
          business_name: string;
          business_description: string | null;
          business_tax_id: string;
          business_website: string | null;
          business_location: string | null;
          business_created_at: string;
        }>(
          `SELECT 
            bu.id,
            bu.user_id,
            bu.branch_id,
            bu.role,
            bu.is_active,
            bu.created_at,
            b.business_id,
            biz.name as business_name,
            biz.description as business_description,
            biz.tax_id as business_tax_id,
            biz.website as business_website,
            biz.location as business_location,
            biz.created_at as business_created_at
           FROM branches_users bu
           INNER JOIN branches b ON b.id = bu.branch_id
           INNER JOIN businesses biz ON biz.id = b.business_id
           WHERE bu.user_id = ? AND bu.is_active = 1 LIMIT 1`,
          [user.id]
        );

        if (branchUserData) {
          // Usuario es cashier - obtener business desde branch
          setBusinessData({
            business: {
              id: branchUserData.business_id,
              name: branchUserData.business_name,
              description: branchUserData.business_description,
              tax_id: branchUserData.business_tax_id,
              website: branchUserData.business_website,
              location: branchUserData.business_location,
              created_at: branchUserData.business_created_at,
            } as Business,
            role: null, // No tiene rol de business, solo de branch
            businessUser: null, // No tiene registro en businesses_users
          });
        } else {
          setBusinessData(null);
        }
      }
    } catch (err) {
      console.error('Error fetching business:', err);
      setError(err as Error);
      setBusinessData(null);
    } finally {
      setIsLoading(false);
    }
  }, [user, isLoadingUser]);

  useEffect(() => {
    fetchBusiness();
  }, [fetchBusiness, refreshKey]);

  const refresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  return {
    business: businessData?.business ?? null,
    role: businessData?.role ?? null,
    businessUser: businessData?.businessUser ?? null,
    isLoading: isLoadingUser || isLoading,
    error,
    hasBusiness: !!businessData?.business,
    refresh,
  };
}
