import { CartProduct } from "@/types";
import React from "react";
import { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemFooter } from "../ui/item";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { formatCurrency } from "@/lib/currency";

// Funciones utilitarias para manejar fechas de vencimiento (fuera del componente para evitar recrearlas)
function getDaysUntilExpiration(expirationDate: string | null | undefined): number | null {
  if (!expirationDate) return null;

  const expiration = new Date(expirationDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expiration.setHours(0, 0, 0, 0);

  const diffTime = expiration.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

function isExpiringSoon(expirationDate: string | null | undefined): boolean {
  const daysUntilExpiration = getDaysUntilExpiration(expirationDate);
  if (daysUntilExpiration === null) return false;

  // Considerar que falta 1 mes o menos (30 días)
  return daysUntilExpiration <= 30 && daysUntilExpiration >= 0;
}

function formatExpirationDate(expirationDate: string | null | undefined): string | null {
  if (!expirationDate) return null;

  try {
    const date = new Date(expirationDate);
    return date.toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return null;
  }
}

// Memoizar el componente del producto para evitar re-renders innecesarios
export const ProductItem = React.memo(({
  product,
  onAddToCart
}: {
  product: CartProduct;
  onAddToCart: (product: CartProduct) => void;
}) => {
  // Memoizar cálculos de vencimiento
  const expirationData = React.useMemo(() => {
    const expirationDate = product.expiration;
    const daysUntilExpiration = getDaysUntilExpiration(expirationDate);
    const expiringSoon = isExpiringSoon(expirationDate);
    const formattedExpiration = formatExpirationDate(expirationDate);
    const isExpired = daysUntilExpiration !== null && daysUntilExpiration < 0;

    return {
      expirationDate,
      daysUntilExpiration,
      expiringSoon,
      formattedExpiration,
      isExpired
    };
  }, [product.expiration]);

  const hasBonification = product.bonification && product.bonification > 0;
  const handleClick = React.useCallback(() => {
    onAddToCart(product);
  }, [product, onAddToCart]);

  return (
    <HoverCard>
      <HoverCardTrigger>
        <Item
          className={cn(product.stock === 0 && "pointer-events-none", "cursor-pointer")}
          variant="outline"
          onClick={handleClick}
        >
          <ItemMedia>
            <img src="/item.png" className={cn("size-10 rounded-md", !hasBonification && "grayscale", product.stock === 0 && "grayscale")} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="line-clamp-1">{product.name}</ItemTitle>
            <ItemDescription>
              {formatCurrency(product.basePrice || 0)}
            </ItemDescription>
          </ItemContent>
          <ItemContent>
          </ItemContent>
          <ItemFooter >
            <div className="flex items-center gap-2">
              {hasBonification && (
                <Badge variant="default">Bonificación</Badge>
              )}
              {product.brand && <Badge variant="secondary">{product.brand}</Badge>}
              {expirationData.isExpired && (
                <Badge variant="destructive">
                  Vencido
                </Badge>
              )}
            </div>
            <ItemDescription>
              {product.stock}
            </ItemDescription>
          </ItemFooter>
        </Item>
      </HoverCardTrigger>
      <HoverCardContent className="w-64">
        <div className="font-normal!">
          {product.description || "Sin descripción"}
        </div>
        <span className="text-muted-foreground text-xs">
          Vence en {" "}
          {new Date(product.expiration || "").toLocaleDateString("es-PE", {
            month: "long",
            year: "numeric",
          })}</span>
      </HoverCardContent>
    </HoverCard>

  );
});