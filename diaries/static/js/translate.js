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

    } catch (err) {
        console.error('Error:', err);
    }
}
const countries={
    "am": "Amharic",
    "ar": "Arabic",
    "be": "Bielarus",
    "bem": "Bemba",
    "bi": "Bislama",
    "bjs": "Bajan",
    "bn": "Bengali",
    "bo": "Tibetan",
    "br": "Breton",
    "bs": "Bosnian",
    "ca": "Catalan",
    "cop": "Coptic",
    "cs": "Czech",
    "cy": "Welsh",
    "da": "Danish",
    "dz": "Dzongkha",
    "de": "German",
    "dv": "Maldivian",
    "el": "Greek",
    "en": "English",
    "es": "Spanish",
    "et": "Estonian",
    "eu": "Basque",
    "fa": "Persian",
    "fi": "Finnish",
    "fn": "Fanagalo",
    "fo": "Faroese",
    "fr": "French",
    "gl": "Galician",
    "gu": "Gujarati",
    "ha": "Hausa",
    "he": "Hebrew",
    "hi": "Hindi",
    "hr": "Croatian",
    "hu": "Hungarian",
    "id": "Indonesian",
    "is": "Icelandic",
    "it": "Italian",
    "ja": "Japanese",
    "kk": "Kazakh",
    "km": "Khmer",
    "kn": "Kannada",
    "ko": "Korean",
    "ku": "Kurdish",
    "ky": "Kyrgyz",
    "la": "Latin",
    "lo": "Lao",
    "lv": "Latvian",
    "men": "Mende",
    "mg": "Malagasy",
    "mi": "Maori",
    "ms": "Malay",
    "mt": "Maltese",
    "my": "Burmese",
    "ne": "Nepali",
    "niu": "Niuean",
    "nl": "Dutch",
    "no": "Norwegian",
    "ny": "Nyanja",
    "ur": "Pakistani",
    "pau": "Palauan",
    "pa": "Panjabi",
    "ps": "Pashto",
    "pis": "Pijin",
    "pl": "Polish",
    "pt": "Portuguese",
    "rn": "Kirundi",
    "ro": "Romanian",
    "ru": "Russian",
    "sg": "Sango",
    "si": "Sinhala",
    "sk": "Slovak",
    "sm": "Samoan",
    "sn": "Shona",
    "so": "Somali",
    "sq": "Albanian",
    "sr": "Serbian",
    "sv": "Swedish",
    "sw": "Swahili",
    "ta": "Tamil",
    "te": "Telugu",
    "tet": "Tetum",
    "tg": "Tajik",
    "th": "Thai",
    "ti": "Tigrinya",
    "tk": "Turkmen",
    "tl": "Tagalog",
    "tn": "Tswana",
    "to": "Tongan",
    "tr": "Turkish",
    "uk": "Ukrainian",
    "uz": "Uzbek",
    "vi": "Vietnamese",
    "wo": "Wolof",
    "xh": "Xhosa",
    "yi": "Yiddish",
    "zu": "Zulu"
}

const from_text=document.getElementById('diary-content');
const to_text=document.getElementById('translated-content');
const icons=document.querySelectorAll('.language i');
const selected_tag = document.querySelectorAll("select");
selected_tag.forEach((tag_now,id)=>{
    for(let country_code in countries){
        // let selected=id==0 ? country_code == 'vi' ? 'selected' : '' : country_code == 'en' ? 'selected' : '';
        if (id == 0) {
            if (country_code == 'vi') {
                selected = 'selected';
            } else {
                selected = '';
            }
        } else {
            if (country_code == 'en') {
                selected = 'selected';
            } else {
                selected = '';
            }
        }
        let option=`<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
        tag_now.insertAdjacentHTML('beforeend',option); // chèn vào sau phần tử cuối dùng của nó
    }
})
icons.forEach(icon => {
    icon.addEventListener('click',({target})=>{
        if(!from_text.innerText || !to_text.innerText) return;
        if(target.classList.contains('fa-copy')){
            if(target.id=='from'){
                navigator.clipboard.writeText(from_text.innerText); // nã text vô clipboard
            }else{
                navigator.clipboard.writeText(to_text.innerText);
            }
        }else{
            let res;
            if(target.id=='from'){
                res=new SpeechSynthesisUtterance(from_text.innerText);
                res.lang=selected_tag[0].value;
            }else{
                res=new SpeechSynthesisUtterance(to_text.innerText);
                res.lang=selected_tag[1].value;
            }
            speechSynthesis.speak(res); // phát âm bằng api web speech
        }
    })
});