import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  useGetUserProfileQuery,
  useGetWalletQuery,
} from "../../service/userApi";

/* ---------- money formatter ---------- */
const fmtMoney = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(n || 0));

export default function UserProfile() {
  const { user } = useSelector((state) => state.auth);

  const userId = user?._id || user?.uid || user?.userId;

  /* ================= RTK QUERY (PROFILE) ================= */
  const {
    data: profile,
    isLoading: profileLoading,
    isFetching: profileFetching,
    error: profileError,
  } = useGetUserProfileQuery(userId, {
    skip: !userId,
  });

  /* ================= RTK QUERY (WALLET) ================= */
  const {
    data: wallet,
    isLoading: walletLoading,
    isFetching: walletFetching,
    error: walletError,
  } = useGetWalletQuery(userId, {
    skip: !userId,
  });

  /* ================= SAFE DATA ================= */

  const shownUser = profile?.user || {};

  const fullName = useMemo(() => {
    return (
      shownUser?.name ||
      `${shownUser?.first_name || ""} ${shownUser?.last_name || ""}`.trim() ||
      "User"
    );
  }, [shownUser]);

  const email = shownUser?.email || "";

  const totalAmount = useMemo(() => {
    return Number(wallet?.cash || 0) + Number(wallet?.bonus || 0);
  }, [wallet]);

  const isProfileLoading = profileLoading || profileFetching;
  const isWalletLoading = walletLoading || walletFetching;

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="h-40 bg-gradient-to-r from-teal-300 via-emerald-200 to-lime-200" />

      <div className="max-w-6xl mx-auto px-4 -mt-16 pb-10">

        {/* ERROR */}
        {(profileError || walletError) && (
          <div className="text-red-600 mb-4">
            {String(
              profileError?.data?.message ||
              walletError?.data?.message ||
              profileError?.data ||
              walletError?.data ||
              profileError?.message ||
              walletError?.message ||
              "Something went wrong"
            )}
          </div>
        )}

        {/* PROFILE CARD */}
        <div className="bg-white p-6 rounded-3xl shadow">
          <h1 className="text-2xl font-bold">
            {isProfileLoading ? "Loading..." : fullName}
          </h1>
          <p className="text-gray-500">{email}</p>
        </div>

        {/* STATS */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="p-5 rounded-2xl bg-white shadow">
            <p className="text-sm text-gray-500">Wallet Balance</p>
            <p className="text-xl font-bold">
              {isWalletLoading ? "Loading..." : fmtMoney(totalAmount)}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white shadow">
            <p className="text-sm text-gray-500">Purchased Packages</p>
            <p className="text-xl font-bold">
              {profile?.packages?.length || 0}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white shadow">
            <p className="text-sm text-gray-500">Tickets Purchased</p>
            <p className="text-xl font-bold">
              {profile?.tickets?.length || 0}
            </p>
          </div>

        </div>

        {/* SIDE BY SIDE */}
        <div className="mt-6 flex flex-col lg:flex-row gap-6">

          {/* PACKAGES */}
          <div className="flex-1 bg-white p-6 rounded-2xl shadow">
            <h2 className="text-lg font-bold">Purchased Packages</h2>

            <div className="mt-4 space-y-4 max-h-[500px] overflow-y-auto">
              {isProfileLoading ? (
                <div className="h-24 bg-slate-100 rounded-3xl animate-pulse" />
              ) : profile?.packages?.length ? (
                profile.packages.map((p, i) => (
                  <div key={p.purchaseId || i} className="p-4 border rounded-xl">
                    {p.title}
                  </div>
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
              {isProfileLoading ? (
                <div className="h-24 bg-slate-100 rounded-3xl animate-pulse" />
              ) : profile?.tickets?.length ? (
                profile.tickets.map((t, i) => (
                  <div key={t.id || i} className="p-4 border rounded-xl">
                    {t.pool_name}
                  </div>
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