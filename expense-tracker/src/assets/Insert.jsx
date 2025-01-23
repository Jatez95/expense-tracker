export default function Insert({label_title, input_placeholder}) {
    return (
        <div className="flex flex-col p-4">
            <label className='text-white'>{label_title}</label>
            <input className='rounded w-full bg-' placeholder={input_placeholder} />
        </div>
    )
}