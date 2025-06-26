import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { ArrowLeft, Edit, Send, Download, Printer } from 'lucide-react';
import toast from 'react-hot-toast';

const QuotationDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { quotations, updateQuotation } = useData();

  const quotation = quotations.find(q => q.id === id);

  if (!quotation) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Cotización no encontrada</h3>
        <p className="mt-2 text-sm text-gray-500">
          La cotización que buscas no existe o ha sido eliminada.
        </p>
        <div className="mt-6">
          <Link to="/quotations" className="btn-primary">
            Volver a Cotizaciones
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'accepted': return 'Aceptada';
      case 'rejected': return 'Rechazada';
      case 'expired': return 'Vencida';
      default: return status;
    }
  };

  const handleSendEmail = () => {
    // Simular envío de correo
    toast.success('Cotización enviada por correo exitosamente');
    updateQuotation(quotation.id, { sentAt: new Date() });
  };

  const handleDownloadPDF = () => {
    // Simular descarga de PDF
    toast.success('PDF descargado exitosamente');
  };

  const handlePrint = () => {
    window.print();
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
              Cotización {quotation.number}
            </h1>
            <p className="text-gray-600">
              Creada el {quotation.createdAt.toLocaleDateString('es-CL')}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(quotation.status)}`}>
            {getStatusText(quotation.status)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3">
        <Link
          to={`/quotations/${quotation.id}/edit`}
          className="btn-secondary flex items-center"
        >
          <Edit className="w-4 h-4 mr-2" />
          Editar
        </Link>
        <button
          onClick={handleSendEmail}
          className="btn-primary flex items-center"
        >
          <Send className="w-4 h-4 mr-2" />
          Enviar por Correo
        </button>
        <button
          onClick={handleDownloadPDF}
          className="btn-secondary flex items-center"
        >
          <Download className="w-4 h-4 mr-2" />
          Descargar PDF
        </button>
        <button
          onClick={handlePrint}
          className="btn-secondary flex items-center"
        >
          <Printer className="w-4 h-4 mr-2" />
          Imprimir
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Information */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Cliente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Empresa</label>
                <p className="mt-1 text-sm text-gray-900">{quotation.client.businessName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">RUT</label>
                <p className="mt-1 text-sm text-gray-900">{quotation.client.rut}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Contacto</label>
                <p className="mt-1 text-sm text-gray-900">{quotation.client.contactName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Email</label>
                <p className="mt-1 text-sm text-gray-900">{quotation.client.email}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500">Dirección de Entrega</label>
                <p className="mt-1 text-sm text-gray-900">{quotation.deliveryAddress}</p>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Productos</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cantidad
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio Unit.
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descuento
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {quotation.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {item.product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Código: {item.product.code}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${item.unitPrice.toLocaleString('es-CL')}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.discount}%
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        ${item.subtotal.toLocaleString('es-CL')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes */}
          {quotation.notes && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notas</h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{quotation.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Summary */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">${quotation.subtotal.toLocaleString('es-CL')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">IVA (19%):</span>
                <span className="font-medium">${quotation.iva.toLocaleString('es-CL')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Costo de Despacho:</span>
                <span className="font-medium">${quotation.deliveryCost.toLocaleString('es-CL')}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-primary-600">${quotation.total.toLocaleString('es-CL')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalles</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500">Número</label>
                <p className="mt-1 text-sm text-gray-900">{quotation.number}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Fecha de Creación</label>
                <p className="mt-1 text-sm text-gray-900">
                  {quotation.createdAt.toLocaleDateString('es-CL')}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Válida Hasta</label>
                <p className="mt-1 text-sm text-gray-900">
                  {quotation.validUntil.toLocaleDateString('es-CL')}
                </p>
              </div>
              {quotation.sentAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Enviada</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {quotation.sentAt.toLocaleDateString('es-CL')}
                  </p>
                </div>
              )}
              {quotation.respondedAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Respondida</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {quotation.respondedAt.toLocaleDateString('es-CL')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationDetail;