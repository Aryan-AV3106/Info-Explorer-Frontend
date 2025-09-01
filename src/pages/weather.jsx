import { useState } from "react";

export default function Weather() {
    const [city, setCity] = useState("");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchWeather = async (e) => {
        e.preventDefault();
        setError("");
        setData(null);

        const q = city.trim();
        if (!q) return setError("Please enter a city name.");

        const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
        if (!apiKey) return setError("Missing API key in .env");

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(q)}&appid=${apiKey}&units=metric`;

        try {
            setLoading(true);
            const res = await fetch(url);
            const json = await res.json().catch(() => ({}));
            if (!res.ok) return setError(json?.message || `Error ${res.status}`);

            setData({
                name: json.name,
                country: json.sys?.country,
                temp: json.main?.temp,
                humidity: json.main?.humidity,
                condition: json.weather?.[0]?.description,
            });
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h2 className="text-2xl font-semibold mb-6">🌦️ Weather Explorer</h2>
            <form onSubmit={fetchWeather} className="flex gap-3 w-full max-w-md">
                <input
                    className="flex-1 px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Enter city name"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <button className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg disabled:opacity-50" disabled={loading}>
                    {loading ? "Searching..." : "Search"}
                </button>
            </form>

            {error && <p className="mt-4 text-red-400 text-sm font-medium">{error}</p>}

            {data && (
                <div className="mt-6 w-full max-w-md p-5 rounded-xl bg-gray-900 border border-gray-700 shadow-md">
                    <h3 className="text-xl font-semibold mb-2">{data.name}, {data.country}</h3>
                    <p className="text-4xl font-bold">{Math.round(data.temp)}°C</p>
                    <p className="capitalize text-gray-300">{data.condition}</p>
                    <p className="mt-2 text-gray-400">Humidity: {data.humidity}%</p>
                </div>
            )}
        </>
    );
}
