import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useLocation, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { addToCartAPI } from "../redux/cartSlice";

function PlayNow() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loading = useSelector((state) => state.cart.loading);

  const ticketId = location.state?.ticketId ?? null;

  const [ticketTitle, setTicketTitle] = useState(
    location.state?.ticketTitle || "RAJSHREE 10 EVENING"
  );
  const [ticketPrice, setTicketPrice] = useState(
    Number(location.state?.ticketPrice ?? 10)
  );

  // ✅ NOW 100 NUMBERS
  const numbers = useMemo(() => Array.from({ length: 100 }, (_, i) => i + 1), []);

  const [visibleCount, setVisibleCount] = useState(15);
  const [selectedNumbers, setSelectedNumbers] = useState([]);

  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

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

  // ✅ FORMAT
  const formatNumber = (num) => {
    const part1 = String(num).padStart(2, "0");
    return `${part1}-${part1}/9422`;
  };

  const visibleNumbers = numbers.slice(0, visibleCount);

  // ✅ SHOW MORE
  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + 15, numbers.length));
  };

  // ✅ SELECT
  const handleSelect = (num) => {
    setSelectedNumbers((prev) => {
      if (prev.includes(num)) {
        return prev.filter((n) => n !== num);
      } else {
        return [...prev, num];
      }
    });
  };

  // ✅ SELECTED TICKETS
  const selectedTickets = selectedNumbers.map((num) => ({
    number: num,
    display: formatNumber(num),
    amount: ticketPrice,
    date: today,
  }));

  // ✅ TOTAL
  const totalAmount = selectedTickets.reduce(
    (sum, t) => sum + t.amount,
    0
  );

  // ✅ ADD TO CART
  const handleAddToCart = async () => {
    if (!ticketId) {
      setError("Invalid ticket");
      return;
    }

    if (selectedNumbers.length === 0) {
      setError("Please select at least one ticket");
      return;
    }

    try {
      setError("");

      const payload = {
        pool_id: ticketId,
        ticket_price: ticketPrice,
        ticket_quantity: selectedNumbers.length,
      };

      const res = await dispatch(addToCartAPI(payload));

      if (addToCartAPI.fulfilled.match(res)) {
        setSelectedNumbers([]);
        navigate("/cart");
      } else {
        throw new Error(res.payload);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to add to cart");
    }
  };

  // ✅ PAYMENT
  const handlePay = async () => {
    if (selectedTickets.length === 0) {
      setError("Please select at least one ticket");
      return;
    }

    try {
      setPaying(true);

      await axiosInstance.post("/ticket/buy", {
        tickets: selectedTickets,
        pool_name: ticketTitle,
        draw_number: ticketId,
        payment_status: "PAID",
        total_amount: totalAmount,
      });

      alert("✅ Tickets purchased successfully!");
      setSelectedNumbers([]);
    } catch {
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
              const isSelected = selectedNumbers.includes(num);

              return (
                <button
                  key={num}
                  onClick={() => handleSelect(num)}
                  className={`px-3 py-2 rounded-full border text-xs font-semibold
                  ${
                    isSelected
                      ? "bg-blue-600 text-white"
                      : "bg-white border-gray-300"
                  }`}
                >
                  {formatNumber(num)}
                </button>
              );
            })}
          </div>

          {/* ✅ SHOW MORE BUTTON */}
          {visibleCount < numbers.length && (
            <button
              onClick={handleShowMore}
              className="mt-4 w-full bg-gray-200 py-2 rounded-lg text-sm font-semibold"
            >
              Show More
            </button>
          )}

          <p className="mt-3 text-sm text-gray-500">
            Selected: {selectedNumbers.length}
          </p>

          {/* ADD TO CART */}
          <button
            onClick={handleAddToCart}
            disabled={loading}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            {loading ? "Adding..." : "Add to Cart"}
          </button>

          {error && <p className="text-red-500 mt-3">{error}</p>}
        </div>

        {/* RIGHT SUMMARY */}
        <div className="bg-white p-5 rounded-2xl shadow">
          <h3 className="font-semibold mb-4">Summary</h3>

          <div className="space-y-3 max-h-64 overflow-auto">
            {selectedTickets.map((t, i) => (
              <div key={i} className="bg-gray-50 p-3 rounded-lg text-sm">
                <div className="flex justify-between">
                  <span>{t.display}</span>
                  <span>₹{t.amount}</span>
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  Date: {t.date}
                </p>
              </div>
            ))}
          </div>

          {/* TOTAL */}
          <div className="mt-4 border-t pt-3 flex justify-between font-semibold">
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>

          {/* PAY */}
         <button
            onClick={handleAddToCart}
            disabled={loading}
            className="mt-4 bg-cyan-400 text-white px-4 py-2 rounded-lg"
          >
            {loading ? "Paying..." : "Pay now"}
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