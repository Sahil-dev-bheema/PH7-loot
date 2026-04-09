import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCartAPI, removeCartItemAPI } from "./cartSlice";

function AddToCart() {
  const dispatch = useDispatch();

  const { items, loading } = useSelector((state) => state.cart);

  // ✅ SAFE ARRAY
  const tickets = Array.isArray(items) ? items : [];

  // ✅ FETCH CART
  useEffect(() => {
    dispatch(getCartAPI());
  }, [dispatch]);

  console.log("REDUX CART:", tickets);

  // ✅ TOTAL
  const totalAmount = useMemo(() => {
    return tickets.reduce((sum, t) => {
      const price = Number(t.ticket_price || t.price || 0);
      const qty = Number(t.ticket_quantity || t.qty || 1);
      return sum + price * qty;
    }, 0);
  }, [tickets]);

  // ✅ REMOVE
  const handleRemove = (pool_id) => {
    dispatch(removeCartItemAPI({ pool_id }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="max-w-3xl mx-auto bg-white p-5 rounded-xl shadow">

        <h2 className="text-xl font-bold mb-4">Cart Summary</h2>

        {loading && <p>Loading...</p>}

        {!loading && tickets.length === 0 && (
          <p className="text-gray-500">Cart is empty</p>
        )}

        <div className="space-y-3">
          {tickets.map((t, i) => (
            <div key={t.pool_id || i} className="bg-gray-50 p-3 rounded-lg">

              <div className="flex justify-between">
                <span>{t.title || `${t.pool_title}`}</span>
                <span>₹{t.ticket_price || t.price || 0}</span>
              </div>

              <p className="text-sm text-gray-500 mt-1">
                Qty: {t.ticket_quantity || t.qty || 1}
              </p>

              <button
                onClick={() => handleRemove(t.pool_id)}
                className="mt-2 text-red-500 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div className="mt-4 flex justify-between font-bold">
          <span>Total</span>
          <span>₹{totalAmount}</span>
        </div>

        {/* CHECKOUT */}
        {tickets.length > 0 && (
          <button
            className="mt-4 w-full bg-green-600 text-white py-2 rounded"
            onClick={() => alert("Proceed to payment")}
          >
            Checkout
          </button>
        )}
      </div>
    </div>
  );
}

export default AddToCart;