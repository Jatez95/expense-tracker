export default function Insert({ label_title, input_placeholder, isSelect, userInsert, inputType }) {
    return (
        <div className="flex flex-col w-full m-3">
            <label className='text-white'>{label_title}</label>
            {isSelect ?
                <select className="rounded mr-1 border-2 border-stone-900" ref={userInsert}>
                    <option>50% (Gastos previstos)</option>
                    <option>30% (Gastos personales)</option>
                    <option>20% (De la parte de ahorro)</option>
                    <option>Añadir</option>
                </select> :
                <input type={inputType} className='rounded mr-1 border-2 border-stone-900' placeholder={input_placeholder} ref={userInsert}/>
            }

        </div>
    )
}