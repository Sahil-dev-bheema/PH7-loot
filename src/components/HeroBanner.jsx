import React from "react";
import { useNavigate } from "react-router-dom";
import heroImg from "../assets/images/powerplay02/heroImg.jpeg";
import axiosInstance from "../utils/axiosInstance";
import { useSelector } from "react-redux"; // ✅ Redux

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
  `₹${Number(n || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;

function HeroBanner() {
  const navigate = useNavigate();

  // ✅ REDUX USER
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = !!user;

  const [pool, setPool] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  // Fetch pool
  React.useEffect(() => {
    const fetchPool = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/pool");

        const list = res?.data?.data || [];
        const now = Date.now();

        const active = list
          .filter((p) => p?.expire_at && new Date(p.expire_at).getTime() > now)
          .sort(
            (a, b) =>
              new Date(a.expire_at).getTime() -
              new Date(b.expire_at).getTime()
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

          <div className="relative grid grid-cols-1 md:grid-cols-2 items-stretch">
            {/* LEFT */}
            <div className="p-7 sm:p-10 text-white flex flex-col justify-center gap-5">
              
              {/* TITLE */}
              <div className="flex items-center gap-2 flex-wrap">
                {titleText.split(" ").slice(0, 2).map((t) => (
                  <span key={t} className="h-9 px-4 rounded-full border border-white/25 bg-white/10 backdrop-blur flex items-center font-extrabold tracking-[0.22em] text-sm">
                    {t.toUpperCase()}
                  </span>
                ))}
                <span className="h-9 px-3 rounded-2xl border border-white/25 bg-white/10 backdrop-blur flex items-center font-extrabold tracking-[0.25em] text-sm">
                  PLUS
                </span>
              </div>

              {/* JACKPOT */}
              <div>
                <p className="text-white/80 font-semibold">
                  {loading ? "Loading jackpot..." : "Today’s Jackpot"}
                </p>
                <div className="mt-1 text-[44px] sm:text-[56px] font-black leading-none">
                  {jackpotText}
                </div>
              </div>

              {/* COUNTDOWN */}
              <div className="flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-2">
                  <span className="text-sm font-semibold">Draw in</span>
                  <span className="ml-2 font-mono text-sm font-bold">
                    {!targetMs
                      ? "—"
                      : left.done
                      ? "Expired"
                      : `${left.days}d : ${pad2(left.hours)}h : ${pad2(
                          left.mins
                        )}m : ${pad2(left.secs)}s`}
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-2">
                  <span className="text-sm font-semibold">Ticket</span>
                  <span className="ml-1 text-sm font-extrabold">
                    {priceText}
                  </span>
                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex flex-wrap gap-4 pt-1">
                {isLoggedIn ? (
                  <button
                    onClick={() =>
                      navigate("/playnow", { state: { ticketId: pool?.id } })
                    }
                    className="h-12 min-w-[200px] rounded-full font-extrabold bg-orange-500 text-gray-900"
                    disabled={!pool}
                  >
                    PLAY NOW
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => navigate("/register")}
                      className="h-12 min-w-[160px] rounded-full font-extrabold bg-orange-500 text-gray-900"
                    >
                      REGISTER
                    </button>

                    <button
                      onClick={() => navigate("/login")}
                      className="h-12 min-w-[160px] rounded-full border text-white"
                    >
                      LOGIN
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="p-6 flex items-center justify-center">
              <img
                src={heroImg}
                alt="hero"
                className="rounded-3xl w-full max-w-[520px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;