function addDiary(event) {
    event.preventDefault();

    const form = document.getElementById('diaryForm');
    const formData = new FormData(form);
    console.log(formData);
    fetch(form.action, {
        method: 'POST',
        headers: {
            'X-CSRFToken': '{{ csrf_token }}',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: formData
    })
    .then(response => response.json())
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
        }
    })
    .catch(error => console.error('Error:', error));
}