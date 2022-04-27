import { toBase64 } from './utils.js';

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

// Show images saved in local storage on page load
const imageList = JSON.parse(localStorage.getItem("gallery.imageList")) || [];
document.querySelector("#gallery").innerHTML = imageList.map(imageItem => {
  return `
    <img
      src="${imageItem.image.data}"
      alt="${imageItem.title}"
      class="object-fill w-full h-full rounded"
      data-tooltip-target="tooltip-light" data-tooltip-style="light"
    >
    <div id="tooltip-light" role="tooltip" class="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 shadow-sm opacity-0 tooltip">
      ${imageItem.title}
      <div class="tooltip-arrow" data-popper-arrow></div>
    </div>
    `;
}).join("");
