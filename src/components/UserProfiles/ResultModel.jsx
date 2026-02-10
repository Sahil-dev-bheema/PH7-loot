// src/pages/ResultModel.jsx
import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";

/* ---------------- helpers ---------------- */
const fmtMoney = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    Number(n || 0),
  );

const rankMeta = (pos) => {
  const p = Number(pos);
  if (p === 1) return { label: "Winner", emoji: "🥇", tone: "green" };
  if (p === 2) return { label: "Runner-up", emoji: "🥈", tone: "amber" };
  if (p === 3) return { label: "Runner-up 2", emoji: "🥉", tone: "rose" };
  return { label: `#${p || "—"}`, emoji: "🏅", tone: "neutral" };
};

/* ---------------- UI bits ---------------- */
const Pill = ({ children, tone = "neutral" }) => {
  const cls =
    tone === "green"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : tone === "rose"
        ? "bg-rose-50 text-rose-700 ring-rose-200"
        : tone === "amber"
          ? "bg-amber-50 text-amber-700 ring-amber-200"
          : "bg-slate-50 text-slate-700 ring-slate-200";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${cls}`}
    >
      {children}
    </span>
  );
};

const Stat = ({ label, value }) => (
  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
    <p className="text-[11px] font-semibold text-slate-600">{label}</p>
    <p className="mt-1 text-sm font-extrabold text-slate-900 truncate">
      {value}
    </p>
  </div>
);

const Section = ({ title, right, accent = "slate", children }) => {
  const accentCls =
    accent === "green"
      ? "from-emerald-50 to-white"
      : accent === "amber"
        ? "from-amber-50 to-white"
        : accent === "rose"
          ? "from-rose-50 to-white"
          : "from-slate-50 to-white";

  return (
    <div className="rounded-3xl bg-white ring-1 ring-slate-200 overflow-hidden shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
      <div
        className={`px-4 py-3 border-b border-slate-100 bg-gradient-to-r ${accentCls}`}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-extrabold text-slate-900">{title}</p>
          {right}
        </div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
};

export default function ResultModel({ open, onClose, ticket }) {
  const { user } = useAuth();
  const loggedInUserId = user?._id || user?.id;

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [result, setResult] = useState(null);

  const poolName = ticket?.pool || "";
  const myUserId = ticket?.userId || ticket?.user_id || loggedInUserId;

  const myWinnerRow = useMemo(() => {
    const winners = Array.isArray(result?.winners) ? result.winners : [];
    return winners.find((w) => String(w?.user_id) === String(myUserId)) || null;
  }, [result, myUserId]);

  const isWinner = Boolean(myWinnerRow);
  const myPosition = myWinnerRow?.position;

  /* esc close */
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  /* lock body scroll */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  /* fetch */
  useEffect(() => {
    const run = async () => {
      if (!open || !poolName) return;

      setLoading(true);
      setErr("");
      setResult(null);

      try {
        const res = await axiosInstance.get(
          `/pool/result/${encodeURIComponent(poolName)}`,
        );
        setResult(res?.data?.data ?? null);
      } catch (e) {
        console.log(e);
        setErr(
          e?.response?.data?.message || e?.message || "Failed to load result",
        );
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [open, poolName]);

  if (!open) return null;

  const winners = Array.isArray(result?.winners) ? result.winners : [];
  const winnersSorted = winners
    .slice()
    .sort((a, b) => Number(a?.position) - Number(b?.position));

  return (
    <div className="fixed inset-0 z-[999]">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-5">
        <div
          className={[
            "w-full max-w-2xl",
            "rounded-[28px] overflow-hidden",
            "bg-white ring-1 ring-slate-200 shadow-2xl",
            "max-h-[74vh] sm:max-h-[70vh]",
            "flex flex-col",
          ].join(" ")}
        >
          {/* Header */}
          <div className="relative border-b border-slate-100">
            <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-white pointer-events-none" />
            <div
              className={[
                "absolute -top-24 -right-24 h-56 w-56 rounded-full blur-3xl opacity-30 pointer-events-none",
                isWinner ? "bg-emerald-300" : "bg-rose-300",
              ].join(" ")}
            />

            <div className="relative px-5 py-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-base sm:text-lg font-extrabold text-slate-900 truncate">
                  Pool Result
                </p>
                <p className="text-xs text-slate-500 mt-1 truncate">
                  Pool:{" "}
                  <span className="font-semibold text-slate-700">
                    {ticket?.pool || "—"}
                  </span>{" "}
                  • Ticket{" "}
                  <span className="font-semibold text-slate-700">
                    #{ticket?.number || "—"}
                  </span>
                </p>
              </div>

              <button
                onClick={onClose}
                className="shrink-0 rounded-2xl px-3 py-2 text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98] transition"
              >
                Close
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-4">
            {loading ? (
              <div className="space-y-3">
                <div className="h-12 rounded-2xl bg-slate-100 animate-pulse" />
                <div className="h-40 rounded-2xl bg-slate-100 animate-pulse" />
                <div className="h-40 rounded-2xl bg-slate-100 animate-pulse" />
              </div>
            ) : err ? (
              <div className="rounded-3xl bg-rose-50 p-4 ring-1 ring-rose-200">
                <p className="font-extrabold text-rose-700">
                  Could not load result
                </p>
                <p className="text-sm text-rose-700/80 mt-1">{err}</p>
              </div>
            ) : !result ? (
              <div className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <p className="text-sm text-slate-700">Result not available.</p>
              </div>
            ) : (
              <>
                {/* Outcome */}
                <div
                  className={[
                    "rounded-3xl ring-1 overflow-hidden",
                    isWinner ? "ring-emerald-200" : "ring-rose-200",
                    "shadow-[0_10px_40px_rgba(15,23,42,0.08)]",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "p-4",
                      "bg-gradient-to-r",
                      isWinner
                        ? "from-emerald-50 via-white to-white"
                        : "from-rose-50 via-white to-white",
                    ].join(" ")}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-extrabold text-slate-900">
                        Result Status
                      </p>

                      <span
                        className={[
                          "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-extrabold ring-1 shadow-sm",
                          isWinner
                            ? "bg-emerald-600 text-white ring-emerald-200"
                            : "bg-rose-600 text-white ring-rose-200",
                        ].join(" ")}
                      >
                        {isWinner ? "🎉 WINNER" : "✖ LOST"}
                        {isWinner && myPosition ? (
                          <span className="bg-white/15 rounded-full px-2 py-0.5">
                            #{myPosition}
                          </span>
                        ) : null}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Pill tone="amber">
                        Prize Pool: {fmtMoney(result?.prize_pool ?? 0)}
                      </Pill>
                      <Pill tone={isWinner ? "green" : "rose"}>
                        Your Bet: {fmtMoney(ticket?.amount ?? 0)}
                      </Pill>
                    </div>

                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <Stat label="Total Users" value={result?.total_users ?? "—"} />
                      <Stat label="Pool Title" value={result?.title ?? "—"} />
                      <Stat
                        label="Your Ticket"
                        value={`#${ticket?.number || "—"}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Winners */}
                <Section
                  title="Winners"
                  accent="green"
                  right={<Pill tone="green">{winnersSorted.length} winners</Pill>}
                >
                  {winnersSorted.length ? (
                    <div className="space-y-2">
                      {winnersSorted.map((w, idx) => {
                        const mine = String(w?.user_id) === String(myUserId);
                        const { label, emoji, tone } = rankMeta(w?.position);

                        const name =
                          [w?.first_name, w?.last_name]
                            .filter(Boolean)
                            .join(" ") ||
                          w?.role ||
                          "Player";

                        return (
                          <div
                            key={`${w?.user_id}-${idx}`}
                            className={[
                              "rounded-3xl p-3 sm:p-4 ring-1",
                              "flex items-center justify-between gap-3",
                              "transition hover:shadow-sm",
                              mine
                                ? "bg-emerald-50 ring-emerald-200"
                                : "bg-white ring-slate-200",
                            ].join(" ")}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className={[
                                  "h-10 w-10 rounded-2xl grid place-items-center text-base font-extrabold shrink-0 ring-1",
                                  mine
                                    ? "bg-emerald-600 text-white ring-emerald-200"
                                    : tone === "amber"
                                      ? "bg-amber-50 text-amber-800 ring-amber-200"
                                      : tone === "rose"
                                        ? "bg-rose-50 text-rose-800 ring-rose-200"
                                        : "bg-slate-50 text-slate-900 ring-slate-200",
                                ].join(" ")}
                              >
                                {emoji}
                              </div>

                              <div className="min-w-0">
                                <p className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
                                  {label}
                                </p>
                                <p className="text-xs text-slate-500 truncate">
                                  {mine ? "✅ This is you" : "Top performer"}
                                </p>
                              </div>
                            </div>

                            <Pill tone={mine ? "green" : "neutral"}>
                              {mine ? "You" : name}
                            </Pill>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="rounded-3xl bg-slate-50 p-3 ring-1 ring-slate-200">
                      <p className="text-sm text-slate-700">No winners listed.</p>
                    </div>
                  )}
                </Section>
              </>
            )}
          </div>

          {/* Bottom bar */}
          <div className="border-t border-slate-100 bg-white px-4 sm:px-5 py-3 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Press <span className="font-semibold">Esc</span> or click outside
              to close
            </p>
            <button
              onClick={onClose}
              className="rounded-2xl px-4 py-2 text-sm font-semibold bg-slate-100 hover:bg-slate-200 active:scale-[0.98] transition"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
