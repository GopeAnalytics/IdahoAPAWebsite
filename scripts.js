document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded. scripts.js is running.");

    // Toggle the navigation menu
    document.querySelector(".hamburger").addEventListener("click", function () {
        const navMenu = document.querySelector("nav ul");
        navMenu.classList.toggle("show");
    });
    // File upload handling logic
    const fileInput = document.getElementById("fileInput");
    const fileList = document.getElementById("fileList");
    const maxFiles = 5;
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes

   if (fileInput) {
     fileInput.addEventListener("change", () => {
        const newFiles = Array.from(fileInput.files);

        // Validate the number of files
        if (newFiles.length > maxFiles) {
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

        updateFileList(newFiles);
    });

    function updateFileList(files) {
        fileList.innerHTML = ""; // Clear the current list

        files.forEach((file, index) => {
            const fileDiv = document.createElement("div");

            const fileName = document.createElement("span");
            fileName.textContent = file.name;

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", () => {
                const updatedFiles = Array.from(fileInput.files);
                updatedFiles.splice(index, 1);

                // Update the file input (workaround for removing files)
                const dataTransfer = new DataTransfer();
                updatedFiles.forEach(file => dataTransfer.items.add(file));
                fileInput.files = dataTransfer.files;

                updateFileList(updatedFiles);
            });

            fileDiv.appendChild(fileName);
            fileDiv.appendChild(deleteButton);
            fileList.appendChild(fileDiv);
        });
    }
}
    // Function to handle form submission
    async function handleFormSubmit(form, endpoint, responseDivId) {
        const responseDiv = document.getElementById(responseDivId);
        responseDiv.innerText = "Sending..."; // Show loading message
        console.log("Submitting form to endpoint:", endpoint);
    
        try {
            const formData = new FormData(form); // Automatically handles file inputs
    
            // Ensure the file input is added to FormData
            const fileInput = form.querySelector('input[type="file"]');
            if (fileInput && fileInput.files.length > 0) {
                console.log("Adding files to FormData:");
                for (let file of fileInput.files) {
                    console.log("Adding file:", file.name);
                    formData.append(fileInput.name, file);
                }
            }
    
            console.log("Final FormData being sent:", Array.from(formData.entries())); // Debug all fields
    
            const fetchOptions = {
                method: "POST",
                body: formData, // Send as multipart/form-data
            };
    
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
            handleFormSubmit(contactForm, "https://idahoapawebsite.onrender.com/send-email", "contact-response");
        });
    }
    
    // Application Form Submission
    const applicationForm = document.getElementById("application-form");
    if (applicationForm) {
        applicationForm.addEventListener("submit", (e) => {
            e.preventDefault();
            console.log("Application form intercepted.");
            handleFormSubmit(applicationForm, "https://idahoapawebsite.onrender.com/submit-application", "application-response", true);
        });
    }

    // Hire-Us Form Submission
    const hireUsForm = document.getElementById("hire-us-form");
    if (hireUsForm) {
        hireUsForm.addEventListener("submit", (e) => {
            e.preventDefault();
            console.log("Hire-Us form intercepted.");
            handleFormSubmit(hireUsForm, "https://idahoapawebsite.onrender.com/hire-us", "hire-us-response", true);
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
        const response = await fetch("https://idahoapawebsite.onrender.com/contact-us", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const responseText = await response.text();
        if (response.ok) {
            document.getElementById('contact-response').innerText = 'Message sent successfully!';
            console.log('Form submitted successfully:', responseText);

            // Reload the page after 2 seconds
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } else {
            document.getElementById('contact-response').innerText = `Failed to send message: ${responseText}`;
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        document.getElementById('contact-response').innerText = 'An error occurred while sending the message.';
    }
});

    
