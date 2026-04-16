import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCartAPI, removeCartItemAPI } from "../../features/cartSlice";
import Payment from "../Payment";
import axiosInstance from "../../utils/axiosInstance";

function AddToCart() {
  const dispatch = useDispatch();

  // ✅ REDUX ONLY
  const { items, loading } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [openPayment, setOpenPayment] = useState(false);

  const tickets = Array.isArray(items) ? items : [];

  // FETCH CART
  useEffect(() => {
    dispatch(getCartAPI());
  }, [dispatch]);

  // SAFE TOTAL CALCULATION
  const totalAmount = useMemo(() => {
    return tickets.reduce((sum, t) => {
      const price = Number(t.ticket_price ?? t.price ?? 0);
      const qty = Number(t.ticket_quantity ?? t.qty ?? 1);

      if (isNaN(price) || isNaN(qty)) return sum;

      return sum + price * qty;
    }, 0);
  }, [tickets]);

  const handleRemove = (pool_id) => {
    if (!pool_id) return;
    dispatch(removeCartItemAPI({ pool_id }));
  };

  // CHECKOUT
  const handleCheckout = () => {
    if (!tickets.length) {
      alert("Cart is empty");
      return;
    }

    if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
      alert("Invalid cart total");
      return;
    }

    if (!user) {
      alert("Please login first");
      return;
    }

    setOpenPayment(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="max-w-3xl mx-auto bg-white p-5 rounded-xl shadow">

        <h2 className="text-xl font-bold mb-4">Cart Summary</h2>

        {loading && <p>Loading...</p>}

        {!loading && tickets.length === 0 && (
          <p className="text-gray-500">Cart is empty</p>
        )}

        {/* ITEMS */}
        <div className="space-y-3">
          {tickets.map((t, i) => (
            <div key={t.pool_id || i} className="bg-gray-50 p-3 rounded-lg">

              <div className="flex justify-between">
                <span>{t.title || t.pool_title}</span>
                <span>₹{Number(t.ticket_price ?? t.price ?? 0)}</span>
              </div>

              <p className="text-sm text-gray-500 mt-1">
                Qty: {Number(t.ticket_quantity ?? t.qty ?? 1)}
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
            onClick={handleCheckout}
            className="mt-4 w-full bg-green-600 text-white py-2 rounded"
          >
            Checkout
          </button>
        )}

        {/* PAYMENT MODAL */}
        <Payment
          key={totalAmount}
          open={openPayment}
          onClose={() => setOpenPayment(false)}
          amount={totalAmount}
          title="Cart Payment (Mock)"

          // ✅ FIXED USER ID SOURCE
          userId={user?.id || user?._id}

          package_id="cart"
          onSubmit={async () => {
            try {
              console.log("🟢 Payment success → creating tickets");

              if (!tickets.length) throw new Error("Cart empty");

              const payload = {
                userId: user?.id || user?._id,
                items: tickets.map((t) => ({
                  pool_id: t.pool_id,
                  quantity: Number(t.ticket_quantity ?? t.qty ?? 1),
                  price: Number(t.ticket_price ?? t.price ?? 0),
                })),
              };

              const res = await axiosInstance.post("/ticket/buy", payload);

              console.log("✅ Ticket purchase success:", res.data);

              dispatch(getCartAPI());
              setOpenPayment(false);

              alert("Payment Successful & Tickets Purchased");
            } catch (err) {
              console.error("❌ Ticket purchase failed:", err);
              alert("Payment succeeded but ticket purchase failed");
            }
          }}
        />

      </div>
    </div>
  );
}

export default AddToCart;