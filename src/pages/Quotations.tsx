import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Plus, Search, Filter, FileText, Send, Eye } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import QuotationForm from '../components/QuotationForm';
import QuotationDetail from '../components/QuotationDetail';

const QuotationsList: React.FC = () => {
  const { quotations, clients } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredQuotations = quotations.filter(quotation => {
    const matchesSearch = quotation.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quotation.client.businessName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || quotation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cotizaciones</h1>
          <p className="text-gray-600">Gestiona todas las cotizaciones de la empresa</p>
        </div>
        <Link
          to="/quotations/new"
          className="btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Cotización
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por número o cliente..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              className="input-field"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="accepted">Aceptadas</option>
              <option value="rejected">Rechazadas</option>
              <option value="expired">Vencidas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quotations Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Número
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vencimiento
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredQuotations.map((quotation) => (
                <tr key={quotation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">
                        {quotation.number}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {quotation.client.businessName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {quotation.client.contactName}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${quotation.total.toLocaleString('es-CL')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(quotation.status)}`}>
                      {getStatusText(quotation.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {quotation.createdAt.toLocaleDateString('es-CL')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {quotation.validUntil.toLocaleDateString('es-CL')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        to={`/quotations/${quotation.id}`}
                        className="text-primary-600 hover:text-primary-900"
                        title="Ver detalle"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        title="Enviar por correo"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredQuotations.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay cotizaciones</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all'
                ? 'No se encontraron cotizaciones con los filtros aplicados.'
                : 'Comienza creando tu primera cotización.'}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <div className="mt-6">
                <Link
                  to="/quotations/new"
                  className="btn-primary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Cotización
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Quotations: React.FC = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/" element={<QuotationsList />} />
      <Route path="/new" element={<QuotationForm />} />
      <Route path="/:id" element={<QuotationDetail />} />
      <Route path="/:id/edit" element={<QuotationForm />} />
    </Routes>
  );
};

export default Quotations;