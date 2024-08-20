
    document.getElementById("sortByDateBtn").addEventListener("click", function() {
    sortTableByDate();
});

function sortTableByDate() {
    const tableBody = document.getElementById("transactionTableBody");
    const rows = Array.from(tableBody.querySelectorAll("tr"));

    // Sort rows based on the date column (5th column, index 4)
    rows.sort((a, b) => {
        const dateA = new Date(a.cells[4].innerText);
        const dateB = new Date(b.cells[4].innerText);
        return dateB- dateA; //   Descending order
    });

    // Clear the table body
    tableBody.innerHTML = "";

    // Re-append the sorted rows
    rows.forEach(row => tableBody.appendChild(row));
}





    document.getElementById("sortByAmountBtn").addEventListener("click", function() {
    sortTableByAmount();
});

document.getElementById("noSortBtn").addEventListener("click", function() {
    // Reload the original data or reset the table to its initial state
    location.reload(); // Simple way to reset for this example
});

function sortTableByAmount() {
    const tableBody = document.getElementById("transactionTableBody");
    const rows = Array.from(tableBody.querySelectorAll("tr"));

    // Sort rows based on the amount column (4th column, index 3)
    rows.sort((a, b) => {
        const amountA = parseFloat(a.cells[3].innerText.replace('₹', ''));
        const amountB = parseFloat(b.cells[3].innerText.replace('₹', ''));
        return amountB - amountA; // Ascending order
    });

    // Clear the table body
    tableBody.innerHTML = "";

    // Re-append the sorted rows
    rows.forEach(row => tableBody.appendChild(row));
}




    // JavaScript to handle selection and apply the 'selected' class
    document.querySelectorAll('.sort-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.sort-option').forEach(el => el.classList.remove('selected'));
            this.classList.add('selected');
            // Add sorting logic here if needed
        });
    });



    // JavaScript to handle dropdown selection
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default link behavior
            const selectedText = this.textContent; // Get the text of the clicked item
            const dropdownButton = document.getElementById('dropdownButton'); // Get the dropdown button
            dropdownButton.textContent = selectedText; // Update button text
        });
    });



    document.addEventListener('DOMContentLoaded', function() {
        const sortOptions = document.querySelectorAll('.sort-option');
        const table = document.querySelector('table tbody');
        const originalRows = Array.from(table.querySelectorAll('tr'));
        const dropdownButton = document.getElementById('dropdownButton');
        const dropdownItems = document.querySelectorAll('.dropdown-item');

        function sortTable(sortFunction) {
            const rows = Array.from(table.querySelectorAll('tr'));
            rows.sort(sortFunction);
            rows.forEach(row => table.appendChild(row));
        }

        function sortTableByDate() {
            sortTable((rowA, rowB) => {
                const dateA = new Date(rowA.cells[2].innerText);
                const dateB = new Date(rowB.cells[2].innerText);
                return dateB - dateA;
            });
        }

        function sortTableByAmount() {
            sortTable((rowA, rowB) => {
                const amountA = parseFloat(rowA.cells[3].innerText.replace(/[^0-9.-]+/g, ""));
                const amountB = parseFloat(rowB.cells[3].innerText.replace(/[^0-9.-]+/g, ""));
                return amountB - amountA;
            });
        }

        function restoreOriginalOrder() {
            originalRows.forEach(row => table.appendChild(row));
        }

        function filterTable(filterValue) {
            const rows = table.querySelectorAll('tr');
            rows.forEach(row => {
                const type = row.cells[1].innerText;
                if (filterValue === 'all' || type.toLowerCase() === filterValue.toLowerCase()) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        }

        sortOptions.forEach(option => {
            option.addEventListener('click', function() {
                sortOptions.forEach(o => o.classList.remove('selected'));
                this.classList.add('selected');
                
                switch (this.id) {
                    case 'sortByDateBtn':
                        sortTableByDate();
                        break;
                    case 'sortByAmountBtn':
                        sortTableByAmount();
                        break;
                    case 'noSortBtn':
                        restoreOriginalOrder();
                        break;
                }
            });
        });

        dropdownItems.forEach(item => {
            item.addEventListener('click', function() {
                const filterValue = this.dataset.value;
                dropdownButton.textContent = this.textContent;
                filterTable(filterValue);
            });
        });
    });




    document.addEventListener('DOMContentLoaded', function() {
        const sortOptions = document.querySelectorAll('.sort-option');
        const tableBody = document.getElementById('transactionTableBody');
        const originalRows = Array.from(tableBody.querySelectorAll('tr'));
        const dropdownButton = document.getElementById('dropdownButton');
        const dropdownItems = document.querySelectorAll('.dropdown-item');
        const tagSearchInput = document.getElementById('tagSearchInput');

        function sortTable(sortFunction) {
            const rows = Array.from(tableBody.querySelectorAll('tr'));
            rows.sort(sortFunction);
            rows.forEach(row => tableBody.appendChild(row));
        }

        function sortTableByDate() {
            sortTable((rowA, rowB) => {
                const dateA = new Date(rowA.cells[4].innerText);
                const dateB = new Date(rowB.cells[4].innerText);
                return dateB - dateA; // Descending order
            });
        }

        function sortTableByAmount() {
            sortTable((rowA, rowB) => {
                const amountA = parseFloat(rowA.cells[3].innerText.replace(/[^0-9.-]+/g, ""));
                const amountB = parseFloat(rowB.cells[3].innerText.replace(/[^0-9.-]+/g, ""));
                return amountB - amountA; // Descending order
            });
        }

        function restoreOriginalOrder() {
            originalRows.forEach(row => tableBody.appendChild(row));
        }

        function filterTable(filterValue) {
            const rows = tableBody.querySelectorAll('tr');
            rows.forEach(row => {
                const type = row.cells[1].innerText.toLowerCase();
                if (filterValue === 'all' || type === filterValue.toLowerCase()) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        }

        function searchByTag(searchValue) {
            const rows = tableBody.querySelectorAll('tr');
            rows.forEach(row => {
                const tag = row.cells[5].innerText.toLowerCase();
                if (tag.includes(searchValue.toLowerCase())) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
            // Clear the input field after search
        tagSearchInput.value = '';
        }

        sortOptions.forEach(option => {
            option.addEventListener('click', function() {
                sortOptions.forEach(o => o.classList.remove('selected'));
                this.classList.add('selected');
                
                switch (this.id) {
                    case 'sortByDateBtn':
                        sortTableByDate();
                        break;
                    case 'sortByAmountBtn':
                        sortTableByAmount();
                        break;
                    case 'noSortBtn':
                        restoreOriginalOrder();
                        break;
                }
            });
        });

        dropdownItems.forEach(item => {
            item.addEventListener('click', function(event) {
                event.preventDefault(); // Prevent default link behavior
                const filterValue = this.getAttribute('data-value');
                dropdownButton.textContent = this.textContent; // Update button text
                filterTable(filterValue);
            });
        });

        tagSearchInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                searchByTag(this.value);
            }
        });
    });


// HTML Input:
// <input type="file" id="csvFileInput" accept=".csv" />
// <button id="importCsvBtn">Import CSV</button>

document.getElementById('importCsvBtn').addEventListener('click', function () {
    const fileInput = document.getElementById('csvFileInput');
    const file = fileInput.files[0];

    if (file) {
        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            complete: function (results) {
                const parsedData = results.data;
                appendCsvData(parsedData);
            },
            error: function (error) {
                alert('Error parsing CSV file: ' + error.message);
            }
        });
    } else {
        alert('Please select a CSV file to upload.');
    }
});

async function appendCsvData(csvData) {
    console.log(csvData); // Inspect the parsed CSV data
    const tableBody = document.getElementById('transactionTableBody');
    const currentRowCount = tableBody.querySelectorAll('tr').length; // Get current number of rows

    // Filter and process CSV data for income and expense entries
    const incomeEntries = csvData.filter(entry => entry.Type && entry.Type.toLowerCase() === 'income');
    const expenseEntries = csvData.filter(entry => entry.Type && entry.Type.toLowerCase() === 'expense');

    const allEntries = [...incomeEntries, ...expenseEntries];
    
    const saveDataPromises = allEntries.map(async (entry, index) => {
        if (Object.values(entry).some(value => value === null || value === '')) {
            console.warn('Skipping entry with missing values:', entry); // Log warning for incomplete entries
            return; // Skip empty or incomplete rows
        }

        const newRow = document.createElement('tr');
        const serialNumber = currentRowCount + index + 1; // Calculate the new S.No

        newRow.innerHTML = `
            <th>${serialNumber}</th>
            <td>${entry.Type || ''}</td>
            <td>${entry.Title || ''}</td>
            <td>₹${entry.Amount || 0}</td>
            <td>${entry.Date || ''}</td>
            <td>${entry.Tag || ''}</td>
        `;
        tableBody.appendChild(newRow);

        // Prepare data for saving
        const dataToSave = {
            title: entry.Title || '',
            amount: entry.Amount || 0,
            date: new Date(entry.Date) || new Date(),
            tag: entry.Tag || ''
        };

        let url = '';
        if (entry.Type.toLowerCase() === 'income') {
            url = '/save-csv-data-income';
        } else if (entry.Type.toLowerCase() === 'expense') {
            // Adjust data structure for the Expense model
            dataToSave.item = entry.Title || ''; // Map Title to item
            delete dataToSave.title; // Remove title field
            url = '/save-csv-data-expense';
        }

        if (url) {
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataToSave)
                });
                const result = await response.text();
                console.log('Server response:', result);
            } catch (error) {
                console.error('Error saving data:', error);
            }
        }
    });

    try {
        await Promise.all(saveDataPromises);
        console.log('All data saved, reloading the page...');
        location.reload(); // Reload the page after all data is saved
    } catch (error) {
        console.error('Error in saving data, page reload aborted:', error);
    }
}


document.getElementById('exportCsvBtn').addEventListener('click', function () {
    // Get the table element
    var table = document.getElementById('transactionTable');

    // Convert table to CSV
    var csv = Papa.unparse({
        fields: [ 'Type', 'Title/Item', 'Amount', 'Date', 'Tag'],
        data: Array.from(table.querySelectorAll('tbody tr')).map(row => 
            Array.from(row.querySelectorAll('td')).map((cell, index) => {
                if (index === 2) { // Amount column
                    return cell.textContent.replace('₹', '').trim(); // Remove ₹ and trim spaces
                }
                return cell.textContent || cell.innerText;
            })
        )
    });

    // Create a Blob from the CSV data
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    // Use FileSaver.js to save the Blob as a file
    saveAs(blob, 'TableData.csv');
});



document.addEventListener('DOMContentLoaded', function () {
    var infoIcon = document.querySelector('.info-icon');
    var modal = document.getElementById('infoModal');
    var closeBtn = document.querySelector('.close-btn');

    // Show the modal when hovering over the info icon
    infoIcon.addEventListener('mouseover', function () {
        modal.style.display = 'block';
    });

    // Hide the modal when clicking the close button
    closeBtn.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    // Hide the modal when clicking outside the modal content
    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});


function deleteEntry(id) {
    if (confirm("Are you sure you want to delete this entry?")) {
        fetch(`/delete-entry/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                location.reload(); // Reload the page to reflect the changes
            } else {
                alert("Failed to delete entry");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("An error occurred while deleting the entry");
        });
    }
}



document.addEventListener('DOMContentLoaded', function () {
    const resetButton = document.querySelector('.btn-reset');

    resetButton.addEventListener('click', async function (event) {
        event.preventDefault(); // Prevent default link behavior

        // const confirmation = confirm('Are you sure you want to reset all data?\n This action cannot be undone.\nResetting all data will permanently delete it, and you will start with a fresh slate. It is highly recommended that you export your data before proceeding with the reset for your reference.');


        const confirmation = confirm(
            'Are you sure you want to reset all data?\n' +
            'This action cannot be undone.\n' +
            'Resetting all data will permanently delete it, and you will start with a fresh slate.\n' +
            'It is highly recommended that you export your data before proceeding with the reset for your reference.'
          );
          


        if (confirmation) {
            try {
                const response = await fetch('/reset-data', {
                    method: 'DELETE',
                });

                if (response.ok) {
                    alert('All data has been deleted successfully.');
                    location.reload(); // Refresh the page to update the UI
                } else {
                    alert('Failed to reset data.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while resetting the data.');
            }
        }
    });
});
