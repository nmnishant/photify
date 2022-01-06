const loader = document.querySelector(".loader");
const noResult = document.querySelector(".no-result");

export const showError = function (msg) {
  const images = document.querySelector(".images-container").children;
  if (!msg) msg = images.length == 0 ? "No image found" : "Finished up";
  noResult.innerText = msg;
  noResult.classList.remove("hide");
  loader.classList.add("hide");
};

export const hideError = function () {
  noResult.classList.add("hide");
  loader.classList.remove("hide");
};
