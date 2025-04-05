const gallery = document.querySelector('.gallery');
const filtersContainer = document.querySelector('.filters'); // div pôur recup les classe CSS
const closeModal = document.querySelector(".close-btn-modal");
const categorySelect = document.getElementById("category");


let works = [];
let categories = [];

const token = sessionStorage.getItem('token');

// Fonction pour afficher les images dans la galerie
function createWorks(worksArray) {
    gallery.innerHTML = ''; // Vider la galerie avant d'ajouter les nouvelles images

    worksArray.forEach(work => {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        const figcaption = document.createElement('figcaption');

        img.src = work.imageUrl;
        img.alt = work.title;
        figcaption.textContent = work.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    });
}

// Récupérer les travaux depuis l'API
async function getWorks() {
    const response = await fetch('http://localhost:5678/api/works');
    return works = await response.json();
}

// Récupérer les catégories depuis l'API
async function getCategories() {
    const response = await fetch('http://localhost:5678/api/categories');
    categories = await response.json();
}

// Filtrer les travaux en fonction de la catégorie
function filterWorks(category) {
    gallery.innerHTML = ''; // Vider la galerie avant de filtrer

    // Si la catégorie est "all", on affiche toutes les images
    if (category === "all") {
        createWorks(works);
    } else {
        // Filtrer les travaux en fonction de la catégorie
        const filteredWorks = works.filter(work => {
            // Normalisation de la catégorie pour éviter des problèmes avec les espaces, etc.
            const normalizedCategory = work.category.name.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and');
            return normalizedCategory === category;
        });
        createWorks(filteredWorks);
    }
}

// Charger les catégories dynamiquement depuis l'API
async function loadCategories() {
    categorySelect.innerHTML = ""; // Nettoyer les options précédentes
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
}

// Création des boutons de filtre dynamiquement
const filterCategories = [
    { category: "all", label: "Tous" },
    { category: "objets", label: "Objets" },
    { category: "appartements", label: "Appartements" },
    { category: "hotels-and-restaurants", label: "Hotels & restaurants" }
];

filterCategories.forEach(filter => {
    const button = document.createElement("button");
    button.className = "filter";
    button.dataset.category = filter.category;
    button.textContent = filter.label;
    filtersContainer.appendChild(button);
});

// Redéfinir les boutons après leur création dynamique
const filterButtons = document.querySelectorAll('.filter');

// Ajouter les événements sur les boutons de filtre
filterButtons.forEach(button => {
    button.addEventListener('click', function () {
        const category = this.getAttribute('data-category');
        filterWorks(category);

        // Retirer la classe active de tous les boutons
        filterButtons.forEach(btn => btn.classList.remove('active'));

        // Ajouter la classe active au bouton cliqué
        this.classList.add('active');
    });
});


// Initialisation : récupérer les données et afficher tout
async function init() {
    await getWorks();
    await getCategories();
    createWorks(works); // Afficher toutes les images au départ
    displayThumbnails();
    loadCategories()
}

init();


if (token) {
    console.log('tu es en mode admin')
    filtersContainer.style.display = 'none';
    document.querySelector('.admin-panel').style.display = 'flex';
    const loginLink = document.getElementById('loginLink');

    loginLink.textContent = 'logout';
        loginLink.href = '#';
        loginLink.addEventListener('click', function(event) {
            event.preventDefault();
            sessionStorage.removeItem('token');
            window.location.reload();
        });
    // Sélection des éléments
    const openModal = document.getElementById('open-modal');
    const modal = document.getElementById('modal');
    const secondModal = document.getElementById('modal-2');

    // Ouvrir la modale au clic sur "modifier"
    openModal.addEventListener('click', function() {
        modal.style.display = 'flex';
        displayThumbnails()
    });


    // Fermer la modale au clic sur la croix
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Fermer la modale lorsqu'on clique en dehors du contenu
    
        window.addEventListener('click', function(event) {
        if (event.target === modal || event.target === secondModal) {
            modal.style.display = 'none';
            secondModal.style.display = 'none';
        }
    });
}
else{
    const editContainer = document.getElementById('edit-container');
    // Cacher la div au chargement de la page
    editContainer.style.display = 'none';
    // Vous pouvez ajouter un événement pour afficher à nouveau la div si nécessaire, par exemple :
    document.getElementById('open-modal').addEventListener('click', function() {
        editContainer.style.display = 'block'; // Afficher la div
    });
}

// Sélectionner les éléments HTML
const modal = document.getElementById("modal");
const secondModal = document.getElementById("modal-2");
const vignetteGallery = document.getElementById("vignette-gallery");

// Fonction pour fermer la modale
function closeModalFunction() {
    modal.style.display = "none";
}


// Ajouter un événement pour fermer la modale
closeModal.addEventListener("click", closeModalFunction);




async function displayThumbnails() {
    const vignettesContainer = document.getElementById('image-gallery');

    // On vide le conteneur avant d'ajouter les nouvelles vignettes
    vignettesContainer.innerHTML = '';

    const works = await getWorks();
    works.forEach(work => {
        const vignette = document.createElement('div');
        vignette.classList.add('vignette');

        const thumbnail = document.createElement('img');
        thumbnail.src = work.imageUrl;
        thumbnail.alt = work.title;

        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('fa-solid', 'fa-trash', 'delete-icon');
        deleteIcon.dataset.id = work.id; // Associe l'ID de l'image

        // Ajouter un event listener pour la suppression
        deleteIcon.addEventListener('click', async function () {
            await deleteWork(work.id);
          
        });

        vignette.appendChild(thumbnail);
        vignette.appendChild(deleteIcon);
        vignettesContainer.appendChild(vignette);
    });
}
async function deleteWork(params) {
    const response = await fetch('http://localhost:5678/api/works/'+ params,{
        method:'delete',
        headers:{
            Authorization:'Bearer '+token
        }
    });
    if (response.ok) {
        await getWorks()
        createWorks(works)
        displayThumbnails()
    }
}


// Ajout d'une nouvelle photo à la galerie


document.addEventListener("DOMContentLoaded", async function () {
    const addPhotoBtn = document.getElementById("add-photo");
    const closeAddPhotoModal = document.getElementById("close-add-photo-modal");
    const validateBtn = document.getElementById("validate");
    const photoInput = document.getElementById("photo-input");
    const titleInput = document.getElementById("title");
    const categorySelect = document.getElementById("category");
    const addPhotoForm = document.getElementById("add-photo-form");
    const secondModal = document.getElementById("modal-2");
    const returnFirstModal = document.getElementById("return-first-modal");
    const photoUploadContainer = document.querySelector(".photo-upload-container");

    // Vérifie si les éléments existent avant d'ajouter les event listeners
    if (addPhotoBtn && closeAddPhotoModal && validateBtn) {
        // Ouvrir la modale d'ajout de photo
        addPhotoBtn.addEventListener("click", function () {
            modal.style.display = "none";
            secondModal.style.display = "flex";
        });

        closeAddPhotoModal.addEventListener("click", function () {
            modal.style.display = "none";
            secondModal.style.display = "none";
        });

        returnFirstModal.addEventListener("click", function () {
            modal.style.display = "flex";
            secondModal.style.display = "none";
        });

        function changeSubmitButtonColor() {
            if (photoInput.files.length > 0 && titleInput.value.trim() !== "" && categorySelect.value !== "") {
                return validateBtn.classList.add('valid')
            }
            validateBtn.classList.remove('valid')
        }

        photoInput.addEventListener("input", function (event) {
            const file = event.target.files[0];
            if (file) {
                const url = URL.createObjectURL(file);

                // Supprimer le contenu actuel de .photo-upload-container
                photoUploadContainer.querySelector("i").style.display = "none"; // Cacher l'icône
                photoUploadContainer.querySelector("label").style.display = "none"; // Cacher le label
                photoUploadContainer.querySelector("p").style.display = "none"; // Cacher le paragraphe

                // Générer et insérer l’image choisie avec les dimensions appropriées
                const img = document.createElement("img");
                img.src = url;
                img.style.width = "200px"; // Largeur fixe pour éviter que ça prenne trop de place
                img.style.maxWidth = "40%"; // Largeur maximale de 40%
                img.style.maxHeight = "100%"; // Hauteur maximale de 100%
                img.style.height = "auto"; // Hauteur automatique pour conserver le ratio
                img.style.display = "block";
                img.style.border = "2px solid blue"; // Bordure bleue pour l'encadré
                img.style.margin = "auto"; // Centrage de l'image

                photoUploadContainer.appendChild(img);
            }
            changeSubmitButtonColor();
        });

        titleInput.addEventListener("input", function () {
            changeSubmitButtonColor();
        })

        categorySelect.addEventListener("change", function () {
            changeSubmitButtonColor();
        })

        // Validation du formulaire et envoi à l'API
        validateBtn.addEventListener("click", async function () {
            const file = photoInput.files[0];
            const title = titleInput.value.trim();
            const category = categorySelect.value;

            if (!file || !title || !category) {
                alert("Veuillez remplir tous les champs !");
                return;
            }

            const formData = new FormData();
            formData.append("image", file);
            formData.append("title", title);
            formData.append("category", category);

            try {
                const response = await fetch("http://localhost:5678/api/works", {
                    method: "POST",
                    headers: { Authorization: "Bearer " + sessionStorage.getItem("token") },
                    body: formData
                });

                if (response.ok) {
                   // alert("Photo ajoutée avec succès !"); // Popup désactivée, aucune alerte affichée

                    addPhotoForm.reset(); // Réinitialiser le formulaire
                    photoUploadContainer.querySelector("img").remove(); // Supprimer l'image
                    photoUploadContainer.querySelector("i").style.display = "inline-block"; // fait apparaitre l'icône
                    photoUploadContainer.querySelector("label").style.display = "flex"; // fait apparaitre le label
                    photoUploadContainer.querySelector("p").style.display = "block"; // fait apparaitre le paragraphe
                    await getWorks()
                    createWorks(works)
                    displayThumbnails()
                    secondModal.style.display = "none"; // Fermer la modale
                    
                } else {
                    alert("Erreur lors de l'ajout de la photo !");
                }
            } catch (error) {
                console.error("Erreur :", error);
            }
        });
    } else {
        console.error("Un ou plusieurs éléments HTML sont introuvables !");
    }
});

