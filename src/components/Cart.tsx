import { Item } from "../types/item";

type CartProps = {
	handleClearCart: () => void;
	cart: Item[];
	decrementQuantity: (value: string) => void;
	incrementQuantity: (value: string) => void;
	setCart: React.Dispatch<React.SetStateAction<Item[]>>;
	totalItems: number;
	totalAmount: number;
	handleCheckout: () => void;
}

export default function Cart({ handleClearCart, cart, decrementQuantity, setCart, incrementQuantity, totalItems, totalAmount, handleCheckout }: CartProps) {
  return (
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
  )
} 