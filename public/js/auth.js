const btn = document.querySelector("#submit");
const logInput = document.querySelector("#login");
const passInput = document.querySelector("#password");
const errText = document.querySelector(".err");

logInput.addEventListener("input", (e) => {
    errText.style.display = "none";
})

passInput.addEventListener("input", (e) => {
    errText.style.display = "none";
})

btn.addEventListener("click", (e) => {
    e.preventDefault();
    fetch("/api/auth", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            login: logInput.value,
            password: passInput.value
        })
    }).then((res) => {
        return res.json();
    }).then((data) => {
        if (data.login) {
            localStorage.setItem("jwtTocken", data.tocken);
            window.location.href = '/edit';
        } else {
            errText.style.display = "block";
        }
    })
})