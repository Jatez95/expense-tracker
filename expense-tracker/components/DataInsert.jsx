import Insert from "./Insert";

export default function DataInsert() {
    return (
        <div className='flex flex-col w-5/6 h-full p-4 mt-8 shadow-md rounded bg-stone-800 justify-center justify-self-center space-x-12 border-2 border-stone-500'>
            <div className="w-full flex flex-row">
                <Insert label_title="Cantidad mes" input_placeholder="Cantidad mes" isSelect={false} />
                <Insert label_title="Descripcion gasto" input_placeholder="Descripcion gasto" isSelect={false}/>
                <Insert label_title="Cantifad gastada" input_placeholder="Cantidad" isSelect={false}/>
                <Insert label_title="Categoria" input_placeholder="" isSelect={true}/>
            </div>
            <button className="justify-end self-end text-white bg-stone-900 hover:bg-stone-800 w-20 h-10 rounded-md border-2 border-stone-400 ">Añadir</button>

        </div>
    )
}