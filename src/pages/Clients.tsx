import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Plus, Search, Edit, Ban, Users, Building, Phone, Mail } from 'lucide-react';
import ClientForm from '../components/ClientForm';
import toast from 'react-hot-toast';

const Clients: React.FC = () => {
  const { clients, blockClient } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<string | null>(null);

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.rut.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && !client.isBlocked) ||
                         (statusFilter === 'blocked' && client.isBlocked);
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (clientId: string) => {
    setEditingClient(clientId);
    setShowForm(true);
  };

  const handleBlock = (clientId: string, businessName: string) => {
    if (window.confirm(`¿Bloquear a ${businessName}? No podrán recibir nuevas cotizaciones.`)) {
      blockClient(clientId);
      toast.success('Cliente bloqueado exitosamente');
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingClient(null);
  };

  const getClientStatus = (client: any) => {
    if (client.isBlocked) {
      return { color: 'text-red-600 bg-red-100', text: 'Bloqueado' };
    }
    if (client.quotationCount >= 3 && client.purchaseCount === 0) {
      return { color: 'text-yellow-600 bg-yellow-100', text: 'En riesgo' };
    }
    return { color: 'text-green-600 bg-green-100', text: 'Activo' };
  };

  const getClientType = (client: any) => {
    if (client.purchaseCount === 0) return 'Prospecto';
    if (client.purchaseCount >= 10) return 'Cliente VIP';
    if (client.purchaseCount >= 5) return 'Cliente Frecuente';
    return 'Cliente Regular';
  };

  if (showForm) {
    return (
      <ClientForm
        clientId={editingClient}
        onClose={handleCloseForm}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600">Gestiona la base de datos de clientes</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Cliente
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center">
            <div className="bg-blue-500 p-2 rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Total Clientes</p>
              <p className="text-xl font-semibold">{clients.length}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <div className="bg-green-500 p-2 rounded-lg">
              <Building className="w-5 h-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Activos</p>
              <p className="text-xl font-semibold">{clients.filter(c => !c.isBlocked).length}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <div className="bg-red-500 p-2 rounded-lg">
              <Ban className="w-5 h-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Bloqueados</p>
              <p className="text-xl font-semibold">{clients.filter(c => c.isBlocked).length}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <div className="bg-yellow-500 p-2 rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">En Riesgo</p>
              <p className="text-xl font-semibold">
                {clients.filter(c => c.quotationCount >= 3 && c.purchaseCount === 0).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar clientes..."
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
              <option value="active">Activos</option>
              <option value="blocked">Bloqueados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClients.map((client) => {
          const status = getClientStatus(client);
          const clientType = getClientType(client);
          
          return (
            <div key={client.id} className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {client.businessName}
                    </h3>
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                      {status.text}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">
                    RUT: {client.rut}
                  </p>
                  <p className="text-xs text-primary-600 font-medium">
                    {clientType}
                  </p>
                </div>
                <div className="flex items-center space-x-1 ml-2">
                  <button
                    onClick={() => handleEdit(client.id)}
                    className="p-1 text-gray-400 hover:text-primary-600"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  {!client.isBlocked && (
                    <button
                      onClick={() => handleBlock(client.id, client.businessName)}
                      className="p-1 text-gray-400 hover:text-red-600"
                      title="Bloquear"
                    >
                      <Ban className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{client.contactName}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="truncate">{client.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{client.phone}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{client.quotationCount}</p>
                    <p className="text-xs text-gray-500">Cotizaciones</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-green-600">{client.purchaseCount}</p>
                    <p className="text-xs text-gray-500">Compras</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-primary-600">
                      ${(client.totalPurchases / 1000).toFixed(0)}K
                    </p>
                    <p className="text-xs text-gray-500">Total</p>
                  </div>
                </div>
              </div>

              <div className="mt-3 text-xs text-gray-500">
                Cliente desde: {client.createdAt.toLocaleDateString('es-CL')}
              </div>
            </div>
          );
        })}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay clientes</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all'
              ? 'No se encontraron clientes con los filtros aplicados.'
              : 'Comienza agregando tu primer cliente.'}
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <div className="mt-6">
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Cliente
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Clients;