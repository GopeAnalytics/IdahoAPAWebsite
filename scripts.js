    document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded. scripts.js is running.");

    // Toggle the navigation menu
    document.querySelector(".hamburger").addEventListener("click", function () {
        const navMenu = document.querySelector("nav ul");
        navMenu.classList.toggle("show");
    });

    // File upload handling logic for the Application Form
    const fileInput = document.getElementById("fileInput");
    const fileList = document.getElementById("fileList");
    const maxFiles = 5;
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes

    let files = [];

    if (fileInput) {
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
    }

    // Function to handle form submission
    async function handleFormSubmit(form, endpoint, responseDivId, isMultipart = false) {
        const responseDiv = document.getElementById(responseDivId);
        responseDiv.innerText = "Sending..."; // Show loading message
        console.log("Submitting form to endpoint:", endpoint);

        try {
            const formData = new FormData(form);
            console.log("Form data being sent:", Array.from(formData.entries())); // Log the data

            const fetchOptions = {
                method: "POST",
                body: isMultipart ? formData : JSON.stringify(Object.fromEntries(formData.entries())),
            };

            if (!isMultipart) {
                fetchOptions.headers = { "Content-Type": "application/json" };
            }

            const response = await fetch(endpoint, fetchOptions);
            if (!response.ok) {
                throw new Error(`Server error! Status: ${response.status}`);
            }

            const message = await response.text();
            responseDiv.innerText = message || "Form submitted successfully.";
            console.log("Form submission response:", message);
            // Reload the page after successful submission
          setTimeout(() => {
            window.location.reload(); // Reload the page
          }, 2000); // Wait 2 seconds before reloading
          
        } catch (error) {
            console.error("Error submitting form:", error);
            responseDiv.innerText = "Failed to submit form. Please try again.";
        }
    }

    // Contact Form Submission
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            console.log("Contact form intercepted.");
            handleFormSubmit(contactForm, "http://localhost:3000/send-email", "contact-response");
        });
    }
    
    // Application Form Submission
    const applicationForm = document.getElementById("application-form");
    if (applicationForm) {
        applicationForm.addEventListener("submit", (e) => {
            e.preventDefault();
            console.log("Application form intercepted.");
            handleFormSubmit(applicationForm, "http://localhost:3000/submit-application", "application-response", true);
        });
    }

    // Hire-Us Form Submission
    const hireUsForm = document.getElementById("hire-us-form");
    if (hireUsForm) {
        hireUsForm.addEventListener("submit", (e) => {
            e.preventDefault();
            console.log("Hire-Us form intercepted.");
            handleFormSubmit(hireUsForm, "http://localhost:3000/hire-us", "hire-us-response", true);
        });
    }
});

  // Contact us Submission
     document.getElementById('contact-us').addEventListener('submit', async (event) => {
        event.preventDefault();
    
        const form = event.target;
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message'),
        };
    
        try {
            const response = await fetch("http://localhost:3000/contact-us", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
    
            const responseText = await response.text();
            document.getElementById('contact-response').innerText = response.ok
                ? 'Message sent successfully!'
                : `Failed to send message: ${responseText}`;
        } catch (error) {
            console.error('Error submitting form:', error);
            document.getElementById('contact-response').innerText = 'An error occurred while sending the message.';
        }
    });

    /*// Stripe Payment Logic
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
