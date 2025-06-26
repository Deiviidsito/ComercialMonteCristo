import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Minus, Search, ArrowLeft, Save, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const quotationSchema = z.object({
  clientId: z.string().min(1, 'Seleccione un cliente'),
  deliveryAddress: z.string().min(1, 'Ingrese la dirección de entrega'),
  deliveryCost: z.number().min(0, 'El costo de despacho debe ser mayor o igual a 0'),
  validUntil: z.string().min(1, 'Seleccione la fecha de vencimiento'),
  notes: z.string().optional(),
  items: z.array(z.object({
    productId: z.string().min(1, 'Seleccione un producto'),
    quantity: z.number().min(1, 'La cantidad debe ser mayor a 0'),
    unitPrice: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
    discount: z.number().min(0).max(100, 'El descuento debe estar entre 0 y 100'),
  })).min(1, 'Debe agregar al menos un producto'),
});

type QuotationForm = z.infer<typeof quotationSchema>;

const QuotationFormComponent: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { products, clients, quotations, addQuotation, updateQuotation } = useData();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [productSearch, setProductSearch] = useState('');

  const isEditing = Boolean(id);
  const existingQuotation = isEditing ? quotations.find(q => q.id === id) : null;

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<QuotationForm>({
    resolver: zodResolver(quotationSchema),
    defaultValues: {
      clientId: existingQuotation?.clientId || '',
      deliveryAddress: existingQuotation?.deliveryAddress || '',
      deliveryCost: existingQuotation?.deliveryCost || 0,
      validUntil: existingQuotation?.validUntil.toISOString().split('T')[0] || 
                   new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: existingQuotation?.notes || '',
      items: existingQuotation?.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount,
      })) || [{ productId: '', quantity: 1, unitPrice: 0, discount: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedItems = watch('items');
  const watchedDeliveryCost = watch('deliveryCost');

  // Calcular totales
  const subtotal = watchedItems.reduce((sum, item) => {
    const itemSubtotal = item.quantity * item.unitPrice * (1 - item.discount / 100);
    return sum + itemSubtotal;
  }, 0);

  const iva = subtotal * 0.19;
  const total = subtotal + iva + (watchedDeliveryCost || 0);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    product.code.toLowerCase().includes(productSearch.toLowerCase())
  );

  const onSubmit = async (data: QuotationForm) => {
    setIsLoading(true);
    try {
      const quotationData = {
        ...data,
        validUntil: new Date(data.validUntil),
        items: data.items.map(item => ({
          id: Date.now().toString() + Math.random(),
          productId: item.productId,
          product: products.find(p => p.id === item.productId)!,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount,
          subtotal: item.quantity * item.unitPrice * (1 - item.discount / 100),
        })),
        subtotal,
        iva,
        total,
        status: 'pending' as const,
        createdBy: user!.id,
        client: clients.find(c => c.id === data.clientId)!,
      };

      if (isEditing && existingQuotation) {
        updateQuotation(existingQuotation.id, quotationData);
        toast.success('Cotización actualizada exitosamente');
      } else {
        addQuotation(quotationData);
        toast.success('Cotización creada exitosamente');
      }

      navigate('/quotations');
    } catch (error) {
      toast.error('Error al guardar la cotización');
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = () => {
    append({ productId: '', quantity: 1, unitPrice: 0, discount: 0 });
  };

  const removeItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const selectProduct = (index: number, productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setValue(`items.${index}.productId`, productId);
      setValue(`items.${index}.unitPrice`, product.price);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/quotations')}
            className="mr-4 p-2 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Editar Cotización' : 'Nueva Cotización'}
            </h1>
            <p className="text-gray-600">
              {isEditing ? `Editando ${existingQuotation?.number}` : 'Crear una nueva cotización'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Client and Basic Info */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Cliente</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cliente *
              </label>
              <select {...register('clientId')} className="input-field">
                <option value="">Seleccionar cliente</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.businessName}
                  </option>
                ))}
              </select>
              {errors.clientId && (
                <p className="mt-1 text-sm text-red-600">{errors.clientId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Vencimiento *
              </label>
              <input
                type="date"
                {...register('validUntil')}
                className="input-field"
              />
              {errors.validUntil && (
                <p className="mt-1 text-sm text-red-600">{errors.validUntil.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección de Entrega *
              </label>
              <input
                type="text"
                {...register('deliveryAddress')}
                className="input-field"
                placeholder="Ingrese la dirección de entrega"
              />
              {errors.deliveryAddress && (
                <p className="mt-1 text-sm text-red-600">{errors.deliveryAddress.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Costo de Despacho
              </label>
              <input
                type="number"
                {...register('deliveryCost', { valueAsNumber: true })}
                className="input-field"
                placeholder="0"
                min="0"
              />
              {errors.deliveryCost && (
                <p className="mt-1 text-sm text-red-600">{errors.deliveryCost.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas
              </label>
              <textarea
                {...register('notes')}
                className="input-field"
                rows={3}
                placeholder="Notas adicionales..."
              />
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Productos</h3>
            <button
              type="button"
              onClick={addItem}
              className="btn-primary flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Producto
            </button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Producto *
                    </label>
                    <select
                      {...register(`items.${index}.productId`)}
                      className="input-field"
                      onChange={(e) => selectProduct(index, e.target.value)}
                    >
                      <option value="">Seleccionar producto</option>
                      {products.map(product => (
                        <option key={product.id} value={product.id}>
                          {product.code} - {product.name}
                        </option>
                      ))}
                    </select>
                    {errors.items?.[index]?.productId && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.items[index]?.productId?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cantidad *
                    </label>
                    <input
                      type="number"
                      {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                      className="input-field"
                      min="1"
                    />
                    {errors.items?.[index]?.quantity && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.items[index]?.quantity?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Precio Unitario *
                    </label>
                    <input
                      type="number"
                      {...register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                      className="input-field"
                      min="0"
                    />
                    {errors.items?.[index]?.unitPrice && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.items[index]?.unitPrice?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descuento (%)
                    </label>
                    <input
                      type="number"
                      {...register(`items.${index}.discount`, { valueAsNumber: true })}
                      className="input-field"
                      min="0"
                      max="100"
                    />
                    {errors.items?.[index]?.discount && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.items[index]?.discount?.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      disabled={fields.length === 1}
                      className="w-full btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Item Subtotal */}
                <div className="mt-2 text-right text-sm text-gray-600">
                  Subtotal: ${(watchedItems[index]?.quantity * watchedItems[index]?.unitPrice * (1 - (watchedItems[index]?.discount || 0) / 100) || 0).toLocaleString('es-CL')}
                </div>
              </div>
            ))}
          </div>

          {errors.items && (
            <p className="mt-2 text-sm text-red-600">
              {errors.items.message}
            </p>
          )}
        </div>

        {/* Totals */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">${subtotal.toLocaleString('es-CL')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">IVA (19%):</span>
              <span className="font-medium">${iva.toLocaleString('es-CL')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Costo de Despacho:</span>
              <span className="font-medium">${(watchedDeliveryCost || 0).toLocaleString('es-CL')}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span className="text-primary-600">${total.toLocaleString('es-CL')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/quotations')}
            className="btn-secondary"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Cotización')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuotationFormComponent;