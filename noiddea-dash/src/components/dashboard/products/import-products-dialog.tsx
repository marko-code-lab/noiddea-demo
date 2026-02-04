'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HugeiconsIcon } from "@hugeicons/react";
import { DownloadIcon } from "@hugeicons/core-free-icons";
import { useState, useEffect } from "react";
import { useSelectedBranch } from "@/hooks/use-selected-branch";
import { useBusiness } from "@/hooks/use-business";
import { importProductsFromBranch, getProducts, importProductsFromExcel } from "@/services/product-actions";
import { importProductsFromExcelClient, getBranchesClient, getProductsClient } from "@/lib/db/client-actions";
import { isNative } from "@/lib/native";
import { useUser } from "@/hooks";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import type { Branch } from "@/types";

export function ImportProductsDialog() {
  const [importType, setImportType] = useState<'file' | 'branch'>('file');
  const [selectedSourceBranch, setSelectedSourceBranch] = useState<string>('');
  const [productCount, setProductCount] = useState<number | null>(null);
  const [isLoadingCount, setIsLoadingCount] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [open, setOpen] = useState(false);
  const [allBranches, setAllBranches] = useState<Branch[]>([]);
  const [isLoadingBranches, setIsLoadingBranches] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);

  const { selectedBranch } = useSelectedBranch();
  const { business } = useBusiness();
  const { user } = useUser();
  const queryClient = useQueryClient();

  // Obtener todas las sucursales del negocio (no solo las asignadas al usuario)
  useEffect(() => {
    const fetchAllBranches = async () => {
      if (!business) {
        setAllBranches([]);
        setIsLoadingBranches(false);
        return;
      }

      if (!user) {
        // Esperar a que el usuario esté disponible
        return;
      }

      try {
        setIsLoadingBranches(true);
        
        const result = typeof window !== 'undefined' && isNative()
          ? await getBranchesClient(user.id)
          : await getBranchesClient(user.id);

        if (!result.success || !result.branches) {
          console.error('Error obteniendo sucursales:', result.error);
          setAllBranches([]);
        } else {
          setAllBranches(result.branches || []);
        }
      } catch (error) {
        console.error('Error obteniendo sucursales:', error);
        setAllBranches([]);
      } finally {
        setIsLoadingBranches(false);
      }
    };

    fetchAllBranches();
  }, [business, user]);

  // Filtrar sucursales: excluir la sucursal actual
  const availableBranches = allBranches.filter(
    (branch) => branch.id !== selectedBranch?.id
  );

  // Obtener el conteo de productos cuando se selecciona una sucursal
  useEffect(() => {
    const fetchProductCount = async () => {
      if (!selectedSourceBranch || importType !== 'branch') {
        setProductCount(null);
        return;
      }

      setIsLoadingCount(true);
      try {
        const useClient = typeof window !== 'undefined' && isNative() && user;
        const result = useClient
          ? await getProductsClient(user.id, selectedSourceBranch)
          : await getProducts(selectedSourceBranch);
        if (result.success) {
          setProductCount(result.products?.length || 0);
        } else {
          setProductCount(0);
        }
      } catch (error) {
        console.error('Error obteniendo conteo de productos:', error);
        setProductCount(0);
      } finally {
        setIsLoadingCount(false);
      }
    };

    fetchProductCount();
  }, [selectedSourceBranch, importType]);

  // Resetear cuando se cierra el diálogo
  useEffect(() => {
    if (!open) {
      setSelectedSourceBranch('');
      setProductCount(null);
      setImportType('file');
      setSelectedFile(null);
    }
  }, [open]);

  const handleImportTypeChange = (value: 'file' | 'branch') => {
    setImportType(value);
    if (value === 'file') {
      setSelectedSourceBranch('');
      setProductCount(null);
      setSelectedFile(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar que sea un archivo Excel
      const validExtensions = ['.xlsx', '.xls', '.xlsm'];
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      
      if (!validExtensions.includes(fileExtension)) {
        toast.error('Por favor selecciona un archivo Excel (.xlsx, .xls, .xlsm)');
        e.target.value = '';
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleDownloadTemplate = async () => {
    setIsDownloadingTemplate(true);
    try {
      // Generar plantilla en el cliente usando xlsx
      const XLSX = await import('xlsx');
      
      // Crear datos de ejemplo
      const data = [
        // Encabezados
        [
          'nombre',
          'descripcion',
          'marca',
          'codigo_barras',
          'sku',
          'costo',
          'precio',
          'stock',
          'bonificacion',
          'fecha_vencimiento',
          'presentaciones',
        ],
        // Fila de ejemplo
        [
          'Producto Ejemplo',
          'Descripción del producto',
          'Marca Ejemplo',
          '1234567890123',
          'SKU-001',
          10.50,
          15.99,
          100,
          0,
          '2025-12-31',
          'pack:6:89.99|caja:12:179.99',
        ],
        // Fila de ejemplo 2
        [
          'Otro Producto',
          '',
          'Otra Marca',
          '',
          'SKU-002',
          5.00,
          8.50,
          50,
          0,
          '',
          '',
        ],
      ];

      // Crear workbook
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.aoa_to_sheet(data);

      // Ajustar ancho de columnas
      const columnWidths = [
        { wch: 20 }, // nombre
        { wch: 30 }, // descripcion
        { wch: 15 }, // marca
        { wch: 15 }, // codigo_barras
        { wch: 15 }, // sku
        { wch: 12 }, // costo
        { wch: 12 }, // precio
        { wch: 10 }, // stock
        { wch: 12 }, // bonificacion
        { wch: 18 }, // fecha_vencimiento
        { wch: 40 }, // presentaciones
      ];
      worksheet['!cols'] = columnWidths;

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos');

      // Generar archivo y descargarlo
      XLSX.writeFile(workbook, 'plantilla-importacion-productos.xlsx');
      
      toast.success('Plantilla descargada correctamente');
    } catch (error) {
      console.error('Error descargando plantilla:', error);
      toast.error('Error inesperado al descargar la plantilla');
    } finally {
      setIsDownloadingTemplate(false);
    }
  };

  const handleImport = async () => {
    if (importType === 'branch') {
      if (!selectedSourceBranch || !selectedBranch) {
        toast.error('Por favor selecciona una sucursal de origen');
        return;
      }

      setIsImporting(true);
      try {
        const result = await importProductsFromBranch({
          sourceBranchId: selectedSourceBranch,
          targetBranchId: selectedBranch.id,
        });

        if (result.success) {
          const importedCount = result.importedCount ?? 0;
          const errorCount = result.errorCount ?? 0;
          
          if (importedCount === 0 && errorCount > 0) {
            // Si no se importó nada pero hubo errores, mostrar los errores
            const errorMessage = result.errors && result.errors.length > 0
              ? result.errors.slice(0, 3).join(', ') + (result.errors.length > 3 ? '...' : '')
              : 'Error desconocido';
            toast.error(`No se pudieron importar productos: ${errorMessage}`);
          } else if (importedCount > 0) {
            // Invalidar y refetchear todas las queries relacionadas para actualización automática en tiempo real
            queryClient.invalidateQueries({ 
              queryKey: queryKeys.products.all,
              refetchType: 'all', // Refetchear todas las queries relacionadas (activas e inactivas)
            });
            if (selectedBranch?.id) {
              queryClient.invalidateQueries({ 
                queryKey: queryKeys.branchProducts.all(selectedBranch.id),
                refetchType: 'all', // Refetchear todas las queries relacionadas (activas e inactivas)
              });
            }
            
            toast.success(
              `${importedCount} productos importados`
            );
            setOpen(false);
          } else {
            toast.error('No se importaron productos. Verifica que haya productos en la sucursal seleccionada.');
          }
        } else {
          toast.error(result.error || 'Error al importar productos');
        }
      } catch (error) {
        console.error('Error importando productos:', error);
        toast.error('Error inesperado al importar productos');
      } finally {
        setIsImporting(false);
      }
    } else {
      // Importación desde archivo Excel
      if (!selectedFile || !selectedBranch) {
        toast.error('Por favor selecciona un archivo Excel');
        return;
      }

      setIsImporting(true);
      try {
        console.log('📤 [Dialog] Iniciando importación de archivo');
        
        const result = typeof window !== 'undefined' && isNative() && user
          ? await importProductsFromExcelClient(user.id, selectedFile, selectedBranch.id)
          : await (async () => {
              const formData = new FormData();
              formData.append('file', selectedFile);
              formData.append('branchId', selectedBranch.id);
              return await importProductsFromExcel(formData);
            })();

        if (result.success) {
          const importedCount = result.importedCount ?? 0;

          // Invalidar y refetchear todas las queries relacionadas para actualización automática en tiempo real
          queryClient.invalidateQueries({ 
            queryKey: queryKeys.products.all,
            refetchType: 'all', // Refetchear todas las queries relacionadas (activas e inactivas)
          });
          if (selectedBranch?.id) {
            queryClient.invalidateQueries({ 
              queryKey: queryKeys.branchProducts.all(selectedBranch.id),
              refetchType: 'all', // Refetchear todas las queries relacionadas (activas e inactivas)
            });
          }

          toast.success(
            `${importedCount} productos importados correctamente`
          );
          setOpen(false);
        } else {
          toast.error(result.error || 'Error al importar productos');
        }
      } catch (error) {
        console.error('❌ [Dialog] Error importando productos:', error);
        toast.error(error instanceof Error ? error.message : 'Error inesperado al importar productos');
      } finally {
        setIsImporting(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>Importar productos</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Importar productos</DialogTitle>
          <DialogDescription>
            Importa productos desde un archivo o de otra sucursal. Los productos importados tendrán stock 0.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel>Tipo de importación</FieldLabel>
            <Select value={importType} onValueChange={handleImportTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder='Selecciona un tipo de importación' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="file">Importar desde archivo</SelectItem>
                <SelectItem value="branch">Importar desde otra sucursal</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          {importType === 'file' && (
            <Field>
              <FieldLabel>Archivo Excel</FieldLabel>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Input 
                    type='file' 
                    accept=".xlsx,.xls,.xlsm,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                    onChange={handleFileChange}
                    disabled={isImporting}
                  />
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground">
                      Archivo seleccionado: {selectedFile.name}
                    </p>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleDownloadTemplate}
                  disabled={isDownloadingTemplate || isImporting}
                >
                  {isDownloadingTemplate ? (
                    <>
                      <Spinner className="size-4" />
                      Descargando...
                    </>
                  ) : (
                    <>
                      <HugeiconsIcon icon={DownloadIcon} className="size-4" strokeWidth={2} />
                      Descargar plantilla
                    </>
                  )}
                </Button>
              </div>
              <FieldDescription>
                Selecciona un archivo Excel (.xlsx, .xls, .xlsm) con los productos a importar.
                Descarga la plantilla para ver el formato requerido.
              </FieldDescription>
            </Field>
          )}
          {importType === 'branch' && (
            <Field>
              <FieldLabel>Sucursal de origen</FieldLabel>
              <Select
                value={selectedSourceBranch}
                onValueChange={setSelectedSourceBranch}
                disabled={isLoadingBranches || !selectedBranch}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Selecciona una sucursal' />
                </SelectTrigger>
                <SelectContent>
                  {availableBranches.length === 0 ? (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      No hay otras sucursales disponibles
                    </div>
                  ) : (
                    availableBranches.map((branch: { id: string; name: string }) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FieldDescription>
                {isLoadingCount ? (
                  <span className="flex items-center gap-2 text-sm">
                    <Spinner />
                    Conectandose a la sucursal
                  </span>
                ) : productCount !== null ? (
                  `Productos a importar: ${productCount}`
                ) : (
                  'Selecciona una sucursal para ver el total de productos'
                )}
              </FieldDescription>
            </Field>
          )}
          <Field>
            <Button
              type='button'
              onClick={handleImport}
              disabled={
                isImporting ||
                (importType === 'branch' && (!selectedSourceBranch || productCount === 0)) ||
                (importType === 'file' && !selectedFile) ||
                !selectedBranch
              }
              className="w-full"
            >
              {isImporting ? (
                <>
                  <Spinner />
                  Importando
                </>
              ) : (
                'Confirmar importación'
              )}
            </Button>
          </Field>
        </FieldGroup>
      </DialogContent>
    </Dialog>
  );
}