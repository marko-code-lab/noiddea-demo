/**
 * Genera y descarga un PDF con el detalle del pedido (productos, cantidades, totales).
 */

import jsPDF from 'jspdf';
import { formatCurrency } from '@/lib/currency';
import type { PurchaseWithItems } from '@/types';

function getStatusLabel(status: string): string {
  switch (status) {
    case 'pending':
      return 'Pendiente';
    case 'approved':
      return 'Aprobado';
    case 'received':
      return 'Recibido';
    case 'cancelled':
      return 'Cancelado';
    default:
      return status;
  }
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return String(dateString);
  }
}

export function generateAndDownloadPurchasePdf(
  purchase: PurchaseWithItems,
  businessName?: string
): void {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const margin = 20;
  let yPosition = margin;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(16);

  // Título
  pdf.setFont('helvetica', 'bold');
  pdf.text('DETALLE DEL PEDIDO', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 8;

  if (businessName) {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text(businessName, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 6;
  }

  yPosition += 4;
  pdf.setLineWidth(0.5);
  pdf.setDrawColor(0, 0, 0);
  pdf.setLineDashPattern([3, 2], 0);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Datos del pedido
  pdf.setFontSize(10);
  pdf.text(`Nº Pedido: ${purchase.id.slice(0, 8)}...`, margin, yPosition);
  yPosition += 5;
  pdf.text(`Fecha: ${formatDate(purchase.created_at)}`, margin, yPosition);
  yPosition += 5;
  pdf.text(
    `Proveedor: ${purchase.supplier?.name ?? '-'}`,
    margin,
    yPosition
  );
  yPosition += 5;
  if (purchase.supplier?.ruc) {
    pdf.text(`RUC Proveedor: ${purchase.supplier.ruc}`, margin, yPosition);
    yPosition += 5;
  }
  if (purchase.branch?.name) {
    pdf.text(`Sucursal: ${purchase.branch.name}`, margin, yPosition);
    yPosition += 5;
  }
  pdf.text(`Estado: ${getStatusLabel(purchase.status)}`, margin, yPosition);
  yPosition += 5;
  const deliveryType = purchase.notes?.includes('Pedido programado')
    ? 'Programado'
    : 'Inmediato';
  pdf.text(`Tipo entrega: ${deliveryType}`, margin, yPosition);
  yPosition += 10;

  // Línea antes de la tabla
  pdf.setLineDashPattern([3, 2], 0);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 8;

  // Encabezados tabla
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  const colProduct = margin;
  const colQty = margin + 85;
  const colUnit = margin + 110;
  const colSub = pageWidth - margin - 25;
  pdf.text('Producto', colProduct, yPosition);
  pdf.text('Cant.', colQty, yPosition);
  pdf.text('P. unit.', colUnit, yPosition);
  pdf.text('Subtotal', colSub, yPosition);
  yPosition += 6;

  pdf.setFont('helvetica', 'normal');
  const items = purchase.purchase_items ?? [];

  for (const item of items) {
    if (yPosition > 265) {
      pdf.addPage();
      yPosition = margin;
    }

    const productName =
      item.product_presentation?.product?.name ?? 'Producto';
    const variant = item.product_presentation?.variant;
    const label = variant ? `${productName} (${variant})` : productName;
    const qty = item.quantity;
    const unitCost = item.unit_cost;
    const subtotal = item.subtotal ?? qty * unitCost;

    const labelWrapped = pdf.splitTextToSize(label, 80);
    pdf.setFontSize(9);
    pdf.text(labelWrapped, colProduct, yPosition);
    pdf.text(String(qty), colQty, yPosition);
    pdf.text(formatCurrency(unitCost), colUnit, yPosition);
    pdf.text(formatCurrency(subtotal), colSub, yPosition, { align: 'right' });
    yPosition += labelWrapped.length * 5 + 2;
  }

  yPosition += 6;
  pdf.setLineWidth(1);
  pdf.setLineDashPattern([], 0);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.text(
    `TOTAL: ${formatCurrency(purchase.total)}`,
    pageWidth - margin,
    yPosition,
    { align: 'right' }
  );
  yPosition += 12;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(102, 102, 102);
  pdf.text(
    `Generado el ${new Date().toLocaleDateString('es-ES')}`,
    pageWidth / 2,
    yPosition,
    { align: 'center' }
  );
  pdf.setTextColor(0, 0, 0);

  const datePart = new Date().toISOString().split('T')[0];
  const fileName = `Pedido-${purchase.id.slice(0, 8)}-${datePart}.pdf`;

  const blob = pdf.output('blob');
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, 100);
}
