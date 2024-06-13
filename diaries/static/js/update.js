function updateDiary(diaryId) {
    const csrftoken = getCookie('csrftoken');
    const title = document.getElementById('id_title').value;
    const content = document.getElementById('id_content').value;
    const created=document.getElementById('id_created_at').value;
    fetch(`/update-diary/${diaryId}/`, {
        method: 'PUT',
        headers: {
            'X-CSRFToken': csrftoken,
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({title: title, content: content,created_at:created})
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
            let back_page=window.location.href.split('/update-diary/')[0]+'/home/';
            window.location=back_page;
        } else {
            alert('An error occurred.');
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
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}