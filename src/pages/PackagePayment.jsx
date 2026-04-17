import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import lottery from "../assets/images/powerplay02/coins.jpg";
import Payment from "../components/Payment";
import { useSelector } from "react-redux";
import { GiTwoCoins } from "react-icons/gi";
import { FaRupeeSign } from "react-icons/fa";
import toast from "react-hot-toast";

/* ✅ RTK QUERY */
import {
  useGetWalletQuery,
  useUpdateWalletMutation,
} from "../service/userApi";

function PackagePayment() {
  const user = useSelector((state) => state.auth.user);

  const userId =
    user?._id || user?.id || user?.uid || user?.userId || null;

  /* ================= RTK QUERY WALLET ================= */
  const { refetch: refetchWallet } = useGetWalletQuery(userId, {
    skip: !userId,
  });

  const [updateWallet] = useUpdateWalletMutation();

  /* ================= LOCAL STATE ================= */
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");

  const [addMoneyOpen, setAddMoneyOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState(null);

  /* ================= FETCH PACKAGES ================= */
  const fetchPackages = async () => {
    try {
      setLoading(true);
      setErr("");
      const res = await axiosInstance.get("/package");
      setPackages(res.data?.data ?? []);
    } catch (e) {
      setErr(
        e?.response?.data?.message ||
          e?.message ||
          "Failed to load packages."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();
    if (!text) return packages;

    return packages.filter((p) =>
      String(p?.package_name || "").toLowerCase().includes(text)
    );
  }, [packages, q]);

  const handleBuyClick = (pkg) => {
    setSelectedPkg(pkg);
    setAddMoneyOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8">

        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          Choose a Package
        </h1>

        <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur px-3 py-1 text-sm font-semibold">
          <GiTwoCoins className="text-yellow-400 text-4xl" />
          <span className="text-xl">1 Coin</span>
          <span className="text-xl">=</span>
          <FaRupeeSign className="text-green-400 text-2xl" />
          <span className="text-xl">1 Rupee</span>
        </div>

        {/* ================= PACKAGES ================= */}
        {!loading && !err && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((pkg) => (
              <div
                key={pkg._id || pkg.id}
                className="group relative overflow-hidden aspect-[16/10] rounded-[26px]"
                style={{
                  backgroundImage: `url(${lottery})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-black/45" />

                <div className="relative h-full p-5 text-white flex flex-col justify-between">

                  {/* TOP */}
                  <div>
                    <h3 className="text-xl font-semibold">
                      {pkg.package_name}
                    </h3>

                    <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur px-3 py-1 text-sm font-semibold">
                      <GiTwoCoins className="text-yellow-400 text-4xl" />
                      <span className="text-xl">1 Coin</span>
                      <span className="text-xl">=</span>
                      <FaRupeeSign className="text-green-400 text-2xl" />
                      <span className="text-xl">1 Rupee</span>
                    </div>
                  </div>

                  {/* BOTTOM */}
                  <div className="flex justify-between items-end">
                    <p className="flex items-center gap-2 text-2xl font-bold">
                      <GiTwoCoins className="text-yellow-400 text-4xl" />
                      {pkg.package_price}
                    </p>

                    <button
                      onClick={() => handleBuyClick(pkg)}
                      className="rounded-xl bg-gradient-to-r from-orange-500 to-pink-500
                                 px-6 py-3 font-semibold shadow-lg hover:scale-105 transition"
                    >
                      Buy
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= PAYMENT MODAL ================= */}
        <Payment
          open={addMoneyOpen}
          onClose={() => {
            setAddMoneyOpen(false);
            setSelectedPkg(null);
          }}
          userId={userId}
          amount={Number(selectedPkg?.package_price ?? 0)}
          title={selectedPkg?.package_name || "Selected Package"}
          package_id={
            selectedPkg?.id ||
            selectedPkg?._id ||
            selectedPkg?.package_id
          }
          onSubmit={async ({ amount }) => {
            try {
              if (!amount) return;

              /* ✅ RTK QUERY WALLET UPDATE */
              await updateWallet({
                userId,
                amount: Number(amount),
              });

              /* 🔥 ensure latest wallet sync */
              await refetchWallet();

              setAddMoneyOpen(false);
              setSelectedPkg(null);

              toast.success("Wallet updated successfully");
            } catch (err) {
              console.error(err);
              toast.error("Failed to update wallet");
            }
          }}
        />

      </div>
    </div>
  );
}

export default PackagePayment;