import { inputEnabled, setDiv } from "./index.js";
import { showLogin } from "./login.js";
import { showRegister } from "./register.js";

let loginRegisterDiv = null;

export const handleLoginRegister = () => {
    loginRegisterDiv = document.getElementById("login-register");
    const login = document.getElementById("login");
    const register = document.getElementById("register");
    const desc = document.getElementById("desc");

    login.addEventListener("click", () => {
        if (inputEnabled) {
            desc.style.display = "none";
            showLogin();
        }
    });

    register.addEventListener("click", () => {
        if (inputEnabled) {
            desc.style.display = "none";
            showRegister();
        }
    });
};

export const showLoginRegister = () => {
    setDiv(loginRegisterDiv);
};
