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

form.addEventListener('submit', serchImages)



function serchImages(e) {

    clearListOfGallery()

    e.preventDefault();
    serchNeedImage = input.value
    console.log(input.value);

    fetch(`https://pixabay.com/api/?key=${KEY}&q=${serchNeedImage}&image_type=photo&orientation=horizontal&safesearch=true`)
        .then(r => r.json())
        .then(array => {
            if (array.total === 0) {
                Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
                btnLodMore.classList.add("hidden");
                return;
            }
            Notiflix.Notify.success(`Hooray! We found ${array.totalHits} images.`)
            createListOfImages(array.hits);
            console.log("all good", array.total);
        });
    
}

function createListOfImages(rezultSerches) {

    btnLodMore.classList.remove("hidden");


    console.log(rezultSerches);

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
    })
}
// webformatURL - ссылка на маленькое изображение для списка карточек.
// largeImageURL - ссылка на большое изображение.
// tags - строка с описанием изображения. Подойдет для атрибута alt.
// likes - количество лайков.
// views - количество просмотров.
// comments - количество комментариев.
// downloads - количество загрузок.

function clearListOfGallery() {
    divGallery.innerHTML = "";
    
}

console.log(serchNeedImage);

