import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useDispatch } from "react-redux";
import { fetchSoldTickets } from "../features/ticketSlice";

export const usePoolAutoSell = (slug) => {
  const dispatch = useDispatch();
  const [pool, setPool] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const fetchPool = async () => {
      const res = await axiosInstance.get("/pool");
      const found = res.data?.data?.find((p) => p.slug === slug);
      setPool(found);
    };

    fetchPool();
    const interval = setInterval(fetchPool, 60000); // refresh every 1 min

    return () => clearInterval(interval);
  }, [slug]);

  useEffect(() => {
    if (!pool) return;

    const updateLogic = () => {
      const now = Date.now();
      const expire = pool.expireAtMs;
      const remaining = expire - now;

      const minutesLeft = remaining / (1000 * 60);

      let percent = 0;

      if (minutesLeft <= 10) percent = 100;
      else if (minutesLeft <= 15) percent = 80;
      else if (minutesLeft <= 30) percent = 50;
      else percent = 0;

      console.log("AUTO SELL %:", percent);

      if (percent > 0) {
        dispatch(fetchSoldTickets(pool.slug));
      }
    };

    updateLogic();

    const interval = setInterval(updateLogic, 60000);

    return () => clearInterval(interval);
  }, [pool, dispatch]);
};