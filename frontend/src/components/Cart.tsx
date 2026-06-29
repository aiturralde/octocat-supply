import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function Cart() {
  const { items, subtotal } = useCart();
  const { darkMode } = useTheme();

  return (
    <div
      className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        <h1
          className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}
        >
          Your Cart
        </h1>

        {items.length === 0 ? (
          <div
            className={`rounded-lg border p-8 text-center ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-gray-200 text-gray-600'} transition-colors duration-300`}
          >
            Your cart is empty.
          </div>
        ) : (
          <>
            <div className="space-y-3" aria-label="Cart items">
              {items.map((item) => (
                <article
                  key={item.productId}
                  className={`rounded-lg border p-4 flex items-center justify-between gap-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} transition-colors duration-300`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={`/${item.imgName}`}
                      alt={item.name}
                      className="h-16 w-16 object-contain rounded-md bg-white/50"
                    />
                    <div className="min-w-0">
                      <h2
                        className={`text-lg font-semibold truncate ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}
                      >
                        {item.name}
                      </h2>
                      <p
                        className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}
                      >
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>

                  <p
                    className={`font-semibold whitespace-nowrap ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}
                  >
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </article>
              ))}
            </div>

            <section
              className={`rounded-lg border p-5 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} transition-colors duration-300`}
              aria-label="Cart subtotal"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}
                >
                  Subtotal
                </span>
                <span
                  className={`text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-900'} transition-colors duration-300`}
                >
                  ${subtotal.toFixed(2)}
                </span>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
