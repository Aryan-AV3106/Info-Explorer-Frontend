import { useState } from "react";

export default function Nasa() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchAPOD = async () => {
        setError("");
        setData(null);
        console.log("NASA KEY:", import.meta.env.VITE_NASA_API_KEY);
        const apiKey = import.meta.env.VITE_NASA_API_KEY;
        if (!apiKey) return setError("Missing NASA API key in .env");

        const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

        try {
            setLoading(true);
            const res = await fetch(url);
            const json = await res.json().catch(() => ({}));
            if (!res.ok) return setError(json?.error?.message || `Error ${res.status}`);

            setData({
                title: json.title,
                date: json.date,
                explanation: json.explanation,
                url: json.hdurl || json.url,
                mediaType: json.media_type, // 'image' | 'video'
            });
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">🚀 NASA Explorer — APOD</h2>
                <button
                    onClick={fetchAPOD}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? "Fetching…" : "Get Today’s APOD"}
                </button>
            </div>

            {error && <p className="text-red-400 text-sm font-medium">{error}</p>}

            {data && (
                <div className="mt-4 rounded-2xl bg-gray-900 border border-gray-800 p-5">
                    <div className="mb-3">
                        <div className="text-sm text-gray-400">{data.date}</div>
                        <h3 className="text-xl font-semibold">{data.title}</h3>
                    </div>

                    <div className="rounded-lg overflow-hidden border border-gray-800">
                        {data.mediaType === "image" ? (
                            <img src={data.url} alt={data.title} className="w-full h-auto" />
                        ) : (
                            <iframe
                                title={data.title}
                                src={data.url}
                                className="w-full aspect-video"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        )}
                    </div>

                    <p className="mt-4 text-gray-300 leading-relaxed">{data.explanation}</p>
                </div>
            )}

            {!data && !loading && !error && (
                <p className="text-gray-400">Click “Get Today’s APOD” to load the Astronomy Picture of the Day.</p>
            )}
        </>
    );
}
