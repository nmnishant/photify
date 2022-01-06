import "@babel/polyfill";
import buildFlickrURL from "./buildFlickrURL";
import loadPage from "./loadPage";
import { urlOptions } from "./config";
import loadAutoComplete from "./loadAutoComplete";
import { showError, hideError } from "./Error";

///////////////////////////////////////

// DOM ELEMENTS
const header = document.querySelector(".header");
const imageContainer = document.querySelector(".images-container");
const searchField = document.querySelector(".search-field");
const autoComp = document.querySelector(".auto-comp");
const loader = document.querySelector(".loader");
const clearSearchFieldBtn = document.querySelector(".cross");
const searchIcon = document.querySelector(".magnifier");
const modal = document.querySelector(".modal");
const modalOverlay = document.querySelector(".modal-overlay");
const closeModalBtn = document.querySelector(".close-modal");

///////////////////////////////////////
// **** FEATURES ****
///////////////////////////////////////

// 1. Infinite scrolling (used intersection api instead of scroll event to boost performance)
const loadPhotos = function ([entry]) {
  if (entry.isIntersecting) {
    hideError();
    const url = buildFlickrURL(urlOptions);
    loadPage(url);
    urlOptions.page++;
  }
};
const loadObserver = new IntersectionObserver(loadPhotos, {
  root: null,
  threshold: 0.5,
});
loadObserver.observe(loader);

///////////////////////////////////////

// 2. Sticky navigation
const stickyNav = function ([entry]) {
  if (!entry.isIntersecting) header.classList.add("sticky");
  else header.classList.remove("sticky");
};
const pageObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
});
const pageOverlay = document.querySelector(".page-overlay");
pageObserver.observe(pageOverlay);

///////////////////////////////////////

// 3. Load images by selected or typed keywords
const LoadImagesByText = function (searchText) {
  urlOptions.method = "flickr.photos.search";
  urlOptions.page = 1;
  urlOptions.options = {};

  storeSearchHistory(searchText);
  if (!searchText) urlOptions.method = "flickr.photos.getRecent";
  else urlOptions.options = { text: searchText };

  autoComp.classList.add("hide");
  imageContainer.innerHTML = "";
  hideError();
};

///////////////////////////////////////

// 4. Suggest keywords and load images when press enter
searchField.addEventListener("keyup", async function (e) {
  const val = e.target.value;

  if (e.key == "Enter") return LoadImagesByText(val);
  if (!val) return;

  const url = buildFlickrURL({
    method: "flickr.photos.search",
    options: { text: val },
  });

  try {
    const res = await fetch(url);
    const resJSON = await res.json();
    autoComp.innerHTML = "";
    if (resJSON.stat == "fail") throw new Error(resJSON.message);
    for (let i = 0; i < resJSON.photos.photo.length && i < 5; i++) {
      const title = resJSON.photos.photo[i].title;
      if (!title) continue;
      autoComp.insertAdjacentHTML(
        "beforeend",
        `<div class="item">
        <li>${resJSON.photos.photo[i].title}</li>
        </div>`
      );
    }
  } catch (err) {
    showError(err);
  }
});

///////////////////////////////////////

// 5. Store and delete search results
const storeSearchHistory = function (val) {
  if (!val) return;

  const searchHistoryArr = JSON.parse(
    localStorage.getItem("searchHistory") || "[]"
  );

  if (searchHistoryArr.includes(val)) {
    searchHistoryArr.splice(searchHistoryArr.indexOf(val), 1);
  }

  searchHistoryArr.push(val);
  localStorage.setItem("searchHistory", JSON.stringify(searchHistoryArr));
};

const deleteSearch = function (index) {
  let searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
  searchHistory = searchHistory.filter(
    (_, i) => index != searchHistory.length - 1 - i
  );
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  loadAutoComplete();
};

///////////////////////////////////////

// 6. Preview photo - Modal
const openModal = function (src) {
  modal.firstElementChild.src = src;
  modal.classList.remove("hide");
  closeModalBtn.classList.remove("hide");
  modalOverlay.classList.remove("hide");
};

const closeModal = function () {
  modal.classList.add("hide");
  modalOverlay.classList.add("hide");
  closeModalBtn.classList.add("hide");
};

///////////////////////////////////////
// **** EVENT DELEGATIONS ****
///////////////////////////////////////

// 1. Delete selected search history
// &&
// load images when text selected
autoComp.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-search")) {
    let target = e.target.closest(".item");
    deleteSearch(target.dataset.item);
    return;
  }
  searchField.value = e.target.innerText;
  storeSearchHistory(e.target.innerText);
  loadAutoComplete();
  LoadImagesByText(e.target.innerText);
});

// 2. Hide auto complete element when out of focus
document.body.addEventListener("click", function (e) {
  const search = e.target.closest(".search");
  if (!search && !e.target.classList.contains("delete-search"))
    autoComp.classList.add("hide");
});

// 3. Open modal when a photo clicked
imageContainer.addEventListener("click", (e) => {
  if (!e.target.classList.contains("photo")) return;
  openModal(e.target.getAttribute("src"));
});

///////////////////////////////////////
// **** Event Handlers *****
///////////////////////////////////////

// 1. Clear search field text
clearSearchFieldBtn.addEventListener("click", () => (searchField.value = ""));

// 2. Load auto complete element from local storage
searchField.addEventListener("click", loadAutoComplete);

// 3. Load images of typed text
searchIcon.addEventListener("click", () => LoadImagesByText(searchField.value));

// 4. Reset to default settings and load images
document.querySelector(".nav__logo").addEventListener("click", () => {
  searchField.value = "";
  LoadImagesByText(null);
});

// 5. Listening events to close modal
closeModalBtn.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", closeModal);
document.addEventListener("keyup", function (e) {
  if (e.key == "Escape" && !modal.classList.contains("hide")) {
    closeModal();
  }
});
