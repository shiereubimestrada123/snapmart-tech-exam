import { Fragment } from 'react';
import { Tab } from '@headlessui/react';
import { Item } from '../types/item';

type ProductsProps = {
	data: Item[];
	filteredProducts: Item[];
	handleTabClick: (value: string) => void;
	addToCart: (value: Item) => void;
}

export default function Products({ data, filteredProducts, handleTabClick, addToCart }: ProductsProps) {
	const getCategory = data.map((d) => d.category);
  const uniqueCategory = [...new Set(getCategory)];

  const defaultCategory = 'All items';
  const allCategories = [defaultCategory, ...uniqueCategory];

  return (
    <div className='flex w-3/4 gap-6'>
      <Tab.Group>
        <Tab.List className='p-4'>
          <div className='flex flex-col bg-slate-400'>
            {allCategories.map((category: string) => (
              <Tab className='p-2' key={category} as={Fragment}>
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
  )
}