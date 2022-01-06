import { api_key } from "./config";

// BUILD FLICKR URL USING GIVEN PARAMS

const buildFlickrURL = function ({ method, page, options }) {
  const params = {
    method: method || "flickr.photos.getRecent",
    api_key,
    format: "json",
    nojsoncallback: 1,
    content_type: 1,
    per_page: 10,
    page: page || 1,
    ...options,
  };
  let getPhotosURL = `https://www.flickr.com/services/rest?`;
  Object.entries(params).forEach(([key, value]) => {
    getPhotosURL += `${key}=${value}&`;
  });
  getPhotosURL = getPhotosURL.slice(0, -1);
  return getPhotosURL;
};

export default buildFlickrURL;
