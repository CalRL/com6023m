import { useEffect, useState } from "react";
import axios from "axios";

interface FactResponse {
    text: string;
    source: string;
    source_url: string;
}

const RandomFact = () => {
    const [fact, setFact] = useState<FactResponse | null>(null);

    useEffect(() => {
        const fetchFact = async () => {
            try {
                const res = await axios.get("https://uselessfacts.jsph.pl/random.json?language=en");
                setFact(res.data);
            } catch (err) {
                console.error("Failed to fetch random fact:", err);
            }
        };

        fetchFact();
    }, []);

    return (
        <div className="bg-slate-800 rounded p-4 text-white shadow">
            <h3 className="font-semibold text-lg mb-2">🧠 Random Fact</h3>
            {fact ? (
                <>
                    <p className="text-sm text-gray-300 mb-2">{fact.text}</p>
                    <a
                        href={fact.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 text-xs hover:underline"
                    >
                        Source: {fact.source}
                    </a>
                </>
            ) : (
                <p className="text-sm text-gray-500">Loading...</p>
            )}
        </div>
    );
};

export default RandomFact;