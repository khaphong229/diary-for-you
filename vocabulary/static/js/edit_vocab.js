document.getElementById('edit-vocabulary-form').addEventListener('submit', function(e) {
    e.preventDefault();
    let vocabularyId=document.getElementById('vocabulary-id').value;
    let formData={
        word: document.getElementById('id_word').value,
        meaning: document.getElementById('id_meaning').value,
        pronunciation:document.getElementById('id_pronunciation').value,
        audio:document.getElementById('id_audio').value,
        example_sentence:document.getElementById('id_examples').value
    };
    fetch(`/update-vocabulary/${vocabularyId}/`, {
        method:'PUT',
        headers:{
            'X-CSRFToken': getCookie('csrftoken'),
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(formData)
    })
    .then(res=>res.json())
    .then(data=>{
        if (data.success) {
            alert('Vocabulary updated successfully!');
            window.location.href = 'http://127.0.0.1:8000/list-vocabs/'; 
        } else {
            alert('Failed to update vocabulary.');
        }
    })
    .catch(err=>console.log(err));
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
