import { useState, useCallback, useMemo } from "react";
import { useCart } from "../providers/cart-provider";
import { useBranch } from "../providers/branch-provider";
import { useUser } from "../providers/user-provider";
import { useCreateSaleMutation } from "@/hooks/use-sales-mutation";
import { type SaleTicketData, printReceipt } from "./sale-ticket";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingCart01Icon } from "@hugeicons/core-free-icons";
import { CartProduct, PaymentMethod } from "@/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Item, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "../ui/item";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { formatCurrency } from "@/lib/currency";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldSet, FieldTitle } from "../ui/field";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Spinner } from "../ui/spinner";
import { useEffect } from "react";
import { SidebarContent, SidebarFooter } from "../ui/sidebar";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { CartItem } from "./session-cart-item";

export function SessionCart() {
  const [customer, setCustomer] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const { cart, updateQuantity, updatePresentation, clearCart, removeFromCart } = useCart();
  const createSaleMutation = useCreateSaleMutation();
  const { branch, isLoading: isBranchLoading } = useBranch();
  const [openConfirmSaleDialog, setOpenConfirmSaleDialog] = useState(false);
  const { user, isLoading: isUserLoading } = useUser();
  const queryClient = useQueryClient();

  // Función helper para obtener el precio del producto según la presentación seleccionada (memoizada)
  const getProductPrice = useCallback((product: CartProduct) => {
    if (!product.selectedPresentationId || product.presentations.length === 0) {
      return product.basePrice || 0;
    }
    const selectedPresentation = product.presentations.find((p: CartProduct['presentations'][0]) => p.id === product.selectedPresentationId);
    // Si la presentación no tiene precio, usar el precio base del producto
    const price = selectedPresentation?.price ?? product.basePrice;
    return price || 0; // Asegurar que nunca sea null/undefined
  }, []);

  // Función helper para obtener la presentación seleccionada (memoizada)
  const getSelectedPresentation = useCallback((product: CartProduct) => {
    if (!product.selectedPresentationId || product.presentations.length === 0) {
      return null;
    }
    return product.presentations.find((p: CartProduct['presentations'][0]) => p.id === product.selectedPresentationId);
  }, []);

  // Memoizar el total del carrito para evitar recalcularlo en cada render
  const cartTotal = useMemo(() => {
    return cart.reduce((acc, cartItem) => {
      const price = getProductPrice(cartItem);
      return acc + price * cartItem.quantity;
    }, 0);
  }, [cart, getProductPrice]);

  const handleConfirmSale = useCallback(async () => {
    // Verificar que no esté cargando
    if (isBranchLoading || isUserLoading) {
      toast.error("Por favor espera un momento...");
      return;
    }

    if (!branch || !user) {
      toast.error("No se pudo identificar la sucursal o el usuario");
      return;
    }

    if (cart.length === 0) {
      toast.error("El carrito está vacío");
      return;
    }

    // Preparar los items para la venta
    const items = cart.map((item) => {
      const price = getProductPrice(item);
      const selectedPresentation = getSelectedPresentation(item);

      // Obtener el ID de la presentación
      let presentationId = item.selectedPresentationId;
      if (!presentationId && item.presentations.length > 0) {
        // Si no hay presentación seleccionada pero hay presentaciones disponibles, usar la primera
        presentationId = item.presentations[0].id;
      }

      // Validar que tengamos un ID de presentación válido
      if (!presentationId) {
        throw new Error(`El producto "${item.name}" no tiene una presentación válida`);
      }

      const presentationUnits = selectedPresentation?.units || 1;

      return {
        productId: item.id,
        productPresentationId: presentationId,
        quantity: item.quantity,
        unitPrice: price,
        bonification: item.bonification || 0,
        presentationUnits: presentationUnits,
      };
    });

    try {
      // Usar la mutación que maneja la invalidación de queries automáticamente
      const result = await createSaleMutation.mutateAsync({
        branchId: branch.id,
        userId: user.id,
        customer: customer || undefined,
        paymentMethod: paymentMethod,
        items: items,
      });

      // Si hay datos de la venta, preparar los datos de la boleta e imprimir automáticamente
      if (result?.saleData) {
        const receiptData: SaleTicketData = {
          saleId: result.saleData.id,
          saleNumber: result.saleData.saleNumber,
          businessName: result.saleData.businessName,
          taxId: result.saleData.taxId,
          businessLocation: (result.saleData as any).businessLocation || null,
          branchName: result.saleData.branchName,
          branchLocation: result.saleData.branchLocation,
          customer: result.saleData.customer,
          date: result.saleData.date,
          paymentMethod: result.saleData.paymentMethod,
          items: result.saleData.items,
          total: result.saleData.total,
        };

        // Imprimir automáticamente la boleta
        try {
          const printingToast = toast.loading("Imprimiendo boleta...");
          await printReceipt(receiptData);
          toast.dismiss(printingToast);
          toast.success("Boleta impresa correctamente");
        } catch (error) {
          console.error('Error al imprimir boleta:', error);
          toast.error("Error al imprimir la boleta");
        }
      }

      // Limpiar carrito después de procesar la impresión
      clearCart();
      setCustomer("");

      // Invalidar queries relacionadas para refrescar los datos
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      if (branch?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.branchProducts.all(branch.id) });
      }
    } catch (error) {
      // El error ya se maneja en el onError de la mutación
      console.error("Error inesperado:", error);
    }
  }, [isBranchLoading, isUserLoading, branch, user, cart, customer, paymentMethod, createSaleMutation, clearCart, queryClient, getProductPrice, getSelectedPresentation]);

  // Atajos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // No activar atajos si el usuario está escribiendo en un input o textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Command/Control + K para "Continuar" (abrir diálogo de confirmación)
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        if (cart.length > 0 && !createSaleMutation.isPending && !openConfirmSaleDialog) {
          setOpenConfirmSaleDialog(true);
        }
      }

      // Command/Control + L para "Confirmar venta"
      if ((e.metaKey || e.ctrlKey) && (e.key === 'l' || e.key === 'L')) {
        e.preventDefault();
        if (cart.length > 0 && !createSaleMutation.isPending) {
          // Si el diálogo está abierto, cerrarlo
          if (openConfirmSaleDialog) {
            setOpenConfirmSaleDialog(false);
          }
          // Confirmar la venta directamente (funciona con o sin cliente)
          handleConfirmSale();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [cart.length, createSaleMutation.isPending, openConfirmSaleDialog, handleConfirmSale]);

  return (
    <div className="h-full flex flex-col">
      <SidebarContent className="flex-1 overflow-hidden p-4 pt-0">
        <div className={cn("flex-1 pb-4", !cart.length && "flex items-center justify-center")}>
          <ItemGroup className={cn("gap-4 overflow-y-scroll", cart.length == 0 && "hidden")}>
            {cart.map((cartItem) => {
              const selectedPresentation = getSelectedPresentation(cartItem);
              const currentPrice = getProductPrice(cartItem);

              // Calcular stock efectivo basado en las unidades de la presentación
              const presentationUnits = selectedPresentation?.units || 1;
              const maxStock = Math.floor(cartItem.stock / presentationUnits);

              const subtotal = currentPrice * cartItem.quantity;

              // Helper para obtener la presentación por defecto (unidad primero)
              const getDefaultPresentationId = () => {
                if (cartItem.selectedPresentationId) {
                  return cartItem.selectedPresentationId;
                }
                // Buscar "unidad" primero
                const unidadPresentation = cartItem.presentations.find(
                  (p: CartProduct['presentations'][0]) => p.variant.toLowerCase() === 'unidad'
                );
                return unidadPresentation?.id || cartItem.presentations[0]?.id;
              };

              return (
                <CartItem
                  cartItem={cartItem}
                  removeFromCart={removeFromCart}
                  selectedPresentation={selectedPresentation || null}
                  updateQuantity={updateQuantity}
                  updatePresentation={updatePresentation}
                  key={cartItem.id}
                  getDefaultPresentationId={getDefaultPresentationId}
                  presentationUnits={presentationUnits}
                  maxStock={maxStock}
                  subtotal={subtotal}
                />
              );
            })}
          </ItemGroup>
          {cart.length == 0 && (
            <Empty className="">
              <EmptyHeader>
                <EmptyMedia variant="icon"><HugeiconsIcon icon={ShoppingCart01Icon} strokeWidth={2} /></EmptyMedia>
                <EmptyTitle>No hay pedidos pendientes</EmptyTitle>
                <EmptyDescription>
                  Añade productos al carrito para continuar.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </div>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Item variant='muted'>
          <ItemContent>
            <ItemDescription>Total</ItemDescription>
          </ItemContent>
          <ItemContent>
            <ItemTitle>{formatCurrency(cartTotal)}</ItemTitle>
          </ItemContent>
        </Item>
        <Drawer open={openConfirmSaleDialog} onOpenChange={setOpenConfirmSaleDialog}>
          <DrawerTrigger asChild>
            <Button size={'lg'} onClick={() => setOpenConfirmSaleDialog(true)} disabled={createSaleMutation.isPending || cart.length === 0}>Continuar</Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="w-md mx-auto">
              <DrawerHeader className="hidden">
                <DrawerTitle>Confirmar venta</DrawerTitle>
              </DrawerHeader>
              <FieldGroup className="p-4">
                <img src="/card.png" alt="" className="h-44 mx-auto rounded-md" />
                <Field>
                  <FieldLabel>Cliente</FieldLabel>
                  <Input
                    type="text"
                    placeholder="Nombre del cliente o RUC"
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                    disabled={createSaleMutation.isPending}
                  />
                </Field>
                <FieldSet>
                  <FieldLabel htmlFor="payment-method-p8w">Método de pago</FieldLabel>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                    disabled={createSaleMutation.isPending}
                    className="grid grid-cols-2 gap-4"
                  >
                    <FieldLabel htmlFor="cash-r2h">
                      <Field orientation="horizontal">
                        <FieldContent>
                          <FieldTitle>Efectivo</FieldTitle>
                          <FieldDescription>
                            Cobro en soles
                          </FieldDescription>
                        </FieldContent>
                        <RadioGroupItem value="cash" id="cash-r2h" />
                      </Field>
                    </FieldLabel>
                    <FieldLabel htmlFor="wallet-z4k">
                      <Field orientation="horizontal">
                        <FieldContent>
                          <FieldTitle>Billetera Digital</FieldTitle>
                          <FieldDescription>
                            Cobra con Yape o Plin
                          </FieldDescription>
                        </FieldContent>
                        <RadioGroupItem value="digital_wallet" id="wallet-z4k" />
                      </Field>
                    </FieldLabel>
                  </RadioGroup>
                </FieldSet>
              </FieldGroup>
              <DrawerFooter>
                <Button
                  variant="default"
                  onClick={() => {
                    handleConfirmSale();
                    setOpenConfirmSaleDialog(false);
                  }}
                  disabled={createSaleMutation.isPending || cart.length === 0}
                >
                  {createSaleMutation.isPending ? <Spinner /> :
                    "Confirmar"
                  }
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline">
                    Cancelar
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </SidebarFooter>
    </div>
  );
}