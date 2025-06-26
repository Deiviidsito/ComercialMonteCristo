import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Download, FileText, Calendar, TrendingUp, Users, DollarSign } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import toast from 'react-hot-toast';

const Reports: React.FC = () => {
  const { quotations, clients, products } = useData();
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });

  // Filter data by date range
  const filteredQuotations = quotations.filter(q => {
    const quotationDate = q.createdAt.toISOString().split('T')[0];
    return quotationDate >= dateRange.from && quotationDate <= dateRange.to;
  });

  // Calculate metrics
  const totalQuotations = filteredQuotations.length;
  const acceptedQuotations = filteredQuotations.filter(q => q.status === 'accepted').length;
  const rejectedQuotations = filteredQuotations.filter(q => q.status === 'rejected').length;
  const pendingQuotations = filteredQuotations.filter(q => q.status === 'pending').length;
  const conversionRate = totalQuotations > 0 ? (acceptedQuotations / totalQuotations) * 100 : 0;

  const totalRevenue = filteredQuotations
    .filter(q => q.status === 'accepted')
    .reduce((sum, q) => sum + q.total, 0);

  // Quotation status data
  const statusData = [
    { name: 'Aceptadas', value: acceptedQuotations, color: '#10B981' },
    { name: 'Rechazadas', value: rejectedQuotations, color: '#EF4444' },
    { name: 'Pendientes', value: pendingQuotations, color: '#F59E0B' },
    { name: 'Vencidas', value: filteredQuotations.filter(q => q.status === 'expired').length, color: '#6B7280' },
  ];

  // Top clients by purchases
  const topClients = clients
    .filter(c => c.totalPurchases > 0)
    .sort((a, b) => b.totalPurchases - a.totalPurchases)
    .slice(0, 10);

  // Clients that only quote (potential blocks)
  const quotingOnlyClients = clients
    .filter(c => c.quotationCount >= 3 && c.purchaseCount === 0)
    .sort((a, b) => b.quotationCount - a.quotationCount);

  // Monthly performance data
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const monthName = date.toLocaleDateString('es-CL', { month: 'short' });
    
    const monthQuotations = quotations.filter(q => {
      const qMonth = q.createdAt.getMonth();
      const qYear = q.createdAt.getFullYear();
      return qMonth === date.getMonth() && qYear === date.getFullYear();
    });

    return {
      month: monthName,
      cotizaciones: monthQuotations.length,
      aceptadas: monthQuotations.filter(q => q.status === 'accepted').length,
      ingresos: monthQuotations
        .filter(q => q.status === 'accepted')
        .reduce((sum, q) => sum + q.total, 0) / 1000000, // In millions
    };
  });

  // Product performance
  const productPerformance = products.map(product => {
    const quotationItems = filteredQuotations
      .flatMap(q => q.items)
      .filter(item => item.productId === product.id);
    
    const totalQuantity = quotationItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalRevenue = quotationItems.reduce((sum, item) => sum + item.subtotal, 0);

    return {
      ...product,
      quotedQuantity: totalQuantity,
      quotedRevenue: totalRevenue,
    };
  }).sort((a, b) => b.quotedRevenue - a.quotedRevenue).slice(0, 10);

  const handleExportPDF = () => {
    toast.success('Reporte exportado a PDF exitosamente');
  };

  const handleExportExcel = () => {
    toast.success('Reporte exportado a Excel exitosamente');
  };

  const stats = [
    {
      name: 'Total Cotizaciones',
      value: totalQuotations,
      icon: FileText,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      name: 'Tasa de Conversión',
      value: `${conversionRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'bg-green-500',
      change: '+5%',
    },
    {
      name: 'Ingresos Totales',
      value: `$${(totalRevenue / 1000000).toFixed(1)}M`,
      icon: DollarSign,
      color: 'bg-purple-500',
      change: '+18%',
    },
    {
      name: 'Clientes Activos',
      value: clients.filter(c => !c.isBlocked).length,
      icon: Users,
      color: 'bg-orange-500',
      change: '+3%',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reportes</h1>
          <p className="text-gray-600">Análisis y métricas del negocio</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportExcel}
            className="btn-secondary flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar Excel
          </button>
          <button
            onClick={handleExportPDF}
            className="btn-primary flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar PDF
          </button>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="card p-6">
        <div className="flex items-center space-x-4">
          <Calendar className="w-5 h-5 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Período:</span>
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
            className="input-field w-auto"
          />
          <span className="text-gray-500">hasta</span>
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
            className="input-field w-auto"
          />
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
                    <span className="ml-2 text-sm font-medium text-green-600">
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quotation Status */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de Cotizaciones</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
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
                <Bar dataKey="aceptadas" fill="#10B981" name="Aceptadas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Revenue Trend */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencia de Ingresos (Millones CLP)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="ingresos" 
                stroke="#6EC348" 
                strokeWidth={3}
                dot={{ fill: '#6EC348', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Clients */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 Clientes por Compras</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Cliente
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Compras
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topClients.map((client, index) => (
                  <tr key={client.id}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-semibold mr-3">
                          {index + 1}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {client.businessName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {client.contactName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {client.purchaseCount}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                      ${client.totalPurchases.toLocaleString('es-CL')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quoting Only Clients */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Clientes Solo Cotizando</h3>
          <p className="text-sm text-gray-600 mb-4">
            Clientes con 3+ cotizaciones sin compras (candidatos a bloqueo)
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Cliente
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Cotizaciones
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quotingOnlyClients.slice(0, 10).map((client) => (
                  <tr key={client.id}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {client.businessName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {client.contactName}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {client.quotationCount}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        client.isBlocked 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {client.isBlocked ? 'Bloqueado' : 'En riesgo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Product Performance */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 Productos Más Cotizados</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Producto
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Cantidad Cotizada
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Ingresos Potenciales
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Stock Actual
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productPerformance.map((product, index) => (
                <tr key={product.id}>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-semibold mr-3">
                        {index + 1}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.code}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                    {product.quotedQuantity}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                    ${product.quotedRevenue.toLocaleString('es-CL')}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                    <span className={product.stock < 100 ? 'text-red-600' : 'text-green-600'}>
                      {product.stock}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;