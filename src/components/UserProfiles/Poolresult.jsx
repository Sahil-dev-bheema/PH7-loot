import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

/* ---------- money formatter ---------- */
const fmtMoney = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(Number(n || 0));

const Poolresult = ({ poolTitle }) => {
  const [loading, setLoading] = useState(false);
  const [winners, setWinners] = useState([]);
  const [poolName, setPoolName] = useState("");
  const [declaredAt, setDeclaredAt] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!poolTitle) return;

    console.log("Pool Title:", poolTitle);

    const fetchResult = async () => {
      try {
        setLoading(true);
        setError("");
        setWinners([]);

        const res = await axiosInstance.get(
          `/pool/result/${encodeURIComponent(poolTitle)}`
        );

        const data = res?.data?.data;

        setPoolName(data?.pool_name);
        setDeclaredAt(data?.declared_at);
        setWinners(data?.winners || []);
      } catch (err) {
        console.error("RESULT API ERROR:", err?.response || err);
        setError("Result not declared yet");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [poolTitle]);

  return (
    <div className="max-w-3xl mx-auto mt-6 bg-white rounded-3xl p-6 ring-1 ring-slate-200">
      <h2 className="text-xl font-extrabold mb-1">
        Pool Result
      </h2>

      {poolName && (
        <p className="text-sm text-slate-500 mb-4">
          Pool: <span className="font-semibold">{poolName}</span>
        </p>
      )}

      {loading && (
        <p className="text-slate-500">Fetching result...</p>
      )}

      {error && (
        <p className="text-amber-600">{error}</p>
      )}

      {!loading && winners.length > 0 && (
        <div className="space-y-3">
          {winners.map((w) => (
            <div
              key={w.position}
              className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  #{w.position} • {w.first_name} {w.last_name}
                </p>
                <p className="text-xs text-slate-500">
                  {w.email}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs uppercase text-slate-500">
                  Prize
                </p>
                <p className="text-lg font-extrabold text-emerald-600">
                  {fmtMoney(w.prize_amount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {declaredAt && (
        <p className="text-xs text-slate-400 mt-4">
          Declared at: {new Date(declaredAt).toLocaleString()}
        </p>
      )}
    </div>
  );
};

export default Poolresult;
