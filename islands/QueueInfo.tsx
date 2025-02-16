import { useEffect, useState } from "preact/hooks";


export const QueueInfo = () => {
    const [queue, setQueue] = useState(-1);

    useEffect(() => {
        const pollfunc = async () => {
            const data = await fetch("/api/queue").then((res) => res.text());
            setQueue(Number.parseInt(data, 10));
        };

        const poll = setInterval(pollfunc, 5000);
        pollfunc();
        return () => clearInterval(poll);
    }, []);

    if (queue === -1) {
        return <p>Henter din plass i køen...</p>;
    }

    return (
        <p>{queue !== 0 ? (<>
            <span>
                Det er nå nummer
            </span>
            <strong className="mx-1">
                {queue}
            </strong>
            <span>
                tegninger i køen.
            </span>
        </>
        ) : (
            <span>
                Du er neste i køen!
            </span>
        )}
        </p>)
};
