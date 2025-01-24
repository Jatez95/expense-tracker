export default function ({ title, message}) {
    return (
        <div className="flex flex-col w-1/3 h-36 text-red-800 bg-red-400 self-center rounded-md justify-center">
            <h2 className="m-2">{title}</h2>
            <p className="m-2">{message}</p>
        </div>
    );
}