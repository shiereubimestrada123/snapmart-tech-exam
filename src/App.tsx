import { useState, useEffect, Fragment } from 'react';

import Header from './components/Header';
import SearchField from './components/SearchField';
import Products from './components/Products';
import Cart from './components/Cart';
import Modal from './components/Modal'

import { Item } from './types/item';
import items from './data/items.json';

function App() {
  const [data, setData] = useState<Item[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Item[]>(data);
  const [productNameFilter, setProductNameFilter] = useState<string>('');
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);

  const [cart, setCart] = useState<Item[]>(
    JSON.parse(localStorage.getItem('cart') || '[]')
  );

  const defaultCategory = 'All items';

  const [selectedCategory, setSelectedCategory] =
    useState<string>(defaultCategory);

  useEffect(() => {
    setData(items);
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));

    const total = cart.reduce((total, item) => total + (item.quantity || 0), 0);
    setTotalItems(total);
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));

    const total = cart.reduce(
      (total, item) => total + item.unitPrice * (item.quantity || 0),
      0
    );
    setTotalAmount(total);
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    setFilteredProducts(data);
  }, [data]);

  useEffect(() => {
    if (productNameFilter.trim() === '') {
      if (selectedCategory === defaultCategory) {
        setFilteredProducts(data);
      } else {
        const filteredProduct = data.filter(
          (d) => d.category === selectedCategory
        );
        setFilteredProducts(filteredProduct);
      }
    } else {
      const filteredProduct = data.filter((product) =>
        product.productName
          .toLowerCase()
          .includes(productNameFilter.toLowerCase())
      );
      setFilteredProducts(filteredProduct);
    }
  }, [productNameFilter, selectedCategory, data]);

  const handleTabClick = (category: string) => {
    setSelectedCategory(category);

    if (category === defaultCategory) {
      setFilteredProducts(data);
    } else {
      const filteredProduct = data.filter((d) => d.category === category);
      setFilteredProducts(filteredProduct);
    }
  };

  const addToCart = (product: Item) => {
    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
      const updatedCart = cart.map((item) => {
        if (item.id === product.id) {
          return { ...item, quantity: item.quantity! + 1 };
        } else {
          return item;
        }
      });
      setCart(updatedCart);
    } else {
      const updatedCart = [...cart, { ...product, quantity: 1 }];
      setCart(updatedCart);
    }
  };

  const incrementQuantity = (productId: string) => {
    const updatedCart = cart.map((item) => {
      if (item.id === productId) {
        return { ...item, quantity: item.quantity! + 1 };
      } else {
        return item;
      }
    });

    setCart(updatedCart);
  };

  const decrementQuantity = (productId: string) => {
    const updatedCart = cart.map((item) => {
      if (item.id === productId) {
        if (item.quantity! > 1) {
          return { ...item, quantity: item.quantity! - 1 };
        } else {
          return null;
        }
      } else {
        return item;
      }
    });

    const filteredCart = updatedCart.filter((item) => item !== null);
    setCart(filteredCart);
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const handleClearCart = () => {
    clearCart();
  };

  const handleCheckout = () => {
    setIsOpen(true);
  };

  const handleModalClose = () => {
    clearCart();
    setIsOpen(false);
  };

  return (
    <>
     <Header />
     <SearchField productNameFilter={productNameFilter} setProductNameFilter={setProductNameFilter} />
      <div className='flex justify-between gap-6'>
        <Products data={data} filteredProducts={filteredProducts} handleTabClick={handleTabClick} addToCart={addToCart} />
        <Cart 
          cart={cart}
          decrementQuantity={decrementQuantity}
          setCart={setCart} incrementQuantity={incrementQuantity}
          totalItems={totalItems}
          totalAmount={totalAmount}
          handleCheckout={handleCheckout}
          handleClearCart={handleClearCart}
        />
      </div>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} handleModalClose={handleModalClose} />
    </>
  );
}

export default App;
