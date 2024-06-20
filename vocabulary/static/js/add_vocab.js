document.getElementById('vocabulary-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    let formData = {
        user_id: document.getElementById('current-user-id').value,
        word: document.getElementById('id_word').value,
        meaning: document.getElementById('id_meaning').value,
        pronunciation: document.getElementById('id_pronunciation').value,
        audio: document.getElementById('id_audio').value,
        example_sentence: document.getElementById('id_examples').value
    };

    fetch('/save-word/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Word saved successfully!');
            document.getElementById('vocabulary-form').reset();
            window.location.href='http://127.0.0.1:8000/list-vocabs/';
        } else {
            alert('Failed to save word. ' + JSON.stringify(data.errors));
        }
    })
    .catch(error => console.error('Error:', error));
});

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


function deleteVocabulary(vocabularyId) {
    if (confirm('Are you sure you want to delete this vocabulary?')) {
        const csrftoken = getCookie('csrftoken');

        fetch(`/delete-vocabulary/${vocabularyId}/`, {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': csrftoken,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                alert('Vocabulary deleted successfully!');
                window.location.reload();
            } else {
                alert('Failed to delete vocabulary.');
            }
        })
        .catch(error => console.error('Error:', error));
    }
}
