const csrftoken = getCookie('csrftoken');

document.addEventListener('mouseup', function(event) {
    let selectedText = window.getSelection().toString().trim();
    if (selectedText.length > 0 && !event.target.closest('#word-popup')) {
        fetch_meaning(selectedText, event);
    }
});

document.addEventListener('mousedown', function(event) {
    let popup = document.getElementById('word-popup');
    if (popup && !popup.contains(event.target)) {
        closePopup();
    }
});

function fetch_meaning(word, event){
    fetch(`/trans-word/`,{
        method:'POST',
        headers:{
            'X-CSRFToken': csrftoken,
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({word:word})
    })
    .then(res=>res.json())
    .then(data=>{
        if(data.success){
            show_popup(word, data.meaning, data.pronunciation, data.audio, data.examples, event);
        }else{
            alert('Word not found.')
        }
    })
    .catch(err=> console.error('Error',err));
}

const show_popup = (word, meaning, pronunciation, audio, examples, mouseEvent) => {
    closePopup();
    let popup = document.createElement('div');
    popup.id = 'word-popup';
    popup.style.position = 'absolute';
    popup.style.left = `${mouseEvent.pageX}px`;
    popup.style.top = `${mouseEvent.pageY}px`;
    popup.style.backgroundColor = 'white';
    popup.style.border = '1px solid black';
    popup.style.padding = '10px';
    popup.style.zIndex = 1000;

    popup.innerHTML = `
        <h3>${word}</h3>
        <p>Meaning: ${meaning}</p>
        <p>Pronunciation: ${pronunciation}</p>
        <audio controls>
            <source src="${audio}" type="audio/mp3">
            Your browser does not support the audio element.
        </audio>
        <p>Example: ${examples}</p>
        <button id="save-word-btn">Save</button>
    `;

    document.body.appendChild(popup);

    document.getElementById('save-word-btn').addEventListener('click', function(event) {
        event.stopPropagation();
        saveWord(word, meaning, pronunciation, audio, examples);
    });
}

function closePopup() {
    let popup = document.getElementById('word-popup');
    if (popup) {
        popup.remove();
    }
}

function saveWord(word, meaning, pronunciation, audio, examples) {
    const user_id=sessionStorage.getItem('user_id');
    fetch(`/save-word/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrftoken,
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id:user_id,
            word: word,
            meaning: meaning,
            pronunciation: pronunciation,
            audio: audio,
            example_sentence: examples
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Word saved successfully!');
            closePopup();
        } else {
            alert('Failed to save word.');
        }
    })
    .catch(error => console.error('Error:', error));
}

function getCookie(name){
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
