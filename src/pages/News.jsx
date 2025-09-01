import { useState } from "react";

async function fetchHN(query, limit = 10) {
    const url = new URL("https://hn.algolia.com/api/v1/search");
    url.searchParams.set("query", query);
    url.searchParams.set("tags", "story");
    url.searchParams.set("hitsPerPage", String(limit));

    const res = await fetch(url.toString(), { headers: { Accept: "application/json" } });
    const json = await res.json().catch(() => ({}));

    if (!res.ok) throw new Error(json?.message || `Error ${res.status}`);

    const hits = Array.isArray(json?.hits) ? json.hits : [];
    return hits.map((h) => ({
        id: h.objectID,
        title: h.title || "(no title)",
        author: h.author || "unknown",
        url: h.url || (h.objectID ? `https://news.ycombinator.com/item?id=${h.objectID}` : ""),
        points: h.points ?? 0,
        created_at: h.created_at || "",
    }));
}

export default function News() {
    const [q, setQ] = useState("technology");
    const [limit, setLimit] = useState(10);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const onSearch = async (e) => {
        e.preventDefault();
        setError("");
        setItems([]);

        const query = q.trim();
        if (!query) return setError("Enter a topic (e.g., technology, crypto, india).");

        try {
            setLoading(true);
            const data = await fetchHN(query, limit);
            setItems(data);
        } catch (err) {
            setError(err.message || "Failed to fetch news.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h2 className="text-2xl font-semibold mb-6">📰 News Explorer</h2>

            <form onSubmit={onSearch} className="flex flex-wrap gap-3 items-center mb-4">
                <input
                    className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Topic (e.g., technology, crypto, india)"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                />
                <select
                    className="px-3 py-2 rounded-lg bg-gray-900 border border-gray-700"
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                >
                    {[5, 10, 15, 20].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <button className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg" disabled={loading}>
                    {loading ? "Searching…" : "Search"}
                </button>
            </form>

            {error && <p className="text-sm text-red-400 font-medium">{error}</p>}

            {!items.length && !error && !loading && (
                <p className="text-gray-400">Try topics like <span className="text-gray-200">technology</span>, <span className="text-gray-200">crypto</span>, <span className="text-gray-200">ai</span>.</p>
            )}

            {!!items.length && (
                <ul className="divide-y divide-gray-800 rounded-2xl overflow-hidden border border-gray-800 bg-gray-900">
                    {items.map((a) => (
                        <li key={a.id} className="p-4 hover:bg-gray-850/60">
                            <a
                                href={a.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-lg font-medium text-blue-300 hover:underline"
                            >
                                {a.title}
                            </a>
                            <div className="text-xs text-gray-500 mt-1">
                                by {a.author} • {a.points} points • {new Date(a.created_at).toLocaleString()}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}
