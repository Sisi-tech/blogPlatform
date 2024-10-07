import {
    inputEnabled,
    setDiv,
    message,
    setToken,
    enableInput,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showAddEdit } from "./addEdit.js";

let postDiv = null;
let postTable = null;
let postTableHeader = null;

export const handlePosts = () => {
    postDiv = document.getElementById("post");
    const logoff = document.getElementById("logoff");
    const addPost = document.getElementById("add-post");
    postTable = document.getElementById("post-table");
    postTableHeader = document.getElementById("post-table-header");

    postDiv.addEventListener("click", (e) => {
        if (inputEnabled && e.target.nodeName === "BUTTON") {
            if (e.target === addPost) {
                showAddEdit(null);
            } else if (e.target === logoff) {
                setToken(null);
                message.textContent = "You have been logged off.";
                postTable.replaceChildren([postTableHeader]);
                showLoginRegister();
            } else if (e.target.classList.contains("editButton")) {
                message.textContent = "",
                showAddEdit(e.target.dataset.id);
            }
        }
    });
};

export const showPosts = async () => {
    try {
        enableInput(false);
        const response = await fetch("/api/v1/post", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        let children = [postTableHeader];
        if (response.status === 200) {
            if (data.count === 0) {
                postTable.replaceChildren(...children);
            } else {
                for (let i = 0; i < data.post.length; i++) {
                    let rowEntry = document.createElement("tr");
                    let editButton = `<td><button type="button" class="editButton" data-id=${data.post[i]._id}>Edit</button></td>`;
                    let deleteButton = `<td><button type="button" class="deleteButton: data-id=${data.post[i]._id}>Delete</button></td>`;
                    let rowHTML = `
                        <td>${data.post[i].picture}</td>
                        <td>${data.post[i].title}</td>
                        <td>${data.post[i].content}</td>
                        <td>${editButton}${deleteButton}</td>`;
                    rowEntry.innerHTML = rowHTML;
                    children.push(rowEntry);
                }
                postTable.replaceChildren(...children);
            }
        } else {
            message.textContent = data.msg;
        }
    } catch (err) {
        console.log(err);
        message.textContent = "A communication error occurred.";
    }
    enableInput(true);
    setDiv(postDiv);
};
