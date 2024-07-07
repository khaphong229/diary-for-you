const csrftoken = getCookie('csrftoken');

document.addEventListener('mouseup', function(e) {
    let selectedText = window.getSelection().toString().trim(); //lấy từ đc bôi đen
    if (selectedText.length > 0 && !e.target.closest('#word-popup')) {
        fetch_meaning(selectedText, e);
    }
});

document.addEventListener('mousedown', function(e) {
    let popup = document.getElementById('word-popup');
    if (popup && !popup.contains(e.target)) {
        //check popup đã tồn tại và sk ko xảy ra bên trong
        closePopup();
    }
});

function fetch_meaning(word, e){
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
            show_popup(word, data.meaning, data.pronunciation, data.audio, data.examples, e);
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
    popup.style.zIndex = 1;

    popup.innerHTML = `
        <h3>${word}</h3>
        <p>Meaning: ${meaning}</p>
        <p>Pronunciation: ${pronunciation}</p>
        <audio controls>
            <source src="${audio}" type="audio/mp3">
        </audio>
        <p>Example: ${examples}</p>
        <button id="save-word-btn">Save</button>
    `;

    document.body.appendChild(popup);

    document.getElementById('save-word-btn').addEventListener('click', function(e) {
        e.stopPropagation(); // ngăn chặn sự kiện lan truyền từ phần tử hiện tại lên phần tử cha
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
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert('Word saved successfully!');
            closePopup();
        } else {
            alert('Failed to save word.');
        }
    })
    .catch(err => console.log(err));
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
