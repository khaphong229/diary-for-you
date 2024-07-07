function deleteDiary(diaryId) {
  const csrftoken = getCookie("csrftoken");

  if (confirm("Are you sure you want to delete this diary?")) {
    fetch(`/delete-diary/${diaryId}/`, {
      method: "DELETE",
      headers: {
        "X-CSRFToken": csrftoken,
        "X-Requested-With": "XMLHttpRequest",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          alert(data.message);
          location.href='/home/';
        } else {
          alert("An error occurred.");
        }
      })
      .catch((err) => console.log(err));
  }
}

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
