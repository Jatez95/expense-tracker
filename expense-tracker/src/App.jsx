import { useEffect, useState } from 'react'
import './index.css'
import { fetchSpreadSheet } from './responses/http'
import ErrorPage from './assets/ErrorPage';
import Header from './assets/Header';

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
  const LoadingText = () => (
    <div role="status" className='flex flex-col justify-center items-center mt-16'>
      <svg aria-hidden="true" className=" w-14 h-14 text-gray-200 animate-spin dark:text-gray-600 fill-neutral-950" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
      </svg>
      <span className="mt-4">Loading...</span>
    </div>
  )

  return (
    <>
      <Header />
      <main className='w-full h-full'>
        <div className='w-5/6 h-80 flex flex-col rounded-md justify-center justify-self-center mt-24'>


          {isFetching && <LoadingText />}

          {errorPage && <ErrorPage title="Ha ocurrido un error al cargar los datos" message={errorPage} />}

          {!isFetching && !errorPage && infoSheet && (
            <table className='table-auto w-full shadow-md rounded border-separate border-spacing-y-4 bg-stone-900'>
              <thead>
                <tr className='border-y-2 text-white'>
                  {infoSheet[0]?.map((header, index) => (
                    <th key={index} className='border-x border-white'>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {infoSheet.slice(1).map((row, rowIndex) => {
                  // Find the maximum number of columns
                  const maxColumns = Math.max(...infoSheet.map(r => r.length));

                  // Pad the row with empty strings if it's shorter than maxColumns
                  const paddedRow = [...row, ...Array(maxColumns - row.length).fill('')];

                  return (
                    <tr
                      key={rowIndex}
                      className={`
                      ${paddedRow.every(cell => !cell || cell.trim() === '')
                          ? 'bg-stone-800/50'
                          : 'bg-stone-800'} 
                      mt-6 text-white rounded shadow-lg w-full
                    `}
                    >
                      {paddedRow.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className='border-x border-white space-x-11 ml-2 p-1 text-center'
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </>
  );
}

export default App