const body = document.querySelector("body");
const myForm = document.createElement("form");
myForm.classList.add("myForm");
const dateInput = document.createElement("input");
dateInput.type = "date";
dateInput.name = "date";
dateInput.classList.add("date");
dateInput.setAttribute("aria-label", "date");
const submitBtn = document.createElement("button");
submitBtn.classList.add("btn", "submitBtn");
submitBtn.type = "submit";
submitBtn.textContent = "Get Picture";
myForm.append(dateInput, submitBtn);
const showBox = document.createElement("div");
const favBox = document.createElement("div");
favBox.classList.add("favourite");
const favTitle = document.createElement("h1");
favTitle.textContent = "Favourite Images";
const favText = document.createElement("h3");
favText.classList.add("favTxt");
favBox.append(favTitle, favText);
const savedImage = JSON.parse(localStorage.getItem("favorites")) || [];
updateGallery();
if (savedImage.length > 0) {
  favText.textContent = `You have ${savedImage.length} images in your favourite.`;
} else {
  favText.textContent = "No images have been saved in your favorites box!";
}

myForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const selectedDate = myForm.elements.date.value;
  const apiKey = "2a19czXpbFL2NBG8tU6NA8yzQ79Rw7nSPjsVl17L";
  const apiLink = await fetch(
    `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${selectedDate}`
  );
  const info = await apiLink.json();
  const date = info.date;
  const explanation = info.explanation;
  const hdurl = info.hdurl;
  const title = info.title;
  const url = info.url;
  showBox.classList.add("showBox");
  showBox.innerHTML = "";
  const detail = document.createElement("div");
  detail.classList.add("details");
  const detailHeader = document.createElement("h1");
  detailHeader.classList.add("detailHeader");
  detailHeader.textContent = title;
  const detailDate = document.createElement("h3");
  detailDate.classList.add("detailDate");
  detailDate.textContent = date;
  const detailTxt = document.createElement("p");
  detailTxt.classList.add("text");
  detailTxt.textContent = explanation;
  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Save";
  saveBtn.classList.add("btn", "saveBtn");
  detail.append(detailHeader, detailDate, detailTxt, saveBtn);
  const imageBox = document.createElement("div");
  imageBox.classList.add("imageBox");
  const image = document.createElement("img");
  image.classList.add("image");
  image.src = url;
  imageBox.append(image);
  showBox.append(detail, imageBox);
  image.addEventListener("click", function (e) {
    e.preventDefault();
    let hdPic = document.querySelector(".hd");
    if (hdPic) {
      hdPic.remove();
    } else {
      const hdImage = document.createElement("img");
      hdImage.classList.add("hd");
      hdImage.src = hdurl;
      showBox.append(hdImage);
    }
  });
  document.addEventListener("click", function (e) {
    let hdPic = document.querySelector(".hd");

    if (hdPic && !hdPic.contains(e.target) && !image.contains(e.target)) {
      hdPic.remove();
    }
  });
  saveBtn.addEventListener("click", function () {
    e.preventDefault();
    const savedItem = { title, date, url };
    const exists = savedImage.some(
      (item) => item.title === savedItem.title && item.date === savedItem.date
    );
    if (!exists) {
      savedImage.push(savedItem);
      localStorage.setItem("favorites", JSON.stringify(savedImage));
      if (savedImage.length > 0) {
        favText.textContent = `You have ${savedImage.length} images in your favourite.`;
      }
      updateGallery();
    }
    else{
      alert("This image is already in your favorites!")
    }
  });
});
function updateGallery() {
  let gallery = document.querySelector(".gallery");
  if (savedImage.length > 0) {
    if (!gallery) {
      gallery = document.createElement("div");
      gallery.classList.add("gallery");
      favBox.append(gallery);
    }
    gallery.innerHTML = "";
    savedImage.forEach((pic) => {
      const imageSavedBox = document.createElement("div");
      imageSavedBox.classList.add("savedBox");
      const picTitle = document.createElement("div");
      picTitle.classList.add("savedTitle");
      picTitle.textContent = pic.title;
      const picDate = document.createElement("div");
      picDate.classList.add("savedDate");
      picDate.textContent = pic.date;
      const picUrl = document.createElement("img");
      picUrl.classList.add("savedImage");
      picUrl.src = pic.url;
      const removeBtn = document.createElement("button");
      removeBtn.classList.add("remove", "btn");
      removeBtn.type = "button";
      removeBtn.textContent = "Remove";

      removeBtn.addEventListener("click", function (e) {
        e.preventDefault();
        const index = savedImage.findIndex(
          (item) => item.title === pic.title && item.date === pic.date
        );
        if (index !== -1) {
          savedImage.splice(index, 1);
        }
        localStorage.setItem("favorites", JSON.stringify(savedImage));
        if (savedImage.length > 0) {
          favText.textContent = `You have ${savedImage.length} images in your favourite.`;
        } else {
          favText.textContent =
            "No images have been saved in your favorites box!";
          gallery.remove();
        }
        updateGallery();
      });
      imageSavedBox.append(picTitle, picDate, picUrl, removeBtn);
      gallery.append(imageSavedBox);
    });
  }
}
body.append(myForm, showBox, favBox);
