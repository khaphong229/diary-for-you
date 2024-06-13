const csrftoken=getCookie('csrftoken');

document.addEventListener('mouseup',function(){
    let selected_text=window.getSelection().toString().trim();
    if(selected_text.length>0){
        fetch_meaning(selected_text);
    }
})

function fetch_meaning(word){
    fetch(`/trans-word/`,{
        method:'POST',
        headers:{
            'X-CSRFToken': csrftoken,
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({word:word})
    })
    .then(res=>res.json())
    .then(data=>{
        if(data.success){
            show_popup(data.meaning, data.pronunciation);
        }else{
            alert('Word not found.')
        }
    })
    .catch(err=> console.error('Error',err));
}

const show_popup=(meaning, pronunciation)=>{
    let popup=document.createElement('div');
    popup.id='word-popup';
    popup.style.position = 'absolute';
    popup.style.left = `50%`;
    popup.style.top = `50%`;
    popup.style.backgroundColor = 'white';
    popup.style.border = '1px solid black';
    popup.style.padding = '10px';
    popup.innerHTML = `
        <p><strong>Meaning:</strong> ${meaning}</p>
        <p><strong>Pronunciation:</strong> ${pronunciation}</p>
        <button onclick="saveWord('${meaning}', '${pronunciation}')">Save</button>
        <button onclick="closePopup()">Close</button>
    `;
    document.body.appendChild(popup);
}

function closePopup(){
    let popup=document.getElementById('word-popup');
    if(popup){
        document.body.removeChild(popup);
    }
}

function saveWord(meaning, pronunciation){
    const word=window.getSelection().toString().trim();
    fetch(`/save-word/`,{
        method:'POST',
        headers:{
            'X-CSRFToken': csrftoken,
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({ word: word, meaning: meaning, pronunciation: pronunciation })
    })
    .then(res => res.json())
    .then(data => {
        if(data.success){
            alert('Word saved successfully!');
        }else{
            alert('Failed to save word.');
        }
    })
    .catch(err => console.error(err));
    closePopup();
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