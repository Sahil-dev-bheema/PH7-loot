import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCartAPI, removeCartItemAPI } from "../../features/cartSlice";
import Payment from "../Payment";
import axiosInstance from "../../utils/axiosInstance";
import {
  useGetWalletQuery,
  useUpdateWalletMutation,
} from "../../service/userApi";

function AddToCart() {
  const dispatch = useDispatch();

  const { items, loading } = useSelector((state) => state.cart);
  const { user, bonus } = useSelector((state) => state.auth);

  const [openPayment, setOpenPayment] = useState(false);

  const [updateWallet] = useUpdateWalletMutation();

  const userId = user?.id || user?._id;

  const { data: walletData } = useGetWalletQuery(userId, {
    skip: !userId,
  });

  const walletBalance = Number(walletData?.cash ?? 0);
  const totalAvailable = walletBalance + Number(bonus || 0);
  const tickets = Array.isArray(items) ? items : [];

  useEffect(() => {
    dispatch(getCartAPI(user?.id || user?._id));
  }, [dispatch]);

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

  const handleCheckout = () => {
    if (!tickets.length) return alert("Cart is empty");
    if (!user) return alert("Please login first");

    if (totalAmount > totalAvailable)
      return alert("Insufficient balance (wallet + bonus)");
    setOpenPayment(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-extrabold text-gray-800">
            Cart Summary
          </h2>

          <div className="text-sm font-semibold text-teal-600">
            Wallet: ₹{walletBalance}
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="space-y-3">
            <div className="h-16 bg-gray-100 animate-pulse rounded-xl" />
            <div className="h-16 bg-gray-100 animate-pulse rounded-xl" />
          </div>
        )}

        {/* EMPTY */}
        {!loading && tickets.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            🛒 Your cart is empty
          </div>
        )}

        {/* ITEMS */}
        <div className="space-y-4">
          {tickets.map((t, i) => {
            const price = Number(t.ticket_price ?? t.price ?? 0);
            const qty = Number(t.ticket_quantity ?? t.qty ?? 1);

            return (
              <div
                key={t.pool_id || i}
                className="bg-gray-50 p-4 rounded-xl border hover:shadow-sm transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {t.title || t.pool_title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Qty: {qty}</p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-gray-900">₹{price * qty}</p>
                    <button
                      onClick={() => handleRemove(t.pool_id)}
                      className="text-xs text-red-500 mt-1 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* TOTAL SECTION */}
        {tickets.length > 0 && (
          <>
            <div className="mt-6 border-t pt-4 flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-700">
                Total Amount
              </span>
              <span className="text-xl font-extrabold text-gray-900">
                ₹{totalAmount}
              </span>
            </div>

            {/* CHECKOUT BUTTON */}
            <button
              onClick={handleCheckout}
              className="mt-5 w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold shadow hover:shadow-md active:scale-[0.98] transition"
            >
              Proceed to Checkout
            </button>
          </>
        )}

        {/* PAYMENT */}
        <Payment
          key={totalAmount}
          open={openPayment}
          onClose={() => setOpenPayment(false)}
          amount={totalAmount}
          title="Cart Payment"
          userId={userId}
          package_id="cart"
          onSubmit={async () => {
            try {
              const payload = {
                userId,
                items: tickets.map((t) => ({
                  pool_id: t.pool_id,
                  quantity: Number(t.ticket_quantity ?? t.qty ?? 1),
                  price: Number(t.ticket_price ?? t.price ?? 0),
                })),
              };

              await axiosInstance.post("/ticket/buy", payload);

              let remainingAmount = totalAmount;

              let currentBonus = Number(bonus || 0);
              let currentWallet = walletBalance;

              // 👉 STEP 1: deduct from bonus
              let usedBonus = Math.min(currentBonus, remainingAmount);
              currentBonus -= usedBonus;
              remainingAmount -= usedBonus;

              // 👉 STEP 2: deduct remaining from wallet
              currentWallet -= remainingAmount;
              await updateWallet({
                userId,
                amount: currentWallet,
              });
              dispatch(setBonus(currentBonus));
              dispatch(getCartAPI());
              setOpenPayment(false);

              alert("Payment Successful & Tickets Purchased");
            } catch (err) {
              console.error(err);
              alert("Payment failed");
            }
          }}
        />
      </div>
    </div>
  );
}

export default AddToCart;
