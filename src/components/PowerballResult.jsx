import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const PowerballResult = () => {
  const navigate = useNavigate();

  // demo dates (replace with API)
  const dates = useMemo(
    () => [
      "27 January 2026 (Tuesday)",
      "24 January 2026 (Saturday)",
      "21 January 2026 (Wednesday)",
    ],
    []
  );

  const [selectedDate, setSelectedDate] = useState(dates[0]);

  // demo balls (replace with API)
  const balls = [51, 21, 60, 31, 63];
  const powerball = 18;

  return (
    <section className="bg-white px-4 pt-6">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              {/* LEFT: Logo + Date */}
              <div className="flex-1">
                {/* Fake logo row (swap with your img) */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex items-center gap-1">
                    {["P", "O", "W", "E", "R"].map((c) => (
                      <span
                        key={c}
                        className="w-7 h-7 rounded-full bg-blue-900 text-white text-xs font-extrabold flex items-center justify-center"
                      >
                        {c}
                      </span>
                    ))}
                    <span className="w-7 h-7 rounded-full bg-red-500 text-white text-[10px] font-extrabold flex items-center justify-center">
                      BALL
                    </span>
                  </div>
                  <span className="text-blue-900 font-extrabold tracking-wide">
                    PLUS
                  </span>
                </div>

                {/* Date dropdown */}
                <div className="w-full max-w-sm">
                  <div className="relative">
                    <select
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-4 py-3 pr-10 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                    >
                      {dates.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>

                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                      ▼
                    </span>
                  </div>
                </div>
              </div>

              {/* RIGHT: Buttons + Balls */}
              <div className="flex flex-col items-end gap-5">
                <div className="flex gap-4">
                  <button
                    onClick={() => navigate("/register")}
                    className="h-11 px-10 rounded-full text-white font-extrabold
                               bg-gradient-to-b from-amber-300 to-orange-500
                               shadow-[0_10px_22px_rgba(255,122,0,0.25)]"
                  >
                    REGISTER
                  </button>
                  <button
                    onClick={() => navigate("/login")}
                    className="h-11 px-10 rounded-full text-white font-extrabold
                               bg-gradient-to-b from-amber-300 to-orange-500
                               shadow-[0_10px_22px_rgba(255,122,0,0.25)]"
                  >
                    LOGIN
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {balls.map((n) => (
                    <div
                      key={n}
                      className="w-12 h-12 rounded-full bg-teal-500 text-white font-bold
                                 flex items-center justify-center shadow-sm"
                    >
                      {n}
                    </div>
                  ))}
                  <div className="w-12 h-12 rounded-full bg-red-400 text-white font-bold flex items-center justify-center shadow-sm">
                    {powerball}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* bottom bar */}
          <button
            className="w-full flex items-center justify-between px-6 py-4
                       bg-teal-50 text-gray-800 text-sm font-medium"
          >
            <span>View prize breakdown</span>
            <span className="text-gray-600">▼</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default PowerballResult;
