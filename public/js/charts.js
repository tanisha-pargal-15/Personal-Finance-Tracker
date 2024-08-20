// Fetch the income data from the backend
fetch('/income-data')
    .then(response => response.json())
    .then(data => {
        // Create an object to aggregate income by month
        const incomeByMonth = {};

        // Process each entry to aggregate income by month
        data.forEach(entry => {
            const date = new Date(entry.date);
            const month = date.toLocaleString('default', { month: 'long', year: 'numeric' }); // Get month and year
            if (!incomeByMonth[month]) {
                incomeByMonth[month] = 0; // Initialize if the month is not in the object
            }
            incomeByMonth[month] += entry.amount; // Sum the income for the month
        });

        // Extract labels and data from the aggregated incomeByMonth object
        let labels = Object.keys(incomeByMonth); // Months as labels
        let incomeData = Object.values(incomeByMonth); // Aggregated income as data

        // Sort labels (and corresponding incomeData) by date
        const sortedEntries = labels.map((label, index) => ({
            label: new Date(label), // Convert month-year to Date object for sorting
            income: incomeData[index]
        })).sort((a, b) => a.label - b.label); // Sort by date

        // Extract sorted labels and data
        labels = sortedEntries.map(entry => entry.label.toLocaleString('default', { month: 'long', year: 'numeric' }));
        incomeData = sortedEntries.map(entry => entry.income);

        // Get the canvas element
        const ctx = document.getElementById('incomeChart').getContext('2d');

        // Create the chart
        const incomeChart = new Chart(ctx, {
            type: 'line', // Line chart
            data: {
                labels: labels, // Labels for the x-axis
                datasets: [{
                    label: 'Monthly Income',
                    data: incomeData, // The aggregated income data
                    backgroundColor: '#c4d9f2', // Fill color under the line
                    borderColor: '#0a68d4', // Line color
                    borderWidth: 2, // Line width
                    fill: true, // Fill the area under the line
                    tension: 0.4 // Optional: Add some curvature to the line
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'category', // Use categorical scale for the x-axis
                        beginAtZero: true
                    },
                    y: {
                        beginAtZero: true // Ensure the y-axis starts at 0
                    }
                },
                responsive: true, // Make the chart responsive
                plugins: {
                    legend: {
                        display: true,
                        position: 'top', // Position the legend at the top
                    },
                    title: {
                        display: true,
                        text: 'Income Over Time' // Title of the chart
                    }
                }
            }
        });
    })
    .catch(error => console.error('Error fetching income data:', error));



   
   
   
    

    document.addEventListener('DOMContentLoaded', () => {
        async function fetchExpenseData() {
            try {
                const response = await fetch('/api/expenses');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Error fetching expense data:', error);
                return [];
            }
        }
    
        async function createPieChart() {
            const data = await fetchExpenseData();
            const ctx = document.getElementById('expenseChart').getContext('2d');
    
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: data.map(entry => entry.tag),
                    datasets: [{
                        label: 'Expense by Category',
                        data: data.map(entry => entry.amount),
                        backgroundColor: [
                            '#FF6384',
                            '#36A2EB',
                            '#B2EBF2',
                            '#5733FF',
                            '#FFE082',
                            '#4A90E2', // Soft Blue
                            '#4A4A4A', // Dark Gray
                            '#7ED321', // Light Green
                            '#D4A5A5',
                            '#A2C2E0',
                            '#B3A4F7',
                            '#F7A2B5',
                            '#BFD3C1',
                            '#FFD1D1 '
                            // Add more colors if needed
                        ],
                        borderColor: '#fff',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            callbacks: {
                                label: function(tooltipItem) {
                                    return `${tooltipItem.label}: ₹${tooltipItem.raw}`;
                                }
                            }
                        }
                    }
                }
            });
        }
    
        createPieChart();
    });
    
    
