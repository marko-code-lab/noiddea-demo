'use client';

import { useState, useCallback, useEffect } from 'react';
import { getBusinessUsers } from '@/services';
import { getBusinessUsersClient } from '@/lib/db/client-actions';
import { isNative } from "@/lib/native";
import { useUser } from './use-user';

export interface BusinessUser {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  branchId?: string;
  branchName?: string;
  benefit?: number | null;
  isActive: boolean;
  level: 'business' | 'branch';
}

export function useBusinessUsers(branchId?: string) {
  const [users, setUsers] = useState<BusinessUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  const fetchUsers = useCallback(async () => {
    // En modo Electron, esperar a que user esté disponible
    if (typeof window !== 'undefined' && isNative() && !user) {
      return;
    }

    try {
      setLoading(true);
      let result;
      
      if (typeof window !== 'undefined' && isNative() && user) {
        result = await getBusinessUsersClient(user.id, branchId);
      } else {
        result = await getBusinessUsers(branchId);
      }
      
      if (result.success && result.users) {
        setUsers(result.users);
        setError(null);
      } else {
        setError(result.error || 'Error desconocido');
        setUsers([]);
      }
    } catch (err) {
      console.error('Error fetching business users:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [branchId, user]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, fetchUsers };
}

