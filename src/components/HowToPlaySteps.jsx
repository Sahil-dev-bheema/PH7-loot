import React from "react";


const StepCard = ({ step, title, desc, alt }) => {
  return (
    <div className="group relative rounded-3xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-md transition">
      {/* Image frame */}
      <div className="relative h-[190px] md:h-[210px] overflow-hidden">
        <img
          src={"/vite.svg"}
          alt={alt}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.06]"
          loading="lazy"
        />

        {/* overlay for premium look */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />

        {/* framed border */}
        <div className="absolute inset-0 ring-1 ring-inset ring-black/10" />

        {/* Step badge */}
        <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/25 px-3 py-1.5 backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-teal-300 shadow-[0_0_18px_rgba(94,234,212,0.9)]" />
          <span className="text-xs font-extrabold tracking-wider text-white">
            STEP {step}
          </span>
        </div>
      </div>

      {/* Content (kept consistent height) */}
      <div className="px-6 py-5 min-h-[110px] flex flex-col justify-between">
        <div>
          <p className="text-[13px] font-semibold text-gray-900">{title}</p>
          <p className="mt-1 text-[13.5px] md:text-[14px] leading-[1.75] text-gray-600">
            {desc}
          </p>
        </div>

        {/* tiny accent line */}
        <div className="mt-4 h-[2px] w-10 rounded-full bg-teal-400/70" />
      </div>

      {/* subtle corner glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-teal-300/15 blur-3xl" />
    </div>
  );
};

const HowToPlaySteps = () => {
  const p = "text-[13.5px] md:text-[14px] leading-[1.75] text-gray-600";
  const li = "text-[13.5px] md:text-[14px] leading-[1.75] text-gray-700";

  return (
    <section className="bg-white px-4">
      <div className="max-w-6xl mx-auto py-12">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-[20px] md:text-[22px] font-semibold text-gray-900">
            To play the Powerball Plus lottery, you need to;
          </h2>
          <div className="mt-4 h-[2px] w-16 bg-teal-400 mx-auto rounded-full" />
        </div>

        {/* COOL + ALIGNED IMAGES ROW */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <StepCard
            step="01"
            title="Pick 5 main numbers"
            desc="Choose five (5) numbers from the main pool."
            alt="Select main numbers"
          />
          <StepCard
            step="02"
            title="Pick the Powerball"
            desc="Choose one (1) number from the Powerball pool."
            alt="Select powerball number"
          />
        </div>

        {/* Content column */}
        <div className="mt-10 max-w-5xl mx-auto">
          {/* Quick bullets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <span className="mt-[8px] w-2.5 h-2.5 rounded-full bg-teal-400 shrink-0" />
              <p className={li}>
                Select five (5) numbers from a pool of 69 possible numbers and;
              </p>
            </div>

            <div className="flex items-start gap-4">
              <span className="mt-[8px] w-2.5 h-2.5 rounded-full bg-teal-400 shrink-0" />
              <p className={li}>Select one (1) number from 26 possible numbers.</p>
            </div>
          </div>

          {/* Quick Pick paragraph */}
          <div className="mt-7 rounded-2xl border border-gray-100 bg-gray-50 p-6">
            <p className={p}>
              When choosing your lucky numbers, you have two (2) options:{" "}
              <span className="font-semibold text-gray-800">manual selection</span>{" "}
              or the{" "}
              <span className="font-semibold text-gray-800">Quick Pick</span>{" "}
              method. In the Quick Pick method, a random number generator is used
              to choose your lucky numbers.
            </p>
          </div>

          {/* Benefits */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6">
              <h3 className="text-[14px] font-semibold text-gray-900">
                Benefits when playing on Lotto247
              </h3>

              <div className="mt-4 space-y-4">
                <div className="flex items-start gap-4">
                  <span className="mt-[8px] w-2.5 h-2.5 rounded-full bg-teal-400 shrink-0" />
                  <p className={li}>
                    When you buy tickets on Lotto247, you do not need to leave the
                    comfort of your home or office.
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <span className="mt-[8px] w-2.5 h-2.5 rounded-full bg-teal-400 shrink-0" />
                  <p className={li}>
                    Your lottery tickets are safely stored in your Lotto247 account
                    and cannot be lost, damaged or stolen.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6">
              <h3 className="text-[14px] font-semibold text-gray-900">
                Auto-check & payouts
              </h3>

              <p className={`mt-4 ${p}`}>
                Your lucky numbers are automatically checked against the drawn
                winning numbers after every draw. We will immediately credit your
                Lotto247 account if you matched the winning numbers and won the
                jackpot or any other prize.
              </p>

              <div className="mt-6 rounded-xl bg-teal-50 border border-teal-100 p-5">
                <p className="text-[13.5px] md:text-[14px] leading-[1.75] text-gray-700">
                  Visit our{" "}
                  <span className="text-teal-600 font-medium cursor-pointer hover:underline">
                    Powerball Plus Resource Centre
                  </span>{" "}
                  for more help with playing this lottery online on Lotto247.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* end content column */}
      </div>
    </section>
  );
};

export default HowToPlaySteps;