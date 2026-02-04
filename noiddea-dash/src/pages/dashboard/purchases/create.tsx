import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronsUpDown, MultiplicationSignIcon, PlusSignIcon, ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useBranch } from "@/components/providers/branch-provider";
import { useProductsQuery } from "@/hooks/use-products-query";
import { useSuppliersQuery, useCreateSupplier } from "@/hooks/use-suppliers-query";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { createPurchase } from "@/services/purchase-actions";
import { createPurchaseClient, createSupplierClient, getSupplierByIdClient } from "@/lib/db/client-actions";
import { isNative } from "@/lib/native";
import { useUser } from "@/hooks/use-user";
import { toast } from "sonner";
import { getSupplierById } from "@/services/supplier-actions";
import { Item, ItemContent, ItemFooter, ItemHeader } from "@/components/ui/item";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Supplier } from "@/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandInput, CommandList } from "@/components/ui/command";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupInput, InputGroupButton } from "@/components/ui/input-group";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Helper function para convertir Date a string YYYY-MM-DD usando hora local
const formatDateToLocalString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

interface PurchaseItem {
  id: string;
  product_name: string;
  product_brand?: string;
  product_barcode?: string;
  quantity: number;
  unit_cost: number;
  sale_price: number;
  expiration?: string;
}

export function CreatePurchasePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { branch } = useBranch();
  const { user } = useUser();
  const [openSearchProductPopover, setOpenSearchProductPopover] = useState(false);
  const queryClient = useQueryClient();
  const { data: products = [] } = useProductsQuery(branch?.id);
  const { data: allSuppliers = [] } = useSuppliersQuery(branch?.id);
  const createSupplierMutation = useCreateSupplier();

  const [supplierName, setSupplierName] = useState("");
  const [supplierTaxId, setSupplierTaxId] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isCreateSupplierDialogOpen, setIsCreateSupplierDialogOpen] = useState(false);
  const [newSupplierForm, setNewSupplierForm] = useState({
    name: "",
    ruc: "",
    phone: "",
    address: "",
  });

  const [deliveryType, setDeliveryType] = useState<"now" | "scheduled">("now");
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(undefined);
  const [deliveryTime, setDeliveryTime] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [expirationCalendarOpen, setExpirationCalendarOpen] = useState(false);
  const [timeZone, setTimeZone] = useState<string | undefined>(undefined);

  // Obtener timezone del navegador
  useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  // Resetear fecha y hora cuando cambia el tipo de entrega
  useEffect(() => {
    if (deliveryType === "now") {
      setDeliveryDate(undefined);
      setDeliveryTime("");
    }
  }, [deliveryType]);

  // Cargar proveedor desde query params si existe (solo una vez al montar)
  useEffect(() => {
    const supplierId = searchParams.get('supplierId');
    // Solo cargar si hay supplierId, branch, y no hay proveedor seleccionado o es diferente
    if (supplierId && branch?.id) {
      // Usar una referencia para evitar loops infinitos
      const loadSupplier = async () => {
        try {
          const useClient = typeof window !== 'undefined' && isNative() && user;
          const result = useClient
            ? await getSupplierByIdClient(supplierId)
            : await getSupplierById(supplierId);
          if (result.success && result.data) {
            const supplier = result.data as Supplier;
            // Solo actualizar si el proveedor es diferente al actual
            setSelectedSupplier((prev) => {
              if (prev?.id === supplier.id) {
                return prev; // No cambiar si es el mismo
              }
              return supplier;
            });
            setSupplierName(supplier.name);
            setSupplierTaxId(supplier.ruc || "");
          }
        } catch (error) {
          // Error silencioso - el usuario puede continuar sin el proveedor pre-cargado
        }
      };
      loadSupplier();
    }
    // Solo ejecutar cuando cambia el supplierId de los params o el branch, no cuando cambia selectedSupplier
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get('supplierId'), branch?.id]);

  // Filtrar proveedores para búsqueda
  const filteredSuppliers = useMemo(() => {
    if (!supplierName || supplierName.length < 2) {
      return allSuppliers.slice(0, 10);
    }

    const searchLower = supplierName.toLowerCase();
    return allSuppliers.filter((supplier: Supplier) =>
      supplier.name.toLowerCase().includes(searchLower) ||
      supplier.ruc?.toLowerCase().includes(searchLower) ||
      supplier.phone?.toLowerCase().includes(searchLower)
    ).slice(0, 10);
  }, [allSuppliers, supplierName]);

  const [items, setItems] = useState<PurchaseItem[]>([]);

  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [selectedProductForItem, setSelectedProductForItem] = useState<any>(null);
  const [itemForm, setItemForm] = useState({
    quantity: "",
    unit_cost: "",
    sale_price: "",
    expiration: "",
    brand: "",
    barcode: "",
  });
  const [expirationDate, setExpirationDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingSupplier, setIsCreatingSupplier] = useState(false);

  // Manejar selección de proveedor
  const handleSelectSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setSupplierName(supplier.name);
    // Autocompletar RUC cuando se selecciona un proveedor
    setSupplierTaxId(supplier.ruc || "");
  };

  // Crear nuevo proveedor
  const handleCreateSupplier = async () => {
    if (!newSupplierForm.name.trim()) {
      toast.error("El nombre del proveedor es requerido");
      return;
    }

    // Validar RUC: debe tener exactamente 11 caracteres si se proporciona
    if (newSupplierForm.ruc.trim() && newSupplierForm.ruc.trim().length !== 11) {
      toast.error("El RUC debe tener exactamente 11 caracteres");
      return;
    }

    // Validar teléfono: debe tener exactamente 9 caracteres si se proporciona
    if (newSupplierForm.phone.trim() && newSupplierForm.phone.trim().length !== 9) {
      toast.error("El número de celular debe tener exactamente 9 caracteres");
      return;
    }

    if (!branch?.id) {
      toast.error("No hay negocio seleccionado");
      return;
    }

    if (!user?.id) {
      toast.error("No hay usuario autenticado");
      return;
    }

    setIsCreatingSupplier(true);
    try {
      const supplierData: any = {
        business_id: branch.id,
        name: newSupplierForm.name.trim(),
        ruc: newSupplierForm.ruc.trim() || null,
        phone: newSupplierForm.phone.trim() || null,
        address: newSupplierForm.address.trim() || null,
        is_active: true,
      };

      const result = typeof window !== 'undefined' && isNative() && user
        ? await createSupplierClient(user.id, supplierData)
        : await createSupplierMutation.mutateAsync(supplierData);

      if (result.success && result.data) {
        const newSupplier = result.data as Supplier;
        handleSelectSupplier(newSupplier);
        setIsCreateSupplierDialogOpen(false);
        setNewSupplierForm({ name: "", ruc: "", phone: "", address: "" });
        toast.success("Proveedor creado exitosamente");

        // Actualizar el cache directamente con el nuevo proveedor
        if (branch?.id) {
          const queryKey = queryKeys.suppliers.byBusiness(branch.id);

          // Obtener los proveedores actuales del cache
          const currentSuppliers = queryClient.getQueryData<Supplier[]>(queryKey) || [];

          // Agregar el nuevo proveedor a la lista (ordenado por nombre)
          const updatedSuppliers = [...currentSuppliers, newSupplier].sort((a, b) =>
            a.name.localeCompare(b.name)
          );

          // Actualizar el cache directamente
          queryClient.setQueryData(queryKey, updatedSuppliers);

          // Invalidar y refetchear todas las queries relacionadas para actualización automática en tiempo real
          queryClient.invalidateQueries({
            queryKey: queryKeys.suppliers.byBusiness(branch.id),
            refetchType: 'all', // Refetchear todas las queries relacionadas (activas e inactivas)
          });
        }
      } else {
        toast.error(result.error || "Error al crear el proveedor");
      }
    } catch (error) {
      console.error("Error creating supplier:", error);
      toast.error("Error al crear el proveedor");
    } finally {
      setIsCreatingSupplier(false);
    }
  };

  // Filtrar productos para búsqueda
  const filteredProducts = useMemo(() => {
    if (!productSearch) return products.slice(0, 10);

    const searchLower = productSearch.toLowerCase();
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchLower) ||
      product.brand?.toLowerCase().includes(searchLower) ||
      product.description?.toLowerCase().includes(searchLower)
    ).slice(0, 10);
  }, [products, productSearch]);

  const handleSelectProduct = (product: any) => {
    setSelectedProductForItem(product);
    // Obtener costo y precio del producto (manejar null, undefined y 0)
    const cost = product.baseCost !== undefined && product.baseCost !== null
      ? product.baseCost
      : (product.cost !== undefined && product.cost !== null ? product.cost : "");
    const price = product.basePrice !== undefined && product.basePrice !== null
      ? product.basePrice
      : (product.price !== undefined && product.price !== null ? product.price : "");

    // Parsear la fecha de expiración si existe
    let expirationDateStr = "";
    let expirationDateObj: Date | undefined = undefined;
    if (product.expiration) {
      try {
        const date = new Date(product.expiration);
        if (!isNaN(date.getTime())) {
          expirationDateStr = date.toISOString().split('T')[0];
          expirationDateObj = date;
        }
      } catch (e) {
        // Si hay error, dejar vacío
      }
    }

    setItemForm({
      quantity: "1",
      unit_cost: typeof cost === 'number' ? cost.toString() : "",
      sale_price: typeof price === 'number' ? price.toString() : "",
      expiration: expirationDateStr,
      brand: product.brand || "",
      barcode: product.barcode || "",
    });
    setExpirationDate(expirationDateObj);
  };

  const handleAddProductToItems = () => {
    if (!selectedProductForItem && !itemForm.brand && !productSearch) {
      toast.error("Debes seleccionar o ingresar información del producto");
      return;
    }

    const quantity = parseFloat(itemForm.quantity);
    const unitCost = parseFloat(itemForm.unit_cost);
    const salePrice = parseFloat(itemForm.sale_price);

    if (!itemForm.quantity || isNaN(quantity) || quantity <= 0) {
      toast.error("La cantidad debe ser mayor a 0");
      return;
    }

    if (!itemForm.unit_cost || isNaN(unitCost) || unitCost <= 0) {
      toast.error("El costo debe ser mayor a 0");
      return;
    }

    if (!itemForm.sale_price || isNaN(salePrice) || salePrice <= 0) {
      toast.error("El precio de venta debe ser mayor a 0");
      return;
    }

    const newItem: PurchaseItem = {
      id: `item-${Date.now()}`,
      product_name: selectedProductForItem?.name || productSearch.trim(),
      product_brand: selectedProductForItem?.brand || itemForm.brand || undefined,
      product_barcode: selectedProductForItem?.barcode || itemForm.barcode || undefined,
      quantity: quantity,
      unit_cost: unitCost,
      sale_price: salePrice,
      expiration: itemForm.expiration || undefined,
    };

    setItems([...items, newItem]);

    // Reset form
    setSelectedProductForItem(null);
    setProductSearch("");
    setItemForm({
      quantity: "",
      unit_cost: "",
      sale_price: "",
      expiration: "",
      brand: "",
      barcode: "",
    });
    setExpirationDate(undefined);
    setIsProductDialogOpen(false);

    toast.success("Producto agregado al pedido");
  };

  const handleRemoveItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supplierName.trim()) {
      toast.error("Debes ingresar el nombre del proveedor");
      return;
    }

    if (items.length === 0) {
      toast.error("Debes agregar al menos un producto al pedido");
      return;
    }

    if (!branch?.id) {
      toast.error("No hay negocio seleccionado");
      return;
    }

    // Validar fecha y hora si es programado
    if (deliveryType === "scheduled") {
      if (!deliveryDate) {
        toast.error("Debes seleccionar una fecha de entrega para pedidos programados");
        return;
      }
      if (!deliveryTime) {
        toast.error("Debes seleccionar una hora de entrega para pedidos programados");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const purchaseData = {
        business_id: branch.business_id,
        branch_id: branch.id,
        supplier_name: supplierName.trim(),
        supplier_tax_id: supplierTaxId.trim() || undefined,
        status: deliveryType === "now" ? "received" : "pending",
        notes: deliveryType === "scheduled" && deliveryDate && deliveryTime
          ? `Pedido programado - Fecha de entrega: ${deliveryDate.getDate().toString().padStart(2, '0')}/${(deliveryDate.getMonth() + 1).toString().padStart(2, '0')}/${deliveryDate.getFullYear()} a las ${deliveryTime}`
          : deliveryType === "now"
            ? "Pedido recibido inmediatamente"
            : undefined,
        type: "purchase",
        items: items.map(item => ({
          product_name: item.product_name,
          product_brand: item.product_brand,
          product_barcode: item.product_barcode,
          quantity: Number(item.quantity),
          unit_cost: Number(item.unit_cost),
          sale_price: Number(item.sale_price),
          expiration: item.expiration,
        })),
      };

      const result = typeof window !== 'undefined' && isNative() && user
        ? await createPurchaseClient(user.id, purchaseData)
        : await createPurchase(purchaseData);

      if (result.success) {
        // Invalidar queries de pedidos para actualizar la lista
        await queryClient.invalidateQueries({
          queryKey: queryKeys.purchases.all,
          refetchType: 'all',
        });

        const scheduledText = deliveryType === "scheduled" && deliveryDate && deliveryTime
          ? ` programado para ${deliveryDate.getDate().toString().padStart(2, '0')}/${(deliveryDate.getMonth() + 1).toString().padStart(2, '0')}/${deliveryDate.getFullYear()} a las ${deliveryTime}`
          : "";
        toast.success("Pedido creado exitosamente" + scheduledText + ". Recibe el pedido para actualizar el inventario.");

        navigate('/dashboard/purchases', { replace: true });
      } else {
        toast.error(result.error || "Error al crear el pedido");
      }
    } catch (error) {
      console.error("Error creating purchase:", error);
      toast.error("Error al crear el pedido");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate total for display (currently not shown in UI but kept for future use)
  // const total = items.reduce((sum, item) => sum + (item.quantity * item.unit_cost), 0);

  return (
    <div className="p-6 container mx-auto">
      <FieldSet>
        <FieldLegend>Crear pedido</FieldLegend>
        <FieldDescription>Crea un nuevo pedido de compra.</FieldDescription>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <div className="grid grid-cols-3 gap-4">
              <Field>
                <FieldLabel>Nombre proveedor</FieldLabel>
                <Popover>
                  <PopoverTrigger asChild className="w-full">
                    <Button variant="outline" role="combobox" className="w-full">
                      {supplierName || "Seleccionar proveedor"}
                      <HugeiconsIcon icon={ChevronsUpDown} strokeWidth={2} className="ml-auto" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-96 overflow-hidden">
                    <Command>
                      <CommandInput
                        placeholder="Buscar o crear proveedor..."
                        value={supplierName}
                        onValueChange={setSupplierName}
                      />
                      <CommandList>
                        <CommandEmpty>
                          {supplierName && supplierName.length >= 2 ? (
                            <div className="py-4 text-center space-y-2">
                              <div className="text-sm text-muted-foreground">
                                No se encontró el proveedor "{supplierName}"
                              </div>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setNewSupplierForm({ ...newSupplierForm, name: supplierName });
                                  setIsCreateSupplierDialogOpen(true);
                                }}
                              >
                                <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} className="mr-2" />
                                Crear "{supplierName}"
                              </Button>
                            </div>
                          ) : (
                            <div className="py-4 text-center text-sm text-muted-foreground">
                              Escribe para buscar proveedores...
                            </div>
                          )}
                        </CommandEmpty>
                        <CommandGroup>
                          {filteredSuppliers.map((supplier: Supplier) => (
                            <CommandItem
                              key={supplier.id}
                              value={supplier.name}
                              onSelect={() => handleSelectSupplier(supplier)}
                              className="cursor-pointer"
                            >
                              <div className="flex flex-col">
                                <span className="font-medium">{supplier.name}</span>
                                {supplier.ruc && (
                                  <span className="text-sm text-muted-foreground">RUC: {supplier.ruc}</span>
                                )}
                                {supplier.phone && (
                                  <span className="text-xs text-muted-foreground">{supplier.phone}</span>
                                )}
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </Field>
              <Field>
                <FieldLabel>RUC proveedor</FieldLabel>
                <Input
                  type="text"
                  placeholder="Ingresa el RUC del proveedor (11 caracteres)"
                  value={supplierTaxId}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ''); // Solo números
                    if (value.length <= 11) {
                      setSupplierTaxId(value);
                    }
                  }}
                  maxLength={11}
                />
              </Field>
              <Field>
                <FieldLabel>Recepción del pedido</FieldLabel>
                <Select value={deliveryType} onValueChange={(value: "now" | "scheduled") => setDeliveryType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="now">Recibir inmediatamente</SelectItem>
                    <SelectItem value="scheduled">Programar entrega</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            {deliveryType === "scheduled" && (
              <div className="flex gap-4">
                <div className="flex flex-col gap-3">
                  <Label htmlFor="date-picker" className="px-1">
                    Fecha de entrega
                  </Label>
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="date-picker"
                        className="w-40 justify-between font-normal"
                      >
                        {deliveryDate ? `${deliveryDate.getDate().toString().padStart(2, '0')}/${(deliveryDate.getMonth() + 1).toString().padStart(2, '0')}/${deliveryDate.getFullYear()}` : "Seleccionar fecha"}
                        <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                      <Calendar
                        mode="single"
                        defaultMonth={deliveryDate}
                        selected={deliveryDate}
                        onSelect={(date) => {
                          setDeliveryDate(date);
                          setCalendarOpen(false);
                        }}
                        timeZone={timeZone}
                        className="rounded-lg border shadow-sm"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="time-picker" className="px-1">
                    Hora de entrega
                  </Label>
                  <Input
                    type="time"
                    id="time-picker"
                    step="1"
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  />
                </div>
              </div>
            )}
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel>Productos</FieldLabel>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedProductForItem(null);
                    setProductSearch("");
                    setItemForm({
                      quantity: "",
                      unit_cost: "",
                      sale_price: "",
                      expiration: "",
                      brand: "",
                      barcode: "",
                    });
                    setExpirationDate(undefined);
                    setIsProductDialogOpen(true);
                  }}
                >
                  <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
                  Agregar producto
                </Button>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted">
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>Laboratorio</TableHead>
                      <TableHead>Expiración</TableHead>
                      <TableHead className="text-center">Cantidad</TableHead>
                      <TableHead className="text-center">Costo</TableHead>
                      <TableHead className="text-center">Venta</TableHead>
                      <TableHead className="w-5"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground">
                          No hay productos agregados
                        </TableCell>
                      </TableRow>
                    ) : (
                      items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.product_name}</TableCell>
                          <TableCell>{item.product_brand || "-"}</TableCell>
                          <TableCell>
                            {item.expiration
                              ? new Date(item.expiration).toLocaleDateString("es-ES")
                              : "-"}
                          </TableCell>
                          <TableCell className="text-center">{item.quantity}</TableCell>
                          <TableCell className="text-center">
                            {item.unit_cost.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-center">
                            {item.sale_price.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              size="icon-sm"
                              variant="ghost"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <HugeiconsIcon icon={MultiplicationSignIcon} strokeWidth={2} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Field>
            <Field orientation="horizontal">
              <Button
                type="button"
                variant="outline"
                className="w-min"
                onClick={() => navigate('/dashboard/purchases', { replace: true })}
              >
                Cancelar
              </Button>
              <Button type="submit" className="w-min" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Confirmar pedido"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </FieldSet>

      {/* Dialog para agregar productos */}
      <Dialog
        open={isProductDialogOpen}
        onOpenChange={(open) => {
          setIsProductDialogOpen(open);
          if (!open) {
            // Resetear el formulario cuando se cierra el diálogo
            setSelectedProductForItem(null);
            setProductSearch("");
            setItemForm({
              quantity: "",
              unit_cost: "",
              sale_price: "",
              expiration: "",
              brand: "",
              barcode: "",
            });
            setExpirationDate(undefined);
          }
        }}
      >
        <DialogContent className="min-w-lg max-w-lg">
          <DialogHeader>
            <DialogTitle>Agregar producto</DialogTitle>
            <DialogDescription>
              Busca un producto existente o ingresa uno nuevo
            </DialogDescription>
          </DialogHeader>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel>Producto</FieldLabel>
                <Popover open={openSearchProductPopover} onOpenChange={setOpenSearchProductPopover}>
                  <PopoverTrigger asChild className="w-full">
                    <Button variant="outline" role="combobox" className="w-full">
                      {productSearch || "Buscar producto..."}
                      <HugeiconsIcon icon={ChevronsUpDown} strokeWidth={2} className="ml-auto" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 min-w-116 max-w-116">
                    <Command className="w-full">
                      <CommandInput
                        placeholder="Buscar producto por nombre, marca..."
                        value={productSearch}
                        onValueChange={setProductSearch}
                      />
                      <CommandList>
                        <CommandEmpty>
                          {productSearch ? (
                            <div className="py-4 text-center text-sm text-muted-foreground">
                              No se encontró el producto. Puedes crear uno nuevo ingresando los datos
                              a continuación.
                            </div>
                          ) : (
                            <div className="py-4 text-center text-sm text-muted-foreground">
                              Escribe para buscar productos...
                            </div>
                          )}
                        </CommandEmpty>
                        <CommandGroup>
                          {filteredProducts.map((product) => (
                            <CommandItem
                              key={product.id}
                              value={product.name}
                              onSelect={() => {
                                handleSelectProduct(product);
                                setOpenSearchProductPopover(false);
                              }}
                              className="cursor-pointer"
                            >
                              <div className="flex flex-col">
                                <span className="font-medium">{product.name}</span>
                                {product.brand && (
                                  <span className="text-sm text-muted-foreground">
                                    {product.brand}
                                  </span>
                                )}
                                <span className="text-xs text-muted-foreground">
                                  Costo: S/ {product.baseCost?.toFixed(2)} | Precio: S/{" "}
                                  {product.basePrice?.toFixed(2)}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </Field>
              {selectedProductForItem ? (
                <Item variant="outline">
                  <ItemHeader className="font-medium">
                    {selectedProductForItem.name}
                    <Badge variant={'secondary'}>{selectedProductForItem.brand}</Badge>
                  </ItemHeader>
                  <Separator />
                  <ItemContent className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Costo</span>
                      <span className="text-muted-foreground">
                        S/ {(selectedProductForItem.baseCost ?? selectedProductForItem.cost ?? 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Precio</span>
                      <span className="text-muted-foreground">
                        S/ {(selectedProductForItem.basePrice ?? selectedProductForItem.price ?? 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Stock</span>
                      <span className="text-muted-foreground">
                        {selectedProductForItem.stock}
                      </span>
                    </div>
                  </ItemContent>
                  <ItemFooter>
                    <span className="text-xs text-muted-foreground">
                      Puedes modificar estos valores en los campos de abajo
                    </span>
                  </ItemFooter>
                </Item>
              ) : (
                <>
                  <Field>
                    <FieldLabel>Nombre del producto *</FieldLabel>
                    <Input
                      type="text"
                      placeholder="Nombre del producto"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel>Marca</FieldLabel>
                      <Input
                        type="text"
                        placeholder="Marca"
                        value={itemForm.brand}
                        onChange={(e) =>
                          setItemForm({ ...itemForm, brand: e.target.value })
                        }
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Código de barras</FieldLabel>
                      <Input
                        type="text"
                        placeholder="Código de barras"
                        value={itemForm.barcode}
                        onChange={(e) =>
                          setItemForm({ ...itemForm, barcode: e.target.value })
                        }
                      />
                    </Field>
                  </div>
                </>
              )}
            </FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Cantidad</FieldLabel>
                <Input
                  type="number"
                  min="1"
                  placeholder="1"
                  value={itemForm.quantity}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, quantity: e.target.value })
                  }
                  required
                />
              </Field>
              <Field>
                <FieldLabel>Vencimiento</FieldLabel>
                <Popover open={expirationCalendarOpen} onOpenChange={setExpirationCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between font-normal"
                    >
                      {expirationDate
                        ? `${expirationDate.getDate().toString().padStart(2, '0')}/${(expirationDate.getMonth() + 1).toString().padStart(2, '0')}/${expirationDate.getFullYear()}`
                        : "Seleccionar fecha"}
                      <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                      mode="single"
                      defaultMonth={expirationDate}
                      selected={expirationDate}
                      onSelect={(date) => {
                        setExpirationDate(date);
                        if (date) {
                          setItemForm({ ...itemForm, expiration: formatDateToLocalString(date) });
                        } else {
                          setItemForm({ ...itemForm, expiration: "" });
                        }
                        setExpirationCalendarOpen(false);
                      }}
                      timeZone={timeZone}
                      className="rounded-lg border shadow-sm"
                    />
                  </PopoverContent>
                </Popover>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Costo unitario</FieldLabel>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={itemForm.unit_cost}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, unit_cost: e.target.value })
                  }
                  required
                />
              </Field>
              <Field>
                <FieldLabel>Precio de venta</FieldLabel>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={itemForm.sale_price}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, sale_price: e.target.value })
                  }
                  required
                />
              </Field>
            </div>

          </FieldSet>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSelectedProductForItem(null);
                setProductSearch("");
                setItemForm({
                  quantity: "",
                  unit_cost: "",
                  sale_price: "",
                  expiration: "",
                  brand: "",
                  barcode: "",
                });
                setExpirationDate(undefined);
                setIsProductDialogOpen(false);
              }}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={handleAddProductToItems}>
              Agregar al pedido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para crear proveedor */}
      <Dialog open={isCreateSupplierDialogOpen} onOpenChange={setIsCreateSupplierDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Crear nuevo proveedor</DialogTitle>
            <DialogDescription>
              Agrega un nuevo proveedor a tu negocio
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel>Nombre del proovedor</FieldLabel>
              <Input
                type="text"
                placeholder="Nombre del proveedor"
                value={newSupplierForm.name}
                onChange={(e) =>
                  setNewSupplierForm({ ...newSupplierForm, name: e.target.value })
                }
                required
                disabled={isCreatingSupplier}
              />
            </Field>
            <Field>
              <FieldLabel>RUC</FieldLabel>
              <Input
                type="text"
                placeholder="00000000000"
                value={newSupplierForm.ruc}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ''); // Solo números
                  if (value.length <= 11) {
                    setNewSupplierForm({ ...newSupplierForm, ruc: value });
                  }
                }}
                maxLength={11}
                disabled={isCreatingSupplier}
              />
            </Field>
            <Field>
              <FieldLabel>Teléfono</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>+51</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  placeholder="000 000 000"
                  type="tel"
                  maxLength={9}
                  value={newSupplierForm.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ''); // Solo números
                    if (value.length <= 9) {
                      setNewSupplierForm({ ...newSupplierForm, phone: value });
                    }
                  }}
                  disabled={isCreatingSupplier}
                />
                <InputGroupAddon align="inline-end">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InputGroupButton
                        variant="ghost"
                        aria-label="Info"
                        size="icon-xs"
                      >
                        <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} />
                      </InputGroupButton>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>El número de teléfono del proveedor</p>
                    </TooltipContent>
                  </Tooltip>
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <Field>
              <FieldLabel>Dirección</FieldLabel>
              <Input
                type="text"
                placeholder="Cercado de Lima"
                value={newSupplierForm.address}
                onChange={(e) =>
                  setNewSupplierForm({ ...newSupplierForm, address: e.target.value })
                }
                disabled={isCreatingSupplier}
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateSupplierDialogOpen(false)}
              disabled={isCreatingSupplier}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleCreateSupplier}
              disabled={isCreatingSupplier || !newSupplierForm.name.trim()}
            >
              {isCreatingSupplier ? "Creando..." : "Crear proveedor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}