import React from "react";

function HowToplay() {
  const bodyText = "text-[13.5px] md:text-[14px] leading-[1.75] text-gray-600";
  const bulletText = "text-[13.5px] md:text-[14px] leading-[1.75] text-gray-700";

  return (
    <section className="bg-white px-4">
      <div className="max-w-6xl mx-auto py-12">
        {/* Header */}
        <div className="rounded-2xl border border-gray-100 bg-gradient-to-r from-teal-50 via-white to-white p-6 md:p-8 shadow-sm">
          <h2 className="text-[20px] md:text-[22px] font-semibold text-gray-900">
            How to play Powerball Plus Lottery Online?
          </h2>
          <p className={`mt-2 max-w-4xl ${bodyText}`}>
            Get your Powerball Plus entry in minutes. Follow these quick steps and
            start playing online securely on Lotto247.
          </p>
        </div>

        {/* Content */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Steps Card */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 md:p-7">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-[15px] font-semibold text-gray-900">
                In 3 steps, you can get your entry
              </h3>
              <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-[12px] font-medium border border-teal-100">
                Quick setup
              </span>
            </div>

            <div className="mt-5 space-y-4">
              <div className="flex gap-4">
                <div className="w-9 h-9 rounded-full bg-teal-500 text-white font-bold flex items-center justify-center shrink-0">
                  1
                </div>
                <p className={bulletText}>
                  Sign in to your <span className="font-semibold">Lotto247</span>{" "}
                  account. If you don’t have one, create it first.
                </p>
              </div>

              <div className="flex gap-4">
                <div className="w-9 h-9 rounded-full bg-teal-500 text-white font-bold flex items-center justify-center shrink-0">
                  2
                </div>
                <p className={bulletText}>
                  Deposit funds using one of our{" "}
                  <span className="font-semibold">safe and secure</span> payment
                  methods.
                </p>
              </div>

              <div className="flex gap-4">
                <div className="w-9 h-9 rounded-full bg-teal-500 text-white font-bold flex items-center justify-center shrink-0">
                  3
                </div>
                <p className={bulletText}>
                  Once funds reflect in your Lotto247 account, you’re ready to play
                  the lottery online.
                </p>
              </div>
            </div>

            {/* Mini highlight */}
            <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-5">
              <p className={bodyText}>
                Tip: Keep your account funded so you can enter draws quickly without
                delays.
              </p>
            </div>
          </div>

          {/* Game Explanation Card */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 md:p-7">
            <h3 className="text-[15px] font-semibold text-gray-900">
              How the game works
            </h3>

            <p className={`mt-4 ${bodyText}`}>
              Powerball Plus is a <span className="font-semibold text-gray-800">two-drum</span>{" "}
              lottery game:
            </p>

            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-4">
                <span className="mt-[8px] w-3 h-3 rounded-full bg-teal-400 shrink-0" />
                <p className={bulletText}>
                  Drum 1 contains <span className="font-semibold">69 white balls</span>.
                </p>
              </div>

              <div className="flex items-start gap-4">
                <span className="mt-[8px] w-3 h-3 rounded-full bg-teal-400 shrink-0" />
                <p className={bulletText}>
                  Drum 2 contains <span className="font-semibold">26 red balls</span>.
                </p>
              </div>

              <div className="flex items-start gap-4">
                <span className="mt-[8px] w-3 h-3 rounded-full bg-teal-400 shrink-0" />
                <p className={bulletText}>
                  Five (5) balls are drawn from Drum 1, and one (1) red ball is drawn
                  from Drum 2.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-teal-50 border border-teal-100 p-5">
              <p className="text-[13.5px] md:text-[14px] leading-[1.75] text-gray-700">
                The red ball is called the{" "}
                <span className="font-semibold text-teal-700">Powerball</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowToplay;