import Notiflix from 'notiflix'
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from 'axios';

const form = document.querySelector('#search-form');
const input = document.querySelector('input[name="searchQuery"]');
const btnSerch = document.querySelector('.search-btn');
const divGallery = document.querySelector('.gallery');
const btnLodMore = document.querySelector('.load-more');

const KEY = '29210178-99963cb2fa4a70f711806a762';
let serchNeedImage = '';
let currentPage = 1;


form.addEventListener('submit', serchImages);
btnLodMore.addEventListener('click', loadMoreSerchImages);


function serchImages(e) {
    e.preventDefault();

    clearListOfGallery()

    currentPage = 1;
    
    if ((e.currentTarget.elements.searchQuery.value).trim() === '') {
        btnLodMore.classList.add("hidden");
        Notiflix.Notify.warning('Please input smt. to serch');
        return;
    } else {
        serchNeedImage = e.currentTarget.elements.searchQuery.value
        fechfunction(serchNeedImage);
    }
    
}
function fechfunction(serchNeedImage) {
    fetch(`https://pixabay.com/api/?key=${KEY}&q=${serchNeedImage}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=40`)
        .then(r => r.json())
        .then(array => {
            if (array.total === 0) {
                Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
                btnLodMore.classList.add("hidden");
                return;
            }
            else if (array.totalHits <= 40) {
                currentPage += 1;
                Notiflix.Notify.success(`Hooray! We found ${array.totalHits} images.`)
                createListOfImages(array.hits);
                btnLodMore.classList.add("hidden");
            } else {
                currentPage += 1;
                Notiflix.Notify.success(`Hooray! We found ${array.totalHits} images.`)
                createListOfImages(array.hits);
            }
        });  
}


function createListOfImages(rezultSerches) {

    btnLodMore.classList.remove("hidden");

    for (const item of rezultSerches) {
        const rezult = `<div class="photo-card">
        <a href="${item.largeImageURL}"><img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" width="270" height ="180"/>
        </a>
        <div class="info">
        <p class="info-item">
        <b>Likes ${item.likes}</b>
        </p>
        <p class="info-item">
        <b>Views ${item.views}</b>
        </p>
        <p class="info-item">
        <b>Comments ${item.comments}</b>
        </p>
        <p class="info-item">
        <b>Downloads ${item.downloads}</b>
        </p>
        </div>
        </div>`
        
        divGallery.insertAdjacentHTML('beforeend', rezult);  
    }

    const lightbox = new SimpleLightbox('.gallery a', {
        captionsData: 'alt',
        captionDelay: 250,
    });
}

function loadMoreSerchImages() {

    fetch(`https://pixabay.com/api/?key=${KEY}&q=${serchNeedImage}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=40`)
        .then(r => r.json())
        .then(array => {
            let count = currentPage*40;
            currentPage += 1;
            
            createListOfImages(array.hits);

            if (count >= array.totalHits) {
                btnLodMore.classList.add("hidden"); 
                Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
            }
        });
}



function clearListOfGallery() {
    divGallery.innerHTML = "";
}

