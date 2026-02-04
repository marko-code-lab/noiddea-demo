"use client";

import { createContext, useContext, useMemo } from "react";
import { User } from "@/types";
import { useUserQuery } from "@/hooks/use-user-query";

interface UserContextType {
  user: User | null;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useUserQuery();

  const value = useMemo(() => ({
    user: user || null,
    isLoading
  }), [user, isLoading]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
