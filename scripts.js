// toggle the navigation menu when the hamburger button is clicked
/*
document.querySelector(".hamburger").addEventListener("click", function () {
    const navMenu = document.querySelector("nav ul");
    navMenu.classList.toggle("show");
});

document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("fileInput");
    const fileList = document.getElementById("fileList");
    const maxFiles = 5;
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes/

    // Array to store selected files
    let files = [];

   fileInput.addEventListener("change", () => {
        const newFiles = Array.from(fileInput.files);

        // Validate the number of files
        if (files.length + newFiles.length > maxFiles) {
            alert(`You can upload a maximum of ${maxFiles} files.`);
            fileInput.value = ""; // Clear file input
            return;
        }

        // Validate file sizes
        for (const file of newFiles) {
            if (file.size > maxSize) {
                alert(`${file.name} exceeds the 5MB size limit.`);
                fileInput.value = ""; // Clear file input
                return;
            }
        }

        // Add new files to the files array and update the display
        files.push(...newFiles);
        updateFileList();
        fileInput.value = ""; // Clear file input for re-selection
    });

    function updateFileList() {
        fileList.innerHTML = ""; // Clear the current list

        files.forEach((file, index) => {
            const fileDiv = document.createElement("div");

            const fileName = document.createElement("span");
            fileName.textContent = file.name;

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", () => {
                files.splice(index, 1); // Remove the file from the array
                updateFileList(); // Refresh the display
            });

            fileDiv.appendChild(fileName);
            fileDiv.appendChild(deleteButton);
            fileList.appendChild(fileDiv);
        });
    }
});
//Frontend integration for Stripe payment.
    const stripe = Stripe('your-publishable-key'); // Replace with your Stripe publishable key
    const elements = stripe.elements();
    const card = elements.create('card');
    card.mount('#card-element');

    document.getElementById('pay-now-button').addEventListener('click', async () => {
        const response = await fetch('/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: 5000 }), // Replace with the dynamic amount in cents
        });

        const { clientSecret } = await response.json();

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: card,
            },
        });

        if (result.error) {
            document.getElementById('payment-result').textContent = 'Payment failed: ' + result.error.message;
        } else {
            document.getElementById('payment-result').textContent = 'Payment successful!';
        }
    });*/
   /* console.log('scripts.js loaded');
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    const form = document.getElementById('contact-form');
    if (form) {
        console.log('Contact form found');
    } else {
        console.error('Contact form not found');
    }
});

    // Contact Form Submission
    document.addEventListener('DOMContentLoaded', () => {
        // Contact Form Submission
        document.getElementById('contact-form').addEventListener('submit', async function (e) {
            e.preventDefault(); // Prevent default form submission
            console.log('Form submission intercepted'); // Log to confirm this runs
    
            const responseDiv = document.getElementById('contact-response');
            responseDiv.innerText = 'Sending...'; // Show loading message
    
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries()); // Convert FormData to JSON
    
            try {
                const response = await fetch('http://localhost:3000/send-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
    
                const message = await response.text();
                responseDiv.innerText = message; // Show success or error
            } catch (error) {
                console.error('Error sending email:', error);
                responseDiv.innerText = 'Failed to send email.';
            }
        });
    });*/
    
    // Application Form Submission
    document.getElementById('application-form').addEventListener('submit', async function (e) {
        e.preventDefault(); // Prevent default form submission

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries()); // Convert FormData to JSON

        try {
            const response = await fetch('/http://localhost:3000/submit-application', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const message = await response.text();
            document.getElementById('application-response').innerText = message; // Show success or error
        } catch (error) {
            console.error('Error submitting application:', error);
            document.getElementById('application-response').innerText = 'Failed to submit application.';
        }
    });
/*
// Contact-us Form Submission
document.addEventListener('DOMContentLoaded', () => {
    // Contact-us Form Submission
    document.getElementById('contact-us').addEventListener('submit', async function (e) {
        e.preventDefault(); // Prevent default form submission
        console.log('Form submission intercepted'); // Log to confirm this runs

        const responseDiv = document.getElementById('contact-us-response');
        responseDiv.innerText = 'Sending...'; // Show loading message

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries()); // Convert FormData to JSON

        try {
            const response = await fetch('http://localhost:3000/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const message = await response.text();
            responseDiv.innerText = message; // Show success or error
        } catch (error) {
            console.error('Error sending email:', error);
            responseDiv.innerText = 'Failed to send email.';
        }
    });
});*/

