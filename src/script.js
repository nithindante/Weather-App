let form = document.querySelector("form");
import "./style.css";
import { createClient } from "pexels";

form.addEventListener("submit", () => {
  event.preventDefault();
  checkImages();
  let input = document.querySelector(".input");

  setTimeout(() => {});
  async function checkWeather() {
    try {
      let response = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${input.value}?key=HCQFFDNV76QXVG7C2739NN36U`
      );
      if (response.status != 200) {
        throw new Error("Please enter a valid location");
      }
      let user = await response.json();
      return user;
    } catch (error) {
      alert("please enter a valid city");
    }
  }

  try {
    weatherResponse();
  } catch (error) {
    alert(error);
  }
  async function weatherResponse() {
    let weather = await checkWeather();
    imgResponse(weather.currentConditions.conditions);
    setDivs(weather);
  }
});

async function imgResponse(query) {
  const client = await createClient(
    "YqAdPNIVeCAHEQhKLObJ2GRyjc6Dtk54fqG7OyRpRnesysfvxtR2xdio"
  );
  let photos = await client.photos.search({ query: `${query}` });
  let photo = photos.photos[0].src.original;
  let results = document.querySelector(".resultsDiv");
  results.style.display = "flex";
  return photo;
}

async function setDivs(weather) {
  let results = document.querySelector(".resultsDiv");
  let roomTemp = Math.round(weather.currentConditions.temp);
  // let roomTemp = Math.round((weather.currentConditions.temp - 32) * (5 / 9));
  let tempDiv = results.querySelector(".tempDiv");
  let descDiv = results.querySelector(".descDiv");
  let climateDiv = results.querySelector(".climateDiv");
  let image = results.querySelector("img");
  tempDiv.textContent = `${roomTemp} F`;
  descDiv.textContent = weather.currentConditions.conditions;
  climateDiv.textContent = weather.description;
  let imgUrl = await imgResponse(weather.currentConditions.conditions);
  image.src = imgUrl;
  let loader = document.getElementById("loader");
  loader.classList.add("hidden");
  results.classList.toggle("displayed");
}

async function checkImages() {
  let results = document.querySelector(".resultsDiv");
  let loader = document.getElementById("loader");
  if (!results.classList.contains("displayed")) {
    results.style.display = "none";
    loader.classList.toggle("hidden");
  }
}

let switchTemp = (function () {
  let button = document.querySelector(".switchDiv");
  button.addEventListener("click", function () {
    let tempDiv = document.querySelector(".tempDiv");
    if (tempDiv.textContent.includes("F") && button.textContent.includes("C")) {
      let temp = Math.round((setTemp() - 32) * (5 / 9));
      tempDiv.textContent = `${temp} C`;
      button.textContent = "Switch to Fahrenheit";
    } else if (
      tempDiv.textContent.includes("C") &&
      button.textContent.includes("F")
    ) {
      let temp = Math.round(setTemp() * (9 / 5) + 32);
      tempDiv.textContent = `${temp} F`;
      button.textContent = "Switch to Celsius";
    }
  });
})();

function setTemp() {
  let tempDiv = document.querySelector(".tempDiv");
  let temp = tempDiv.textContent;
  const regex = /^\d+/;
  const match = temp.match(regex);
  const temperature = parseInt(match[0], 10);
  return temperature;
}
