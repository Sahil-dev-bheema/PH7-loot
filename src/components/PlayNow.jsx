// src/pages/PlayNow.jsx
import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

function PlayNow() {
  const location = useLocation();
  const navigate = useNavigate();

  const ticketId = location.state?.ticketId ?? null;

  const [ticketTitle, setTicketTitle] = useState(
    location.state?.ticketTitle || "RAJSHREE 10 EVENING"
  );
  const [ticketPrice, setTicketPrice] = useState(
    Number(location.state?.ticketPrice ?? 10)
  );

  const numbers = useMemo(() => Array.from({ length: 50 }, (_, i) => i + 1), []);

  const [tickets, setTickets] = useState([]);
  const [visibleCount, setVisibleCount] = useState(15);

  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  const { wallet } = useAuth();

  const priceText = ticketPrice.toLocaleString("en-IN");

  const today = new Date().toLocaleDateString("en-IN");

  // ✅ FETCH
  useEffect(() => {
    if (!ticketId) return;

    (async () => {
      try {
        const res = await axiosInstance.get("/pool");
        const found = res.data?.data?.find(
          (p) => String(p.id) === String(ticketId)
        );

        if (found) {
          setTicketTitle(found.title);
          setTicketPrice(Number(found.price));
        }
      } catch {}
    })();
  }, [ticketId]);

  // ✅ FORMAT NUMBER → 05-09/9422
  const formatNumber = (num) => {
    const part1 = String(num).padStart(2, "0");
    const part2 = String(Math.floor(Math.random() * 99)).padStart(2, "0");
    const part3 = String(9422); // static or from backend

    return `${part1}-${part2}/${part3}`;
  };

  const visibleNumbers = numbers.slice(0, visibleCount);

  // ✅ CLICK → ADD TO SUMMARY
  const handleSelect = (num) => {
    const exists = tickets.find((t) => t.number === num);

    if (exists) {
      // remove if already selected
      setTickets(tickets.filter((t) => t.number !== num));
    } else {
      setTickets([
        ...tickets,
        {
          number: num,
          display: formatNumber(num),
          amount: ticketPrice,
          date: today,
        },
      ]);
    }
  };

  // ✅ PAYMENT
  const handlePay = async () => {
    if (tickets.length === 0) {
      setError("Please select at least one ticket");
      return;
    }

    try {
      setPaying(true);

      const totalAmount = tickets.reduce((sum, t) => sum + t.amount, 0);

      await axiosInstance.post("/ticket/buy", {
        tickets,
        pool_name: ticketTitle,
        draw_number: ticketId,
        payment_status: "PAID",
        total_amount: totalAmount,
      });

      alert("✅ Tickets purchased successfully!");
      setTickets([]);
    } catch (err) {
      setError("Payment failed");
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl shadow">

          <h2 className="text-xl font-bold mb-2">{ticketTitle}</h2>
          <p className="text-sm text-gray-500 mb-4">
            Ticket Price ₹{priceText}
          </p>

          <p className="font-semibold mb-2">Select Ticket Number</p>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {visibleNumbers.map((num) => {
              const isSelected = tickets.some((t) => t.number === num);

              return (
                <button
                  key={num}
                  onClick={() => handleSelect(num)}
                  className={`px-3 py-2 rounded-full border text-xs font-semibold transition
                    ${
                      isSelected
                        ? "bg-black text-white"
                        : "bg-white border-gray-300 hover:bg-gray-100"
                    }`}
                >
                  {formatNumber(num)}
                </button>
              );
            })}
          </div>

          {/* MORE BUTTON */}
          {visibleCount < numbers.length && (
            <button
              onClick={() => setVisibleCount((prev) => prev + 15)}
              className="mt-4 text-blue-600 font-semibold"
            >
              + More Numbers
            </button>
          )}

          {error && (
            <p className="text-red-500 mt-3 text-sm">{error}</p>
          )}
        </div>

        {/* RIGHT SUMMARY */}
        <div className="bg-white p-5 rounded-2xl shadow">

          <h3 className="font-semibold mb-4">Summary</h3>

          <div className="space-y-3 max-h-64 overflow-auto">
            {tickets.map((t, i) => (
              <div
                key={i}
                className="bg-gray-50 p-3 rounded-lg text-sm"
              >
                <div className="flex justify-between items-center">
                  <span className="bg-black text-white px-3 py-1 rounded-full">
                    {t.display}
                  </span>
                  <span className="font-semibold">₹{t.amount}</span>
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  Date: {t.date}
                </p>
              </div>
            ))}
          </div>

          {/* SUBTOTAL */}
          <div className="mt-4 border-t pt-3 flex justify-between font-semibold">
            <span>Sub Total</span>
            <span>
              ₹{tickets.reduce((sum, t) => sum + t.amount, 0)}
            </span>
          </div>

          {/* PAY */}
          <button
            onClick={handlePay}
            disabled={paying}
            className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg"
          >
            {paying ? "Processing..." : "Pay Now"}
          </button>

          <button
            onClick={() => navigate(-1)}
            className="mt-3 w-full border py-2 rounded-lg"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlayNow;