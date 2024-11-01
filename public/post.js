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
export let postContainer = null;


export const handlePosts = () => {
    postDiv = document.getElementById("post");
    postContainer = document.getElementById("posts-container");
    const logoff = document.getElementById("logoff");
    const addPost = document.getElementById("add-post");

    postDiv.addEventListener("click", (e) => {
        if (inputEnabled && e.target.nodeName === "BUTTON") {
            if (e.target === addPost) {
                showAddEdit(null);  // This function should now be recognized
            } else if (e.target === logoff) {
                setToken(null);
                setTimeout(() => {
                    message.textContent = "You have been logged off.";
                }, 3000);
                showLoginRegister();  // This function should now be recognized
            } else if (e.target.classList.contains("editButton")) {
                message.textContent = "";
                showAddEdit(e.target.dataset.id);  // This function should now be recognized
            } else if (e.target.classList.contains("deleteButton")) {
                const postId = e.target.dataset.id;
                deletePost(postId);
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
        postContainer.innerHTML = '';
        if (!Array.isArray(data.posts) || data.posts.length === 0) {
            postContainer.innerHTML = '<p>No posts available.</p>';
        } else {
            data.posts.forEach(post => {
                const postDiv = document.createElement("div");
                postDiv.classList.add("post-entry");
                postDiv.innerHTML = `
                    <div class="single-post">
                        <h3>${post.title}</h3>
                        <p>${post.content}</p>
                        <div>
                            <button type="button" class="editButton" data-id="${post._id}">Edit</button>
                            <button type="button" id="delete-button" class="deleteButton" data-id="${post._id}">Delete</button>
                        </div>
                    </div>
                `;
                postContainer.appendChild(postDiv);
            })
        }
    } catch (err) {
        console.log(err);
        message.textContent = "A communication error occurred.";
    } finally {
        enableInput(true);
        setDiv(postDiv);
    }
};

export const deletePost = async (postId) => {
    try {
        enableInput(false);
        const response = await fetch(`/api/v1/post/${postId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to delete post: ${response.status} - ${errorText}`);
        }
        message.textContent = "Post deleted successfully.";
        setTimeout(() => {
            message.textContent = "";
        }, 2000);
        showPosts();
    } catch (err) {
        console.log(err);
        message.textContent = "Failed to delete post. Please try again.";
    } finally {
        enableInput(true);
    }
};
