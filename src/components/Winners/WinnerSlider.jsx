import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useSelector } from "react-redux";

/* ---------- fallback data ---------- */
const STATIC_WINNERS = [
  { first_name: "Santosh", last_name: "Vaghmare", prize_amount: 100000, position: 1 },
  { first_name: "Ramesh", last_name: "Dass", prize_amount: 100000, position: 2 },
  { first_name: "Pooja", last_name: "Sakhala", prize_amount: 100000, position: 3 },
  { first_name: "Mohit", last_name: "Babbar", prize_amount: 100000, position: 4 },
];

/* ---------- card colors ---------- */
const CARD_COLORS = [
  "bg-orange-500",
  "bg-blue-700",
  "bg-lime-600",
  "bg-red-900",
];

export default function WinnerSlider({
  poolTitle = "BigAuction",
  speed = 25,
}) {
  const [winners, setWinners] = useState(STATIC_WINNERS);

  // ✅ REDUX USER
  const { user } = useSelector((state) => state.auth);

  /* ---------- fetch API ---------- */
  useEffect(() => {
    console.log("🔥 useEffect triggered", user?.id);

    if (!user?.id) return;

    const fetchWinners = async () => {
      try {
        const url = `/result/all_results`;
        console.log("➡️ URL:", url);

        const res = await axiosInstance.get(url);

        console.log("✅ DATA:", res.data);

        const apiWinners =
          res?.data?.data?.results || res?.data?.results || [];

        if (!apiWinners.length) {
          console.warn("⚠️ No winners from API, using fallback");
        }

        setWinners(apiWinners.length ? apiWinners : STATIC_WINNERS);
      } catch (err) {
        console.error("❌ WINNER SLIDER ERROR:", err);
        setWinners(STATIC_WINNERS);
      }
    };

    fetchWinners();
  }, [user?.id]);

  /* ---------- infinite loop ---------- */
  const loop = useMemo(() => [...winners, ...winners], [winners]);

  return (
    <div className="w-full py-10">
      <div className="max-w-6xl mx-auto px-4 overflow-hidden">

        <style>{`
          @keyframes infiniteScroll {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }

          .scroll-track {
            animation: infiniteScroll linear infinite;
            animation-duration: ${speed}s;
          }

          .scroll-container::-webkit-scrollbar {
            display: none;
          }
          .scroll-container {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>

        <h2 className="text-center text-2xl font-bold mb-6">
          Winners Gallery
        </h2>

        <div className="scroll-container overflow-hidden relative">
          <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-white to-transparent z-10" />

          <div className="scroll-track flex w-[200%] gap-6">
            {loop.map((winner, i) => (
              <WinnerCard
                key={i}
                winner={winner}
                color={CARD_COLORS[i % CARD_COLORS.length]}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Winner Card ---------- */
function WinnerCard({ winner, color }) {
  const fullName = `${winner.first_name} ${winner.last_name}`;

  const initials = fullName
    .split(" ")
    .map((x) => x[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`min-w-[260px] h-[320px] rounded-3xl text-white flex flex-col items-center justify-center shadow-xl ${color}`}
    >
      <div className="text-xl font-semibold">
        Won{" "}
        <span className="text-3xl font-bold">
          ₹{Number(winner.prize_amount).toLocaleString("en-IN")}
        </span>
      </div>

      <div className="mt-6 w-28 h-28 rounded-full bg-white text-black flex items-center justify-center text-2xl font-bold shadow-lg">
        {initials}
      </div>

      <div className="mt-6 text-lg font-semibold text-center px-4">
        {fullName}
      </div>

      <div className="mt-2 text-sm bg-white/20 px-3 py-1 rounded-full">
        Rank #{winner.position}
      </div>
    </div>
  );
}