document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded. scripts.js is running.");

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    if (!API_BASE_URL) {
        console.error("API base URL is not defined in the environment variables.");
        return;
    }

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

            if (newFiles.length > maxFiles) {
                alert(`You can upload a maximum of ${maxFiles} files.`);
                fileInput.value = ""; // Clear file input
                return;
            }

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

                    const dataTransfer = new DataTransfer();
                    updatedFiles.forEach((file) => dataTransfer.items.add(file));
                    fileInput.files = dataTransfer.files;

                    updateFileList(updatedFiles);
                });

                fileDiv.appendChild(fileName);
                fileDiv.appendChild(deleteButton);
                fileList.appendChild(fileDiv);
            });
        }
    }

    async function handleFormSubmit(form, endpoint, responseDivId) {
        const responseDiv = document.getElementById(responseDivId);
        responseDiv.innerText = "Sending...";
        console.log("Submitting form to endpoint:", endpoint);

        try {
            const formData = new FormData(form);

            const fileInput = form.querySelector('input[type="file"]');
            if (fileInput && fileInput.files.length > 0) {
                for (let file of fileInput.files) {
                    formData.append(fileInput.name, file);
                }
            }

            const fetchOptions = {
                method: "POST",
                body: formData,
            };

            const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);
            if (!response.ok) {
                throw new Error(`Server error! Status: ${response.status}`);
            }

            const message = await response.text();
            responseDiv.innerText = message || "Form submitted successfully.";
            console.log("Form submission response:", message);

            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error) {
            console.error("Error submitting form:", error);
            responseDiv.innerText = "Failed to submit form. Please try again.";
        }
    }

    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            handleFormSubmit(contactForm, "/send-email", "contact-response");
        });
    }

    const applicationForm = document.getElementById("application-form");
    if (applicationForm) {
        applicationForm.addEventListener("submit", (e) => {
            e.preventDefault();
            handleFormSubmit(applicationForm, "/submit-application", "application-response");
        });
    }

    const hireUsForm = document.getElementById("hire-us-form");
    if (hireUsForm) {
        hireUsForm.addEventListener("submit", (e) => {
            e.preventDefault();
            handleFormSubmit(hireUsForm, "/hire-us", "hire-us-response");
        });
    }
});
