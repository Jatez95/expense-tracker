import { useRef, useState } from "react";
import Insert from "./Insert";
import { updateSpreadSheet, fetchDownloadSheet } from "../responses/http"

export default function DataInsert() {
    const [isFetching, setIsFetching] = useState(false);
    const monthQuantity = useRef();
    const descExpense = useRef();
    const quantityExpensed = useRef();
    const category = useRef();

    const [dataValues, setdataValues] = useState([])

    async function handleValues() {
        if (monthQuantity.current && monthQuantity.current.value.trim() !== "" &&
            descExpense.current && descExpense.current.value.trim() !== "" &&
            quantityExpensed.current && quantityExpensed.current.value.trim() !== ""
        ) {
            setdataValues([monthQuantity.current.value, descExpense.current.value, quantityExpensed.current.value, category.current.value])
            try {
                await updateSpreadSheet(dataValues)
            } catch (error) {
                console.log(`An error has ocurred sending the data: ${error}`)
            }
        }

    }

    async function downloadSheet() {
        setIsFetching(true)
        try {
            await fetchDownloadSheet()
        } catch (error) {
            console.log(`An error has ocurred sending the data: ${error}`)
        }
        setIsFetching(false)
    }


    return (
        <div className='flex flex-col w-5/6 h-full p-4 mt-8 shadow-md rounded bg-stone-800 justify-center justify-self-center space-x-12 border-2 border-stone-500'>
            <div className="w-full flex flex-row">
                <Insert label_title="Cantidad mes" input_placeholder="Cantidad mes" isSelect={false} userInsert={monthQuantity} inputType="number" />
                <Insert label_title="Descripcion gasto" input_placeholder="Descripcion gasto" isSelect={false} userInsert={descExpense} inputType="text" />
                <Insert label_title="Cantifad gastada" input_placeholder="Cantidad" isSelect={false} userInsert={quantityExpensed} inputType="number" />
                <Insert label_title="Categoria" isSelect={true} userInsert={category} />
            </div>
            <div className="flex flex-row space-x-5 self-end">
                <button className="justify-end self-end text-white bg-stone-900 hover:bg-stone-800 w-24 h-10 rounded-md border-2 border-stone-400" onClick={downloadSheet}>Descargar</button>
                <button className="justify-end self-end text-white bg-stone-900 hover:bg-stone-800 w-24 h-10 rounded-md border-2 border-stone-400" onClick={handleValues}>Añadir</button>
            </div>
        </div>
    )
}