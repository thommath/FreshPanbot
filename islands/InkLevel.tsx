type InkLevelProps = {
    maxLength: number;
    currentLength: number;
}

export default function InkLevel({ maxLength, currentLength }: InkLevelProps) {
    const percentage = (currentLength / maxLength) * 100;

    const progressBarStyle = {
        height: `${Math.min(100, 100 - percentage)}%`,
        width: '64px',
    };

    const containerStyle = {
        height: '100%',
        backgroundColor: '#e0e0df',
        borderRadius: '5px',
        overflow: 'hidden',
        width: '64px',
        display: 'flex',
        alignItems: 'end',
    };

    const maxLengthIsMet = currentLength >= maxLength;

    return (
        <div className="flex p-8 h-full w-full items-center flex-col">
            <div className="flex p-8 h-full w-full items-center flex-col">
                <div style={containerStyle}>
                    <div style={progressBarStyle} className="bg-yellow-500"></div>
                </div>
            </div>
            <div className="flex text-center flex-col" style={{width: '256px'}}>
                {maxLengthIsMet && <div style={{ color: "red", fontWeight: "bold" }}>
                    Du er tom for pannekakerøre!
                </div>}
                {!maxLengthIsMet && <div style={{ fontWeight: "bold" }}>
                    Her ser du hvor mye pannekakerøre du har igjen.
                </div>}
            </div>
        </div>
    );
}