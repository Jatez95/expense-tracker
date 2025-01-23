import Insert from "./Insert";

export default function DataInsert() {
    return (
        <div className='flex flex-row w-2/4 h-full mt-8 shadow-md rounded bg-stone-800 justify-center justify-self-center space-x-32'>
            <Insert label_title="Cantidad mes" input_placeholder="Cantidad mes"/>
            <Insert label_title="Descripcion gasto" input_placeholder="Descripcion gasto"/>
            <Insert label_title="Cantifad gastada" input_placeholder="Cantidad"/>
            <Insert label_title="Categoria" input_placeholder=""/>
            <Insert label_title="Cantidad mes" input_placeholder="Cantidad mes"/>
            
        </div>
    )
}