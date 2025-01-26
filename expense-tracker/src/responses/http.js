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
        body: JSON.stringify({ dataValues }),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const resData = await response.json()

    if (!response.ok) {
        throw new Error('Failed to update the Google Sheet')
    }

    return resData.message;
}

export async function fetchDownloadSheet() {
    const response = await fetch('http://127.0.0.1:5000/download-sheet');
    
    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = "none"
    a.href = url
    a.download = "expenses.csv";
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    return blob
}