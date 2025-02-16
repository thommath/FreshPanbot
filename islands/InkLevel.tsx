
type InkLevelProps = {
    maxLength: number;
    currentLength: number;
}

export default function InkLevel({ maxLength, currentLength }: InkLevelProps) {
    const percentage = (currentLength / maxLength) * 100;

    const progressBarStyle = {
        width: `${Math.min(100, 100 - percentage)}%`,
        height: '100%',
    };

    const containerStyle = {
        width: '100%',
        backgroundColor: '#e0e0df',
        borderRadius: '5px',
        overflow: 'hidden',
        height: '20px'
    };

    return (
        <div style={containerStyle}>
            <div style={progressBarStyle} className="bg-yellow-500"></div>
        </div>
    );
}