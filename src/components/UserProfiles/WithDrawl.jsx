import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const fmtMoney = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(Number(n || 0));

export default function WithDrawl({ open, onClose }) {
  // =========================
  // ✅ REDUX STATE (FIXED)
  // =========================
  const user = useSelector((state) => state.auth.user);
  const wallet = useSelector((state) => state.user.wallet);

  // =========================
  // WALLET CALCULATION
  // =========================
  const total = useMemo(() => {
    const cash = Number(wallet?.cash ?? 0);
    const bonus = Number(wallet?.bonus ?? 0);

    return cash + bonus;
  }, [wallet]);

  const maxCoins = Math.max(0, total);

  // =========================
  // LOCAL STATE
  // =========================
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("upi");

  const [upiId, setUpiId] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [accountHolder, setAccountHolder] = useState("");

  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  // =========================
  // RESET ON OPEN
  // =========================
  useEffect(() => {
    if (!open) return;

    setAmount("");
    setErr("");
    setSubmitting(false);

    setMethod("upi");
    setUpiId("");

    setBankAccount("");
    setIfsc("");
    setAccountHolder("");

    setFieldErrors({});
  }, [open]);

  // =========================
  // ESC CLOSE
  // =========================
  useEffect(() => {
    if (!open) return;

    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // =========================
  // SCROLL LOCK
  // =========================
  useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // =========================
  // VALIDATION
  // =========================
  const nAmount = Number(amount);

  const isValidAmount =
    amount !== "" &&
    Number.isFinite(nAmount) &&
    nAmount > 0 &&
    nAmount <= maxCoins;

  const isValidUpi = method === "upi" && upiId.trim().length > 0;

  const isValidBank =
    method === "bank" &&
    /^[0-9]{8,18}$/.test(bankAccount.trim()) &&
    /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.trim().toUpperCase()) &&
    accountHolder.trim().length >= 3;

  const canSubmit =
    !submitting && user && isValidAmount && (isValidUpi || isValidBank);

  // =========================
  // BANK VALIDATION
  // =========================
  const validateBankFields = () => {
    const errors = {};

    if (!/^[0-9]{8,18}$/.test(bankAccount.trim())) {
      errors.bankAccount = "Invalid account number";
    }

    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.trim().toUpperCase())) {
      errors.ifsc = "Invalid IFSC code";
    }

    if (accountHolder.trim().length < 3) {
      errors.accountHolder = "Invalid account holder name";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // =========================
  // SUBMIT
  // =========================
  const submitWithdraw = async () => {
    if (!canSubmit) return;

    if (method === "bank" && !validateBankFields()) return;

    setSubmitting(true);
    setErr("");

    const tId = toast.loading("Submitting withdraw request...");

    try {
      const payload = {
        userId: user?._id || user?.id,
        amount: nAmount,
        method,
        upi_id: method === "upi" ? upiId.trim() : null,
        bank_account: method === "bank" ? bankAccount.trim() : null,
        ifsc: method === "bank" ? ifsc.trim().toUpperCase() : null,
        account_holder: method === "bank" ? accountHolder.trim() : null,
      };

      await axiosInstance.post("/payment/withdraw-request", payload);

      toast.dismiss(tId);
      toast.success("Withdraw request submitted successfully");

      setTimeout(() => onClose?.(), 800);
    } catch (e) {
      toast.dismiss(tId);

      const msg =
        e?.response?.data?.message || e?.message || "Request failed";

      setErr(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // UI GUARD
  // =========================
  if (!open) return null;

  // =========================
  // UI
  // =========================
  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-2xl p-5">

          <h2 className="text-lg font-bold">Withdraw</h2>

          <p className="text-sm text-gray-500">
            Available: {fmtMoney(maxCoins)}
          </p>

          {/* AMOUNT */}
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full mt-3 border p-2 rounded"
            placeholder="Enter amount"
          />

          {!isValidAmount && amount !== "" && (
            <p className="text-xs text-red-500 mt-1">
              Invalid amount
            </p>
          )}

          {/* METHOD */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setMethod("upi")}
              className={`flex-1 p-2 rounded ${
                method === "upi"
                  ? "bg-black text-white"
                  : "bg-gray-100"
              }`}
            >
              UPI
            </button>

            <button
              onClick={() => setMethod("bank")}
              className={`flex-1 p-2 rounded ${
                method === "bank"
                  ? "bg-black text-white"
                  : "bg-gray-100"
              }`}
            >
              Bank
            </button>
          </div>

          {/* UPI */}
          {method === "upi" && (
            <input
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full mt-3 border p-2 rounded"
              placeholder="UPI ID"
            />
          )}

          {/* BANK */}
          {method === "bank" && (
            <div className="space-y-2 mt-3">
              <input
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="Account Number"
              />

              <input
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                className="w-full border p-2 rounded"
                placeholder="IFSC Code"
              />

              <input
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="Account Holder Name"
              />

              {Object.values(fieldErrors).map((err, i) => (
                <p key={i} className="text-xs text-red-500">
                  {err}
                </p>
              ))}
            </div>
          )}

          {/* ERROR */}
          {err && (
            <p className="text-red-500 text-sm mt-2">{err}</p>
          )}

          {/* SUBMIT */}
          <button
            onClick={submitWithdraw}
            disabled={!canSubmit}
            className="mt-4 w-full bg-green-600 text-white p-2 rounded disabled:bg-gray-300"
          >
            {submitting ? "Processing..." : "Withdraw"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}