import React, { useState, useMemo, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

// --- Iconos (Sin cambios) ---
// Icono de Búsqueda (Search)
const SearchIcon = ({ size = 20, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

// Icono de Carga (Loader2)
const LoaderIcon = ({ size = 20, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`animate-spin ${className}`}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

// --- (NUEVO) Iconos para el Carrito ---
const PlusCircleIcon = ({ size = 18, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const CheckIcon = ({ size = 18, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ShoppingCartIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const Trash2Icon = ({ size = 18, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const XIcon = ({ size = 16, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// (NUEVO) Iconos para +/-
const PlusIcon = ({ size = 16, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const MinusIcon = ({ size = 16, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
// --- Fin Iconos ---


// Helper: Formateador de Moneda (Sin cambios)
const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) {
    return '$0.00';
  }
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// --- Constantes ---
const ITEMS_PER_PAGE = 50; // Cuántos items cargar cada vez

// --- (NUEVO) Componente de Carrito ---
// (MODIFICADO) Acepta nuevas props 'onIncrement' y 'onDecrement'
function CartList({ cartItems, onRemoveItem, onUpdateQuantity, onClearCart, onIncrement, onDecrement }) {
  // Calcula el total
  const total = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }, [cartItems]);

  if (cartItems.length === 0) {
    return null; // No mostrar nada si el carrito está vacío
  }

  return (
    <div className="mb-6 bg-white rounded-lg shadow-md border border-gray-200">
      <header className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <ShoppingCartIcon className="text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">
            Productos Seleccionados
          </h2>
        </div>
        <button
          onClick={onClearCart}
          className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
        >
          <XIcon size={14} />
          Vaciar Lista
        </button>
      </header>

      {/* Tabla del Carrito */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Código
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cant.
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subtotal
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quitar
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cartItems.map(item => (
              <tr key={item.code}>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.code}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {item.description}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  {/* (MODIFICADO) Controlador de cantidad +/- */}
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => onDecrement(item.code)}
                      className="p-1.5 border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors"
                      title="Restar uno"
                    >
                      <MinusIcon size={14} />
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => onUpdateQuantity(item.code, e.target.value)}
                      className="w-14 text-center border-t border-b border-gray-300 py-1 px-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => onIncrement(item.code)}
                      className="p-1.5 border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors"
                      title="Sumar uno"
                    >
                      <PlusIcon size={14} />
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-semibold text-gray-900">
                  {formatCurrency(item.price * item.quantity)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                  <button
                    onClick={() => onRemoveItem(item.code)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title="Quitar producto"
                  >
                    <Trash2Icon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          {/* Footer con Total */}
          <tfoot className="bg-gray-50">
            <tr>
              <td colSpan="3" className="px-4 py-3 text-right text-sm font-bold text-gray-700 uppercase">
                Total
              </td>
              <td className="px-4 py-3 text-right text-lg font-bold text-gray-900">
                {formatCurrency(total)}
              </td>
              <td className="px-4 py-3"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}


// --- Componente de Página (Refactorizado) ---

function PriceListPage() {
  // --- Estados ---
  const [searchTerm, setSearchTerm] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  
  // (MODIFICADO) Estado del carrito, inicializado desde localStorage
  const [cart, setCart] = useState(() => {
    try {
      // Intenta cargar el carrito guardado
      const savedCart = localStorage.getItem('priceListCart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error al cargar el carrito de localStorage", error);
      return []; // Empieza vacío si hay un error
    }
  });

  // Hook para el "infinite scroll"
  const { ref, inView } = useInView();
  
  // --- Carga de Datos (Sin cambios) ---
  useEffect(() => {
    fetch('/products.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error al cargar 'products.json': ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        setAllProducts(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err);
        setIsLoading(false);
      });
  }, []);
  
  // (NUEVO) Hook para guardar el carrito en localStorage cada vez que cambia
  useEffect(() => {
    try {
      localStorage.setItem('priceListCart', JSON.stringify(cart));
    } catch (error) {
      console.error("Error al guardar el carrito en localStorage", error);
    }
  }, [cart]); // El array de dependencia [cart] es la clave

  // --- (NUEVO) Lógica del Carrito ---

  // 1. Set de códigos en el carrito (para búsquedas rápidas)
  const cartItemCodes = useMemo(() => new Set(cart.map(item => item.code)), [cart]);

  // 2. Agregar al carrito
  const handleAddToCart = (productToAdd) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.code === productToAdd.code);

      if (existingItem) {
        // Si ya existe, incrementa la cantidad
        return prevCart.map(item =>
          item.code === productToAdd.code
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Si es nuevo, lo agrega con cantidad 1
        return [...prevCart, { ...productToAdd, quantity: 1 }];
      }
    });
  };

  // 3. Actualizar cantidad
  const handleUpdateQuantity = (productCode, newQuantityStr) => {
    const newQuantity = parseInt(newQuantityStr, 10);

    if (isNaN(newQuantity) || newQuantity <= 0) {
      // Si la cantidad es inválida o 0, elimina el ítem
      handleRemoveFromCart(productCode);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.code === productCode ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // 4. Quitar del carrito
  const handleRemoveFromCart = (productCode) => {
    setCart(prevCart => prevCart.filter(item => item.code !== productCode));
  };

  // 5. Vaciar carrito
  const handleClearCart = () => {
    setCart([]);
  };

  // (NUEVO) 6. Incrementar cantidad
  const handleIncrementQuantity = (productCode) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.code === productCode
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };
  
  // (NUEVO) 7. Decrementar cantidad
  const handleDecrementQuantity = (productCode) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.code === productCode);

      // Si la cantidad es 1 o menos, elimínalo
      if (existingItem && existingItem.quantity <= 1) {
        // Llama a la función de remover
        return prevCart.filter(item => item.code !== productCode);
      }

      // Si es mayor que 1, réstale uno
      return prevCart.map(item =>
        item.code === productCode
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  };


  // --- Lógica de Filtros (Sin cambios) ---
  const filteredProducts = useMemo(() => {
    let products = allProducts;
    if (searchTerm) {
      const searchWords = searchTerm
        .toLowerCase()
        .split(' ') 
        .filter(word => word.length > 0); 

      products = products.filter(p => {
        const productText = (
          (p.description || '') + ' ' + (p.code || '')
        ).toLowerCase();
        return searchWords.every(word => productText.includes(word));
      });
    }
    return products;
  }, [allProducts, searchTerm]);

  // Resetea el conteo visible si los filtros cambian
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [searchTerm]);

  // Lógica de "Cargar más"
  useEffect(() => {
    if (inView) {
      setVisibleCount(prevCount =>
        Math.min(prevCount + ITEMS_PER_PAGE, filteredProducts.length)
      );
    }
  }, [inView, filteredProducts.length]);

  // Obtiene la lista final de productos a *mostrar*
  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);
  
  // Variables de estado para la UI
  const totalProductsFound = filteredProducts.length;
  const hasMore = visibleCount < totalProductsFound;

  // --- Manejadores de eventos ---
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // --- Renderizado ---

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Lista de Precios</h1>
        <p className="text-gray-600">
          Explora nuestro catálogo completo de productos.
          {!isLoading && !error && (
            <span className="ml-2 font-medium text-blue-600">
              ({totalProductsFound} {totalProductsFound === 1 ? 'producto' : 'productos'} encontrados)
            </span>
          )}
        </p>
      </header>

      {/* --- Barra de Filtros (Sin cambios) --- */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="relative">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Buscar por Código o Nombre
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Ej: 10001, Z10, Latex..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <SearchIcon size={18} className="absolute left-3 top-9 text-gray-400" />
        </div>
      </div>

      {/* --- (NUEVO) Lista/Carrito de Productos Seleccionados --- */}
      <CartList
        cartItems={cart}
        onRemoveItem={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
        onIncrement={handleIncrementQuantity}
        onDecrement={handleDecrementQuantity}
      />
      
      {/* --- Título de la tabla de productos --- */}
      <h2 className="text-xl font-bold text-gray-800 mb-3">
        Catálogo de Productos
      </h2>

      {/* --- Tabla de Productos (MODIFICADO) --- */}
      <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          {/* (MODIFICADO) Thead actualizado */}
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Código
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripción
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio (ARS)
              </th>
              {/* (NUEVO) Columna de Acción */}
              <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acción
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              // Estado de Carga Inicial
              <tr>
                {/* (MODIFICADO) colSpan="4" */}
                <td colSpan="4" className="text-center py-12">
                  <div className="flex justify-center items-center text-gray-500">
                    <LoaderIcon size={24} className="mr-2" />
                    Cargando productos...
                  </div>
                </td>
              </tr>
            ) : error ? (
              // Estado de Error
              <tr>
                {/* (MODIFICADO) colSpan="4" */}
                <td colSpan="4" className="text-center py-12 text-red-600">
                  Error al cargar los productos: {error.message}.
                  <br/>
                  <span className="text-sm text-gray-600">¿Ejecutaste el script 'node convert.mjs' y colocaste 'products.json' en la carpeta 'public'?</span>
                </td>
              </tr>
            ) : totalProductsFound === 0 ? (
               // Estado Vacío (sin resultados)
              <tr>
                {/* (MODIFICADO) colSpan="4" */}
                <td colSpan="4" className="text-center py-12 text-gray-500">
                  No se encontraron productos que coincidan con los filtros.
                </td>
              </tr>
            ) : (
              // (MODIFICADO) Mostrar productos
              visibleProducts.map((product) => {
                // (NUEVO) Verifica si el ítem ya está en el carrito
                const isInCart = cartItemCodes.has(product.code);

                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.code}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {product.description}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-semibold text-gray-900">
                      {formatCurrency(product.price)}
                    </td>
                    {/* (NUEVO) Celda de Acción */}
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={isInCart}
                        className={`py-1 px-2.5 rounded-full flex items-center justify-center gap-1.5 transition-colors text-xs font-bold ${
                          isInCart
                            ? 'bg-green-100 text-green-700 cursor-default'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                      >
                        {isInCart ? (
                          <CheckIcon size={14} />
                        ) : (
                          <PlusCircleIcon size={14} />
                        )}
                        {isInCart ? 'Agregado' : 'Agregar'}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
            
            {/* --- Trigger de Carga (MODIFICADO) --- */}
            {!isLoading && !error && totalProductsFound > 0 && (
              <tr ref={ref}>
                {/* (MODIFICADO) colSpan="4" */}
                <td colSpan="4" className="text-center py-6">
                  {hasMore ? (
                    <div className="flex justify-center items-center text-sm text-gray-500">
                      <LoaderIcon size={20} className="mr-2" />
                      Cargando más...
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">Fin de la lista</span>
                  )}
                </td>
              </tr>
            )}
            
          </tbody>
        </table>
      </div>
    </div>
  );
}


// --- Componente Raíz (App) (Sin cambios) ---
export default function App() {
  return (
    <main className="bg-gray-50 min-h-screen font-sans">
      <PriceListPage />
    </main>
  );
}