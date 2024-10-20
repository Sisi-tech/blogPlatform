import {
    inputEnabled,
    setDiv,
    token,
    message,
    enableInput,
    setToken,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showPosts } from "./post.js";

let loginDiv = null;
let email = null;
let password = null;

export const handleLogin = () => {
    loginDiv = document.getElementById("login-div");
    email = document.getElementById("email-one");
    password = document.getElementById("password-one");
    const loginButton = document.getElementById("login-button");
    const loginCancel = document.getElementById("login-cancel");

    loginDiv.addEventListener("click", async (e) => {
        if (inputEnabled) {
            if (e.target === loginButton) {
                enableInput(false);
                try {
                    const response = await fetch("/api/v1/user/login", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email: email.value,
                            password: password.value,                        
                        }),
                    });
                    const data = await response.json();
                    if (response.status === 200) {
                        message.textContent = `Logon successful. Welcome ${data.user.name}`;
                        setToken(data.token);
                        email.value = "";
                        password.value = "";
                        showPosts();
                    } else {
                        message.textContent = data.msg;
                    }
                } catch (err) {
                    console.error(err);
                    message.textContent = "A communications error occurred.";
                }
                enableInput(true);
            } else if (e.target === loginCancel) {
                email.value = "";
                password.value = "";
                showLoginRegister();
            }
        }
    });
};

export const showLogin = () => {
    email.value = null;
    password.value = null;
    setDiv(loginDiv);
};
