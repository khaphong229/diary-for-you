document.addEventListener('DOMContentLoaded', function() {
    const calendarButton = document.getElementById('calendar');
    const calendarPopup = document.getElementById('calendar-popup');
    const calendarContainer = document.getElementById('calendar-container');
    const dateSearch = document.getElementById('date-search');

    let picker = new Pikaday({
        field: dateSearch,
        container: calendarContainer,
        format: 'YYYY-MM-DD',
        toString: function(date, format) {
            var day = date.getDate();
            var month = date.getMonth() + 1;
            var year = date.getFullYear();

            var yyyy = year;
            var mm = ((month > 9) ? '' : '0') + month;
            var dd = ((day > 9) ? '' : '0') + day;

            return yyyy + '-' + mm + '-' + dd;
        },
        onSelect: function(date) {
            searchDiaries(this.toString('YYYY-MM-DD'));
        }
    });

    calendarButton.addEventListener('click', function(e) {
        e.stopPropagation();
        calendarPopup.style.display = calendarPopup.style.display === 'none' ? 'block' : 'none';
    });

    document.addEventListener('click', function(e) {
        if (!calendarPopup.contains(e.target) && e.target !== calendarButton) {
            calendarPopup.style.display = 'none';
        }
    });

    calendarPopup.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    dateSearch.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchDiaries(this.value);
        }
    });

    function searchDiaries(date) {
        fetch(`/search_diaries/?date=${date}`, {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': getCookie('csrftoken')
            }
        })
        .then(res => res.json())
        .then(data => {
            display_diaries(data);
        })
        .catch(err => console.log(err));
    }

    function getCookie(name) {
        let cookie_val = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookie_val = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookie_val;
    }

    function display_diaries(diaries) {
        const diary_container = document.querySelector('.list-diaries');
        diary_container.innerHTML = '';
        if (diaries.length === 0) {
            diary_container.innerHTML = '<h1>There are no logs for this date</h1>';
            return;
        }
        diaries.forEach(diary => {
            const created_date = new Date(diary.created_at);
            const created_day = ('0' + created_date.getDate()).slice(-2);
            const created_month = ('0' + (created_date.getMonth() + 1)).slice(-2);
            const diary_child = document.createElement('div');
            diary_child.className = 'diary';
            diary_child.innerHTML = `
                <div class="time-diary">
                    <div class="created-day">${created_day}</div>
                    <div class="created-month">${created_month}</div>
                </div>
                <div class="pre-content-diary" onclick="location.href='/diary/${diary.diary_id}/';">
                    <a class="title-diary" href="/diary/${diary.diary_id}/">${diary.title}</a>
                    <p class="content-diary">${diary.content}</p>
                </div>
                <div class="handle-diary">
                    <!-- <a href="/update-diary/${diary.diary_id}/" class="buttn-edit"><i class="fa-solid fa-pen"></i></a> -->
                    <!-- <a onclick="deleteDiary(${diary.diary_id})" class="buttn-del"><i class="fa-solid fa-x"></i></a> -->
                </div>
            `;
            diary_container.appendChild(diary_child);
        });
    }
    
});