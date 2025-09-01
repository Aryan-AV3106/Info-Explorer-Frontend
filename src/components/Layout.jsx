import Navbar from "./Navbar";

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-gray-950 text-gray-100">
            <Navbar />
            <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
            <footer className="border-t border-gray-800 mt-16">
                <div className="max-w-5xl mx-auto px-4 py-6 text-xs text-gray-400">
                    Frontend v2 • Built for Aryan
                </div>
            </footer>
        </div>
    );
}

