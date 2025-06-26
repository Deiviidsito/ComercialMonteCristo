import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Plus, Search, Edit, Trash2, Package, AlertTriangle } from 'lucide-react';
import ProductForm from '../components/ProductForm';
import toast from 'react-hot-toast';

const Products: React.FC = () => {
  const { products, deleteProduct } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);

  const categories = Array.from(new Set(products.map(p => p.category)));

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (productId: string) => {
    setEditingProduct(productId);
    setShowForm(true);
  };

  const handleDelete = (productId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      deleteProduct(productId);
      toast.success('Producto eliminado exitosamente');
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { color: 'text-red-600', text: 'Sin stock' };
    if (stock < 100) return { color: 'text-yellow-600', text: 'Stock bajo' };
    return { color: 'text-green-600', text: 'En stock' };
  };

  if (showForm) {
    return (
      <ProductForm
        productId={editingProduct}
        onClose={handleCloseForm}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
          <p className="text-gray-600">Gestiona el catálogo de productos</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Producto
        </button>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar productos..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              className="input-field"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">Todas las categorías</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const stockStatus = getStockStatus(product.stock);
          return (
            <div key={product.id} className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    Código: {product.code}
                  </p>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                </div>
                <div className="flex items-center space-x-1 ml-2">
                  <button
                    onClick={() => handleEdit(product.id)}
                    className="p-1 text-gray-400 hover:text-primary-600"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Categoría:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {product.category}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Precio:</span>
                  <span className="text-lg font-semibold text-primary-600">
                    ${product.price.toLocaleString('es-CL')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Stock:</span>
                  <div className="flex items-center">
                    <span className={`text-sm font-medium ${stockStatus.color}`}>
                      {product.stock} unidades
                    </span>
                    {product.stock < 100 && (
                      <AlertTriangle className="w-4 h-4 text-yellow-500 ml-1" />
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center text-xs text-gray-500">
                  <Package className="w-3 h-3 mr-1" />
                  Actualizado: {product.updatedAt.toLocaleDateString('es-CL')}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay productos</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || categoryFilter !== 'all'
              ? 'No se encontraron productos con los filtros aplicados.'
              : 'Comienza agregando tu primer producto al catálogo.'}
          </p>
          {!searchTerm && categoryFilter === 'all' && (
            <div className="mt-6">
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Producto
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Products;