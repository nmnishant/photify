const autoComp = document.querySelector(".auto-comp");
const searchField = document.querySelector(".search-field");

///////////////////////////////

// Load auto complete element from browser local storage
const loadAutoComplete = function () {
  autoComp.classList.remove("hide");
  autoComp.innerHTML = "";
  const searchHistory = JSON.parse(
    localStorage.getItem("searchHistory") || "[]"
  );
  for (let i = 0; i < searchHistory.length && i < 5; i++) {
    autoComp.insertAdjacentHTML(
      "beforeend",
      `<div data-item="${i}" class="item">
        <li class="list-item">${
          searchHistory[searchHistory.length - 1 - i]
        }</li>
        <i class="im im-x-mark delete-search"></i>
      </div>`
    );
  }
};

export default loadAutoComplete;
