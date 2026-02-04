'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/currency';
import { HugeiconsIcon } from '@hugeicons/react';
import { PrinterIcon } from '@hugeicons/core-free-icons';
import jsPDF from 'jspdf';

export interface SaleTicketData {
  saleId: string;
  saleNumber: string;
  businessName: string;
  taxId: string;
  businessLocation: string | null;
  branchName: string;
  branchLocation: string;
  customer: string | null;
  date: string;
  paymentMethod: string;
  items: {
    name: string;
    variant: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
  total: number;
}

interface SaleTicketProps {
  receiptData: SaleTicketData;
  onClose?: () => void;
  autoPrint?: boolean;
}

export function SaleTicket({ receiptData, onClose, autoPrint = false }: SaleTicketProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    printReceipt(receiptData, printRef);
  };

  // Imprimir automáticamente cuando el componente se monta si autoPrint es true
  useEffect(() => {
    if (autoPrint && printRef.current) {
      // Pequeño delay para asegurar que el DOM esté listo
      setTimeout(() => {
        handlePrint();
      }, 100);
    }
  }, [autoPrint]);

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      cash: 'Efectivo',
      card: 'Tarjeta',
      transfer: 'Transferencia',
      digital_wallet: 'Billetera Digital',
    };
    return labels[method] || method;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="no-print flex justify-end gap-2">
        <Button onClick={handlePrint} size="sm" variant="outline">
          <HugeiconsIcon icon={PrinterIcon} strokeWidth={2} />
          Imprimir Boleta
        </Button>
        {onClose && (
          <Button onClick={onClose} size="sm" variant="ghost">
            Cerrar
          </Button>
        )}
      </div>

      <div ref={printRef} className="bg-white text-black p-4 rounded-lg border">
        {/* Header */}
        <div className="ticket-header">
          <div className="ticket-title">{receiptData.businessName}</div>
          <div className="ticket-info">RUC: {receiptData.taxId}</div>
          {receiptData.businessLocation && (
            <div className="ticket-info">{receiptData.businessLocation}</div>
          )}
        </div>

        {/* Sale Info */}
        <div className="ticket-section">
          <div className="ticket-info">
            <strong>BOLETA:</strong> {receiptData.saleNumber}
          </div>
          <div className="ticket-info">
            <strong>Fecha:</strong> {formatDate(receiptData.date)}
          </div>
          <div className="ticket-info">
            <strong>Cliente:</strong> {receiptData.customer || 'General'}
          </div>
          <div className="ticket-info">
            <strong>Pago:</strong> {getPaymentMethodLabel(receiptData.paymentMethod)}
          </div>
        </div>

        {/* Items */}
        <div className="ticket-items">
          <div className="ticket-info" style={{ fontWeight: 'bold', marginBottom: '5px' }}>
            DETALLE:
          </div>
          {receiptData.items.map((item, index) => (
            <div key={index} className="ticket-item">
              <div className="ticket-item-name" style={{ fontWeight: 500 }}>
                {item.name} {item.variant && `(${item.variant})`}
              </div>
              <div className="ticket-item-details">
                <span>
                  {item.quantity} x {formatCurrency(item.unitPrice)}
                </span>
                <span>{formatCurrency(item.subtotal)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="ticket-total">
          <div>TOTAL: {formatCurrency(receiptData.total)}</div>
        </div>

        {/* Footer */}
        <div className="ticket-footer">
          <div>¡Gracias por su compra!</div>
          <div style={{ marginTop: '5px' }}>
            {new Date().toLocaleDateString('es-PE')}
          </div>
        </div>
      </div>
    </div>
  );
}

// Función exportada para imprimir directamente sin mostrar el diálogo
export async function printReceipt(receiptData: SaleTicketData, printRef?: React.RefObject<HTMLDivElement | null>) {
  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      cash: 'Efectivo',
      card: 'Tarjeta',
      transfer: 'Transferencia',
      digital_wallet: 'Billetera Digital',
    };
    return labels[method] || method;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Generar HTML y usar window.print() directamente
  // Este método funciona mejor en Tauri que el iframe
  const htmlContent = generateReceiptHTML(receiptData, printRef, getPaymentMethodLabel, formatDate);
  printWithWindowPrint(htmlContent);
}

// Función auxiliar para generar HTML (usado en fallback)
function generateReceiptHTML(
  receiptData: SaleTicketData,
  printRef: React.RefObject<HTMLDivElement | null> | undefined,
  getPaymentMethodLabel: (method: string) => string,
  formatDate: (dateString: string) => string
): string {
  // Obtener el contenido HTML (del ref si existe, o generarlo)
  let printContent: string;
  if (printRef?.current) {
    printContent = printRef.current.innerHTML;
  } else {
    printContent = `
      <div class="ticket-header">
        <div class="ticket-title">${receiptData.businessName}</div>
        <div class="ticket-info">RUC: ${receiptData.taxId}</div>
        ${receiptData.businessLocation ? `<div class="ticket-info">${receiptData.businessLocation}</div>` : ''}
      </div>
      <div class="ticket-section">
        <div class="ticket-info"><strong>BOLETA:</strong> ${receiptData.saleNumber}</div>
        <div class="ticket-info"><strong>Fecha:</strong> ${formatDate(receiptData.date)}</div>
        <div class="ticket-info"><strong>Cliente:</strong> ${receiptData.customer || 'General'}</div>
        <div class="ticket-info"><strong>Pago:</strong> ${getPaymentMethodLabel(receiptData.paymentMethod)}</div>
      </div>
      <div class="ticket-items">
        <div class="ticket-info" style="font-weight: bold; margin-bottom: 5px;">DETALLE:</div>
        ${receiptData.items.map((item: any) => `
          <div class="ticket-item">
            <div class="ticket-item-name">${item.name} ${item.variant ? `(${item.variant})` : ''}</div>
            <div class="ticket-item-details">
              <span>${item.quantity} x ${formatCurrency(item.unitPrice)}</span>
              <span>${formatCurrency(item.subtotal)}</span>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="ticket-total">
        <div>TOTAL: ${formatCurrency(receiptData.total)}</div>
      </div>
      <div class="ticket-footer">
        <div>¡Gracias por su compra!</div>
        <div style="margin-top: 5px;">${new Date().toLocaleDateString('es-PE')}</div>
      </div>
    `;
  }

  // Crear el HTML completo con estilos
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Boleta - ${receiptData.saleNumber}</title>
        <meta charset="UTF-8">
        <style>
          @media print {
            body { margin: 0; padding: 0; }
            .no-print { display: none !important; }
            @page { 
              size: 58mm auto; 
              margin: 0; 
              padding: 0;
            }
            * {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
          body {
            font-family: 'Courier New', monospace;
            font-size: 12px;
            padding: 5mm;
            max-width: 58mm;
            width: 58mm;
            margin: 0 auto;
            background: white;
            color: black;
            box-sizing: border-box;
          }
          .ticket-header {
            text-align: center;
            border-bottom: 1px dashed #000;
            padding-bottom: 10px;
            margin-bottom: 10px;
          }
          .ticket-title {
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 5px;
          }
          .ticket-info {
            font-size: 10px;
            margin: 2px 0;
          }
          .ticket-section {
            margin: 10px 0;
            border-bottom: 1px dashed #000;
            padding-bottom: 10px;
          }
          .ticket-items {
            margin: 10px 0;
          }
          .ticket-item {
            margin: 5px 0;
            font-size: 11px;
          }
          .ticket-item-name {
            font-weight: 500;
          }
          .ticket-item-details {
            display: flex;
            justify-content: space-between;
            margin-top: 2px;
            font-size: 10px;
          }
          .ticket-total {
            text-align: right;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 2px solid #000;
            font-weight: bold;
            font-size: 14px;
          }
          .ticket-footer {
            text-align: center;
            margin-top: 15px;
            font-size: 9px;
            color: #666;
          }
        </style>
      </head>
      <body>
        ${printContent}
      </body>
    </html>
  `;
}

// Función principal para imprimir usando window.print() directamente
// Este método funciona mejor en Tauri que los iframes
function printWithWindowPrint(htmlContent: string) {
  try {
    console.log('Preparando impresión con window.print()...');

    // Extraer solo el body del HTML y los estilos
    const styleMatch = htmlContent.match(/<style[^>]*>([\s\S]*)<\/style>/i);
    const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    const bodyContent = bodyMatch ? bodyMatch[1] : htmlContent;
    const styleContent = styleMatch ? styleMatch[1] : '';

    // Crear un contenedor temporal para la boleta
    const printContainer = document.createElement('div');
    printContainer.id = 'print-receipt-container';
    printContainer.innerHTML = bodyContent;

    // Agregar estilos de impresión que ocultan todo excepto la boleta
    const printStyle = document.createElement('style');
    printStyle.id = 'print-receipt-style';
    printStyle.textContent = `
      /* Estilos normales - ocultar la boleta en pantalla */
      #print-receipt-container {
        position: fixed;
        left: -9999px;
        top: -9999px;
        width: 58mm;
        background: white;
        padding: 5mm;
        font-family: 'Courier New', monospace;
      }
      
      /* Estilos de impresión - mostrar solo la boleta */
      @media print {
        /* Ocultar todo el contenido normal */
        body * {
          visibility: hidden !important;
        }
        
        /* Mostrar solo el contenedor de la boleta */
        #print-receipt-container,
        #print-receipt-container * {
          visibility: visible !important;
        }
        
        #print-receipt-container {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 58mm !important;
          margin: 0 !important;
          padding: 5mm !important;
        }
        
        /* Configuración de página para impresoras térmicas */
        @page {
          size: 58mm auto;
          margin: 0;
          padding: 0;
        }
        
        /* Estilos adicionales del ticket */
        ${styleContent}
      }
    `;

    // Agregar al DOM
    document.head.appendChild(printStyle);
    document.body.appendChild(printContainer);

    console.log('Contenedor de impresión agregado, ejecutando window.print()...');

    // Esperar un momento para que el DOM se actualice y luego imprimir
    setTimeout(() => {
      try {
        // Enfocar la ventana y ejecutar print
        window.focus();
        window.print();
        console.log('window.print() ejecutado - debería aparecer el diálogo de impresión');
      } catch (error) {
        console.error('Error al ejecutar window.print():', error);
      } finally {
        // Limpiar después de que se complete la impresión (o se cancele)
        // Usamos un timeout más largo para dar tiempo al diálogo
        setTimeout(() => {
          const container = document.getElementById('print-receipt-container');
          const style = document.getElementById('print-receipt-style');

          if (container && document.body.contains(container)) {
            document.body.removeChild(container);
            console.log('Contenedor de impresión removido');
          }

          if (style && document.head.contains(style)) {
            document.head.removeChild(style);
            console.log('Estilos de impresión removidos');
          }
        }, 2000);
      }
    }, 300);
  } catch (error) {
    console.error('Error al preparar la impresión:', error);
  }
}

// Función exportada para guardar la boleta como PDF
export function saveReceiptAsPDF(receiptData: SaleTicketData) {
  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      cash: 'Efectivo',
      card: 'Tarjeta',
      transfer: 'Transferencia',
      digital_wallet: 'Billetera Digital',
    };
    return labels[method] || method;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  try {
    // Crear el PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = 210; // A4 width in mm
    const margin = 20;
    let yPosition = margin;

    // Configurar fuente
    pdf.setFont('courier', 'normal');
    pdf.setFontSize(16);

    // Header - Nombre del negocio
    pdf.setFont('courier', 'bold');
    pdf.text(receiptData.businessName, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 8;

    // RUC
    pdf.setFont('courier', 'normal');
    pdf.setFontSize(10);
    pdf.text(`RUC: ${receiptData.taxId}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 5;

    // Ubicación del negocio (si existe)
    if (receiptData.businessLocation) {
      pdf.text(receiptData.businessLocation, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 5;
    }

    // Línea separadora
    yPosition += 5;
    pdf.setLineWidth(0.5);
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineDashPattern([3, 2], 0);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    // Información de la venta
    pdf.setFontSize(10);
    pdf.text(`BOLETA: ${receiptData.saleNumber}`, margin, yPosition);
    yPosition += 5;
    pdf.text(`Fecha: ${formatDate(receiptData.date)}`, margin, yPosition);
    yPosition += 5;
    pdf.text(`Cliente: ${receiptData.customer || 'General'}`, margin, yPosition);
    yPosition += 5;
    pdf.text(`Pago: ${getPaymentMethodLabel(receiptData.paymentMethod)}`, margin, yPosition);
    yPosition += 8;

    // Línea separadora
    pdf.setLineDashPattern([3, 2], 0);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    // Detalle de items
    pdf.setFont('courier', 'bold');
    pdf.text('DETALLE:', margin, yPosition);
    yPosition += 6;

    pdf.setFont('courier', 'normal');
    receiptData.items.forEach((item) => {
      // Verificar si necesitamos una nueva página
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = margin;
      }

      // Nombre del producto
      pdf.setFont('courier', 'normal');
      pdf.setFontSize(11);
      const productName = `${item.name}${item.variant ? ` (${item.variant})` : ''}`;
      pdf.text(productName, margin, yPosition);
      yPosition += 5;

      // Detalles del item
      pdf.setFont('courier', 'normal');
      pdf.setFontSize(10);
      const itemDetail = `${item.quantity} x ${formatCurrency(item.unitPrice)}`;
      const subtotal = formatCurrency(item.subtotal);
      pdf.text(itemDetail, margin, yPosition);
      pdf.text(subtotal, pageWidth - margin, yPosition, { align: 'right' });
      yPosition += 6;
    });

    // Línea separadora antes del total
    yPosition += 5;
    pdf.setLineWidth(1);
    pdf.setLineDashPattern([], 0);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    // Total
    pdf.setFont('courier', 'bold');
    pdf.setFontSize(14);
    pdf.text(`TOTAL: ${formatCurrency(receiptData.total)}`, pageWidth - margin, yPosition, { align: 'right' });
    yPosition += 15;

    // Footer
    pdf.setFont('courier', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(102, 102, 102);
    pdf.text('¡Gracias por su compra!', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 5;
    pdf.text(new Date().toLocaleDateString('es-PE'), pageWidth / 2, yPosition, { align: 'center' });

    // Resetear color
    pdf.setTextColor(0, 0, 0);

    // Generar el nombre del archivo
    const fileName = `Boleta-${receiptData.saleNumber}-${new Date().toISOString().split('T')[0]}.pdf`;

    // Obtener el PDF como blob para descargarlo de manera más confiable
    const pdfBlob = pdf.output('blob');

    // Crear un enlace de descarga (método más confiable para Tauri)
    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();

    // Limpiar después de un breve delay
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('Error al generar PDF:', error);
    throw error;
  }
}
