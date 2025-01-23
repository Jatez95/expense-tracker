export async function fetchSpreadSheet() {
    const response = await fetch('http://127.0.0.1:5000/get-sheet')
    const responseData = await response.json()

    if (!response.ok) {
        throw new Error('Failed to fetch places')
    }

    return responseData;
}