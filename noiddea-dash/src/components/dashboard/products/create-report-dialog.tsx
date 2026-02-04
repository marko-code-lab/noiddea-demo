'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { HugeiconsIcon } from "@hugeicons/react";
import { Document, DownloadIcon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { useSelectedBranch } from "@/hooks/use-selected-branch";
import { exportProductsToExcel } from "@/services/product-actions";
import { exportProductsToExcelClient } from "@/lib/db/client-actions";
import { isNative } from "@/lib/native";
import { useUser } from "@/hooks";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export function CreateReportDialog() {
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { selectedBranch } = useSelectedBranch();
  const { user } = useUser();

  const handleGenerateReport = async () => {
    if (!selectedBranch) {
      toast.error('Por favor selecciona una sucursal');
      return;
    }

    setIsGenerating(true);
    try {
      // Usar la función cliente si estamos en modo Electron, sino usar la del servidor
      const useClient = typeof window !== 'undefined' && isNative() && user;
      const result = useClient
        ? await exportProductsToExcelClient(user.id, selectedBranch.id)
        : await exportProductsToExcel(selectedBranch.id);

      if (result.success && result.base64) {
        // Convertir base64 a blob
        const byteCharacters = atob(result.base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        // Descargar el archivo
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = result.filename || 'reporte-productos.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success(
          `Reporte generado correctamente. ${result.productCount || 0} productos exportados.`
        );
        setOpen(false);
      } else {
        toast.error(result.error || 'Error al generar el reporte');
      }
    } catch (error) {
      console.error('Error generando reporte:', error);
      toast.error('Error inesperado al generar el reporte');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant='outline' size='sm'>
          Generar reporte
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia>
            <HugeiconsIcon icon={Document} />
          </AlertDialogMedia>
          <AlertDialogTitle>Crear reporte</AlertDialogTitle>
          <AlertDialogDescription>
            Se generara un reporte en formato Excel con todos los productos.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleGenerateReport} disabled={isGenerating || !selectedBranch}>
            {isGenerating ? (
              <>
                <Spinner />
                Generando
              </>
            ) : (
              <>
                Descargar
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}