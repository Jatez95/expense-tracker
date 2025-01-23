import { useEffect, useState } from 'react'
import './index.css'
import { fetchSpreadSheet } from './responses/http'
import ErrorPage from './assets/ErrorPage';
import Header from './assets/Header';
import SheetTable from './assets/SheetTable';
import LoadingText from './assets/LoadingText';
import DataInsert from './assets/DataInsert';

function App() {
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

  // Loading component

  return (
    <>
      <Header />
      <section className='w-full h-full'>
        <DataInsert/>
      </section>
      <main className='w-full h-full'>
        <div className='w-5/6 h-80 flex flex-col rounded-md justify-center justify-self-center mt-20'>

          {isFetching && <LoadingText />}

          {errorPage && <ErrorPage title="Ha ocurrido un error al cargar los datos" message={errorPage} />}

          {!isFetching && !errorPage && infoSheet && (
            <SheetTable infoSheet={infoSheet}/>
          )}
        </div>
      </main>
    </>
  );
}

export default App