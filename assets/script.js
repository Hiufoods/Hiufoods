const apiKey = 'AIzaSyCOZQaLnFsExxn0D7G47bPZsY7xWSyPing'; // Replace with your API Key
const spreadsheetId = '1Q9DfMxxElWR067rRh6iRkBNej1OG25ShakHL_rtjolQ'; // Replace with your Spreadsheet ID
const sheetName = 'Sheet1'; // Replace with the name of your sheet

// Load the Google Sheets API
function loadGoogleSheetsAPI() {
    gapi.load('client', initClient);
}

function initClient() {
    gapi.client.init({
        apiKey: apiKey,
        discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
    }).then(function () {
        console.log('Google API client initialized.');
    });
}

// Handle form submission
document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting

    // Get the form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    // Simple validation
    if (name === '' || email === '') {
        alert('Please fill in all fields.');
        return;
    }

    // Call the function to insert data into the Google Sheet
    insertDataToSheet(name, email);
});

// Insert data into Google Sheets
function insertDataToSheet(name, email) {
    const params = {
        spreadsheetId: spreadsheetId,
        range: `${sheetName}!A:B`,  // Column range where data will go
        valueInputOption: 'RAW',
    };

    const valueRangeBody = {
        "values": [
            [name, email]  // Data to insert
        ]
    };

    gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody).then(function(response) {
        console.log('Data successfully added to Google Sheets:', response);
        displayResult(name, email);
    }, function(error) {
        console.error('Error adding data to Google Sheets:', error);
    });
}

// Display the result on the page
function displayResult(name, email) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <h3>Submitted Information</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
    `;
    document.getElementById('userForm').reset(); // Reset the form after submission
}

// Initialize Google API client
loadGoogleSheetsAPI();
