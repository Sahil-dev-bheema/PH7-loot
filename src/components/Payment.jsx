import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const cn = (...a) => a.filter(Boolean).join(" ");

const isValidUpi = (upi) =>
  /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/.test(upi.trim());

export default function Payment({
  open,
  onClose,
  onSubmit,
  userId = 1,
  amount = 0,
  title = "Selected Package",
  package_id = null, // ✅ add this
}) {
  const [upiId, setUpiId] = useState("");
  const [provider, setProvider] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  if (!open) return null;

  const markTouched = (k) => setTouched((p) => ({ ...p, [k]: true }));

  const errors = {
    upiId: !upiId
      ? "UPI ID required"
      : !isValidUpi(upiId)
      ? "Invalid UPI ID"
      : null,
    provider: !provider ? "Select payment app" : null,
    package_id: !package_id ? "Package not selected" : null,
    amount: !amount || Number(amount) <= 0 ? "Invalid amount" : null,
  };

  const close = () => {
    if (loading) return;
    setUpiId("");
    setProvider("");
    setTouched({});
    onClose?.();
  };

  const handlePay = async () => {
    markTouched("upiId");
    markTouched("provider");

    if (errors.upiId || errors.provider || errors.package_id || errors.amount) {
      if (errors.package_id) alert(errors.package_id);
      if (errors.amount) alert(errors.amount);
      return;
    }

    const amt = Number(amount);

    try {
      setLoading(true);

      // ✅ 1) Create order (send userId + amount + package_id)
      const { data } = await axiosInstance.post(`/payment/create-order`, {
        userId,
        amount: amt,
        package_id,
        meta: {
          upiId: upiId.trim(),
          provider,
          title,
        },
      });

      if (!data?.success || !data?.order?.id) {
        alert("Order creation failed");
        return;
      }

      const orderId = data.order.id;

      const ok = window.confirm(`Pay ₹${amt}? (Dummy Payment)`);
      if (!ok) return;

      // ✅ 2) Verify payment (send all required fields)
      const paymentId = "pay_dummy_" + Date.now();

      const verifyRes = await axiosInstance.post(`/payment/verify`, {
        userId,
        order_id: orderId,
        payment_id: paymentId,
        amount: amt,
        package_id,
      });

      if (verifyRes?.data?.success) {
        alert("✅ Payment Successful");

        // ✅ callback to parent with everything
        onSubmit?.({
          userId,
          orderId,
          paymentId,
          amount: amt,
          package_id,
        });

        close();
      } else {
        alert(verifyRes?.data?.message || "Payment failed");
      }
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          err?.message ||
          "Payment error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999]">
      <div className="absolute inset-0 bg-black/40" onClick={close} />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border">
          {/* Header */}
          <div className="px-5 py-4 border-b flex justify-between">
            <div>
              <p className="font-bold text-gray-900">Payment</p>
              <p className="text-xs text-gray-500">Buy Package</p>
            </div>

            <button
              onClick={close}
              disabled={loading}
              className="text-sm px-3 py-1 border rounded-lg"
              type="button"
            >
              Close
            </button>
          </div>

          {/* Body */}
          <div className="p-5">
            <p className="text-sm text-gray-600">Purchasing:</p>
            <p className="font-bold text-lg text-gray-900">{title}</p>

            <div className="mt-4 rounded-xl border bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Amount</p>
              <p className="text-3xl font-bold">
                ₹{Number(amount).toLocaleString("en-IN")}
              </p>

              {/* Optional debug info */}
              <p className="mt-1 text-xs text-gray-500">
                Package ID: <span className="font-semibold">{package_id ?? "—"}</span>
              </p>
            </div>

            {/* UPI */}
            <div className="mt-4">
              <label className="text-sm font-semibold">UPI ID</label>
              <input
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                onBlur={() => markTouched("upiId")}
                placeholder="name@bank"
                className={cn(
                  "mt-2 w-full border rounded-xl px-4 py-3 outline-none",
                  touched.upiId && errors.upiId ? "border-red-500" : "border-gray-200"
                )}
              />
              {touched.upiId && errors.upiId && (
                <p className="text-xs text-red-600 mt-1">{errors.upiId}</p>
              )}
            </div>

            {/* Provider */}
            <div className="mt-4">
              <p className="text-sm font-semibold">Payment App</p>

              <div className="mt-2 grid grid-cols-3 gap-2">
                {["paytm", "phonepe", "gpay"].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setProvider(p);
                      markTouched("provider");
                    }}
                    className={cn(
                      "border px-3 py-2 rounded-lg capitalize",
                      provider === p
                        ? "border-teal-400 bg-teal-50"
                        : "border-gray-200"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>

              {touched.provider && errors.provider && (
                <p className="text-xs text-red-600 mt-1">{errors.provider}</p>
              )}
            </div>

            {/* Pay */}
            <button
              onClick={handlePay}
              disabled={loading}
              className="w-full mt-6 py-3 rounded-xl text-white font-semibold bg-teal-500 hover:bg-teal-600 disabled:opacity-60"
              type="button"
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}