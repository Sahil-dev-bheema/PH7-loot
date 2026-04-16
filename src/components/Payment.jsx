import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";

export default function Payment({
  open,
  onClose,
  onSubmit,
  userId = 1,
  amount = 0,
  title = "Payment",
  package_id = null,
}) {
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handlePay = async () => {
    try {
      setLoading(true);

      // ❌ COMMENTED OUT RAZORPAY FLOW (DISABLED)

      /*
      const ok = await loadRazorpay();

      if (!ok || !window.Razorpay) {
        toast.error("Razorpay failed to load");
        setLoading(false);
        return;
      }

      const { data } = await axiosInstance.post("/payment/create-order", {
        amount,
        userId,
        currency: "INR",
      });

      const order = data?.order;

      if (!order?.id) {
        toast.error("Order not created");
        setLoading(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "App Payment",
        description: title,
        order_id: order.id,

        handler: async function (response) {
          await axiosInstance.post("/payment/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            userId,
            package_id,
          });

          toast.success("Payment Successful");

          onSubmit?.({
            ...response,
            amount,
          });

          onClose?.();
          setLoading(false);
        },

        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },

        theme: {
          color: "#14b8a6",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      */

      // ✅ FAKE PAYMENT FLOW (DUMMY SUCCESS)
      await new Promise((res) => setTimeout(res, 1500));

      const fakeResponse = {
        razorpay_payment_id: "fake_pay_" + Date.now(),
        razorpay_order_id: "fake_order_" + Date.now(),
        razorpay_signature: "fake_signature",
        amount,
        status: "success",
      };

      console.log("🟢 Mock Payment Success:", fakeResponse);

      toast.success("Payment Successful (Mock)");

      onSubmit?.(fakeResponse);
      onClose?.();

    } catch (err) {
      console.error(err);
      toast.error("Payment failed (mock)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="flex items-center justify-center h-full">
        <div className="bg-white p-5 rounded-xl w-[400px] z-50">

          <h2 className="text-lg font-bold">{title}</h2>

          <p className="mt-2 text-gray-600">
            Amount: ₹{amount}
          </p>

          <button
            onClick={handlePay}
            disabled={loading}
            className="mt-5 w-full bg-teal-500 text-white py-2 rounded"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>

        </div>
      </div>
    </div>
  );
}