import { useState } from "react";

function fmtNumber(n) {
    if (n == null || Number.isNaN(n)) return "—";
    try { return new Intl.NumberFormat().format(n); } catch { return String(n); }
}
function fmtMoney(n, vs) {
    if (n == null || Number.isNaN(n)) return "—";
    const upper = vs?.toUpperCase?.() || "";
    return `${fmtNumber(Number(n).toFixed(2))} ${upper}`;
}
function titleCase(s) { return s ? s[0].toUpperCase() + s.slice(1) : ""; }

export default function Crypto() {
    const [coin, setCoin] = useState("bitcoin");
    const [vs, setVs] = useState("usd");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchPrice = async (e) => {
        e.preventDefault?.(); // supports onClick or onSubmit
        setError("");
        setData(null);

        const id = coin.trim().toLowerCase();
        const cur = vs.trim().toLowerCase();
        if (!id || !cur) return setError("Enter a coin id and a currency (e.g., bitcoin / usd).");

        const url = new URL("https://api.coingecko.com/api/v3/simple/price");
        url.searchParams.set("ids", id);
        url.searchParams.set("vs_currencies", cur);
        url.searchParams.set("include_market_cap", "true");
        url.searchParams.set("include_24hr_change", "true");

        try {
            setLoading(true);
            const res = await fetch(url.toString(), { headers: { Accept: "application/json" } });
            const json = await res.json().catch(() => ({}));

            if (!res.ok) {
                // CoinGecko rate limit or other error
                return setError(json?.error || `Error ${res.status}`);
            }
            if (!json[id] || json[id][cur] == null) {
                return setError("Invalid coin or currency. Try coin like 'bitcoin' and currency 'usd'.");
            }

            const price = json[id][cur];
            const mc = json[id][`${cur}_market_cap`];
            const chg = json[id][`${cur}_24h_change`];

            setData({
                coin: id,
                vs: cur,
                price,
                marketCap: mc,
                change24h: chg,
                fetchedAt: new Date(),
            });
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const changeColor =
        data?.change24h == null ? "" : data.change24h >= 0 ? "text-green-400" : "text-red-400";
    const sign = data?.change24h == null ? "" : data.change24h >= 0 ? "+" : "";

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">💰 Crypto Tracker</h2>
                <button
                    onClick={fetchPrice}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? "Fetching…" : "Fetch"}
                </button>
            </div>

            <form onSubmit={fetchPrice} className="flex flex-wrap gap-3 items-center mb-4">
                <input
                    className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="coin id (e.g., bitcoin, ethereum)"
                    value={coin}
                    onChange={(e) => setCoin(e.target.value)}
                />
                <input
                    className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none w-28"
                    placeholder="vs (e.g., usd, inr)"
                    value={vs}
                    onChange={(e) => setVs(e.target.value)}
                />
                <button className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg" disabled={loading}>
                    Go
                </button>
            </form>

            {error && <p className="text-sm text-red-400 font-medium">{error}</p>}

            {data && (
                <div className="mt-4 max-w-md rounded-2xl bg-gray-900 border border-gray-800 p-5">
                    <div className="text-sm text-gray-400">
                        {titleCase(data.coin)} • {data.vs.toUpperCase()}
                    </div>
                    <div className="text-4xl font-bold mt-1">{fmtMoney(data.price, data.vs)}</div>
                    <div className="mt-2 text-gray-300">
                        Market cap: <span className="text-gray-100">{fmtNumber(Math.round(data.marketCap))}</span>
                    </div>
                    <div className={`mt-1 ${changeColor}`}>
                        24h: {sign}{data.change24h?.toFixed?.(2)}%
                    </div>
                    <div className="mt-3 text-xs text-gray-500">
                        Updated: {data.fetchedAt.toLocaleString()}
                    </div>
                </div>
            )}

            {!data && !error && (
                <p className="text-gray-400">Try coins like <span className="text-gray-200">bitcoin</span>, <span className="text-gray-200">ethereum</span>. Currencies like <span className="text-gray-200">usd</span>, <span className="text-gray-200">inr</span>.</p>
            )}
        </>
    );
}
