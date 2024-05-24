let slideIndex = 0;
showSlides();

function showSlides() {
    const slides = document.getElementsByClassName("mySlides");
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove("show");
    }
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1 }
    slides[slideIndex-1].classList.add("show");
    setTimeout(showSlides, 3000); // Change image every 3 seconds
}

var headingElement = document.getElementById("text-heading");

var list_heading_text = [
  "hey guys! welcome to my portfolio",
  "my name is phong",
  "you can follow me with the socials",
  "good job! bro",
  "please! hire me",
];

// Ham random trong khoang tuy y
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function get_heading() {
  var index = getRandomInt(0, list_heading_text.length);
  headingElement.innerHTML = list_heading_text[index];
}

setInterval(get_heading, 3000);
