import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Save, Users, Shield, Bell, Mail, Database } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', name: 'General', icon: Shield },
    { id: 'users', name: 'Usuarios', icon: Users },
    { id: 'notifications', name: 'Notificaciones', icon: Bell },
    { id: 'email', name: 'Correo', icon: Mail },
    { id: 'backup', name: 'Respaldo', icon: Database },
  ];

  const handleSave = () => {
    toast.success('Configuración guardada exitosamente');
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración General</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la Empresa
            </label>
            <input
              type="text"
              defaultValue="Monte Cristo"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              RUT de la Empresa
            </label>
            <input
              type="text"
              defaultValue="76.123.456-7"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección
            </label>
            <input
              type="text"
              defaultValue="Av. Industrial 1234, Santiago"
              className="input-field"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                defaultValue="+56 2 2345 6789"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                defaultValue="contacto@montecristo.cl"
                className="input-field"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración de Cotizaciones</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vigencia por defecto (días)
            </label>
            <input
              type="number"
              defaultValue="3"
              min="1"
              max="30"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              IVA (%)
            </label>
            <input
              type="number"
              defaultValue="19"
              min="0"
              max="100"
              step="0.1"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Límite de cotizaciones sin compra para bloqueo
            </label>
            <input
              type="number"
              defaultValue="3"
              min="1"
              max="10"
              className="input-field"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderUserSettings = () => (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Usuarios del Sistema</h3>
          <button className="btn-primary">
            <Users className="w-4 h-4 mr-2" />
            Nuevo Usuario
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Usuario
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Rol
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Estado
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Administrador</div>
                    <div className="text-sm text-gray-500">admin@montecristo.com</div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                    Admin
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Activo
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-primary-600 hover:text-primary-900 mr-3">
                    Editar
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Juan Pérez</div>
                    <div className="text-sm text-gray-500">vendedor@montecristo.com</div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    Vendedor
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Activo
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-primary-600 hover:text-primary-900 mr-3">
                    Editar
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    Desactivar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración de Notificaciones</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Recordatorios de cotizaciones</h4>
              <p className="text-sm text-gray-500">Enviar recordatorios automáticos a clientes</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Alertas de stock bajo</h4>
              <p className="text-sm text-gray-500">Notificar cuando el stock esté bajo</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Alertas de clientes en riesgo</h4>
              <p className="text-sm text-gray-500">Notificar sobre clientes que solo cotizan</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Frecuencia de Recordatorios</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Días para primer recordatorio
            </label>
            <input
              type="number"
              defaultValue="3"
              min="1"
              max="30"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Días para segundo recordatorio
            </label>
            <input
              type="number"
              defaultValue="7"
              min="1"
              max="30"
              className="input-field"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración de Correo</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Servidor SMTP
            </label>
            <input
              type="text"
              defaultValue="smtp.gmail.com"
              className="input-field"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Puerto
              </label>
              <input
                type="number"
                defaultValue="587"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seguridad
              </label>
              <select className="input-field">
                <option value="tls">TLS</option>
                <option value="ssl">SSL</option>
                <option value="none">Ninguna</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usuario
            </label>
            <input
              type="email"
              defaultValue="sistema@montecristo.cl"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="input-field"
            />
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Plantillas de Correo</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Asunto para cotizaciones
            </label>
            <input
              type="text"
              defaultValue="Cotización #{numero} - Monte Cristo"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mensaje de cotización
            </label>
            <textarea
              className="input-field"
              rows={4}
              defaultValue="Estimado/a cliente,&#10;&#10;Adjuntamos la cotización solicitada.&#10;&#10;Saludos cordiales,&#10;Equipo Monte Cristo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mensaje de recordatorio
            </label>
            <textarea
              className="input-field"
              rows={4}
              defaultValue="Estimado/a cliente,&#10;&#10;Le recordamos que tiene una cotización pendiente de respuesta.&#10;&#10;Saludos cordiales,&#10;Equipo Monte Cristo"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Respaldo Automático</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Respaldo automático</h4>
              <p className="text-sm text-gray-500">Crear respaldos automáticos en la nube</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frecuencia de respaldo
            </label>
            <select className="input-field">
              <option value="daily">Diario</option>
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensual</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hora de respaldo
            </label>
            <input
              type="time"
              defaultValue="02:00"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Retener respaldos por (días)
            </label>
            <input
              type="number"
              defaultValue="30"
              min="1"
              max="365"
              className="input-field"
            />
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Respaldo Manual</h3>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Crear un respaldo manual de todos los datos del sistema.
          </p>
          <div className="flex space-x-3">
            <button className="btn-primary">
              <Database className="w-4 h-4 mr-2" />
              Crear Respaldo
            </button>
            <button className="btn-secondary">
              <Database className="w-4 h-4 mr-2" />
              Restaurar Respaldo
            </button>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Historial de Respaldos</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Fecha
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tipo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tamaño
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date().toLocaleDateString('es-CL')}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Automático
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  2.4 MB
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-primary-600 hover:text-primary-900 mr-3">
                    Descargar
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'users':
        return renderUserSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'email':
        return renderEmailSettings();
      case 'backup':
        return renderBackupSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-600">Administra la configuración del sistema</p>
        </div>
        <button
          onClick={handleSave}
          className="btn-primary flex items-center"
        >
          <Save className="w-4 h-4 mr-2" />
          Guardar Cambios
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <nav className="card p-4">
            <ul className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      {tab.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;