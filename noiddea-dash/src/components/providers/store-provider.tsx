"use client";

import { CartProvider } from "./cart-provider";
import { BranchProvider } from "./branch-provider";
import { UserProvider } from "./user-provider";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <BranchProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </BranchProvider>
    </UserProvider>
  );
}