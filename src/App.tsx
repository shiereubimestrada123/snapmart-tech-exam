import { useState, useEffect, Fragment } from 'react';
import { Transition, Tab, Dialog } from '@headlessui/react';

import items from './data/items.json';

type Item = {
  id: string;
  productName: string;
  description: string;
  unitPrice: number;
  imageUrl: string;
  category: string;
  quantity?: number;
};

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

  const getCategory = data.map((d) => d.category);
  const uniqueCategory = [...new Set(getCategory)];

  const defaultCategory = 'All items';
  const allCategories = [defaultCategory, ...uniqueCategory];

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
      <header className='p-6 bg-slate-500'>
        <h1 className='text-2xl font-bold text-white'>Online Shopping Store</h1>
      </header>
      <div className='flex justify-center py-6'>
        <input
          type='text'
          placeholder='Search by Product Name'
          value={productNameFilter}
          onChange={(e) => setProductNameFilter(e.target.value)}
        />
      </div>

      <div className='flex justify-between gap-6'>
        <div className='flex w-3/4 gap-6'>
          <Tab.Group>
            <Tab.List>
              <div className='flex flex-col bg-slate-400'>
                {allCategories.map((category: string) => (
                  <Tab key={category} as={Fragment}>
                    {({ selected }) => (
                      <button
                        onClick={() => handleTabClick(category)}
                        className={
                          selected
                            ? 'bg-blue-500 text-white'
                            : 'bg-white text-black'
                        }
                      >
                        {category[0].toUpperCase() + category.slice(1)}
                      </button>
                    )}
                  </Tab>
                ))}
              </div>
            </Tab.List>
            <Tab.Panels>
              <div className='flex justify-between gap-8'>
                {allCategories.map((category) => (
                  <Tab.Panel key={category}>
                    <div className='flex flex-wrap h-full gap-10 justify-evenly'>
                      {filteredProducts
                        .filter((product: Item) =>
                          category === defaultCategory
                            ? true
                            : product.category === category
                        )
                        .map((product: Item) => (
                          <div
                            key={product.id}
                            className='flex flex-col w-full bg-white rounded-lg shadow-md lg:max-w-sm'
                          >
                            <img
                              className='object-cover w-full h-48 rounded-lg'
                              src={product.imageUrl}
                              alt='image'
                            />

                            <div className='flex flex-col justify-between h-full p-4'>
                              <h4 className='text-xl font-semibold tracking-tight text-blue-600'>
                                {product.productName}
                              </h4>
                              <p className='mb-2 overflow-hidden leading-normal whitespace-break-spaces overflow-ellipsis'>
                                {product.description}
                              </p>
                              <div className='flex items-center justify-between px-4 py-2'>
                                <p className='mb-2 leading-normal'>{`$${product.unitPrice}`}</p>
                                <button
                                  className='p-2 text-sm text-blue-100 bg-blue-500 rounded shadow'
                                  onClick={() => addToCart(product)}
                                >
                                  Add to Cart
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </Tab.Panel>
                ))}
              </div>
            </Tab.Panels>
          </Tab.Group>
        </div>

        <div className='w-1/4'>
          <div className='px-6 py-4 bg-slate-500'>
            <h1 className='text-2xl'>My Cart</h1>
            <div className='text-right'>
              <button onClick={handleClearCart}>Clear Cart</button>
            </div>
          </div>
          <div className='bg-slate-200'>
            {cart.map((product: Item) => (
              <div className='flex justify-between p-4' key={product.id}>
                <img
                  className='w-10 h-10'
                  src={product.imageUrl}
                  alt={product.productName}
                />
                <div className='text-center'>
                  <p>{product.productName}</p>
                  <p>{`$${product.unitPrice}`}</p>
                </div>
                <div className='flex items-center justify-center'>
                  <button
                    className='px-2 mx-1 bg-slate-500'
                    onClick={() => decrementQuantity(product.id)}
                  >
                    -
                  </button>
                  <input
                    name='quantity'
                    type='text'
                    className='w-10 text-center'
                    value={product.quantity}
                    onChange={(e) => {
                      const newQuantity = parseInt(e.target.value, 10);
                      if (!isNaN(newQuantity)) {
                        // Ensure the new quantity is a valid number
                        setCart((prevCart) =>
                          prevCart.map((item) =>
                            item.id === product.id
                              ? { ...item, quantity: newQuantity }
                              : item
                          )
                        );
                      }
                    }}
                  />
                  <button
                    className='px-2 mx-1 bg-slate-500'
                    onClick={() => incrementQuantity(product.id)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className='px-6 py-4 bg-slate-500'>
            <p>Total Items: {totalItems}</p>
            <p>Total Amount: ${totalAmount.toFixed(2)}</p>
            <button onClick={handleCheckout}>Checkout</button>
          </div>
        </div>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex items-center justify-center min-h-full p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl'>
                  <Dialog.Title
                    as='h3'
                    className='flex items-center justify-between text-lg font-medium leading-6 text-gray-900'
                  >
                    Thank you for purchasing
                  </Dialog.Title>
                  <button onClick={handleModalClose}>Close</button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default App;
