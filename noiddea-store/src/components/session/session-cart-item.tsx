import { CartProduct, CartProductPresentation } from "@/types";
import { Item, ItemMedia } from "../ui/item";
import { ItemContent, ItemTitle } from "../ui/item";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { MinusSignIcon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { formatCurrency } from "@/lib/currency";

export function CartItem({
    cartItem, removeFromCart, updateQuantity, updatePresentation, getDefaultPresentationId, presentationUnits, maxStock, subtotal, selectedPresentation
}: {
    cartItem: CartProduct;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    updatePresentation: (id: string, presentationId: string) => void;
    getDefaultPresentationId: () => string;
    presentationUnits: number;
    maxStock: number;
    subtotal: number;
    selectedPresentation: CartProductPresentation | null;
}) {
    return (
        <Item variant='outline' key={cartItem.id}>
            <ItemMedia onClick={() => removeFromCart(cartItem.id)} variant="image">
                <img src={`/item.png`} className={cn("size-10 rounded-md hover:brightness-50", !cartItem.bonification && "grayscale")} />
            </ItemMedia>
            <ItemContent className="gap-2">
                <ItemTitle className="line-clamp-1">
                    {cartItem.name}
                </ItemTitle>
                <div className="flex items-center gap-2">
                    {cartItem.presentations.length > 0 ? (
                        <Select
                            value={getDefaultPresentationId()}
                            onValueChange={(value) => {
                                // Obtener la nueva presentación seleccionada
                                const newPresentation = cartItem.presentations.find((p: CartProduct['presentations'][0]) => p.id === value);
                                const newPresentationUnits = newPresentation?.units || 1;
                                const newMaxStock = Math.floor(cartItem.stock / newPresentationUnits);

                                updatePresentation(cartItem.id, value);

                                // Validar que la cantidad actual no exceda el stock al cambiar de presentación
                                if (cartItem.quantity > newMaxStock) {
                                    const presentationName = newPresentation?.variant || 'presentación';
                                    toast.warning(
                                        `Cantidad ajustada a ${newMaxStock}. Stock disponible: ${cartItem.stock} unidades (${newMaxStock} ${presentationName}${newMaxStock !== 1 ? 's' : ''})`
                                    );
                                    updateQuantity(cartItem.id, newMaxStock);
                                }
                            }}
                        >
                            <SelectTrigger size="sm" className="capitalize">
                                <SelectValue placeholder="Presentación">
                                    {selectedPresentation
                                        ? selectedPresentation.variant.charAt(0).toUpperCase() + selectedPresentation.variant.slice(1).toLowerCase()
                                        : 'Presentación'}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {[...cartItem.presentations]
                                    // Ordenar para que "unidad" aparezca primero
                                    .sort((a, b) => {
                                        const aIsUnidad = a.variant.toLowerCase() === 'unidad';
                                        const bIsUnidad = b.variant.toLowerCase() === 'unidad';
                                        if (aIsUnidad && !bIsUnidad) return -1;
                                        if (!aIsUnidad && bIsUnidad) return 1;
                                        return 0; // Mantener el orden original para las demás
                                    })
                                    .map((presentation) => {
                                        // Capitalizar primera letra
                                        const capitalizedVariant = presentation.variant.charAt(0).toUpperCase() + presentation.variant.slice(1).toLowerCase();

                                        // Formato en el dropdown: Si es "unidad" y tiene 1 unidad, solo mostrar "Unidad"
                                        // Si tiene más de 1 unidad, mostrar "X unidades"
                                        const isUnit = presentation.variant.toLowerCase() === 'unidad';
                                        const displayText = isUnit && presentation.units === 1
                                            ? capitalizedVariant
                                            : presentation.units > 1
                                                ? `${capitalizedVariant} (${presentation.units} unidades)`
                                                : capitalizedVariant;

                                        return (
                                            <SelectItem key={presentation.id} value={presentation.id}>
                                                {displayText}
                                            </SelectItem>
                                        );
                                    })}
                            </SelectContent>
                        </Select>
                    ) : (
                        <span className="text-xs text-muted-foreground">Unidad</span>
                    )}
                    <ButtonGroup>
                        <Button
                            variant="outline"
                            size="icon-sm"
                            className={cn(cartItem.quantity <= 1 && "pointer-events-none")}
                            onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}
                        >
                            <HugeiconsIcon icon={MinusSignIcon} strokeWidth={2} />
                        </Button>
                        <Input
                            value={cartItem.quantity}
                            type="number"
                            min={1}
                            max={maxStock}
                            className="w-11 h-7 text-center"
                            onChange={(e) => {
                                const newQuantity = parseInt(e.target.value) || 0;
                                if (newQuantity > maxStock) {
                                    const presentationName = selectedPresentation?.variant || 'unidades';
                                    toast.error(
                                        `Máximo disponible: ${maxStock} ${presentationName}${maxStock !== 1 ? 's' : ''} (${maxStock * presentationUnits} unidades totales)`
                                    );
                                    updateQuantity(cartItem.id, maxStock);
                                } else {
                                    updateQuantity(cartItem.id, newQuantity);
                                }
                            }}
                        />
                        <Button
                            variant="outline"
                            size="icon-sm"
                            onClick={() => {
                                if (cartItem.quantity >= maxStock) {
                                    const presentationName = selectedPresentation?.variant || 'unidades';
                                    toast.error(
                                        `Stock máximo alcanzado: ${maxStock} ${presentationName}${maxStock !== 1 ? 's' : ''} (${maxStock * presentationUnits} unidades totales)`
                                    );
                                } else {
                                    updateQuantity(cartItem.id, cartItem.quantity + 1);
                                }
                            }}
                            className={cn(cartItem.quantity >= maxStock && "pointer-events-none")}
                        >
                            <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
                        </Button>
                    </ButtonGroup>
                </div>
            </ItemContent>
            <ItemContent className="text-end">
                <ItemTitle>
                    {formatCurrency(subtotal)}
                </ItemTitle>
            </ItemContent>
        </Item>
    );
}