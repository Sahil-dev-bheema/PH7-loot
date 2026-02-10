import React from "react";

const PrizeTiers = () => {
  // demo rows (replace with API)
  const rows = [
    { match: "Five (5) numbers + Powerball", prize: "Jackpot" },
    { match: "Five (5) numbers", prize: "$500 000" },
    { match: "Four (4) numbers + Powerball", prize: "$50 000" },
    { match: "Four (4) numbers", prize: "$100" },
    { match: "Three (3) numbers + Powerball", prize: "$100" },
    { match: "Three (3) numbers", prize: "$7" },
    { match: "Two (2) numbers + Powerball", prize: "$7" },
    { match: "One (1) number + Powerball", prize: "$4" },
    { match: "Powerball only", prize: "$4" },
  ];

  return (
    <section className="bg-white px-4">
      <div className="max-w-6xl mx-auto py-10">
        <h2 className="text-3xl font-extrabold text-gray-900">Prize Tiers</h2>
        <p className="mt-2 text-gray-600 text-sm">
          This lottery boasts offer prizes across 9 different tiers.
        </p>

        <div className="mt-6 rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="grid grid-cols-2 px-6 py-4 bg-gray-50">
            <div className="text-sm font-extrabold text-gray-800">
              NUMBERS MATCHED
            </div>
            <div className="text-sm font-extrabold text-gray-800 text-right">
              PRIZE
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {rows.map((r, idx) => (
              <div
                key={idx}
                className={`grid grid-cols-2 px-6 py-4 ${
                  idx === 0 ? "bg-teal-50" : "bg-white"
                }`}
              >
                <div className="text-sm text-gray-700">{r.match}</div>
                <div className="text-sm text-gray-700 text-right">
                  {r.prize}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrizeTiers;
