import "./login.scss";

let loginContainer = document.querySelector<HTMLDivElement>(".login-container")!;

let serverField = loginContainer.querySelector<HTMLInputElement>("#server-input")!;
let usernameField = loginContainer.querySelector<HTMLInputElement>("#username-input")!;
let enterButton = loginContainer.querySelector(".enter-button")!;

const validCharRegex = /^[a-z0-9_]$/i;
usernameField.addEventListener("keydown", (event) => {
    if (!(validCharRegex.test(event.key) || event.key == "Backspace")) {
        event.preventDefault();
    }
});

enterButton.addEventListener("click", () => {
    if (serverField.value.length <= 0) {
        return alert("Server address must not be empty.");
    } else if (usernameField.value.length <= 0) {
        return alert("Username field must not be empty.");
    }
    let url = new URL("viewer.html", document.location.href);
    url.searchParams.append("server", serverField.value);
    url.searchParams.append("name", usernameField.value);
    document.location.href = url.toString();
});