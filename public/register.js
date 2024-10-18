import {
    inputEnabled,
    setDiv,
    message,
    token,
    enableInput,
    setToken,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showPosts } from "./post.js";

let registerDiv = null;
let name = null;
let email = null;
let password = null;
let password_two = null;

export const handleRegister = () => {
    registerDiv = document.getElementById("register-div");
    name = document.getElementById("name");
    email = document.getElementById("email_two");
    password = document.getElementById("password");
    password_two = document.getElementById("password_two");
    const registerButton = document.getElementById("register-button");
    const registerCancel = document.getElementById("register-cancel");

    const resetForm = () => {
        name.value = "";
        email.value = "";
        password.value = "";
        password_two.value = "";
    };

    registerButton.addEventListener("click", async () => {
        if (inputEnabled) {
            if (password.value != password2.value) {
                message.textContent = "The passwords entered do not match.";
            } else {
                enableInput(false);
                try {
                    const response = await fetch("/api/v1/user/register", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            name: name.value,
                            email: email.value,
                            password: password.value,
                        }),
                    });
                    const data = await response.json();
                    if (response.status === 201) {
                        message.textContent = `Registration successful. Welcome ${data.user.name}`;
                        setToken(data.token);
                        resetForm();
                        showPosts();
                    } else {
                        message.textContent = data.msg;
                    }
                } catch (err) {
                    console.error(err);
                    message.textContent = "A communications error occurred.";
                }
                enableInput(true);
            }
        }
    });

    registerCancel.addEventListener("click", () => {
        resetForm();
        showLoginRegister();
    })
};

export const showRegister = () => {
    name.value = null;
    email.value = null;
    password.value = null;
    password_two.value = null;
    setDiv(registerDiv);
};
