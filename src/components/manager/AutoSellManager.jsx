// src/components/AutoSellManager.jsx
import { useEffect, useRef } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useDispatch } from "react-redux";
import { mergeSoldTickets } from "../../features/ticketSlice";

export default function AutoSellManager({ slug }) {
  const dispatch = useDispatch();
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!slug) return;

    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

    // 🎲 RANDOM UNIQUE GENERATOR
    const getRandomTickets = (total, count) => {
      const pool = Array.from({ length: total }, (_, i) => i + 1);

      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }

      return pool.slice(0, count);
    };

    const run = async () => {
      try {
        const res = await axiosInstance.get("/pool");
        const pool = res.data?.data?.find((p) => p.slug === slug);

        if (!pool) return;

        const now = Date.now();
        const remaining = pool.expireAtMs - now;
        const minutes = remaining / (1000 * 60);

        let percent = 0;
        if (minutes <= 10) percent = 100;
        else if (minutes <= 15) percent = 80;
        else if (minutes <= 30) percent = 50;

        if (percent === 0) return;

        const totalTickets = pool.totalTickets || 100;
        const countToSell = Math.floor((percent / 100) * totalTickets);

        // 🎲 RANDOM SOLD LIST
        const randomSold = getRandomTickets(totalTickets, countToSell);

        // 🔥 ONE BY ONE ANIMATION
        for (let i = 0; i < randomSold.length; i++) {
          await delay(120); // adjust speed here

          dispatch(mergeSoldTickets([randomSold[i]]));
        }
      } catch (err) {
        console.log("AutoSell error:", err.message);
      }
    };

    run();

    intervalRef.current = setInterval(run, 60000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [slug, dispatch]);

  return null;
}