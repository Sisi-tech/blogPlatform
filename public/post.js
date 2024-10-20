import {
    inputEnabled,
    setDiv,
    message,
    setToken,
    enableInput, 
    token,
} from "./index.js";

import { showAddEdit } from './addEdit.js';  // Import showAddEdit function
import { showLoginRegister } from './loginRegister.js';  // Import showLoginRegister function

export let postDiv = null;
export let postTable = null;
export let postTableHeader = null;

export const handlePosts = () => {
    postDiv = document.getElementById("post");
    const logoff = document.getElementById("logoff");
    const addPost = document.getElementById("add-post");
    postTable = document.getElementById("post-table");
    postTableHeader = document.getElementById("post-table-header");

    postDiv.addEventListener("click", (e) => {
        if (inputEnabled && e.target.nodeName === "BUTTON") {
            if (e.target === addPost) {
                showAddEdit(null);  // This function should now be recognized
            } else if (e.target === logoff) {
                setToken(null);
                message.textContent = "You have been logged off.";
                postTable.replaceChildren([postTableHeader]);
                showLoginRegister();  // This function should now be recognized
            } else if (e.target.classList.contains("editButton")) {
                message.textContent = "";
                showAddEdit(e.target.dataset.id);  // This function should now be recognized
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
        
        // Check if the response is OK (status code 200)
        if (!response.ok) {
            const errorText = await response.text(); // Read response as text
            throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
        }
        
        const data = await response.json();
        let children = [postTableHeader];
        if (!Array.isArray(data.posts) || data.posts.length === 0) {
            postTable.replaceChildren(...children);
        } else {
            for (let i = 0; i < data.posts.length; i++) {
                let rowEntry = document.createElement("tr");
                let editButton = `<td><button type="button" class="editButton" data-id=${data.posts[i]._id}>Edit</button></td>`;
                let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.posts[i]._id}>Delete</button></td>`;
                let rowHTML = `
                    <td>${data.posts[i].title}</td>
                    <td>${data.posts[i].content}</td>
                    <td>${editButton}${deleteButton}</td>`;
                rowEntry.innerHTML = rowHTML;
                children.push(rowEntry);
            }
            postTable.replaceChildren(...children);
        }
    } catch (err) {
        console.log(err);
        message.textContent = "A communication error occurred.";
    } finally {
        enableInput(true);
        setDiv(postDiv);
    }
};

