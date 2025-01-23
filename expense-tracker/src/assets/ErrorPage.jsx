export default function ({ title, message, onConfirm }) {
    return (
        <div className="flex flex-col w-1/3 h-56 bg-red-600">
            <h2>{title}</h2>
            <p>{message}</p>
            {onConfirm && (
                <div>
                    <button onClick={onConfirm} className="button">
                        Okay
                    </button>
                </div>
            )}
        </div>
    );
}