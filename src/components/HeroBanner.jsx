import React from "react";
import { useNavigate } from "react-router-dom";
import heroImg from "../assets/images/powerplay02/heroImg.jpeg";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";

const pad2 = (n) => String(n).padStart(2, "0");

const formatTimeLeft = (targetMs) => {
  const now = Date.now();
  const diff = Math.max(0, targetMs - now);

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  return { days, hours, mins, secs, done: diff <= 0 };
};

const toINR = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

function HeroBanner() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isLoggedIn = React.useMemo(() => {
    if (user) return true;
    const savedUser = localStorage.getItem("user");
    return !!savedUser;
  }, [user]);

  const [pool, setPool] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  // Fetch pool
  React.useEffect(() => {
    const fetchPool = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/pool");

        // Expecting: { success: true, data: [...] }
        const list = res?.data?.data || [];
        const now = Date.now();

        // keep only non-expired pools
        const active = list
          .filter((p) => p?.expire_at && new Date(p.expire_at).getTime() > now)
          // choose nearest expiring (soonest draw)
          .sort(
            (a, b) =>
              new Date(a.expire_at).getTime() - new Date(b.expire_at).getTime()
          )[0];

        setPool(active || null);
      } catch (e) {
        console.error("HeroBanner pool fetch error:", e);
        setPool(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPool();
  }, []);

  // Target time for countdown (from API)
  const targetMs = React.useMemo(() => {
    if (!pool?.expire_at) return null;
    const t = new Date(pool.expire_at).getTime();
    return Number.isFinite(t) ? t : null;
  }, [pool]);

  const [left, setLeft] = React.useState(
    targetMs ? formatTimeLeft(targetMs) : formatTimeLeft(Date.now())
  );

  React.useEffect(() => {
    if (!targetMs) return;
    setLeft(formatTimeLeft(targetMs));

    const t = setInterval(() => setLeft(formatTimeLeft(targetMs)), 1000);
    return () => clearInterval(t);
  }, [targetMs]);

  // Dynamic values
  const jackpotText = pool?.jackpot ? toINR(pool.jackpot) : "₹—";
  const priceText = pool?.price ? toINR(pool.price) : "₹—";
  const titleText = pool?.title || "POWERBALL PLUS";

  return (
    <section className="bg-white px-4 pt-8 pb-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-center text-[30px] sm:text-[38px] font-extrabold tracking-tight text-gray-900 mb-2">
          Play Powerball Plus Lotto Online
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Secure entry • Live countdown • Instant confirmation
        </p>

        <div className="relative rounded-3xl overflow-hidden shadow-[0_18px_55px_rgba(0,0,0,0.12)] ring-1 ring-black/5">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-950 via-teal-700 to-white" />
          <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
          <div className="absolute -top-28 right-10 h-72 w-72 rounded-full bg-orange-300/20 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:18px_18px]" />

          <div className="relative grid grid-cols-1 md:grid-cols-2 items-stretch">
            {/* LEFT */}
            <div className="p-7 sm:p-10 text-white flex flex-col justify-center gap-5">
              {/* Logo */}
              <div className="flex items-center gap-2 flex-wrap">
                {titleText.split(" ").slice(0, 2).map((t) => (
                  <span
                    key={t}
                    className="h-9 px-4 rounded-full border border-white/25 bg-white/10 backdrop-blur
                               flex items-center font-extrabold tracking-[0.22em] text-sm"
                  >
                    {t.toUpperCase()}
                  </span>
                ))}
                <span className="h-9 px-3 rounded-2xl border border-white/25 bg-white/10 backdrop-blur flex items-center font-extrabold tracking-[0.25em] text-sm">
                  PLUS
                </span>
              </div>

              {/* Amount */}
              <div>
                <p className="text-white/80 font-semibold">
                  {loading ? "Loading jackpot..." : "Today’s Jackpot"}
                </p>
                <div className="mt-1 text-[44px] sm:text-[56px] font-black leading-none">
                  {jackpotText}
                </div>
              </div>

              {/* Meta pills */}
              <div className="flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 backdrop-blur px-4 py-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.85)]" />
                  <span className="text-sm font-semibold text-white/90">
                    Draw in
                  </span>

                  <span className="ml-2 font-mono text-sm font-bold tracking-wide">
                    {!targetMs ? (
                      "—"
                    ) : left.done ? (
                      "Expired"
                    ) : (
                      <>
                        {left.days}d : {pad2(left.hours)}h : {pad2(left.mins)}m :{" "}
                        {pad2(left.secs)}s
                      </>
                    )}
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 backdrop-blur px-4 py-2">
                  <span className="w-4 h-2.5 rounded bg-white/90" />
                  <span className="text-sm font-semibold text-white/90">
                    Ticket
                  </span>
                  <span className="ml-1 text-sm font-extrabold">
                    {priceText}
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-4 pt-1">
                {isLoggedIn ? (
                  <button
                    onClick={() =>
                      navigate("/playnow", { state: { ticketId: pool?.id } })
                    }
                    className="h-12 min-w-[200px] rounded-full font-extrabold tracking-wide text-gray-900
                               bg-gradient-to-b from-amber-300 to-orange-500
                               shadow-[0_14px_30px_rgba(255,140,0,0.35)]
                               hover:brightness-105 active:brightness-95 transition
                               focus:outline-none focus:ring-4 focus:ring-orange-200/60"
                    disabled={!pool}
                    title={!pool ? "No active pool available" : "Play now"}
                  >
                    PLAY NOW
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => navigate("/register")}
                      className="h-12 min-w-[160px] rounded-full font-extrabold tracking-wide text-gray-900
                                 bg-gradient-to-b from-amber-300 to-orange-500
                                 shadow-[0_14px_30px_rgba(255,140,0,0.35)]
                                 hover:brightness-105 active:brightness-95 transition
                                 focus:outline-none focus:ring-4 focus:ring-orange-200/60"
                    >
                      REGISTER
                    </button>

                    <button
                      onClick={() => navigate("/login")}
                      className="h-12 min-w-[160px] rounded-full font-extrabold tracking-wide
                                 border border-white/35 text-white bg-white/5 backdrop-blur
                                 hover:bg-white/10 transition
                                 focus:outline-none focus:ring-4 focus:ring-white/25"
                    >
                      LOGIN
                    </button>
                  </>
                )}
              </div>

              <div className="text-xs text-white/75 flex flex-wrap gap-x-4 gap-y-1">
                <span>• Secure payments</span>
                <span>• Instant confirmation</span>
                <span>• Fast withdrawals</span>
              </div>
            </div>

            {/* RIGHT */}
            <div className="relative p-6 sm:p-8 flex items-center justify-center">
              <div className="absolute inset-0 md:inset-auto md:right-0 md:top-0 md:bottom-0 md:w-[120%] bg-gradient-to-l from-black/0 via-black/5 to-black/25" />

              <div className="relative w-full max-w-[520px] group">
                <div
                  className="relative rounded-3xl overflow-hidden
                             ring-1 ring-white/35 bg-white/10 backdrop-blur
                             shadow-[0_18px_50px_rgba(0,0,0,0.25)]
                             transform md:rotate-[-2deg] md:translate-x-3
                             group-hover:rotate-0 group-hover:translate-x-0 transition duration-300"
                >
                  <div className="absolute inset-0 pointer-events-none ring-1 ring-white/20 rounded-3xl" />

                  <img
                    src={heroImg}
                    alt="Powerball hero"
                    className="w-full h-[260px] sm:h-[320px] md:h-[420px] object-cover"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />

                  <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/25 px-3 py-1.5 backdrop-blur">
                    <span className="h-2 w-2 rounded-full bg-emerald-300" />
                    <span className="text-xs font-bold tracking-wide text-white">
                      LIVE DRAWS
                    </span>
                  </div>
                </div>

                <div className="absolute -z-10 -bottom-4 -left-4 h-full w-full rounded-3xl bg-white/10 blur-[1px] ring-1 ring-white/15" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;
