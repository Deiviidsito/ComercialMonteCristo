import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Client, Quotation } from '../types';

interface DataContextType {
  products: Product[];
  clients: Client[];
  quotations: Quotation[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  blockClient: (id: string) => void;
  addQuotation: (quotation: Omit<Quotation, 'id' | 'number' | 'createdAt' | 'updatedAt'>) => void;
  updateQuotation: (id: string, quotation: Partial<Quotation>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);

  useEffect(() => {
    // Cargar datos iniciales de ejemplo
    const mockProducts: Product[] = [
      {
        id: '1',
        code: 'TOR001',
        name: 'Tornillo Hexagonal M8x20',
        description: 'Tornillo hexagonal galvanizado M8x20mm',
        category: 'Tornillería',
        price: 150,
        stock: 1000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        code: 'TUE001',
        name: 'Tuerca Hexagonal M8',
        description: 'Tuerca hexagonal galvanizada M8',
        category: 'Tornillería',
        price: 80,
        stock: 800,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        code: 'ARA001',
        name: 'Arandela Plana M8',
        description: 'Arandela plana galvanizada M8',
        category: 'Tornillería',
        price: 25,
        stock: 2000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const mockClients: Client[] = [
      {
        id: '1',
        businessName: 'Constructora ABC Ltda.',
        rut: '76.123.456-7',
        email: 'compras@constructoraabc.cl',
        phone: '+56 2 2345 6789',
        address: 'Av. Providencia 1234, Santiago',
        contactName: 'María González',
        contactPhone: '+56 9 8765 4321',
        contactEmail: 'maria.gonzalez@constructoraabc.cl',
        isBlocked: false,
        quotationCount: 5,
        purchaseCount: 3,
        totalPurchases: 2500000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        businessName: 'Metalúrgica XYZ S.A.',
        rut: '96.789.123-4',
        email: 'adquisiciones@metalurgicaxyz.cl',
        phone: '+56 2 3456 7890',
        address: 'Calle Industrial 567, Maipú',
        contactName: 'Carlos Rodríguez',
        contactPhone: '+56 9 7654 3210',
        contactEmail: 'carlos.rodriguez@metalurgicaxyz.cl',
        isBlocked: false,
        quotationCount: 8,
        purchaseCount: 6,
        totalPurchases: 4200000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    setProducts(mockProducts);
    setClients(mockClients);
  }, []);

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === id
          ? { ...product, ...productData, updatedAt: new Date() }
          : product
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const addClient = (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newClient: Client = {
      ...clientData,
      id: Date.now().toString(),
      quotationCount: 0,
      purchaseCount: 0,
      totalPurchases: 0,
      isBlocked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setClients(prev => [...prev, newClient]);
  };

  const updateClient = (id: string, clientData: Partial<Client>) => {
    setClients(prev =>
      prev.map(client =>
        client.id === id
          ? { ...client, ...clientData, updatedAt: new Date() }
          : client
      )
    );
  };

  const blockClient = (id: string) => {
    updateClient(id, { isBlocked: true });
  };

  const addQuotation = (quotationData: Omit<Quotation, 'id' | 'number' | 'createdAt' | 'updatedAt'>) => {
    const quotationNumber = `COT-${Date.now()}`;
    const newQuotation: Quotation = {
      ...quotationData,
      id: Date.now().toString(),
      number: quotationNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setQuotations(prev => [...prev, newQuotation]);
  };

  const updateQuotation = (id: string, quotationData: Partial<Quotation>) => {
    setQuotations(prev =>
      prev.map(quotation =>
        quotation.id === id
          ? { ...quotation, ...quotationData, updatedAt: new Date() }
          : quotation
      )
    );
  };

  return (
    <DataContext.Provider
      value={{
        products,
        clients,
        quotations,
        addProduct,
        updateProduct,
        deleteProduct,
        addClient,
        updateClient,
        blockClient,
        addQuotation,
        updateQuotation,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};