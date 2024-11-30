// toggle the navigation menu when the hamburger button is clicked

document.querySelector(".hamburger").addEventListener("click", function () {
    const navMenu = document.querySelector("nav ul");
    navMenu.classList.toggle("show");
});

document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("fileInput");
    const fileList = document.getElementById("fileList");
    const maxFiles = 5;
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes

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


