import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { LoadingOverlay } from "@/components/loading-overlay";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { HugeiconsIcon } from "@hugeicons/react";
import { SearchIcon, PlusSignIcon, UserIcon } from "@hugeicons/core-free-icons";
import { useBranch } from "@/components/providers/branch-provider";
import { useSuppliersQuery } from "@/hooks/use-suppliers-query";
import { DeleteSupplierDialog } from "@/components/dashboard/suppliers/delete-supplier-dialog";
import { EditSupplierDialog } from "@/components/dashboard/suppliers/edit-supplier-dialog";
import { CreateSupplierDialog } from "@/components/dashboard/suppliers/create-supplier-dialog";
import { SuppliersTable } from "@/components/dashboard/suppliers/suppliers-table";
import type { Supplier } from "@/types";
import { cn } from "@/lib/utils";

export function SuppliersPage() {
  const navigate = useNavigate();
  const { branch, isLoading: branchLoading } = useBranch();
  const { data: suppliers = [], isLoading: suppliersLoading, error } = useSuppliersQuery(
    branch?.id
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const handleCreatePurchase = (supplier: Supplier) => {
    navigate(`/dashboard/purchases/create?supplierId=${supplier.id}`, { replace: false });
  };

  const handleDeleteClick = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setDeleteDialogOpen(true);
  };

  const handleEditClick = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setEditDialogOpen(true);
  };

  const filteredSuppliers = useMemo(() => {
    if (!searchQuery) return suppliers;

    const query = searchQuery.toLowerCase();
    return suppliers.filter(
      (supplier: Supplier) =>
        supplier.name.toLowerCase().includes(query) ||
        supplier.ruc?.toLowerCase().includes(query) ||
        supplier.phone?.toLowerCase().includes(query) ||
        supplier.address?.toLowerCase().includes(query)
    );
  }, [suppliers, searchQuery]);

  const isLoading = branchLoading || suppliersLoading;
  const hasData = !isLoading && suppliers.length > 0;
  const hasNoData = !isLoading && !suppliersLoading && suppliers.length === 0;

  return (
    <div className="">
      <LoadingOverlay isLoading={isLoading} />
      <div className={cn("p-6 space-y-4 h-dvh", hasNoData && "flex items-center justify-center")}>
        <header className={cn("flex items-center justify-between", hasNoData && "hidden")}>
          <InputGroup className="w-96">
            <InputGroupAddon>
              <HugeiconsIcon icon={SearchIcon} strokeWidth={2} />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Busqueda..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <InputGroupAddon align="inline-end">
              {suppliers.length} proveedores
            </InputGroupAddon>
          </InputGroup>
          <div className="flex items-center gap-2">
            <Link to="/dashboard/purchases/create">
              <Button variant='outline' size='sm'>
                Realizar pedido
              </Button>
            </Link>
            <Button onClick={() => setCreateDialogOpen(true)} size="sm">
              <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
              Crear proveedor
            </Button>
          </div>
        </header>
        {error ? (
          <div className="border rounded-lg p-8">
            <Empty>
              <EmptyHeader>
                <EmptyTitle>Error al cargar proveedores</EmptyTitle>
                <EmptyDescription>
                  {error instanceof Error ? error.message : "Error desconocido"}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </div>
        ) : hasNoData || (hasData && filteredSuppliers.length === 0) ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <HugeiconsIcon icon={UserIcon} strokeWidth={2} />
              </EmptyMedia>
              <EmptyTitle>
                {searchQuery ? "No se encontraron proveedores" : "No hay proveedores"}
              </EmptyTitle>
              <EmptyDescription>
                {searchQuery
                  ? "Intenta ajustar los términos de búsqueda"
                  : "Comienza creando tu primer proveedor"}
              </EmptyDescription>
            </EmptyHeader>
            {!searchQuery && (
              <EmptyContent>
                <Button onClick={() => setCreateDialogOpen(true)} size="sm">
                  <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
                  Crear proveedor
                </Button>
              </EmptyContent>
            )}
          </Empty>
        ) : (
          <SuppliersTable
            suppliers={filteredSuppliers}
            onCreatePurchase={handleCreatePurchase}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        )}
      </div>
      <CreateSupplierDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
      <DeleteSupplierDialog
        supplier={selectedSupplier}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={() => {
          setSelectedSupplier(null);
        }}
      />
      <EditSupplierDialog
        supplier={selectedSupplier}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={() => {
          setSelectedSupplier(null);
        }}
      />
    </div>
  );
}
