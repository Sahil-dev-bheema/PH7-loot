// src/pages/UserProfile.jsx
import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";
// import ResultModel from "./ResultModel";
import Poolresult from "./Poolresult";

/* ---------- money formatter ---------- */
const fmtMoney = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(Number(n || 0));

/* ---------- UI helpers ---------- */
const Pill = ({ children, tone = "neutral" }) => {
  const cls =
    tone === "green"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
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

const Stat = ({ label, value, sub }) => (
  <div className="rounded-2xl bg-slate-50 p-4 sm:p-5 ring-1 ring-slate-200">
    <p className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wide">
      {label}
    </p>
    <p className="mt-1 text-xl sm:text-2xl font-extrabold text-slate-900 break-words">
      {value}
    </p>
    {sub && <p className="text-xs text-slate-500 mt-2 leading-relaxed">{sub}</p>}
  </div>
);

const ItemCard = ({ title, meta, right, onClick, clickable }) => (
  <div
    onClick={onClick}
    role={clickable ? "button" : undefined}
    tabIndex={clickable ? 0 : undefined}
    onKeyDown={(e) => {
      if (!clickable) return;
      if (e.key === "Enter" || e.key === " ") onClick?.();
    }}
    className={[
      "rounded-2xl bg-white p-4 sm:p-5 ring-1 ring-slate-200 transition",
      "focus:outline-none focus:ring-2 focus:ring-slate-300",
      clickable ? "cursor-pointer hover:shadow-sm hover:ring-slate-300" : "",
    ].join(" ")}
  >
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="font-semibold text-slate-900 break-words">{title}</p>
        <p className="text-xs text-slate-500 mt-1">{meta}</p>
        {clickable ? (
          <p className="text-[11px] text-slate-400 mt-2">Tap to check result</p>
        ) : null}
      </div>
      <div className="shrink-0">{right}</div>
    </div>
  </div>
);

const Skeleton = () => (
  <div className="space-y-3">
    <div className="h-20 rounded-2xl bg-slate-100 animate-pulse" />
    <div className="h-20 rounded-2xl bg-slate-100 animate-pulse" />
    <div className="h-20 rounded-2xl bg-slate-100 animate-pulse" />
  </div>
);

const pick = (obj, keys, fallback) => {
  for (const k of keys) {
    const v = obj?.[k];
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return fallback;
};

const toYMD = (d) => {
  const x = d ? new Date(d) : null;
  if (!x || Number.isNaN(x.getTime())) return "—";
  return x.toISOString().slice(0, 10);
};

export default function UserProfile() {
  const { user, wallet, updateWallet } = useAuth();
  const userId = user?._id || user?.id;

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    user: {},
    packages: [],
    tickets: [],
  });

  const [resultOpen, setResultOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const totalAmount = Number(wallet?.cash ?? 0) + Number(wallet?.bonus ?? 0);

  const fullName = useMemo(() => {
    const u = profile.user || {};
    return (
      u?.name ||
      `${u?.first_name || ""} ${u?.last_name || ""}`.trim() ||
      "User"
    );
  }, [profile.user]);

  const email = profile.user?.email || "";

  const initials = (name) =>
    String(name || "User")
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;

      setLoading(true);
      try {
        const res = await axiosInstance.get(`/user/user-profile/${userId}`);
        const payload = res?.data?.data || res?.data || {};


        if (payload?.wallet) updateWallet(payload.wallet);

        const rawPackages = pick(payload, ["package", "packages"], []);
        const rawTickets = pick(payload, ["tickets"], []);

        const packages = Array.isArray(rawPackages)
          ? rawPackages.map((p) => ({
            purchaseId: p?._id,
            title: p?.package_name,
            price: p?.package_price,
            purchasedAt: p?.createdAt,
          }))
          : [];

        const tickets = Array.isArray(rawTickets)
          ? rawTickets
            .map((t) => ({
              id: t?._id,
              pool: t?.pool_name,
              number: t?.user_number,
              pool: t?.pool_name,
              amount: t?.ticket_amount,
              draw: t?.draw_number,
              userId: userId,
              // status:
              //   String(t?.payment_status || "").toLowerCase() === "paid"
              //     ? "active"
              //     : "expired",
            }))
          // .filter((t) => t.status === "active")
          : [];

        setProfile({
          user: payload?.user || {},
          packages,
          tickets,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, updateWallet]);

  const openTicketResult = (t) => {
    setSelectedTicket(t);
    setResultOpen(true);
  };

  return (
    <>
    <div className="min-h-screen bg-slate-50">
      {/* ✅ Result modal */}
      {/* <ResultModel
        open={resultOpen}
        onClose={() => setResultOpen(false)}
        ticket={selectedTicket}
      /> */}

      {/* HEADER (responsive height + nicer depth) */}
      <div className="relative">
        <div className="h-28 sm:h-36 md:h-44 bg-gradient-to-r from-teal-300 via-emerald-200 to-lime-200" />
        <div className="absolute inset-x-0 bottom-0 h-10 sm:h-14 bg-gradient-to-t from-slate-50 to-transparent" />
      </div>

      {/* WRAP */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* PROFILE CARD */}
        <div className="relative -mt-10 sm:-mt-12 bg-white rounded-3xl p-4 sm:p-6 shadow-sm ring-1 ring-slate-200">
          {/* Top row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Left: avatar + name */}
            <div className="flex items-center gap-4 min-w-0">
              <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-slate-900 text-white grid place-items-center font-bold text-lg sm:text-xl shrink-0">
                {initials(fullName)}
              </div>

              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 truncate">
                  {fullName}
                </h1>
                <p className="text-sm text-slate-600 truncate">{email}</p>

                <div className="mt-2 flex gap-2 flex-wrap">
                  <Pill>{profile.tickets.length} Active Tickets</Pill>
                  <Pill tone="amber">Packages: {profile.packages.length}</Pill>
                </div>
              </div>
            </div>

            {/* Right: wallet total (quick glance) */}
            <div className="sm:text-right">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Total Balance
              </p>
              <p className="mt-1 text-2xl font-extrabold text-slate-900">
                {fmtMoney(totalAmount)}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Cash: {fmtMoney(wallet?.cash)} • Bonus: {fmtMoney(wallet?.bonus)}
              </p>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mt-5 sm:mt-6">
            <Stat
              label="Wallet Balance"
              value={fmtMoney(totalAmount)}
              sub={`Cash: ${fmtMoney(wallet?.cash)} • Bonus: ${fmtMoney(
                wallet?.bonus
              )}`}
            />
            <Stat label="Packages Purchased" value={profile.packages.length} />
            <Stat label="Active Tickets" value={profile.tickets.length} />
          </div>
        </div>

        {/* CONTENT */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 pb-10">
          {/* Packages */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 ring-1 ring-slate-200">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-extrabold text-base sm:text-lg text-slate-900">
                Purchased Packages
              </h2>
              <Pill tone="amber">{profile.packages.length}</Pill>
            </div>

            <div className="mt-4 space-y-3">
              {loading ? (
                <Skeleton />
              ) : profile.packages.length ? (
                profile.packages.map((p, i) => (
                  <ItemCard
                    key={p.purchaseId || i}
                    title={p.title || "Package"}
                    meta={toYMD(p.purchasedAt)}
                    right={<Pill tone="green">{fmtMoney(p.price)}</Pill>}
                  />
                ))
              ) : (
                <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 text-sm text-slate-600">
                  No packages purchased yet.
                </div>
              )}
            </div>
          </div>

          {/* Tickets */}
          {/* Tickets */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 ring-1 ring-slate-200 flex flex-col">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-extrabold text-base sm:text-lg text-slate-900">
                My Tickets
              </h2>
              <Pill>{profile.tickets.length}</Pill>
            </div>

            {/* Scrollable section */}
            <div className="mt-4 space-y-3 overflow-y-auto max-h-[320px] pr-1">
              {loading ? (
                <Skeleton />
              ) : profile.tickets.length ? (
                profile.tickets.map((t, i) => {
                  // const isActive = t.status === "active";

                  return (
                    <ItemCard
                      key={t.id || i}
                      clickable
                      onClick={() => openTicketResult(t)}
                      title={`Ticket #${t.number} • ${t.pool}`}
                      meta={`Draw: ${t.draw} • ${fmtMoney(t.amount)}`}
                    />

                  );
                })
              ) : (
                <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 text-sm text-slate-600">
                  No tickets found.
                </div>
              )}
            </div>
          </div>


        </div>
      </div>
    </div>
{selectedTicket?.pool && (
  <Poolresult poolTitle={selectedTicket.pool} />
)}



    </>

  );
}
