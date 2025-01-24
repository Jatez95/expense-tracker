import { useEffect, useState } from 'react'
import { fetchSpreadSheet } from "../src/responses/http"
import LoadingText from "./LoadingText"
import ErrorPage from "./ErrorPage"
import SheetTable from "./SheetTable"

export default function MainSection() {

    const [isFetching, setIsFetching] = useState(false);
    const [infoSheet, setInfoSheet] = useState(null)
    const [errorPage, setErrorPage] = useState()

    useEffect(() => {
        async function getSheetInfo() {
            setIsFetching(true)
            try {
                const sheetData = await fetchSpreadSheet();
                setInfoSheet(sheetData)
            } catch (error) {
                setErrorPage(error.message || "Failed to fetch the data")
            }
            setIsFetching(false)
        }

        getSheetInfo()
    }, [])

    return (
        <div className='w-5/6 h-80 flex flex-col rounded-md justify-center justify-self-center mt-14'>

            {isFetching && <LoadingText />}

            {errorPage && <ErrorPage title="Ha ocurrido un error al cargar los datos" message={errorPage} />}

            {!isFetching && !errorPage && infoSheet && (
                <SheetTable infoSheet={infoSheet} />
            )}
        </div>
    )
}