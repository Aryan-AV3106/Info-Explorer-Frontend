import { NavLink } from "react-router-dom";

const base = "px-3 py-2 rounded-lg text-sm transition-colors";
const active = "bg-white/10 text-white";
const idle = "text-gray-300 hover:bg-white/5";

export default function Navbar() {
    return (
        <header className="border-b border-gray-800">
            <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                <h1 className="text-xl font-semibold">Info Explorer</h1>
                <nav className="flex gap-2">
                    <NavLink to="/" end className={({ isActive }) => `${base} ${isActive ? active : idle}`}>Weather</NavLink>
                    <NavLink to="/country" className={({ isActive }) => `${base} ${isActive ? active : idle}`}>Country</NavLink>
                    <NavLink to="/nasa" className={({ isActive }) => `${base} ${isActive ? active : idle}`}>NASA</NavLink>
                    <NavLink to="/crypto" className={({ isActive }) => `${base} ${isActive ? active : idle}`}>Crypto</NavLink>
                    <NavLink to="/news" className={({ isActive }) => `${base} ${isActive ? active : idle}`}>News</NavLink>
                </nav>
            </div>
        </header>
    );
}
