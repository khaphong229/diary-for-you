const display = (data) => {
  let address = document.getElementById("address");
  let temp = document.getElementById("temperature");
  let time = document.getElementById("time");
  let img_weather = document.getElementById("img-weather");

  address.innerText =
    data["location"]["name"] + ", " + data["location"]["country"];
  temp.innerText = data["current"]["temp_c"];
  let localtime = data["location"]["localtime"];
  let [datePart, timePart] = localtime.split(" ");
  let [year, month, day] = datePart.split("-");
  let formattedDate = `${timePart} - ${day}/${month}/${year}`;
  time.innerText = formattedDate;
  img_weather.src = data["current"]["condition"]["icon"];
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
setInterval(getApi, 30000);

document.addEventListener("DOMContentLoaded", () => {
  const customCursor = document.getElementById("custom-cursor");
  let mouseX = 0,
    mouseY = 0;
  let cursorX = 0,
    cursorY = 0;

  document.addEventListener("mousemove", (e) => {
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

const handleDataDiary = () => {
  let numbers_diary = document.getElementsByClassName("diary").length;
  for (let i = 0; i < numbers_diary; i++) {
    let day_input = document.getElementsByClassName("created-day")[i];
    let month_input = document.getElementsByClassName("created-month")[i];
    let title_input = document.getElementsByClassName("title-diary")[i];
    let content_input = document.getElementsByClassName("content-diary")[i];

    let day = day_input.innerText.split(" ")[1].split(",")[0];
    let month = day_input.innerText.split(" ")[0];
    let title = title_input.innerText.slice(0, 50);
    let content = content_input.innerText.slice(0, 100) + "... ";
    day_input.innerText = day;
    month_input.innerText = month;
    content_input.innerText = content;
    title_input.innerText = title;
  }
};
const timeline=()=>{
  document.addEventListener("DOMContentLoaded", function() {
    const diaryList = document.querySelectorAll(".list-diaries .diary");
    let lastDateClass = "";
    
    diaryList.forEach(diary => {
        const dateElement = diary.querySelector(".time-diary");
        let dateClass=dateElement.innerText;
        if (dateClass === lastDateClass) {
          const newDiv = document.createElement('div');
          newDiv.className = 'flex-container';
          newDiv.style.flex = '1';
          const timeDiary = diary.querySelector('.time-diary');
          diary.insertBefore(newDiv, timeDiary); 
            dateElement.style.display = 'none';
        } else {
            lastDateClass = dateClass;
        }
    });
  });
}
handleDataDiary();
timeline();