document.addEventListener('DOMContentLoaded', () => {
    const mealForm = document.getElementById('mealForm');
    const dateInput = document.getElementById('date');
    const dayOfWeekInput = document.getElementById('dayOfWeek');
    const responseMessage = document.getElementById('responseMessage');

    // Set today's date as default and trigger day of week calculation
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(today.getDate()).padStart(2, '0');
    dateInput.value = `${year}-${month}-${day}`;
    updateDayOfWeek(); // Call immediately to set initial day

    // Function to update the day of the week based on the selected date
    dateInput.addEventListener('change', updateDayOfWeek);

    function updateDayOfWeek() {
        const selectedDate = dateInput.value;
        if (selectedDate) {
            const date = new Date(selectedDate);
            const options = { weekday: 'long' };
            dayOfWeekInput.value = new Intl.DateTimeFormat('en-US', options).format(date);
        } else {
            dayOfWeekInput.value = '';
        }
    }

    mealForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent default form submission

        const formData = new FormData(mealForm);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Get the Google Apps Script Web App URL from your deployment
        // IMPORTANT: Replace with your deployed Web App URL
        const WEB_APP_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE'; // ⚠️ REMEMBER TO UPDATE THIS!

        try {
            const response = await fetch(WEB_APP_URL, {
                method: 'POST',
                mode: 'no-cors', // Use 'no-cors' for simple POST requests to Apps Script
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(data).toString(),
            });

            // For 'no-cors', response.ok will always be true and status 0.
            // You'll rely on the Google Apps Script to confirm success (e.g., by redirecting or handling the response within Apps Script).
            // For a more robust check, Apps Script should send a success message back via content service,
            // but for simplicity with direct form submission, we'll assume success for 'no-cors'.
            showResponseMessage('Attendance submitted successfully! ✨', 'success');
            mealForm.reset(); // Clear the form
            // Reset day of week and date input after reset
            dateInput.value = `${year}-${month}-${day}`;
            updateDayOfWeek();
        } catch (error) {
            console.error('Error submitting form:', error);
            showResponseMessage('Failed to submit attendance. Please try again. 😔', 'error');
        }
    });

    function showResponseMessage(message, type) {
        responseMessage.textContent = message;
        responseMessage.className = `response-message ${type}`;
        responseMessage.style.display = 'block';
        setTimeout(() => {
            responseMessage.style.display = 'none';
        }, 5000); // Hide after 5 seconds
    }
});