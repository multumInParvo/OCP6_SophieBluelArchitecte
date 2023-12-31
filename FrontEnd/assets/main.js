document.addEventListener('DOMContentLoaded', () => { // DOMContentLoaded event fires when the initial HTML document has been completely loaded and parsed.
    const isLoggedIn = sessionStorage.getItem('token');
    const loginLink = document.querySelector('a[href="./assets/login_page.html"]');

    if (isLoggedIn) {  // Updates the UI elements if user is logged in
        loginLink.textContent = 'logout';
        document.querySelector('header').style.marginTop = '100px';
        document.querySelector('.edit').style.display = 'flex';
        document.querySelector('.modifier-text').style.display = 'flex';
        document.querySelector('.buttons-container').style.display = 'none';
        document.querySelector('.modal-two').style.display = 'none';

        // Event listeners and functionality for the first modal
        const modal = document.querySelector('.modal');
        const openModal = document.querySelector('.modifier-text');
        const closeModal = document.querySelector('.fa-xmark');
        const modalOverlay = document.querySelector('.modal-overlay');

        loginLink.addEventListener('click', () => {
            sessionStorage.removeItem('token');
            window.location.href = 'index.html';
        });

        openModal.addEventListener('click', () => {
            modal.style.display = 'block';
            modalOverlay.style.display = 'block';
        });

        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
            modalOverlay.style.display = 'none';
        });

        modalOverlay.addEventListener('click', () => {
            modalOverlay.style.display = 'none';
            modal.style.display = 'none';
        });
        // end Event listeners and functionality for the first modal

        // second modal (add works)
        const openModalTwo = document.querySelector('.add-picture');
        const leftArrowButton = document.querySelector('.fa-arrow-left');
        const modalTwo = document.querySelector('.modal-two');
        const closeModalTwo = document.querySelector('.modal-two .fa-xmark');
        const imagePreview = document.querySelector('.image-preview');
        const addPictureContainerDescription = document.querySelector('.add-picture-container-description');
        const customFileUpload = document.querySelector('.custom-file-upload');

        openModalTwo.addEventListener('click', () => {
            modalTwo.style.display = 'block';
        });

        closeModalTwo.addEventListener('click', () => {
            displayErrorMessage.textContent = '';
            imagePreview.innerHTML = '';
            form.reset();
            addPictureContainerDescription.style.display = 'flex';
            customFileUpload.style.display = 'flex';
            submitButton.disabled = true;
            submitButton.style.backgroundColor = '#A7A7A7';
            modalTwo.style.display = 'none';
            modal.style.display = 'none';
            modalOverlay.style.display = 'none';
        });

        modalOverlay.addEventListener('click', () => {
            displayErrorMessage.textContent = '';
            imagePreview.innerHTML = '';
            form.reset();
            addPictureContainerDescription.style.display = 'flex';
            customFileUpload.style.display = 'flex';
            submitButton.disabled = true;
            submitButton.style.backgroundColor = '#A7A7A7';
            modalOverlay.style.display = 'none';
            modalTwo.style.display = 'none';
        });

        leftArrowButton.addEventListener('click', () => {
            displayErrorMessage.textContent = '';
            imagePreview.innerHTML = '';
            form.reset();
            addPictureContainerDescription.style.display = 'flex';
            customFileUpload.style.display = 'flex';
            submitButton.disabled = true;
            submitButton.style.backgroundColor = '#A7A7A7';
            modal.style.display = 'block';
            modalTwo.style.display = 'none';
        });
        // end second modal (add works)

        // Fetch categories to SELECT element in the second modal
        const urlCategories = 'http://localhost:5678/api/categories';

        fetch(urlCategories)
            .then(response => response.json())
            .then(categories => {
                const selectElement = document.getElementById('category'); // Get the select element

                // loop through the categories array
                categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.id;
                    option.textContent = category.name;
                    selectElement.appendChild(option); // Append the option to the select element
                });
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
        // end Fetch categories to SELECT element in the second modal   

        // Add a new work to the database when the form is submitted (second modal) 
        const fileInput = document.getElementById('work-photo');
        const displayErrorMessage = document.querySelector('.error-message');
        const MAX_FILE_SIZE_MB = 4; // Maximum file size in MB
        const imagePreviewContainer = document.querySelector('.image-preview');
        const titleInput = document.getElementById('title');
        const submitButton = document.querySelector('.submit-form-btn');
        const categoryInput = document.querySelector('.category-form');

        fileInput.addEventListener('change', function () {

            const file = this.files[0]; // Get the selected file

            if (file && file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                displayErrorMessage.textContent = 'Veuillez sélectionner un fichier plus petit. (max : 4 Mo)';
                displayErrorMessage.style.display = 'block'; // If File size exceeds the maximum limit, it will display error message
                submitButton.disabled = true;
            }

            else if (file) {
                displayErrorMessage.textContent = ''; // Clear the error message content
                displayErrorMessage.style.display = 'none'; // Hide the error message
                const reader = new FileReader(); // Create a FileReader object
                document.querySelector('.modal-form-container label').style.display = 'none';
                document.querySelector('.add-picture-container-description').style.display = 'none';

                reader.addEventListener('load', function () {
                    const previewImage = document.createElement('img'); // Create an image element for the preview
                    previewImage.src = reader.result; // Set the source of the preview image to the loaded file
                    previewImage.style.width = '130px';
                    previewImage.style.height = '170px';

                    imagePreviewContainer.innerHTML = ''; // Clear any previous previews
                    imagePreviewContainer.appendChild(previewImage); // Append the preview image to the container

                    titleInput.value = file.name.split('.').slice(0, -1).join('.');

                    // Check if all fields are completed to enable/disable the submit button
                    function checkInputs() {
                        const isFileSelected = fileInput.files.length > 0;
                        const isTitleFilled = titleInput.value.trim() !== '';
                        const isCategorySelected = categoryInput.value !== '';

                        if (isFileSelected && isTitleFilled && isCategorySelected) {
                            submitButton.style.backgroundColor = '#1D6154';
                            submitButton.disabled = false;
                        } else {
                            submitButton.style.backgroundColor = '';
                            submitButton.disabled = true;
                        }
                    }
                    [fileInput, titleInput, categoryInput].forEach(input => { // Check inputs whenever any of the fields change
                        input.addEventListener('input', checkInputs);
                    });
                    checkInputs(); // Initial check after setting the title
                });
                reader.readAsDataURL(file);
            }
        });
        // end Add a new work to the database when the form is submitted (second modal)

        // structure of modal content
        const urlWorks = 'http://localhost:5678/api/works'
        fetch(urlWorks)
            .then(response => response.json())
            .then(works => {
                function displayWorksModal(works) {
                    const modalGallery = document.querySelector('.modalGallery');

                    for (let i = 0; i < works.length; i++) {
                        const arrayWork = works[i]
                        const modalContent = document.createElement('figure');
                        const img = document.createElement('img');
                        const figcaption = document.createElement('figcaption');
                        const trashHolder = document.createElement('div');
                        const trashIcon = document.createElement('i');
                        img.dataset.categoryId = arrayWork.categoryId;
                        img.src = arrayWork.imageUrl;

                        modalContent.classList.add('modal-content');
                        trashHolder.classList.add('trash-holder');
                        trashIcon.classList.add('fa-solid', 'fa-trash-can');

                        modalGallery.appendChild(modalContent);
                        modalContent.appendChild(img);
                        modalContent.appendChild(figcaption);
                        modalContent.appendChild(trashHolder);
                        trashHolder.appendChild(trashIcon);
                        // removes Work
                        trashHolder.addEventListener('click', (event) => {
                            event.preventDefault();

                            const workId = arrayWork.id; // Retrieve the work ID associated with the trash icon clicked
                            const token = sessionStorage.getItem('token');

                            fetch(`http://localhost:5678/api/works/${workId}`, {
                                method: 'DELETE',
                                headers: {
                                    'Authorization': 'Bearer ' + token,
                                    'Content-Type': 'application/json'
                                }
                            })
                                .then(response => {
                                    if (response.ok) {
                                        // Find and remove the deleted work's HTML element from the DOM
                                        const workContainer = event.target.closest('figure');
                                        workContainer.remove();
                                        // Remove the corresponding element from the main gallery
                                        const mainGalleryElement = document.querySelector(`[data-id="${workId}"]`);
                                        if (mainGalleryElement) {
                                            mainGalleryElement.remove();
                                        } else {
                                            console.error('Element not found in the main gallery.');
                                        }
                                    } else {
                                        // Handle deletion failure (optional)
                                        console.error('Failed to delete the work');
                                    }
                                })
                                .catch(error => {
                                    console.error('Error deleting the work:', error);
                                });
                        });
                        // end removes Work
                    }
                }
                displayWorksModal(works);
            })
    }

    // WORKS SECTION
    const urlWorks = 'http://localhost:5678/api/works'
    fetch(urlWorks) // fetch method makes a request to the url and returns a promise
        .then(response => response.json())     // handles the response from fetch operation. Once the data is retrieved, the first .then is executed converting the response to .json format using response.json()
        .then(works => { // second .then handles the json data received from server. The works variable contains the parsed json data retrieved from the first .then

            function displayWorks(works) {
                const gallery = document.querySelector('#portfolio .gallery');

                for (let i = 0; i < works.length; i++) {
                    const arrayWork = works[i];

                    const figure = document.createElement('figure');
                    figure.setAttribute('data-id', arrayWork.id); // Set the data-id attribute based on the work's ID

                    const img = document.createElement('img');
                    const figcaption = document.createElement('figcaption');

                    img.dataset.categoryId = arrayWork.categoryId;
                    img.src = arrayWork.imageUrl;
                    figcaption.textContent = arrayWork.title;

                    figure.appendChild(img);
                    figure.appendChild(figcaption);
                    gallery.appendChild(figure);
                }
            }
            displayWorks(works);

            // CATEGORIES SECTION   
            const urlCategories = 'http://localhost:5678/api/categories'
            fetch(urlCategories)
                .then(response => response.json())
                .then(categories => {
                    const filterButtons = document.querySelector('.buttons-container');
                    const allCategoriesButton = document.createElement('button');
                    allCategoriesButton.textContent = 'Tous'; // button Tous to show all categories
                    allCategoriesButton.dataset.categoryId = 'all';
                    allCategoriesButton.addEventListener('click', () => {
                        categoryFilter('all');
                    });
                    filterButtons.appendChild(allCategoriesButton);

                    for (let i = 0; i < categories.length; i++) {
                        const arrayCategory = categories[i]

                        const button = document.createElement('button');
                        button.textContent = arrayCategory.name;
                        button.dataset.categoryId = arrayCategory.id;
                        button.addEventListener('click', () => {
                            categoryFilter(arrayCategory.id);
                        });
                        filterButtons.appendChild(button);
                    };
                })
                .catch(error => {  // error handling for categories section
                    console.error('Something went wrong with filtres:', error);
                });
        })
        .catch(error => { // error handling for works section
            console.error('Something went wrong with works:', error);
        });

    function categoryFilter(categoryId) {
        const allButtons = document.querySelectorAll('.buttons-container button');
        const allImages = document.querySelectorAll('#portfolio .gallery img');

        allButtons.forEach(button => {
            button.classList.remove('selected');
        });

        event.target.classList.add('selected');

        for (i = 0; i < allImages.length; i++) {
            const img = allImages[i]

            if (categoryId === 'all' || img.dataset.categoryId === categoryId.toString()) {
                img.parentNode.style.display = 'block'; // Show images of the selected category or all images
            } else {
                img.parentNode.style.display = 'none'; // Hide images not matching the category
            }
        };
    }

    // Form submission handling for adding new works
    const form = document.querySelector('.modal-form-container');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const token = sessionStorage.getItem('token');
        const formData = new FormData(form);

        fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json', // The API returns JSON
            },
            body: formData,
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Failed to add the work'); // Throw an error for unsuccessful response
            })
            .then(data => {
                console.log('API response:', data);
                updateModalGallery();
                updateGallery();

                const modal = document.querySelector('.modal');
                const modalTwo = document.querySelector('.modal-two');
                const modalOverlay = document.querySelector('.modal-overlay');
                const imagePreview = document.querySelector('.image-preview');
                const addPictureContainerDescription = document.querySelector('.add-picture-container-description');
                const customFileUpload = document.querySelector('.custom-file-upload');
                const submitButton = document.querySelector('.submit-form-btn');

                modal.style.display = 'none';
                modalTwo.style.display = 'none';
                modalOverlay.style.display = 'none';

                imagePreview.innerHTML = '';
                addPictureContainerDescription.style.display = 'flex';
                customFileUpload.style.display = 'flex';
                submitButton.disabled = true;
                submitButton.style.backgroundColor = '#A7A7A7';
                form.reset();
            })
    });
    // end Form submission handling for adding new works
});
// end DOMContentLoaded 

// Function to update the modal gallery when a work is added or deleted
function updateModalGallery() {
    const modalGallery = document.querySelector('.modalGallery');

    fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(works => {
            modalGallery.innerHTML = ''; // Clear existing content in the modal gallery

            works.forEach(arrayWork => {
                const modalContent = document.createElement('figure');
                const img = document.createElement('img');
                const figcaption = document.createElement('figcaption');
                const trashHolder = document.createElement('div');
                const trashIcon = document.createElement('i');

                img.dataset.categoryId = arrayWork.categoryId;
                img.src = arrayWork.imageUrl;

                modalContent.classList.add('modal-content');
                trashHolder.classList.add('trash-holder');
                trashIcon.classList.add('fa-solid', 'fa-trash-can');

                modalGallery.appendChild(modalContent);
                modalContent.appendChild(img);
                modalContent.appendChild(figcaption);
                modalContent.appendChild(trashHolder);
                trashHolder.appendChild(trashIcon);

                trashHolder.addEventListener('click', (event) => {
                    event.preventDefault();

                    const workId = arrayWork.id; // Retrieve the work ID associated with the trash icon clicked
                    const token = sessionStorage.getItem('token');

                    fetch(`http://localhost:5678/api/works/${workId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': 'Bearer ' + token,
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(response => {
                            if (response.ok) {
                                // Find and remove the deleted work's HTML element from the DOM
                                const workContainer = event.target.closest('figure');
                                workContainer.remove();

                                // Remove the corresponding element from the main gallery
                                const mainGalleryElement = document.querySelector(`[data-id="${workId}"]`);
                                if (mainGalleryElement) {
                                    mainGalleryElement.remove();
                                } else {
                                    console.error('Element not found in the main gallery.');
                                }
                            } else {
                                // Handle deletion failure (optional)
                                console.error('Failed to delete the work');
                            }
                        })
                        .catch(error => {
                            console.error('Error deleting the work:', error);
                        });
                });
            });
            console.log('Modal Gallery updated successfully!');
        })
        .catch(error => {
            console.error('Error fetching updated works for modal gallery:', error);
        });
}
// end Update the modal gallery when a work is added or deleted

// Function to update the main gallery
function updateGallery() {
    const gallery = document.querySelector('#portfolio .gallery');

    fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(works => {
            gallery.innerHTML = ''; // Clear existing content in the gallery

            works.forEach(arrayWork => {
                const figure = document.createElement('figure');
                figure.setAttribute('data-id', arrayWork.id);

                const img = document.createElement('img');
                const figcaption = document.createElement('figcaption');

                img.dataset.categoryId = arrayWork.categoryId;
                img.src = arrayWork.imageUrl;
                figcaption.textContent = arrayWork.title;

                figure.appendChild(img);
                figure.appendChild(figcaption);
                gallery.appendChild(figure);
            });
            console.log('Gallery updated successfully!');
        })
        .catch(error => {
            console.error('Error fetching updated works:', error);
        });
}
// end function to update the main gallery