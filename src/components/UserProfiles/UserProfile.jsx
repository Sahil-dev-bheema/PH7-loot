// src/pages/UserProfile.jsx
import React, { useEffect, useMemo,useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../../features/userSlice";
import toast from "react-hot-toast";
// /result/pooltitle/pool ->api
/* ---------- money formatter ---------- */
const fmtMoney = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(n || 0));

/* ---------- helpers ---------- */
const toYMD = (d) => {
  const x = d ? new Date(d) : null;
  if (!x || Number.isNaN(x.getTime())) return "—";
  return x.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/* ---------- UI ---------- */
const Pill = ({ children, tone = "neutral" }) => {
  const cls =
    tone === "green"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : tone === "amber"
      ? "bg-amber-50 text-amber-700 ring-amber-200"
      : tone === "teal"
      ? "bg-teal-50 text-teal-700 ring-teal-200"
      : "bg-slate-50 text-slate-700 ring-slate-200";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${cls}`}
    >
      {children}
    </span>
  );
};

const StatCard = ({ label, value, sub, accent = "teal" }) => {
  const accentCls =
    accent === "green"
      ? "from-emerald-500/10 to-emerald-100/40 ring-emerald-200"
      : accent === "amber"
      ? "from-amber-500/10 to-amber-100/40 ring-amber-200"
      : "from-teal-500/10 to-cyan-100/40 ring-teal-200";

  return (
    <div
      className={`rounded-3xl bg-gradient-to-br ${accentCls} p-5 sm:p-6 ring-1 shadow-sm`}
    >
      <p className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-[0.18em]">
        {label}
      </p>
      <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 break-words">
        {value}
      </p>
      {sub && (
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          {sub}
        </p>
      )}
    </div>
  );
};

const PackageCard = ({ title, price, purchasedAt, index }) => (
  <div className="group rounded-3xl border border-slate-200 bg-white/90 p-4 sm:p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
    <div className="flex items-start justify-between gap-4">
      <div>
        <Pill tone="teal">Package #{index + 1}</Pill>
        <h3 className="mt-3 text-base sm:text-lg font-bold text-slate-900">
          {title || "Package"}
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          Purchased on{" "}
          <span className="text-slate-700 font-medium">
            {toYMD(purchasedAt)}
          </span>
        </p>
      </div>

      <div className="bg-emerald-50 px-3 py-2 rounded-2xl ring-1 ring-emerald-200 text-right">
        <p className="text-xs font-semibold text-emerald-700 uppercase">
          Amount
        </p>
        <p className="font-bold text-emerald-800">
          {fmtMoney(price)}
        </p>
      </div>
    </div>
  </div>
);

const TicketCard = ({ ticket }) => (
  <div className="group rounded-3xl border border-slate-200 bg-white/90 p-4 sm:p-5 shadow-sm">
    <div className="flex items-start justify-between gap-4">
      <div>
        <Pill tone="amber">Ticket #{ticket.id}</Pill>
        <h3 className="mt-3 text-base sm:text-lg font-bold text-slate-900">
          {ticket.pool_name}
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          Status:{" "}
          <span className="text-slate-700 font-medium">
            {ticket.payment_status}
          </span>
        </p>
      </div>

      <div className="bg-teal-50 px-3 py-2 rounded-2xl ring-1 ring-teal-200 text-right">
        <p className="text-xs font-semibold text-teal-700 uppercase">
          Amount
        </p>
        <p className="font-bold text-teal-800">
          {fmtMoney(ticket.ticket_amount)}
        </p>
      </div>
    </div>
  </div>
);

const SkeletonCard = () => (
  <div className="space-y-3">
    <div className="h-24 bg-slate-100 rounded-3xl animate-pulse" />
    <div className="h-24 bg-slate-100 rounded-3xl animate-pulse" />
  </div>
);

export default function UserProfile() {
  const dispatch = useDispatch();
const hasFetched = useRef(false);
  const { user } = useSelector((state) => state.auth);
  const { wallet, profile, loading, error } = useSelector(
    (state) => state.user
  );

useEffect(() => {
  const userId = user?._id || user?.id;

  if (!userId) return;

  if (hasFetched.current) return;

  hasFetched.current = true;
  dispatch(fetchUserProfile());
}, [dispatch, user?._id, user?.id]);

  const totalAmount =
    Number(wallet?.cash ?? 0) + Number(wallet?.bonus ?? 0);

  const shownUser = profile?.user || {};

  const fullName = useMemo(() => {
    return (
      shownUser?.name ||
      `${shownUser?.first_name || ""} ${shownUser?.last_name || ""}`.trim() ||
      "User"
    );
  }, [shownUser]);

  const email = shownUser?.email || "";

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="h-40 bg-gradient-to-r from-teal-300 via-emerald-200 to-lime-200" />

      <div className="max-w-6xl mx-auto px-4 -mt-16 pb-10">
        {error && <div className="text-red-600">{error}</div>}

        {/* PROFILE */}
        <div className="bg-white p-6 rounded-3xl shadow">
          <h1 className="text-2xl font-bold">{fullName}</h1>
          <p className="text-gray-500">{email}</p>
        </div>

        {/* STATS */}
<div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
  <StatCard
    label="Wallet Balance"
    value={fmtMoney(totalAmount)}
    sub={`Cash: ${fmtMoney(wallet?.cash)} • Bonus: ${fmtMoney(
      wallet?.bonus
    )}`}
  />

  <StatCard
    label="Purchased Packages"
    value={profile?.packages?.length || 0}
  />

  {/* ✅ NEW: Tickets */}
  <StatCard
    label="Tickets Purchased"
    value={profile?.tickets?.length || 0}
  />
</div>
        {/* ✅ SIDE BY SIDE */}
        <div className="mt-6 flex flex-col lg:flex-row gap-6">

          {/* PACKAGES */}
          <div className="flex-1 bg-white p-6 rounded-2xl shadow">
            <h2 className="text-lg font-bold">Purchased Packages</h2>

            <div className="mt-4 space-y-4 max-h-[500px] overflow-y-auto">
              {loading ? (
                <SkeletonCard />
              ) : profile?.packages?.length ? (
                profile.packages.map((p, i) => (
                  <PackageCard key={i} index={i} {...p} />
                ))
              ) : (
                <p className="text-gray-500">No packages found</p>
              )}
            </div>
          </div>

          {/* TICKETS */}
          <div className="flex-1 bg-white p-6 rounded-2xl shadow">
            <h2 className="text-lg font-bold">My Tickets</h2>

            <div className="mt-4 space-y-4 max-h-[500px] overflow-y-auto">
              {loading ? (
                <SkeletonCard />
              ) : profile?.tickets?.length ? (
                profile.tickets.map((t) => (
                  <TicketCard key={t.id} ticket={t} />
                ))
              ) : (
                <p className="text-gray-500">No tickets found</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}