async function translateDiary(diaryId) {
    const language = document.getElementById('language').value;
    const language_from = document.getElementById('language_from').value;
    const textToTranslate = document.getElementById('diary-content').innerText;

    const url = 'https://google-translator9.p.rapidapi.com/v2';
    const data = JSON.stringify({
        q: textToTranslate,
        source: language_from,
        target: language,
        format: 'text'
    });

    const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': '72bd193986msh0160757f2d92060p140acajsn9d211a7b306c',
            'x-rapidapi-host': 'google-translator9.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        body: data
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        const translatedText = result.data.translations[0].translatedText;

        document.getElementById('translated-content').innerText = translatedText;

        saveTranslation(diaryId, language, translatedText);

    } catch (error) {
        console.error(error);
        alert('An error occurred while translating.');
    }
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

async function saveTranslation(diaryId, language, translatedText) {
    const csrftoken = getCookie('csrftoken');

    const data = {
        diary_id: diaryId,
        language: language,
        translated_text: translatedText
    };

    try {
        const response = await fetch(`/diary/save-translation/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrftoken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            console.log('Translation saved successfully.');
        } else {
            console.error('Failed to save translation.');
        }

    } catch (error) {
        console.error('Error:', error);
    }
}
const fromText=document.getElementById('diary-content');
const toText=document.getElementById('translated-content');
const icons=document.querySelectorAll('.language i');
const selectTag = document.querySelectorAll("select");
icons.forEach(icon => {
    icon.addEventListener('click',({target})=>{
        if(!fromText.innerText || !toText.innerText) return;
        if(target.classList.contains('fa-copy')){
            if(target.id=='from'){
                navigator.clipboard.writeText(fromText.innerText);
            }else{
                navigator.clipboard.writeText(toText.innerText);
            }
        }else{
            let res;
            if(target.id=='from'){
                res=new SpeechSynthesisUtterance(fromText.innerText);
                res.lang=selectTag[0].value;
            }else{
                res=new SpeechSynthesisUtterance(toText.innerText);
                res.lang=selectTag[1].value;
            }
            speechSynthesis.speak(res);
        }
    })
});