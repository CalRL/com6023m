import { useEffect, useState } from "react";

interface HackerNewsStory {
    id: number;
    title: string;
    url: string;
}

const HackerNews: React.FC = () => {
    const [stories, setStories] = useState<HackerNewsStory[]>([]);

    useEffect(() => {
        async function fetchThreeRandomStories() {
            try {
                const topIdsRes = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
                const topIds: number[] = await topIdsRes.json();

                const randomIds = topIds
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 5);

                const storyData = await Promise.all(
                    randomIds.map(id =>
                        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json())
                    )
                );

                setStories(storyData);
            } catch (err) {
                console.error("Failed to fetch Hacker News stories:", err);
            }
        }

        fetchThreeRandomStories();
    }, []);

    return (
        <div className="bg-gray-800 p-4 rounded text-white">
            <h2 className="text-lg font-bold mb-3">Hacker News Highlights</h2>
            <ul className="space-y-2">
                {stories.map((story) => (
                    <li key={story.id}>
                        <a href={story.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                            {story.title}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default HackerNews;