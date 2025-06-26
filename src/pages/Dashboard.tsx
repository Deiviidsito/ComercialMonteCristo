import React from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import {
  FileText,
  Users,
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Dashboard: React.FC = () => {
  const { quotations, clients, products } = useData();
  const { user } = useAuth();

  // Estadísticas generales
  const totalQuotations = quotations.length;
  const acceptedQuotations = quotations.filter(q => q.status === 'accepted').length;
  const rejectedQuotations = quotations.filter(q => q.status === 'rejected').length;
  const pendingQuotations = quotations.filter(q => q.status === 'pending').length;
  const expiredQuotations = quotations.filter(q => q.status === 'expired').length;

  const totalClients = clients.length;
  const blockedClients = clients.filter(c => c.isBlocked).length;
  const activeClients = totalClients - blockedClients;

  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock < 100).length;

  // Datos para gráficos
  const quotationStatusData = [
    { name: 'Aceptadas', value: acceptedQuotations, color: '#10B981' },
    { name: 'Rechazadas', value: rejectedQuotations, color: '#EF4444' },
    { name: 'Pendientes', value: pendingQuotations, color: '#F59E0B' },
    { name: 'Vencidas', value: expiredQuotations, color: '#6B7280' },
  ];

  const monthlyData = [
    { month: 'Ene', cotizaciones: 12, ventas: 8 },
    { month: 'Feb', cotizaciones: 19, ventas: 13 },
    { month: 'Mar', cotizaciones: 15, ventas: 11 },
    { month: 'Abr', cotizaciones: 22, ventas: 16 },
    { month: 'May', cotizaciones: 18, ventas: 14 },
    { month: 'Jun', cotizaciones: 25, ventas: 19 },
  ];

  const topClients = clients
    .sort((a, b) => b.totalPurchases - a.totalPurchases)
    .slice(0, 5);

  const stats = [
    {
      name: 'Total Cotizaciones',
      value: totalQuotations,
      icon: FileText,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive',
    },
    {
      name: 'Clientes Activos',
      value: activeClients,
      icon: Users,
      color: 'bg-green-500',
      change: '+5%',
      changeType: 'positive',
    },
    {
      name: 'Productos',
      value: totalProducts,
      icon: Package,
      color: 'bg-purple-500',
      change: '+2%',
      changeType: 'positive',
    },
    {
      name: 'Tasa de Conversión',
      value: totalQuotations > 0 ? `${Math.round((acceptedQuotations / totalQuotations) * 100)}%` : '0%',
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: '+8%',
      changeType: 'positive',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Bienvenido, {user?.name}. Aquí tienes un resumen de tu actividad.
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Última actualización: {new Date().toLocaleString('es-CL')}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card p-6">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    <span className={`ml-2 text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quotation Status Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de Cotizaciones</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={quotationStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {quotationStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Performance */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rendimiento Mensual</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="cotizaciones" fill="#6EC348" name="Cotizaciones" />
                <Bar dataKey="ventas" fill="#10B981" name="Ventas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Clients */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Clientes</h3>
          <div className="space-y-3">
            {topClients.map((client, index) => (
              <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{client.businessName}</p>
                    <p className="text-xs text-gray-500">{client.purchaseCount} compras</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    ${client.totalPurchases.toLocaleString('es-CL')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div className="ml-3">
                <p className="text-sm text-gray-900">Cotización COT-001 aceptada</p>
                <p className="text-xs text-gray-500">Hace 2 horas</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-red-50 rounded-lg">
              <XCircle className="w-5 h-5 text-red-500" />
              <div className="ml-3">
                <p className="text-sm text-gray-900">Cotización COT-002 rechazada</p>
                <p className="text-xs text-gray-500">Hace 4 horas</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-500" />
              <div className="ml-3">
                <p className="text-sm text-gray-900">Cotización COT-003 pendiente</p>
                <p className="text-xs text-gray-500">Hace 1 día</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-orange-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <div className="ml-3">
                <p className="text-sm text-gray-900">Stock bajo: Tornillo M8x20</p>
                <p className="text-xs text-gray-500">Hace 2 días</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {(lowStockProducts > 0 || blockedClients > 0) && (
        <div className="card p-6 border-l-4 border-orange-500">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 text-orange-500 mr-2" />
            Alertas del Sistema
          </h3>
          <div className="space-y-2">
            {lowStockProducts > 0 && (
              <p className="text-sm text-gray-700">
                ⚠️ {lowStockProducts} productos con stock bajo (menos de 100 unidades)
              </p>
            )}
            {blockedClients > 0 && (
              <p className="text-sm text-gray-700">
                🚫 {blockedClients} clientes bloqueados por falta de compras
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;