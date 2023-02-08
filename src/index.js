const axios = require('axios');
const Notiflix = require('notiflix');
require('notiflix/build/notiflix-aio');
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = '33350132-5d1ea35eb331ac29bb43c59ce';
const form = document.querySelector('#search-form');
const input = form.querySelector('input');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

let page = 1;

const clearCode = () => { gallery.innerHTML = "" };

form.addEventListener('submit', async event => {
  clearCode();
  event.preventDefault();
  page = 1;
  loadMoreButton.style.display = 'none';
  const query = input.value;
  if (!query) {
    return;
  }
  const response = await axios.default.get(
    `https://pixabay.com/api/?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&per_page=40&page=${page}&safesearch=true`,
    {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    }
  );
  if (response.data.hits.length === 0) {
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    return;
  }
  const images = response.data.hits;
  showImages(images);
  if (response.data.totalHits > images.length) {
    loadMoreButton.style.display = 'block';
  }
});

loadMoreButton.addEventListener('click', async event => {
  event.preventDefault();
  const query = input.value;
  if (!query) {
    return;
  }
  const response = await axios.default.get(
    `https://pixabay.com/api/?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&per_page=40&page=${++page}&safesearch=true`,
    {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    }
  );
  const images = response.data.hits;
  showImages(images);
  if (response.data.totalHits <= images.length * page) {
    loadMoreButton.style.display = 'none';
  }
});

const showImages = images => {
  if (!loadMoreButton) {
      clearCode();
  };
  images.forEach(image => {
    const div = document.createElement('div');
    div.classList.add('photo-card');
    div.innerHTML = `
        <a href="${image.webformatURL}" class="card-image"><img src="${image.webformatURL}" alt="${image.tags}" loading="lazy"/></a>
        <div class="info">
            <p class="info-item"><b>Likes:</b> ${image.likes}</p>
            <p class="info-item"><b>Views:</b> ${image.views}</p>
            <p class="info-item"><b>Comments:</b> ${image.comments}</p>
            <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
        </div>
        `;
    gallery.appendChild(div);
  });
  let lightbox = new SimpleLightbox('.gallery .photo-card a', {
        captionsData: 'alt',
        captionDelay: 250,
        captionPosition: 'bottom',
  });
  lightbox.on(`show.lightbox`);
  lightbox.refresh();
};