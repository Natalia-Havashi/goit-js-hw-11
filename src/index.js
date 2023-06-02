import { Notify } from "notiflix";
import axios from "axios";


const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '36947214-e67710a045a4cff9982bc6142';

const refs ={
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.load-more')
};

let page = 1;
let value = '';

refs.form.addEventListener('submit', handlerSearchForm);
refs.btnLoadMore.addEventListener('click', handlerLoadMore);
refs.btnLoadMore.classList.add('is-hidden');

async function getUrl(query, page) {
  const { data } = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&per_page=40&page=${page}&orientation=horizontal&safesearch=true`);
  return data.hits;
}


async function handlerSearchForm(event) {
  event.preventDefault();
 refs.btnLoadMore.classList.remove('is-hidden');
 const data = new FormData(event.currentTarget);
 const formatted = data.getAll('searchQuery').map(item => item.trim());

 if(formatted === ''){
  Notify.info('Enter a request');
  return;
 } else 
 page = 1;
 gallery()
 value = formatted;
 

 const result = await getUrl(formatted, page);
 if(result.length === 0){
  return Notify.failure("Sorry, there are no images matching your search query. Please try again.")
 }

 createImagesMarkup(result);
 endOfSearch(result);

 refs.form.reset();
 
}


function gallery() {
  refs.gallery.innerHTML = '';
}

async function handlerLoadMore(){
  refs.btnLoadMore.setAttribute('disabled', true);
  page += 1;
  const result = await getUrl(value, page);

  createImagesMarkup(result)
  endOfSearch(result)

  refs.btnLoadMore.removeAttribute('disabled');
}



  function createImagesMarkup(arr) {
    const murkup = arr.map(hit =>  
`    <div class="photo-card">
        <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" />
        <div class="info">
            <p class="info-item">
                <b>Likes ${hit.likes}</b>
            </p>
            <p class="info-item">
                <b>Views ${hit.views}</b>
            </p>
            <p class="info-item">
                <b>Comments ${hit.comments}</b>
            </p>
            <p class="info-item">
                <b>Downloads ${hit.downloads}</b>
            </p>
        </div>
    </div>        
    `).join('');
     refs.gallery.insertAdjacentHTML('beforeend', murkup);
}

function endOfSearch(result){
  if (result.length < 40) {
    Notify.warning("We're sorry, but you've reached the end of search results.");
      refs.btnLoadMore.classList.add('is-hidden');
  }
}


