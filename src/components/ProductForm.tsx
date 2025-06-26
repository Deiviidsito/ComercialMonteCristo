import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useData } from '../contexts/DataContext';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

const productSchema = z.object({
  code: z.string().min(1, 'El código es requerido'),
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  category: z.string().min(1, 'La categoría es requerida'),
  price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
  stock: z.number().min(0, 'El stock debe ser mayor o igual a 0'),
});

type ProductForm = z.infer<typeof productSchema>;

interface ProductFormProps {
  productId?: string | null;
  onClose: () => void;
}

const ProductFormComponent: React.FC<ProductFormProps> = ({ productId, onClose }) => {
  const { products, addProduct, updateProduct } = useData();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const isEditing = Boolean(productId);
  const existingProduct = isEditing ? products.find(p => p.id === productId) : null;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      code: existingProduct?.code || '',
      name: existingProduct?.name || '',
      description: existingProduct?.description || '',
      category: existingProduct?.category || '',
      price: existingProduct?.price || 0,
      stock: existingProduct?.stock || 0,
    },
  });

  React.useEffect(() => {
    if (existingProduct?.image) {
      setImagePreview(existingProduct.image);
    }
  }, [existingProduct]);

  const onSubmit = async (data: ProductForm) => {
    setIsLoading(true);
    try {
      const productData = {
        ...data,
        image: imagePreview || undefined,
      };

      if (isEditing && existingProduct) {
        updateProduct(existingProduct.id, productData);
        toast.success('Producto actualizado exitosamente');
      } else {
        addProduct(productData);
        toast.success('Producto creado exitosamente');
      }

      onClose();
    } catch (error) {
      toast.error('Error al guardar el producto');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('La imagen debe ser menor a 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
  };

  const categories = [
    'Tornillería',
    'Herramientas',
    'Soldadura',
    'Ferretería',
    'Eléctrico',
    'Plomería',
    'Pintura',
    'Seguridad',
    'Otros',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onClose}
            className="mr-4 p-2 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
            </h1>
            <p className="text-gray-600">
              {isEditing ? `Editando ${existingProduct?.name}` : 'Agregar un nuevo producto al catálogo'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código *
              </label>
              <input
                type="text"
                {...register('code')}
                className="input-field"
                placeholder="Ej: TOR001"
              />
              {errors.code && (
                <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría *
              </label>
              <select {...register('category')} className="input-field">
                <option value="">Seleccionar categoría</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                {...register('name')}
                className="input-field"
                placeholder="Ej: Tornillo Hexagonal M8x20"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción *
              </label>
              <textarea
                {...register('description')}
                className="input-field"
                rows={3}
                placeholder="Descripción detallada del producto..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Pricing and Stock */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Precio y Stock</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio (CLP) *
              </label>
              <input
                type="number"
                {...register('price', { valueAsNumber: true })}
                className="input-field"
                placeholder="0"
                min="0"
                step="1"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock *
              </label>
              <input
                type="number"
                {...register('stock', { valueAsNumber: true })}
                className="input-field"
                placeholder="0"
                min="0"
                step="1"
              />
              {errors.stock && (
                <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Imagen del Producto</h3>
          <div className="space-y-4">
            {imagePreview ? (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Subir imagen
                    </span>
                    <span className="mt-1 block text-sm text-gray-500">
                      PNG, JPG hasta 2MB
                    </span>
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
            )}
            <p className="text-sm text-gray-500">
              La imagen es opcional. Formatos soportados: JPG, PNG. Tamaño máximo: 2MB.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
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
            {isLoading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Producto')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductFormComponent;