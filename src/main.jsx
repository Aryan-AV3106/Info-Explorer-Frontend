import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Layout from "./components/Layout";
import Weather from "./pages/weather";
import Country from "./pages/Country";
import Nasa from "./pages/Nasa";
import Crypto from "./pages/Crypto";
import News from "./pages/News";

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<Weather />} />
                    <Route path="/country" element={<Country />} />
                    <Route path="/nasa" element={<Nasa />} />
                    <Route path="/crypto" element={<Crypto />} />
                    <Route path="/news" element={<News />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode><App /></React.StrictMode>
);
