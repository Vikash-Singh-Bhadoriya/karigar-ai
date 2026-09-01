import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Product } from '../types';
import { getProduct, getImageUrl, placeOrder } from '../api/client';

function formatPrice(price: number | null): string {
  if (price == null) return '—';
  return `₹${price.toLocaleString('en-IN')}`;
}

export default function OrderPage() {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!productId) return;
    getProduct(Number(productId))
      .then(setProduct)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) { setError('Please enter your name'); return; }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setSubmitting(true);
    try {
      await placeOrder({
        product_id: Number(productId),
        buyer_name: name.trim(),
        buyer_phone: phone.trim(),
        buyer_message: message.trim() || undefined,
      });
      setSubmitted(true);
    } catch {
      setError('Order failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block w-10 h-10 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-20 px-4">
        <span className="text-6xl block mb-4">✅</span>
        <h2 className="text-2xl font-bold text-stone-900 mb-3">
          ऑर्डर सफलतापूर्वक भेजा गया!
        </h2>
        <p className="text-stone-600 mb-2">
          Order sent successfully! The artisan will contact you soon.
        </p>
        <p className="text-stone-500 text-sm mb-8">
          कारीगर जल्द ही आपसे संपर्क करेंगे।
        </p>
        <Link
          to="/browse"
          className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          ← Browse More Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link to={`/product/${productId}`} className="text-amber-700 hover:underline text-sm mb-6 inline-block">
        ← Back to Product
      </Link>

      <h1 className="text-2xl font-bold text-stone-900 mb-6">Place Order / ऑर्डर भेजें</h1>

      {/* Product Summary */}
      {product && (
        <div className="flex gap-4 bg-stone-50 rounded-xl p-4 mb-8 border border-stone-200">
          <img
            src={getImageUrl(product.image_url)}
            alt={product.name}
            className="w-20 h-20 object-cover rounded-lg"
          />
          <div>
            <h3 className="font-semibold text-stone-900">{product.name}</h3>
            <p className="text-sm text-stone-500">{product.category}</p>
            <p className="text-lg font-bold text-amber-700 mt-1">
              {formatPrice(product.price)}
            </p>
          </div>
        </div>
      )}

      {/* Order Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Your Name / आपका नाम *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full border border-stone-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Phone Number / फ़ोन नंबर *
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="10-digit phone number"
            className="w-full border border-stone-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Message / संदेश (Optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Any special instructions or questions for the artisan..."
            rows={3}
            className="w-full border border-stone-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none"
          />
        </div>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white py-3 rounded-xl font-semibold text-lg transition-colors shadow-lg shadow-amber-200"
        >
          {submitting ? 'Sending...' : 'Submit Order / ऑर्डर भेजें'}
        </button>
      </form>
    </div>
  );
}
