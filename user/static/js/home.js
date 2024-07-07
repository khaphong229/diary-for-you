/// get api weather
const display = (data) => {
  let address = document.getElementById("address");
  let temp = document.getElementById("temperature");
  let time = document.getElementById("time");
  let img_weather = document.getElementById("img-weather");

  address.innerText = `${data.location.name}, ${data.location.country}`;
  temp.innerText = `${data.current.temp_c}`;
  
  sessionStorage.setItem('weather_address', address.innerText);
  sessionStorage.setItem('weather_temp', temp.innerText);
  sessionStorage.setItem('weather_icon', data.current.condition.icon);
  sessionStorage.setItem('weather_localtime', data.location.localtime);
  
  update_display_time(data.location.localtime);
  img_weather.src = data.current.condition.icon;
};

const update_display_time = (localtime) => {
  let time = document.getElementById("time");
  let time_now = new Date();
  let [date, timePart] = localtime.split(" ");
  let [year, month, day] = date.split("-");
  let format_date = `${time_now.getHours()}:${time_now.getMinutes()} - ${day}/${month}/${year}`;
  time.innerText = format_date;
};

const getApi = () => {
  fetch("https://api.weatherapi.com/v1/current.json?q=HaNoi&key=4ae04986f307408ba4222015240104")
      .then((res) => res.json())
      .then((data) => {
          display(data);
          console.log(data);
      })
      .catch((err) => {
          console.log(err);
      });
};

const load_data = () => {
  let address = sessionStorage.getItem('weather_address');
  let temp = sessionStorage.getItem('weather_temp');
  let icon = sessionStorage.getItem('weather_icon');
  let localtime = sessionStorage.getItem('weather_localtime');

  if (address && temp && icon && localtime) {
      document.getElementById("address").innerText = address;
      document.getElementById("temperature").innerText = temp;
      document.getElementById("img-weather").src = icon;
      update_display_time(localtime);
  } else {
      getApi();
  }
};

load_data();
setInterval(() => {
  let localtime = sessionStorage.getItem('weather_localtime');
  if (localtime) {
      update_display_time(localtime);
  }
}, 60000);




// edit the ui of list diaries
const handle_diary = () => {
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
const edit_timeline=()=>{
  document.addEventListener("DOMContentLoaded", function() {
    const diaryList = document.querySelectorAll(".list-diaries .diary");
    let last_date = "";
    
    diaryList.forEach(diary => {
        const date_element = diary.querySelector(".time-diary");
        let dateClass=date_element.innerText;
        if (dateClass === last_date) {
          const newDiv = document.createElement('div');
          newDiv.className = 'flex-container';
          newDiv.style.flex = '1';
          const timeDiary = diary.querySelector('.time-diary');
          diary.insertBefore(newDiv, timeDiary); 
            date_element.style.display = 'none';
        } else {
            last_date = dateClass;
        }
    });
  });
}
handle_diary();
edit_timeline();


// get current user name and user id
const get_username_userid_save = () => {
  let user_name_root = document.getElementsByClassName('name-user')[0];
  let name_user = user_name_root ? user_name_root.innerText : '';
  let user_id=document.getElementById('user_id_curr') ? document.getElementById('user_id_curr').value : '';
  // check if value user name empty or get in session doesnt have or current name diffence with name user 
  if (name_user && (!sessionStorage.getItem('user-name') || sessionStorage.getItem('user-name') !== name_user)) {
    sessionStorage.setItem('user-name', name_user);
    sessionStorage.setItem('user_id',user_id);
  }
  if (!name_user) {
    let user = sessionStorage.getItem('user-name');
    console.log(user);
    if (user) {
      user_name_root.innerText = user;
    }
  }
};

get_username_userid_save();
