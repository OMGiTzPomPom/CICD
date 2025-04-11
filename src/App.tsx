import { Toaster } from "react-hot-toast";
import { PonyRegistrationForm } from "./components/PonyRegistrationForm";
import "./App.css";

/**
 * 🌈 Main App Component – Welcome to Equestria!
 *
 * @component
 * @returns {JSX.Element} The rendered Equestrian App
 *
 * @example
 * ```tsx
 * <App />
 * ```
 */
function App() {
    const scrollLibraryPath = "/vitest-vite-app/docs/index.html";

    return (
        <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100 rounded-xl shadow-lg">
            <Toaster position="top-right" />

            <header className="mb-8 text-center">
                <h1 className="text-4xl font-extrabold text-purple-700 mb-2 drop-shadow-md">
                    ✨ Royal Scroll Registration ✨
                </h1>
                <a
                    href={scrollLibraryPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 underline"
                >
                    📚 Scroll Library (Documentation)
                </a>
            </header>

            <PonyRegistrationForm onSubmit={console.log} />

            <footer className="mt-8 text-center text-gray-500 text-sm italic">
                &copy; {new Date().getFullYear()} – Royal Scroll Division of Equestria
            </footer>
        </div>
    );
}

export default App;
