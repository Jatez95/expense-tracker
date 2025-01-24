export default function SheetTable({ infoSheet }) {
    return (
        <table className='table-auto w-full shadow-md rounded border-separate border-spacing-y-4 bg-stone-900 border-stone-600 border-2'>
            <thead>
                <tr className='border-y-2 text-white'>
                    {infoSheet[0]?.map((header) => (
                        <th key={header}>{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {infoSheet.slice(1).map((row) => {
                    // Find the maximum number of columns
                    const maxColumns = Math.max(...infoSheet.map(r => r.length));

                    // Pad the row with empty strings if it's shorter than maxColumns
                    const paddedRow = [...row, ...Array(maxColumns - row.length).fill('')];

                    return (
                        <tr
                            key={Math.random()}
                            className={
                                ` ${paddedRow.every(cell => !cell || cell.trim() === '')
                                    ? 'bg-stone-800/50'
                                    : 'bg-stone-800'} 
                                mt-6 text-white rounded shadow-lg w-full`
                            }
                        >
                            {paddedRow.map((cell) => (
                                <td
                                    key={Math.random()}
                                    className='ml-2 p-1 text-center'
                                >
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}