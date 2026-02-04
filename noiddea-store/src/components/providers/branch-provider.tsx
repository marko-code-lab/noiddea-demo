"use client";

import { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { Branch } from "@/types";
import { useBranchQuery } from "@/hooks/use-branch-query";

interface BranchContextType {
  branch: Branch | null;
  branches: Branch[];
  setBranch: (branch: Branch) => void;
  isLoading: boolean;
  isOwner: boolean; // true si tiene múltiples branches (puede seleccionar), false si solo tiene una (cashier)
}

const BranchContext = createContext<BranchContextType>({
  branch: null,
  branches: [],
  setBranch: () => {},
  isLoading: true,
  isOwner: false,
});

export function BranchProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading } = useBranchQuery();
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  // Sincronizar selectedBranch cuando data?.branch cambia por primera vez
  useEffect(() => {
    if (!isLoading && data?.branch && !selectedBranch) {
      setSelectedBranch(data.branch);
    }
  }, [isLoading, data?.branch?.id, selectedBranch]);

  // Usar el branch seleccionado manualmente o el del query
  const branch = selectedBranch || (data?.branch ?? null);
  const branches = data?.branches ?? [];
  const isOwner = data?.isOwner ?? false;

  const handleSetBranch = useCallback((newBranch: Branch) => {
    setSelectedBranch(newBranch);
  }, []);

  const value = useMemo(() => ({
    branch, 
    branches, 
    setBranch: handleSetBranch, 
    isLoading,
    isOwner
  }), [branch, branches, handleSetBranch, isLoading, isOwner]);

  return (
    <BranchContext.Provider value={value}>
      {children}
    </BranchContext.Provider>
  );
}

export const useBranch = () => useContext(BranchContext);

// Alias para compatibilidad con el nombre esperado en otros componentes
export const useSelectedBranch = () => {
  const context = useContext(BranchContext);
  return {
    selectedBranch: context.branch,
    branches: context.branches,
    selectBranch: context.setBranch,
    isLoading: context.isLoading,
    isOwner: context.isOwner,
  };
};
