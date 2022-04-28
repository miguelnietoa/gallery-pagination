import { toBase64, paginate } from './utils.js';

// Get the state of dropdown to decide what input to show
document.getElementById("category").addEventListener("change", (e) => {
  const imageType = e.target.value;
  const fileInput = document.getElementById("image-file");
  const urlInput = document.getElementById("image-url");

  if (imageType === "file") {
    fileInput.classList.remove("hidden");
    fileInput.setAttribute("required", "");

    urlInput.classList.add("hidden");
    urlInput.removeAttribute("required");
  } else if (imageType === "url") {
    urlInput.classList.remove("hidden");
    urlInput.setAttribute("required", "");

    fileInput.classList.add("hidden");
    fileInput.removeAttribute("required");
  }
});

document.getElementById("form").addEventListener("submit", async (e) => {
  const imageType = document.getElementById("category").value;
  let imageData;
  if (imageType === "file") {
    imageData = document.getElementById("image-file").files[0];
    imageData = await toBase64(imageData);
  } else if (imageType === "url") {
    imageData = document.getElementById("image-url").value;
  }
  const imageObject = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    image: {
      type: imageType,
      data: imageData,
    }
  };

  const imageList = JSON.parse(localStorage.getItem("gallery.imageList")) || [];
  imageList.push(imageObject);
  localStorage.setItem("gallery.imageList", JSON.stringify(imageList));

});

const PAGE_SIZE = 12;
const imageList = JSON.parse(localStorage.getItem("gallery.imageList")) || [];
const numPages = Math.ceil(imageList.length / PAGE_SIZE);



const url = new URL(window.location);
let currentPage = parseInt(url.searchParams.get("page"));
if (!currentPage || currentPage < 1 || currentPage > numPages) {
  currentPage = 1;
  url.searchParams.set("page", currentPage);
  window.history.pushState({}, "", url.toString());
}

const imagesToShow = paginate(imageList, currentPage, PAGE_SIZE);

if (imageList.length === 0) {
  document.getElementById("pagination-controls").classList.add("hidden");
}

// Render buttons for pagination
document.querySelector("#btns-pages").innerHTML = [...Array(numPages)].map((_, i) =>
  `
  <a id="btn-${i + 1}" href="/?page=${i + 1}" class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-blue-400 hover:text-white">
    ${i + 1}
  </a>
  `
).join("");

// Set href of prev and next buttons
const enableButtonClasses = " hover:bg-blue-400 hover:text-white";
if (currentPage === 1) {
  document.getElementById("btn-prev").removeAttribute("href");
  document.getElementById("btn-prev").className.replace(enableButtonClasses, "");
} else {
  document.getElementById("btn-prev").setAttribute("href", `/?page=${currentPage - 1}`);
  document.getElementById("btn-prev").className += enableButtonClasses;
}

if (currentPage === numPages) {
  document.getElementById("btn-next").removeAttribute("href");
  document.getElementById("btn-next").className.replace(enableButtonClasses, "");
} else {
  document.getElementById("btn-next").setAttribute("href", `/?page=${currentPage + 1}`);
  document.getElementById("btn-next").className += enableButtonClasses;
}


const renderImages = (imagesToShow) => {
  document.querySelector("#gallery").innerHTML = imagesToShow.map(imageItem => {
    return `
      <img
        src="${imageItem.image.data}"
        alt="${imageItem.title}"
        class="object-fill w-full h-full rounded"
        data-tooltip-target="tooltip-light" data-tooltip-style="light"
      >
      <div id="tooltip-light" role="tooltip" class="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 shadow-sm opacity-0 tooltip">
        <h6 class="font-bold">${imageItem.title}</h6>
        ${imageItem.description}
        <div class="tooltip-arrow" data-popper-arrow></div>
      </div>
      `;
  }).join("");
};

renderImages(imagesToShow);
