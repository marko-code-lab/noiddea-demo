'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { HugeiconsIcon } from "@hugeicons/react";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';

// Helper function para convertir Date a string YYYY-MM-DD usando hora local
const formatDateToLocalString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export interface CreateProductData {
  branchId: string;
  name: string;
  description?: string;
  expiration?: string;
  brand?: string;
  barcode?: string;
  sku?: string;
  cost: number;
  price: number;
  stock?: number;
  bonification?: number;
  presentations: Array<{
    variant: string;
    units: number;
    price: number;
  }>;
}
import { PlusSignIcon, DeleteIcon, ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '../../ui/empty';
import { Spinner } from '@/components/ui/spinner';
import { Item, ItemContent } from '@/components/ui/item';

interface CreateProductFormProps {
  branchId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  onSubmit: (data: CreateProductData) => Promise<{ success: boolean; error?: string }>;
  isLoading?: boolean;
}

interface Presentation {
  id: string;
  variant: string;  // pack, blister, caja, unidad
  units: string;    // cuántas unidades incluye
  price: string;    // precio de venta de esta presentación
}

export function CreateProductForm({
  branchId,
  onSuccess,
  onCancel,
  onSubmit,
  isLoading = false,
}: CreateProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    expiration: '',
    brand: '',
    barcode: '',
    sku: '',
    cost: '',      // Costo general del producto
    price: '',     // Precio base del producto
    stock: '',     // Stock inicial del producto
    bonification: '',     // Bonificación del producto
  });
  const [expirationDate, setExpirationDate] = useState<Date | undefined>(undefined);
  const [expirationCalendarOpen, setExpirationCalendarOpen] = useState(false);
  const [timeZone, setTimeZone] = useState<string | undefined>(undefined);

  // Presentaciones adicionales (la variante "unidad" se crea automáticamente)
  const [presentations, setPresentations] = useState<Presentation[]>([]);

  // Obtener timezone del navegador
  useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  const handleAddPresentation = () => {
    setPresentations([
      ...presentations,
      {
        id: Date.now().toString(),
        variant: '',
        units: '1',
        price: '',
      },
    ]);
  };

  const handleRemovePresentation = (id: string) => {
    setPresentations(presentations.filter(p => p.id !== id));
  };

  const handlePresentationChange = (
    id: string,
    field: keyof Presentation,
    value: string
  ) => {
    setPresentations(
      presentations.map(p => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación
    if (!formData.name.trim()) {
      toast.error('El nombre del producto es requerido');
      return;
    }

    if (!formData.cost || parseFloat(formData.cost) <= 0) {
      toast.error('El costo del producto es requerido');
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('El precio de venta es requerido');
      return;
    }

    // Validar presentaciones adicionales (si las hay)
    const additionalPresentations = presentations.filter(p => p.variant.trim());
    for (const presentation of additionalPresentations) {
      if (!presentation.units || parseInt(presentation.units) <= 0) {
        toast.error('Las unidades deben ser mayor a 0 en las presentaciones');
        return;
      }
      if (!presentation.price || parseFloat(presentation.price) <= 0) {
        toast.error('El precio es requerido en las presentaciones adicionales');
        return;
      }
    }

    // Convertir fecha de expiración a ISO string si existe (usando hora local)
    const expirationISO = formData.expiration
      ? (() => {
          const date = new Date(formData.expiration + 'T00:00:00');
          return date.toISOString();
        })()
      : undefined;

    const data: CreateProductData = {
      branchId,
      name: formData.name,
      description: formData.description || undefined,
      expiration: expirationISO,
      brand: formData.brand || undefined,
      barcode: formData.barcode || undefined,
      sku: formData.sku || undefined,
      cost: parseFloat(formData.cost),
      price: parseFloat(formData.price),
      stock: formData.stock ? parseInt(formData.stock) : 0,
      bonification: formData.bonification ? parseFloat(formData.bonification) : 0,
      // Solo enviar presentaciones adicionales (unidad se crea automáticamente)
      presentations: additionalPresentations.map(p => ({
        variant: p.variant,
        units: parseInt(p.units),
        price: parseFloat(p.price),
      })),
    };

    const result = await onSubmit(data);

    if (result?.success) {
      toast.success('Producto creado exitosamente');
      onSuccess?.();
    } else {
      toast.error(result?.error || 'Error al crear producto');
    }
  };

  return (
    <form onSubmit={handleSubmit} className='overflow-y-scroll'>
      <FieldSet>
        <FieldGroup>
          <div className='grid grid-cols-3 gap-4'>
            <Field className='col-span-2'>
              <FieldLabel>Nombre del producto</FieldLabel>
              <Input
                placeholder='Ej: Coca-Cola'
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Field>
            <Field>
              <FieldLabel>Marca</FieldLabel>
              <Input
                placeholder='Ej: Coca-Cola'
                value={formData.brand}
                onChange={e => setFormData({ ...formData, brand: e.target.value })}
              />
            </Field>
          </div>
          <Field>
            <FieldLabel>Descripción</FieldLabel>
            <Textarea
              placeholder='Descripción del producto...'
              value={formData.description}
              onChange={e =>
                setFormData({ ...formData, description: e.target.value })
              }
              className='h-20 resize-none'
            />
          </Field>
          <div className='grid grid-cols-3 gap-4'>
            <Field>
              <FieldLabel>Fecha de Vencimiento</FieldLabel>
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
                        setFormData({ ...formData, expiration: formatDateToLocalString(date) });
                      } else {
                        setFormData({ ...formData, expiration: "" });
                      }
                      setExpirationCalendarOpen(false);
                    }}
                    timeZone={timeZone}
                    className="rounded-lg border shadow-sm"
                  />
                </PopoverContent>
              </Popover>
            </Field>
            <Field>
              <FieldLabel>Código de barras</FieldLabel>
              <Input
                placeholder='7891234567890'
                value={formData.barcode}
                onChange={e => setFormData({ ...formData, barcode: e.target.value })}
              />
            </Field>
            <Field>
              <FieldLabel>Stock Inicial</FieldLabel>
              <Input
                type='number'
                min='0'
                placeholder='0'
                value={formData.stock}
                onChange={e => setFormData({ ...formData, stock: e.target.value })}
              />
            </Field>
          </div>
          <div className='grid grid-cols-3 gap-4'>
            <Field>
              <FieldLabel>Costo de Compra</FieldLabel>
              <Input
                type='number'
                step='0.01'
                min='0.01'
                placeholder='0.00'
                value={formData.cost}
                onChange={e => setFormData({ ...formData, cost: e.target.value })}
                required
              />
            </Field>
            <Field>
              <FieldLabel>Precio de Venta</FieldLabel>
              <Input
                type='number'
                step='0.01'
                min='0.01'
                placeholder='0.00'
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </Field>
            <Field>
              <FieldLabel>Bonificación</FieldLabel>
              <Input
                type='number'
                step='0.01'
                min='0'
                placeholder='0'
                value={formData.bonification}
                onChange={e => setFormData({ ...formData, bonification: e.target.value })}
              />
            </Field>
          </div>
        </FieldGroup>
        <FieldGroup>
          <Field>
            {presentations.length === 0 ? (
              <Empty className='border border-dashed'>
                <EmptyHeader>
                  <EmptyDescription>
                    Puedes agregar variantes como packs, blisters o cajas.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <div className='space-y-4'>
                <h3 className='text-sm font-medium'>Presentaciones adicionales</h3>
                {presentations.map((presentation) => (
                  <Item
                    key={presentation.id}
                    variant='outline'
                  >
                    <ItemContent>
                      <FieldGroup className='grid grid-cols-3 gap-4'>
                        <Field>
                          <FieldLabel>Variante</FieldLabel>
                          <Select
                            value={presentation.variant}
                            onValueChange={value =>
                              handlePresentationChange(presentation.id, 'variant', value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder='Tipo' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='pack'>Pack</SelectItem>
                              <SelectItem value='blister'>Blister</SelectItem>
                              <SelectItem value='caja'>Caja</SelectItem>
                              <SelectItem value='sixpack'>Six Pack</SelectItem>
                              <SelectItem value='docena'>Docena</SelectItem>
                              <SelectItem value='pallet'>Pallet</SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>
      
                        <Field>
                          <FieldLabel>Unidades</FieldLabel>
                          <Input
                            type='number'
                            min='1'
                            placeholder='Ej: 6'
                            value={presentation.units}
                            onChange={e =>
                              handlePresentationChange(
                                presentation.id,
                                'units',
                                e.target.value
                              )
                            }
                          />
                        </Field>
      
                        <Field>
                          <FieldLabel>Precio de Venta</FieldLabel>
                          <Input
                            type='number'
                            step='0.01'
                            min='0'
                            placeholder='0.00'
                            value={presentation.price}
                            onChange={e =>
                              handlePresentationChange(
                                presentation.id,
                                'price',
                                e.target.value
                              )
                            }
                          />
                        </Field>
                      </FieldGroup>
                    </ItemContent>
                    <ItemContent>
                      <Button
                        type='button'
                        variant='destructive'
                        size='sm'
                        onClick={() => handleRemovePresentation(presentation.id)}
                      >
                        <HugeiconsIcon icon={DeleteIcon} strokeWidth={2} />
                      </Button>
                    </ItemContent>
                  </Item>
                ))}
              </div>
            )}
            <Button
              type='button'
              variant='outline'
              onClick={handleAddPresentation}
            >
              <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
              Agregar
            </Button>
          </Field>
        </FieldGroup>
        <Field orientation="horizontal" className='justify-end'>
          {onCancel && (
            <Button type='button' variant='outline' onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type='submit' disabled={isLoading}>
            {isLoading && <Spinner />} Crear producto
          </Button>
        </Field>
      </FieldSet>
    </form>
  );
}
