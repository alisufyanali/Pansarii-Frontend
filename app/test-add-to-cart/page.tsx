// app/test-add-to-cart/page.tsx
"use client";

import { useCart } from "../context/CartContext";

export default function TestAddToCartPage() {
  const { cartItems, addToCart, getCartCount } = useCart();

  const testProducts = [
    {
      id: '1',
      img: '/images/products/honey.jpg',
      nameEn: 'Pure Honey',
      nameUr: 'خالص شہد',
      price: 999,
      size: '500ml'
    },
    {
      id: '2', 
      img: '/images/products/coconut-oil.jpg',
      nameEn: 'Coconut Oil',
      nameUr: 'ناریل کا تیل',
      price: 699,
      size: '250ml'
    }
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Add to Cart</h1>
      
      <div className="mb-6">
        <p>Cart Count: {getCartCount()}</p>
        <p>Cart Items: {cartItems.length}</p>
        <pre className="bg-gray-100 p-4 rounded mt-2 text-sm">
          {JSON.stringify(cartItems, null, 2)}
        </pre>
      </div>

      <div className="space-y-4">
        {testProducts.map(product => (
          <div key={product.id} className="p-4 border rounded-lg">
            <h3 className="font-semibold">{product.nameEn}</h3>
            <p>Price: PKR {product.price}</p>
            <button
              onClick={() => addToCart(product)}
              className="mt-2 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <a href="/cart" className="px-6 py-3 bg-blue-700 text-white rounded-lg font-semibold">
          Go to Cart Page →
        </a>
      </div>
    </div>
  );
}