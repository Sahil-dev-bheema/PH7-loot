// src/pages/PlayNow.jsx
import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import TicketNumberPicker from "./PlaynowSetup/TicketNumberPicker";

function PlayNow() {
  const location = useLocation();
  const navigate = useNavigate();

  const ticketId = location.state?.ticketId ?? null;

  const [locked, setLocked] = useState(false);
  const [purchased, setPurchased] = useState(false); // ✅ after successful buy

  const [ticketTitle, setTicketTitle] = useState(
    location.state?.ticketTitle || "Powerball Plus"
  );
  const [ticketPrice, setTicketPrice] = useState(
    Number(location.state?.ticketPrice ?? 0)
  );

  const priceText = Number(ticketPrice || 0).toLocaleString("en-IN");

  const numbers = useMemo(() => Array.from({ length: 48 }, (_, i) => i + 1), []);
  const [selected, setSelected] = useState(null);
  const [isEditing, setIsEditing] = useState(true);

  const [paying, setPaying] = useState(false);
  const [loadingTicket, setLoadingTicket] = useState(false);
  const [error, setError] = useState("");

  const { wallet, updateWallet } = useAuth();
  const walletBalance = Number(wallet?.cash ?? 0);
  const walletBonus = Number(wallet?.bonus ?? 0);
  const totalWallet = walletBalance + walletBonus;
  const walletText = totalWallet.toLocaleString("en-IN");

  useEffect(() => {
    const hasPrice = Number(location.state?.ticketPrice ?? 0) > 0;
    const hasTitle = Boolean(location.state?.ticketTitle);
    if (hasPrice && hasTitle) return;

    if (!ticketId) {
      setError("Ticket ID missing. Please go back and select a pool again.");
      return;
    }

    (async () => {
      try {
        setLoadingTicket(true);
        setError("");

        const res = await axiosInstance.get("/pool");
        if (!res.data?.success) throw new Error("Failed to fetch pools.");

        const list = res.data?.data || [];
        const found = list.find((p) => String(p.id) === String(ticketId));
        if (!found) throw new Error("Ticket not found.");

        setTicketTitle(found.title || "Powerball Plus");
        setTicketPrice(Number(found.price || 0));
      } catch (e) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          "Failed to fetch ticket details.";
        setError(msg);
      } finally {
        setLoadingTicket(false);
      }
    })();
  }, [ticketId, location.state]);

  const debitFromWallet = (amount, walletObj) => {
    const cash = Number(walletObj?.cash ?? 0);
    const bonus = Number(walletObj?.bonus ?? 0);
    const total = cash + bonus;

    if (amount <= 0) return { ok: false, message: "Invalid amount." };
    if (total < amount)
      return { ok: false, message: "Insufficient wallet balance." };

    const cashUsed = Math.min(cash, amount);
    const remaining = amount - cashUsed;
    const bonusUsed = remaining;

    const nextWallet = { cash: cash - cashUsed, bonus: bonus - bonusUsed };
    return { ok: true, nextWallet, breakdown: { cashUsed, bonusUsed } };
  };

  // ✅ selection handlers (blocked after purchase)
  const handlePick = (num) => {
    if (purchased) return;
    if (locked && selected !== num) return;
    setSelected(num);
    setLocked(true);
    setIsEditing(true);
  };

  const handleRandomPick = () => {
    if (purchased) return;
    if (locked) return;
    const randomIndex = Math.floor(Math.random() * 48);
    setSelected(randomIndex + 1);
    setLocked(true);
    setIsEditing(true);
  };

  const handleClear = () => {
    if (purchased) return;
    setSelected(null);
    setLocked(false);
    setIsEditing(true);
    setError("");
  };

  const handleEdit = () => {
    if (purchased) return;
    setLocked(false);
    setIsEditing(true);
  };

  const handleDone = () => {
    if (!selected) return;
    setIsEditing(false);
  };

  // ✅ after purchase -> reset flow to buy again
  const handleBuyAnother = () => {
    setPurchased(false);
    setSelected(null);
    setLocked(false);
    setIsEditing(true);
    setError("");
  };

  const handlePayAndPlay = async () => {
    setError("");

    const token =
      localStorage.getItem("user_token") || localStorage.getItem("token");
    if (!token) {
      setError("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    if (!ticketId) {
      setError("Ticket ID missing. Please go back and select a pool again.");
      return;
    }

    if (!ticketPrice || ticketPrice <= 0) {
      setError("Ticket price not available. Please refresh or go back.");
      return;
    }

    if (!selected) {
      setError("Please select a number first.");
      return;
    }

    const ok = window.confirm(`Pay ₹${priceText} from your wallet?`);
    if (!ok) return;

    const result = debitFromWallet(ticketPrice, wallet);
    if (!result.ok) {
      setError(result.message || "Payment failed.");
      return;
    }

    const prevWallet = { cash: walletBalance, bonus: walletBonus };

    try {
      setPaying(true);

      updateWallet(result.nextWallet);

      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = storedUser?.id || storedUser?._id || null;

      await axiosInstance.post("/ticket/buy", {
        pool_name: ticketTitle,
        user_number: selected,
        ticket_amount: ticketPrice,
        draw_number: ticketId,
        payment_status: "PAID",
        user_id: userId,
        wallet: walletBalance,
      });

      alert(`✅ Ticket purchased! Number: ${selected}`);

      // ✅ lock + blur now, but allow Buy Another Ticket
      setPurchased(true);
      setIsEditing(false);
      setLocked(true);
    } catch (e) {
      updateWallet(prevWallet);

      const status = e?.response?.status;
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Payment failed due to server error.";

      if (status === 401) {
        setError("Unauthorized (401). Please login again.");
        return;
      }

      setError(msg);
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left */}
        <div className="lg:col-span-8">
          <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm">
            <div className="h-1.5 bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400" />

            <div className="p-5 border-b bg-gradient-to-br from-slate-900 to-slate-800 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/70">Ticket</p>
                  <h2 className="text-lg font-semibold">{ticketTitle}</h2>
                  {!!ticketId && (
                    <p className="text-[11px] text-white/60 mt-0.5">
                      Ticket ID: {ticketId}
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <p className="text-xs text-white/70">Selection</p>
                  <p className="text-sm font-semibold">
                    {selected ? `#${selected}` : "None"}
                  </p>
                </div>
              </div>

              <div className="mt-3 text-xs text-white/70 flex items-center justify-between">
                <span>
                  {purchased
                    ? "Ticket purchased"
                    : isEditing
                    ? "Pick 1 number"
                    : "Ticket confirmed"}
                </span>
                <span className="text-white/80">
                  {selected ? "1/1 selected" : "0/1 selected"}
                </span>
              </div>

              <div className="mt-3 text-xs text-white/70 flex items-center justify-between">
                <span>
                  Ticket Price: {loadingTicket ? "Loading..." : `₹${priceText}`}
                </span>
                <span>Wallet: ₹{walletText}</span>
              </div>
            </div>

            <div className="p-5">
              {error ? (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Your chosen number</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    {selected ? selected : "—"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {!isEditing && !purchased && (
                    <button
                      onClick={handleEdit}
                      className="px-4 py-2 rounded-full text-sm font-semibold border border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100 transition"
                      type="button"
                    >
                      Edit
                    </button>
                  )}

                  <button
                    onClick={handleClear}
                    disabled={purchased}
                    className={[
                      "px-4 py-2 rounded-full text-sm font-semibold border transition",
                      purchased
                        ? "border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
                    ].join(" ")}
                    type="button"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* ✅ Picker stays visible. After purchase it becomes blurred+locked */}
              <TicketNumberPicker
                max={48}
                selected={selected}
                purchased={purchased}
                onPick={handlePick}
                onRandom={handleRandomPick}
                onClear={handleClear}
              />

              <div className="mt-6 flex items-center justify-end gap-2">
                {purchased ? (
                  <button
                    onClick={handleBuyAnother}
                    className="px-5 py-2 rounded-full text-sm font-semibold transition bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98]"
                    type="button"
                  >
                    ➕ Buy Another Ticket
                  </button>
                ) : isEditing ? (
                  <button
                    onClick={handleDone}
                    disabled={!selected}
                    className={[
                      "px-5 py-2 rounded-full text-sm font-semibold transition",
                      selected
                        ? "bg-orange-500 text-white hover:bg-orange-600 active:scale-[0.98]"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed",
                    ].join(" ")}
                    type="button"
                  >
                    Confirm Ticket
                  </button>
                ) : (
                  <button
                    onClick={handlePayAndPlay}
                    disabled={paying || loadingTicket || !ticketPrice}
                    className={[
                      "px-5 py-2 rounded-full text-sm font-semibold transition",
                      paying || loadingTicket || !ticketPrice
                        ? "bg-emerald-300 text-white cursor-not-allowed"
                        : "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98]",
                    ].join(" ")}
                    type="button"
                  >
                    {paying ? "Processing..." : `Pay ₹${priceText} via Wallet`}
                  </button>
                )}
              </div>

              {!isEditing && !purchased && totalWallet < ticketPrice ? (
                <p className="mt-3 text-xs text-red-600">
                  Insufficient wallet balance. Please add money.
                </p>
              ) : null}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="lg:col-span-4">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
            <h3 className="text-base font-semibold text-gray-900">
              Ticket Summary
            </h3>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Lottery</span>
                <span className="font-semibold text-gray-900">{ticketTitle}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Selected</span>
                <span className="font-semibold text-gray-900">
                  {selected ? selected : "—"}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Ticket Price</span>
                <span className="font-semibold text-gray-900">
                  {loadingTicket ? "Loading..." : `₹${priceText}`}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Wallet Total</span>
                <span className="font-semibold text-gray-900">₹{walletText}</span>
              </div>
            </div>

            <button
              onClick={() => navigate(-1)}
              className="mt-4 w-full rounded-xl px-4 py-3 text-sm font-semibold border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition"
              type="button"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayNow;
