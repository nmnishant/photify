///////////////////////////////////////

import addPhotosToDOM from "./addPhotosToDOM";
import { imgSize } from "./config";
import { showError } from "./Error";

// Get Photos from Flickr and add it to the DOM
const getPhotos = async function (url) {
  try {
    const photosRes = await fetch(url);
    const photosJSON = await photosRes.json();
    if (photosJSON.stat == "fail") throw new Error(photosJSON.message);
    addPhotosToDOM(photosJSON.photos.photo, imgSize); // w - size suffix (means 400px max)
  } catch (err) {
    showError(err);
  }
};

// LOAD NEXT PAGE
const loadPage = function (url, pageNo) {
  if (pageNo) url += `&page=${pageNo}`;
  getPhotos(url);
};

export default loadPage;
