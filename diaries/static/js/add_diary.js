function addDiary(event) {
    event.preventDefault(); // ngăn chặn các hành động mặc định của sự kiện đó

    const form = document.getElementById('diaryForm');
    const formData = new FormData(form);
    const csrftoken = getCookie('csrftoken');

    console.log(formData);
    fetch(form.action, {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrftoken,
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.message) {
            document.getElementById('id_content').value='';
            document.getElementById('id_title').value='',
            alert(data.message);
            let back_page=window.location.href.split('/add/')[0]+'/home/';
            window.location=back_page;
        } else {
            const errorDiv = document.getElementById('errors');
            errorDiv.innerHTML = '';
            for (const [key, value] of Object.entries(data)) {
                const error = document.createElement('p');
                error.innerText = `${key}: ${value}`;
                errorDiv.appendChild(error);
            }
            // alert('Added diary failed. Please try again!')
        }
    })
    .catch(error => console.error('Error:', error));
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1)); //decode if in case csrf in the encodation status
                break;
            }
        }
    }
    console.log(cookieValue);
    return cookieValue;
}

document.addEventListener('DOMContentLoaded', (e) => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('id_created_at').value = today;
});