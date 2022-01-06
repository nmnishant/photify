import { showError, hideError } from "./Error";
const imageContainer = document.querySelector(".images-container");

///////////////////////////////

// Add photos to DOM
const addPhotosToDOM = function (photosArr, size) {
  if (photosArr.length == 0) showError();
  else hideError();
  photosArr.forEach((photo) =>
    imageContainer.insertAdjacentHTML(
      "beforeend",
      `<img class="photo" src="https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_${size}.jpg" alt="${photo.title}">`
    )
  );
};

export default addPhotosToDOM;
