/// get api weather
const display = (data) => {
  let address = document.getElementById("address");
  let temp = document.getElementById("temperature");
  let time = document.getElementById("time");
  let img_weather = document.getElementById("img-weather");

  address.innerText = `${data.location.name}, ${data.location.country}`;
  temp.innerText = `${data.current.temp_c}`;
  
  localStorage.setItem('weather_address', address.innerText);
  localStorage.setItem('weather_temp', temp.innerText);
  localStorage.setItem('weather_icon', data.current.condition.icon);
  localStorage.setItem('weather_localtime', data.location.localtime);
  
  updateDisplayTime(data.location.localtime);
  img_weather.src = data.current.condition.icon;
};

const updateDisplayTime = (localtime) => {
  let time = document.getElementById("time");
  let currentTime = new Date();
  let [datePart, timePart] = localtime.split(" ");
  let [year, month, day] = datePart.split("-");
  let formattedDate = `${currentTime.getHours()}:${currentTime.getMinutes()} - ${day}/${month}/${year}`;
  time.innerText = formattedDate;
};

const getApi = () => {
  fetch("https://api.weatherapi.com/v1/current.json?q=HaNoi&key=4ae04986f307408ba4222015240104")
      .then((req) => req.json())
      .then((data) => {
          display(data);
          console.log(data);
      })
      .catch((err) => {
          console.log(err);
      });
};

const loadLocalData = () => {
  let address = localStorage.getItem('weather_address');
  let temp = localStorage.getItem('weather_temp');
  let icon = localStorage.getItem('weather_icon');
  let localtime = localStorage.getItem('weather_localtime');

  if (address && temp && icon && localtime) {
      document.getElementById("address").innerText = address;
      document.getElementById("temperature").innerText = temp;
      document.getElementById("img-weather").src = icon;
      updateDisplayTime(localtime);
  } else {
      getApi();
  }
};

loadLocalData();
setInterval(() => {
  let localtime = localStorage.getItem('weather_localtime');
  if (localtime) {
      updateDisplayTime(localtime);
  }
}, 60000);


// effect to move cursor
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


// edit the ui of list diaries
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

// get username and save in the localstorage
const get_save_user_name=()=>{
  let nameuser=document.getElementsByClassName('name-user')[0].innerText;
  if(!sessionStorage.getItem('user-name') || sessionStorage.getItem('user-name')!=nameuser){
    sessionStorage.setItem('user-name',nameuser);
  }
  if(!nameuser){
    let user=sessionStorage.getItem('user-name');
    console.log(user);
    document.getElementsByClassName('name-user')[0].innerText=user;
  }
}
get_save_user_name();
