import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import axiosInstance from "../../utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";

const fmtMoney = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(Number(n || 0));

export default function WithDrawl({ open, onClose }) {
  const { user, wallet, updateWallet } = useAuth();

  const total = useMemo(
    () => Number(wallet?.cash ?? 0) + Number(wallet?.bonus ?? 0),
    [wallet?.cash, wallet?.bonus]
  );

  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!open) return;
    setAmount("");
    setErr("");
    setMethod("upi");
    setUpiId("");
  }, [open]);

  /* ESC close */
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  /* lock scroll */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, [open]);

  const maxCoins = Math.max(0, total);
  const nAmount = Number(amount);

  const canSubmit =
    !submitting &&
    user &&
    amount !== "" &&
    Number.isFinite(nAmount) &&
    nAmount > 0 &&
    nAmount <= maxCoins &&
    method === "upi" &&
    upiId.trim().length > 0;

  const handleWithdrawClick = () => {
    if (!canSubmit || submitting) return;

    const ok = window.confirm(
      "Are you sure you want to withdraw this money?"
    );

    if (ok) submitWithdraw();
  };

  /* ✅ Withdraw logic */
  const submitWithdraw = async () => {
    if (!canSubmit) return;

    setSubmitting(true);
    setErr("");

    const prevWallet = { ...wallet };

    try {
      const currentCash = Number(wallet?.cash ?? 0);
      const currentBonus = Number(wallet?.bonus ?? 0);

      let remaining = nAmount;
      let newCash = currentCash;
      let newBonus = currentBonus;

      const fromCash = Math.min(newCash, remaining);
      newCash -= fromCash;
      remaining -= fromCash;

      const fromBonus = Math.min(newBonus, remaining);
      newBonus -= fromBonus;
      remaining -= fromBonus;

      if (remaining > 0) {
        setErr("Insufficient balance.");
        setSubmitting(false);
        return;
      }

      /* optimistic update */
      updateWallet({ cash: newCash, bonus: newBonus });

      /* backend sync */
      const res = await axiosInstance.post("/payment/withdraw", {
        userId: user?._id || user?.id,
        amount: nAmount,
        method: "upi",
        upiId: upiId.trim(),
      });

      const serverWallet =
        res?.data?.wallet || res?.data?.data?.wallet;

      if (serverWallet) updateWallet(serverWallet);

      onClose?.();
    } catch (e) {
      updateWallet(prevWallet);
      setErr(
        e?.response?.data?.message ||
          e?.message ||
          "Withdraw failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-6">
        <div className="w-full max-w-lg rounded-[28px] bg-white ring-1 ring-slate-200 shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="px-5 py-4 border-b">
            <p className="text-lg font-extrabold">Withdraw Coins</p>
            <p className="text-xs text-slate-500 mt-1">
              Available: <b>{fmtMoney(maxCoins)}</b>
            </p>
          </div>

          {/* Body */}
          <div className="p-5 space-y-4">

            {err && (
              <div className="bg-rose-50 ring-1 ring-rose-200 p-3 rounded-xl">
                <p className="text-sm font-semibold text-rose-700">
                  {err}
                </p>
              </div>
            )}

            {/* Amount */}
            <div className="bg-slate-50 ring-1 ring-slate-200 p-4 rounded-3xl">
              <p className="text-xs font-semibold">Enter amount</p>
              <div className="mt-3 flex gap-2">
                <input
                  type="number"
                  min={1}
                  max={maxCoins}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 rounded-2xl px-4 py-3 ring-1 ring-slate-200"
                  placeholder="e.g. 500"
                />
                <button
                  onClick={() => setAmount(String(maxCoins))}
                  className="px-4 py-3 rounded-2xl ring-1 ring-slate-200"
                >
                  Max
                </button>
              </div>
            </div>

            {/* UPI */}
            <div className="bg-slate-50 ring-1 ring-slate-200 p-4 rounded-3xl">
              <p className="text-xs font-semibold mb-2">
                Withdraw via UPI
              </p>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="example@upi"
                className="w-full rounded-2xl px-4 py-3 ring-1 ring-slate-200"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t flex justify-between items-center">
            <p className="text-xs text-slate-500">
              Press <b>Esc</b> to close
            </p>
            <button
              onClick={handleWithdrawClick}
              disabled={!canSubmit}
              className={`px-5 py-2.5 rounded-2xl text-sm font-semibold ${
                canSubmit
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-200 text-slate-500"
              }`}
            >
              {submitting ? "Processing..." : "Withdraw via UPI"}
            </button>
          </div>

        </div>
      </div>
    </div>,
    document.body
  );
}
