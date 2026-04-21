import React, { useMemo, useState } from "react";
import { HiOutlineWallet, HiXMark } from "react-icons/hi2";
import { GiTwoCoins } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Payment from "./Payment";
import WithDrawl from "./UserProfiles/WithDrawl";

import {
  useGetWalletQuery,
  useUpdateWalletMutation,
} from "../service/userApi";

const WalletDropdown = () => {
  const [open, setOpen] = useState(false);
  const [addMoneyOpen, setAddMoneyOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  const navigate = useNavigate();

  const { user,bonus } = useSelector((state) => state.auth);
  const isLoggedIn = !!user;

  const userId = user?.id || user?._id;

  /* ================= WALLET QUERY ================= */
  const {
    data: wallet,
    isLoading,
    isFetching,
  } = useGetWalletQuery(userId, {
    skip: !userId,
  });

  /* ================= MUTATION ================= */
  const [updateWallet] = useUpdateWalletMutation();

  /* ================= SAFE VALUES ================= */
  const walletBalance = Number(wallet?.cash ?? 0);
const walletBonus = Number(bonus ?? 0);
  const totalAmount = useMemo(() => {
    return walletBalance + walletBonus;
  }, [walletBalance, walletBonus]);

  /* ================= HANDLERS ================= */
  const handleOpen = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    setOpen((v) => !v);
  };
  console.log("USER ID:", userId);
console.log("WALLET DATA:", wallet);
console.log("LOADING:", isLoading, isFetching);

  return (
    <>
      <div className="relative">
        <button
          onClick={handleOpen}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all hover:border-teal-200"
          type="button"
        >
          <span className="text-lg text-teal-500">
            <HiOutlineWallet />
          </span>

          <div className="flex items-center gap-2">
            <GiTwoCoins className="text-yellow-500 text-4xl" />
            <span>
              {isLoggedIn
                ? isLoading
                  ? "..."
                  : totalAmount
                : "Login"}
            </span>
          </div>

          <span className="ml-1 text-[11px] text-gray-400">▼</span>
        </button>

        {isLoggedIn && (
          <div
            className={`absolute right-0 top-12 w-[320px] z-50 transition-all duration-200 origin-top-right ${
              open
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)]">

              {/* HEADER */}
              <div className="relative px-5 pt-5 pb-4">
                <button
                  onClick={() => setOpen(false)}
                  className="absolute right-3 top-3 p-1.5 rounded-full hover:bg-gray-100"
                >
                  <HiXMark className="text-xl text-gray-500" />
                </button>

                <p className="text-xs uppercase text-gray-500">
                  Wallet Overview
                </p>

                <p className="text-base font-bold text-gray-900 flex gap-2 items-center">
                  <GiTwoCoins className="text-yellow-500 text-4xl" />
                  <span>{isFetching ? "..." : totalAmount}</span>
                </p>

                {/* BALANCES */}
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border p-3">
                    <p className="text-xs text-gray-500">Main Balance</p>
                    <p className="font-bold">{walletBalance}</p>
                  </div>

                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3">
                    <p className="text-xs text-emerald-700">Bonus Cash</p>
                    <p className="font-bold text-emerald-700">
                      {walletBonus}
                    </p>
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="px-5 py-4 border-t flex gap-3">
                <button
                  onClick={() => {
                    setOpen(false);
                    setWithdrawOpen(true);
                  }}
                  className="flex-1 py-2.5 text-sm font-semibold rounded-xl border"
                >
                  Withdraw
                </button>

                <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/purchase")
                  }}
                  className="flex-1 py-2.5 text-sm font-semibold rounded-xl bg-teal-500 text-white"
                >
                  Add Money
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PAYMENT MODAL */}
      <Payment
        open={addMoneyOpen}
        onClose={() => setAddMoneyOpen(false)}
        onSubmit={async (payload) => {
          const amount = Number(payload?.amount ?? 0);
          if (!amount || amount < 100) return;

          try {
            await updateWallet({ userId, amount }).unwrap();
            setAddMoneyOpen(false);
          } catch (err) {
            console.error("Wallet update failed", err);
          }
        }}
      />

      {/* WITHDRAW */}
      <WithDrawl
        open={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
      />
    </>
  );
};

export default WalletDropdown;