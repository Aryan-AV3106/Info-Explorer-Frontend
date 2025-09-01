import { useState } from "react";

// fetch helper (RestCountries v3.1)
async function fetchCountry(name) {
    const url =
        `https://restcountries.com/v3.1/name/${encodeURIComponent(name)}?fields=name,capital,region,population,flags,cca2`;

    const res = await fetch(url, { headers: { Accept: "application/json" } });

    // try to read API message even on errors
    let json;
    try { json = await res.json(); } catch { json = null; }

    if (!res.ok || !Array.isArray(json) || json.length === 0) {
        const msg = (json && json.message) ? json.message : "Country not found";
        throw new Error(msg);
    }

    const c = json[0];
    return {
        name: c?.name?.common || name,
        capital: Array.isArray(c?.capital) ? c.capital[0] : (c?.capital || "—"),
        region: c?.region || "—",
        population: typeof c?.population === "number" ? c.population : null,
        code: c?.cca2 || "",
        flag: c?.flags?.svg || c?.flags?.png || "",
    };
}

export default function Country() {
    const [q, setQ] = useState("");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setData(null);

        const name = q.trim();
        if (!name) return setError("Please enter a country name.");

        try {
            setLoading(true);
            const result = await fetchCountry(name);
            setData(result);
        } catch (err) {
            setError(err.message || "Failed to fetch country info.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h2 className="text-2xl font-semibold mb-6">🌍 Country Explorer</h2>

            <form onSubmit={onSubmit} className="flex gap-3 w-full max-w-md">
                <input
                    className="flex-1 px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Enter country name (e.g., India)"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                />
                <button
                    className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? "Searching..." : "Search"}
                </button>
            </form>

            {error && (
                <p className="mt-4 text-red-400 text-sm font-medium">{error}</p>
            )}

            {data && (
                <div className="mt-6 w-full max-w-md p-5 rounded-xl bg-gray-900 border border-gray-700 shadow-md">
                    <div className="flex items-center gap-4">
                        {data.flag && (
                            <img
                                src={data.flag}
                                alt={`${data.name} flag`}
                                className="w-10 h-7 rounded border border-gray-700"
                            />
                        )}
                        <h3 className="text-xl font-semibold">
                            {data.name} {data.code ? `(${data.code})` : ""}
                        </h3>
                    </div>

                    <div className="mt-3 text-gray-300 space-y-1">
                        <div>
                            <span className="text-gray-400">Capital:</span> {data.capital}
                        </div>
                        <div>
                            <span className="text-gray-400">Region:</span> {data.region}
                        </div>
                        <div>
                            <span className="text-gray-400">Population:</span>{" "}
                            {data.population?.toLocaleString() ?? "—"}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
