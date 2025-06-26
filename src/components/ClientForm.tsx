import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useData } from '../contexts/DataContext';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const clientSchema = z.object({
  businessName: z.string().min(1, 'El nombre de la empresa es requerido'),
  rut: z.string().min(1, 'El RUT es requerido'),
  email: z.string().email('Ingrese un correo válido'),
  phone: z.string().min(1, 'El teléfono es requerido'),
  address: z.string().min(1, 'La dirección es requerida'),
  contactName: z.string().min(1, 'El nombre del contacto es requerido'),
  contactPhone: z.string().min(1, 'El teléfono del contacto es requerido'),
  contactEmail: z.string().email('Ingrese un correo válido para el contacto'),
});

type ClientForm = z.infer<typeof clientSchema>;

interface ClientFormProps {
  clientId?: string | null;
  onClose: () => void;
}

const ClientFormComponent: React.FC<ClientFormProps> = ({ clientId, onClose }) => {
  const { clients, addClient, updateClient } = useData();
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = Boolean(clientId);
  const existingClient = isEditing ? clients.find(c => c.id === clientId) : null;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientForm>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      businessName: existingClient?.businessName || '',
      rut: existingClient?.rut || '',
      email: existingClient?.email || '',
      phone: existingClient?.phone || '',
      address: existingClient?.address || '',
      contactName: existingClient?.contactName || '',
      contactPhone: existingClient?.contactPhone || '',
      contactEmail: existingClient?.contactEmail || '',
    },
  });

  const onSubmit = async (data: ClientForm) => {
    setIsLoading(true);
    try {
      if (isEditing && existingClient) {
        updateClient(existingClient.id, data);
        toast.success('Cliente actualizado exitosamente');
      } else {
        addClient(data);
        toast.success('Cliente creado exitosamente');
      }

      onClose();
    } catch (error) {
      toast.error('Error al guardar el cliente');
    } finally {
      setIsLoading(false);
    }
  };

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
              {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
            </h1>
            <p className="text-gray-600">
              {isEditing ? `Editando ${existingClient?.businessName}` : 'Agregar un nuevo cliente'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Company Information */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de la Empresa</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la Empresa *
              </label>
              <input
                type="text"
                {...register('businessName')}
                className="input-field"
                placeholder="Ej: Constructora ABC Ltda."
              />
              {errors.businessName && (
                <p className="mt-1 text-sm text-red-600">{errors.businessName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                RUT *
              </label>
              <input
                type="text"
                {...register('rut')}
                className="input-field"
                placeholder="Ej: 76.123.456-7"
              />
              {errors.rut && (
                <p className="mt-1 text-sm text-red-600">{errors.rut.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono *
              </label>
              <input
                type="tel"
                {...register('phone')}
                className="input-field"
                placeholder="Ej: +56 2 2345 6789"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico *
              </label>
              <input
                type="email"
                {...register('email')}
                className="input-field"
                placeholder="Ej: compras@empresa.cl"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección *
              </label>
              <input
                type="text"
                {...register('address')}
                className="input-field"
                placeholder="Ej: Av. Providencia 1234, Santiago"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Contacto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Contacto *
              </label>
              <input
                type="text"
                {...register('contactName')}
                className="input-field"
                placeholder="Ej: María González"
              />
              {errors.contactName && (
                <p className="mt-1 text-sm text-red-600">{errors.contactName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono del Contacto *
              </label>
              <input
                type="tel"
                {...register('contactPhone')}
                className="input-field"
                placeholder="Ej: +56 9 8765 4321"
              />
              {errors.contactPhone && (
                <p className="mt-1 text-sm text-red-600">{errors.contactPhone.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo del Contacto *
              </label>
              <input
                type="email"
                {...register('contactEmail')}
                className="input-field"
                placeholder="Ej: maria.gonzalez@empresa.cl"
              />
              {errors.contactEmail && (
                <p className="mt-1 text-sm text-red-600">{errors.contactEmail.message}</p>
              )}
            </div>
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
            {isLoading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Cliente')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientFormComponent;