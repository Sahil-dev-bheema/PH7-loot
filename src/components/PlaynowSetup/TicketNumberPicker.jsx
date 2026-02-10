import React, { useMemo } from "react";

export default function TicketNumberPicker({
  max = 48,
  selected,
  purchased = false,
  soldNumbers = [],        // ✅ numbers already purchased by others
  onPick,
  onRandom,
  onClear,
}) {
  const numbers = useMemo(
    () => Array.from({ length: max }, (_, i) => i + 1),
    [max]
  );

  const soldSet = useMemo(() => new Set((soldNumbers || []).map(Number)), [soldNumbers]);

  return (
    <div className="mt-5 relative">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-gray-900">Pick a number</p>
        <p className="text-xs text-gray-500">
          Sold: {soldSet.size}/{max}
        </p>
      </div>

      {/* grid */}
      <div
        className={[
          "grid grid-cols-9 sm:grid-cols-10 md:grid-cols-12 gap-2 transition",
          purchased ? "blur-[2px] opacity-70 pointer-events-none select-none" : "",
        ].join(" ")}
      >
        {numbers.map((n) => {
          const active = selected === n;
          const sold = soldSet.has(n);

          return (
            <button
              key={n}
              onClick={() => {
                if (purchased || sold) return;
                onPick(n);
              }}
              disabled={purchased || sold}
              className={[
                "h-9 rounded-lg text-sm font-semibold border transition select-none",
                sold
                  ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                  : active
                  ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300",
              ].join(" ")}
              aria-pressed={active}
              type="button"
              title={sold ? "Already purchased" : ""}
            >
              {n}
            </button>
          );
        })}
      </div>

      {/* actions below */}
      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={onRandom}
          disabled={purchased}
          className={[
            "px-4 py-2 rounded-full text-sm font-semibold border transition",
            purchased
              ? "border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
              : "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
          ].join(" ")}
          type="button"
        >
          🎲 Random Pick
        </button>

        <button
          onClick={onClear}
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

      {purchased && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-xl bg-white/90 border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-800 shadow-sm">
            ✅ Ticket purchased. Selection locked.
          </div>
        </div>
      )}
    </div>
  );
}
