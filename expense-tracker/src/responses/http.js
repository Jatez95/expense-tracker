export async function fetchSpreadSheet() {
    const response = await fetch('http://127.0.0.1:5000/get-sheet')
    const responseData = await response.json()

    if (!response.ok) {
        throw new Error('Failed to fetch the values')
    }

    return responseData;
}

export async function updateSpreadSheet(dataValues) {
    const response = await fetch('http://127.0.0.1:5000/insert-sheet', {
        method: 'POST',
        body: JSON.stringify({dataValues}),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const resData = await response.json()

    if(!response.ok){
        throw new Error('Failed to update the Google Sheet')
    }

    return resData.message;
}