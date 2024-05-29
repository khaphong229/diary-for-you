const display = (data) => {
  let address = document.getElementById("address");
  let temp = document.getElementById("temperature");
  let time = document.getElementById("time");
  let img_weather=document.getElementById('img-weather');

  address.innerText = data["location"]["name"] + ', ' + data["location"]["country"];
  temp.innerText = data["current"]["temp_c"];
  time.innerText=data["location"]["localtime"];
  img_weather.src=data['current']['condition']['icon'];
};
const getApi = () => {
  fetch(
    "https://api.weatherapi.com/v1/current.json?q=HaNoi&key=4ae04986f307408ba4222015240104"
  )
    .then((req) => {
      return req.json();
    })
    .then((data) => {
      display(data);
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
};
getApi();
setInterval(getApi,30000);

document.addEventListener('DOMContentLoaded', () => {
  const customCursor = document.getElementById('custom-cursor');
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
  });

  function updateCursor() {
      cursorX += (mouseX - cursorX) * 0.1;
      cursorY += (mouseY - cursorY) * 0.1;

      customCursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;

      requestAnimationFrame(updateCursor);
  }

  requestAnimationFrame(updateCursor);
});