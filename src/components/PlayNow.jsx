// import React, { useEffect, useMemo, useState } from "react";
// import axiosInstance from "../utils/axiosInstance";
// import { useLocation, useNavigate } from "react-router-dom";

// import { useDispatch, useSelector } from "react-redux";
// import { addToCartAPI } from "../redux/cartSlice";

// function PlayNow() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const loading = useSelector((state) => state.cart.loading);

//   const ticketId = location.state?.ticketId ?? null;

//   const [ticketTitle, setTicketTitle] = useState(
//     location.state?.ticketTitle || "RAJSHREE 10 EVENING"
//   );
//   const [ticketPrice, setTicketPrice] = useState(
//     Number(location.state?.ticketPrice ?? 10)
//   );

//   // ✅ NOW 100 NUMBERS
//   const numbers = useMemo(() => Array.from({ length: 100 }, (_, i) => i + 1), []);

//   const [visibleCount, setVisibleCount] = useState(15);
//   const [selectedNumbers, setSelectedNumbers] = useState([]);

//   const [paying, setPaying] = useState(false);
//   const [error, setError] = useState("");

//   const priceText = ticketPrice.toLocaleString("en-IN");
//   const today = new Date().toLocaleDateString("en-IN");

//   // ✅ FETCH
//   useEffect(() => {
//     if (!ticketId) return;

//     (async () => {
//       try {
//         const res = await axiosInstance.get("/pool");
//         const found = res.data?.data?.find(
//           (p) => String(p.id) === String(ticketId)
//         );

//         if (found) {
//           setTicketTitle(found.title);
//           setTicketPrice(Number(found.price));
//         }
//       } catch {}
//     })();
//   }, [ticketId]);

//   // ✅ FORMAT
//   const formatNumber = (num) => {
//     const part1 = String(num).padStart(2, "0");
//     return `${part1}-${part1}/9422`;
//   };

//   const visibleNumbers = numbers.slice(0, visibleCount);

//   // ✅ SHOW MORE
//   const handleShowMore = () => {
//     setVisibleCount((prev) => Math.min(prev + 15, numbers.length));
//   };

//   // ✅ SELECT
//   const handleSelect = (num) => {
//     setSelectedNumbers((prev) => {
//       if (prev.includes(num)) {
//         return prev.filter((n) => n !== num);
//       } else {
//         return [...prev, num];
//       }
//     });
//   };

//   // ✅ SELECTED TICKETS
//   const selectedTickets = selectedNumbers.map((num) => ({
//     number: num,
//     display: formatNumber(num),
//     amount: ticketPrice,
//     date: today,
//   }));

//   // ✅ TOTAL
//   const totalAmount = selectedTickets.reduce(
//     (sum, t) => sum + t.amount,
//     0
//   );

//   // ✅ ADD TO CART
//   const handleAddToCart = async () => {
//     if (!ticketId) {
//       setError("Invalid ticket");
//       return;
//     }

//     if (selectedNumbers.length === 0) {
//       setError("Please select at least one ticket");
//       return;
//     }

//     try {
//       setError("");

//       const payload = {
//         pool_id: ticketId,
//         ticket_price: ticketPrice,
//         ticket_quantity: selectedNumbers.length,
//       };

//       const res = await dispatch(addToCartAPI(payload));

//       if (addToCartAPI.fulfilled.match(res)) {
//         setSelectedNumbers([]);
//         navigate("/cart");
//       } else {
//         throw new Error(res.payload);
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Failed to add to cart");
//     }
//   };

//   // ✅ PAYMENT
//   const handlePay = async () => {
//     if (selectedTickets.length === 0) {
//       setError("Please select at least one ticket");
//       return;
//     }

//     try {
//       setPaying(true);

//       await axiosInstance.post("/ticket/buy", {
//         tickets: selectedTickets,
//         pool_name: ticketTitle,
//         draw_number: ticketId,
//         payment_status: "PAID",
//         total_amount: totalAmount,
//       });

//       alert("✅ Tickets purchased successfully!");
//       setSelectedNumbers([]);
//     } catch {
//       setError("Payment failed");
//     } finally {
//       setPaying(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-4">
//       <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">

//         {/* LEFT */}
//         <div className="lg:col-span-2 bg-white p-5 rounded-2xl shadow">
//           <h2 className="text-xl font-bold mb-2">{ticketTitle}</h2>

//           <p className="text-sm text-gray-500 mb-4">
//             Ticket Price ₹{priceText}
//           </p>

//           <p className="font-semibold mb-2">Select Ticket Number</p>

//           <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
//             {visibleNumbers.map((num) => {
//               const isSelected = selectedNumbers.includes(num);

//               return (
//                 <button
//                   key={num}
//                   onClick={() => handleSelect(num)}
//                   className={`px-3 py-2 rounded-full border text-xs font-semibold
//                   ${
//                     isSelected
//                       ? "bg-blue-600 text-white"
//                       : "bg-white border-gray-300"
//                   }`}
//                 >
//                   {formatNumber(num)}
//                 </button>
//               );
//             })}
//           </div>

//           {/* ✅ SHOW MORE BUTTON */}
//           {visibleCount < numbers.length && (
//             <button
//               onClick={handleShowMore}
//               className="mt-4 w-full bg-gray-200 py-2 rounded-lg text-sm font-semibold"
//             >
//               Show More
//             </button>
//           )}

//           <p className="mt-3 text-sm text-gray-500">
//             Selected: {selectedNumbers.length}
//           </p>

//           {/* ADD TO CART */}
//           <button
//             onClick={handleAddToCart}
//             disabled={loading}
//             className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
//           >
//             {loading ? "Adding..." : "Add to Cart"}
//           </button>

//           {error && <p className="text-red-500 mt-3">{error}</p>}
//         </div>

//         {/* RIGHT SUMMARY */}
//         <div className="bg-white p-5 rounded-2xl shadow">
//           <h3 className="font-semibold mb-4">Summary</h3>

//           <div className="space-y-3 max-h-64 overflow-auto">
//             {selectedTickets.map((t, i) => (
//               <div key={i} className="bg-gray-50 p-3 rounded-lg text-sm">
//                 <div className="flex justify-between">
//                   <span>{t.display}</span>
//                   <span>₹{t.amount}</span>
//                 </div>

//                 <p className="text-xs text-gray-500 mt-1">
//                   Date: {t.date}
//                 </p>
//               </div>
//             ))}
//           </div>

//           {/* TOTAL */}
//           <div className="mt-4 border-t pt-3 flex justify-between font-semibold">
//             <span>Total</span>
//             <span>₹{totalAmount}</span>
//           </div>

//           {/* PAY */}
//          <button
//             onClick={handleAddToCart}
//             disabled={loading}
//             className="mt-4 bg-cyan-400 text-white px-4 py-2 rounded-lg"
//           >
//             {loading ? "Paying..." : "Pay now"}
//           </button>

//           <button
//             onClick={() => navigate(-1)}
//             className="mt-3 w-full border py-2 rounded-lg"
//           >
//             Back
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default PlayNow;








import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePoolAutoSell } from "../hooks/usePoolAutoSell";
import axiosInstance from "../utils/axiosInstance";
import { useSelector, useDispatch } from "react-redux";
import { fetchSoldTickets } from "../features/ticketSlice";
import { addToCartAPI } from "../features/cartSlice";
import { updateWallet,updateWalletLocal } from "../features/userSlice"; // ✅ USE THIS
import AutoSellManager from "../components/manager/AutoSellManager";

/* ---------- countdown helper ---------- */
const getTimeLeft = (date) => {
  if (!date) return "-";

  const diff = new Date(date) - new Date();
  if (diff <= 0) return "Expired";

  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);

  return `${d}d : ${h}h : ${m}m : ${s}s`;
};

function PlayNow() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
 
const { soldTickets } = useSelector((state) => state.ticket);
  const selectedTicket = useSelector(
    (state) => state.ticket.selectedTicket
  );

  useEffect(() => {
  if (selectedTicket?.slug) {
    dispatch(fetchSoldTickets(selectedTicket.slug));
  }
}, [dispatch, selectedTicket]);

  // ✅ REDUX WALLET
  const wallet = useSelector((state) => state.user.wallet);

  if (!selectedTicket) {
    return (
      <div className="p-6 text-center">
        No ticket selected. Please go back.
      </div>
    );
  }

  const ticketId = selectedTicket.id;
  const ticketTitle = selectedTicket.title;
  const ticketPrice = Number(selectedTicket.price);
  const expiredAt = selectedTicket.expiredAt;

  /* ---------- TIMER ---------- */
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  /* ---------- NUMBERS ---------- */
  const numbers = useMemo(
    () => Array.from({ length: 100 }, (_, i) => i + 1),
    []
  );

  const generatedTickets = useMemo(() => {
    const map = {};

    const slugHash = selectedTicket.slug
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);

    numbers.forEach((num) => {
      const part1 = String(num).padStart(2, "0");
      const part2 = Math.floor(10 + Math.random() * 90);

      const part3 = (slugHash + Math.floor(Math.random() * 10000))
        .toString()
        .slice(0, 4)
        .padStart(4, "0");

      map[num] = `${part1}-${part2}/${part3}`;
    });

    return map;
  }, [selectedTicket.slug, numbers]);

  /* ---------- STATE ---------- */
  const [visibleCount, setVisibleCount] = useState(15);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);

  const today = new Date().toLocaleDateString("en-IN");

  const visibleNumbers = numbers.slice(0, visibleCount);

  /* ---------- HANDLERS ---------- */
  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + 15, numbers.length));
  };

const handleSelect = (num) => {
  if (soldTickets.includes(Number(num))) return; // 🔥 force number

  setSelectedNumbers((prev) =>
    prev.includes(num)
      ? prev.filter((n) => n !== num)
      : [...prev, num]
  );
};
  const selectedTickets = selectedNumbers.map((num) => ({
    number: num,
    display: generatedTickets[num],
    amount: ticketPrice,
    date: today,
  }));

  const totalAmount = selectedTickets.reduce(
    (sum, t) => sum + t.amount,
    0
  );

  /* ---------- ADD TO CART ---------- */
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

    // ✅ BUILD TICKETS ARRAY
    const tickets = selectedNumbers.map((num) => ({
      ticket_number: num,
      ticket_price: ticketPrice,
      ticket_display: generatedTickets[num], // optional but useful
    }));

    const payload = {
      pool_id: ticketId,
      tickets,
    };

    const res = await dispatch(addToCartAPI(payload));

    if (addToCartAPI.fulfilled.match(res)) {
      setSelectedNumbers([]);
      navigate("/cart");
    } else {
      setError(res.payload?.message || "Failed to add to cart");
    }
  } catch (err) {
    console.error(err);
    setError("Something went wrong");
  }
};

  /* ---------- PAY ---------- */
const handlePay = async () => {
  if (!ticketId) {
    setError("Invalid ticket");
    return;
  }

  if (selectedTickets.length === 0) {
    setError("Please select at least one ticket");
    return;
  }

  if ((wallet?.cash || 0) < totalAmount) {
    setError("Insufficient balance");
    return;
  }

  try {
    setPaying(true);
    setError("");

    await axiosInstance.post("/ticket/buy", {
      tickets: selectedTickets,
      pool_name: ticketTitle,
      draw_number: ticketId,
      payment_status: "PAID",
      total_amount: totalAmount,
    });

    // ✅ UPDATE WALLET
   dispatch(updateWalletLocal(-totalAmount)); // instant UI
await dispatch(updateWallet(-totalAmount)); // backend

    // ✅ 🔥 REFRESH SOLD TICKETS (THIS IS WHAT YOU NEEDED)
    await dispatch(fetchSoldTickets(selectedTicket.slug));

    // ✅ CLEAR SELECTION AFTER REFRESH
    setSelectedNumbers([]);

    alert("✅ Tickets purchased successfully!");

  } catch (err) {
    console.error(err);
    setError("Payment failed");
  } finally {
    setPaying(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <AutoSellManager slug={selectedTicket?.slug} />
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-2">{ticketTitle}</h2>

          <p className="text-sm text-gray-500 mb-4">
            Ticket Price ₹{ticketPrice}
          </p>

          <p className="font-semibold mb-2">Select Ticket Number</p>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
    {visibleNumbers.map((num) => {
  const isSelected = selectedNumbers.includes(num);
  const isSold = soldTickets.includes(Number(num)); // 🔥 force number

  return (
    <button
      key={num}
      onClick={() => handleSelect(num)}
      disabled={isSold}
      className={`relative px-3 py-2 rounded-full border text-xs font-semibold transition
      ${
        isSold
          ? "bg-red-500 text-white border-red-600 cursor-not-allowed"
          : isSelected
          ? "bg-blue-600 text-white"
          : "bg-white border-gray-300"
      }`}
    >
      {generatedTickets[num]}

      {/* 🔥 CLEAR SOLD LABEL */}
      {isSold && (
        <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] px-1 rounded">
          SOLD
        </span>
      )}
    </button>
  );
})}
          </div>

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

          <button
            onClick={handleAddToCart}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Add to Cart
          </button>

          {error && <p className="text-red-500 mt-3">{error}</p>}
        </div>

        {/* RIGHT */}
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

          <div className="flex justify-between items-center mt-3">
            <span className="text-sm text-gray-600">Time Left</span>
            <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 rounded">
              {getTimeLeft(expiredAt)}
            </span>
          </div>

          <div className="mt-4 border-t pt-3 flex justify-between font-semibold">
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>

          {/* ✅ PAY NOW FIXED */}
          <button
            onClick={handlePay}
            disabled={paying}
            className="mt-4 bg-cyan-400 text-white px-4 py-2 rounded-lg"
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