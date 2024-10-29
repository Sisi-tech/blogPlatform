import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showPosts } from "./post.js";

let addEditDiv = null;
let title = null;
let content = null;
let addingPost = null;

export const handleAddEdit = () => {
  addEditDiv = document.getElementById("edit-post");
  title = document.getElementById("edit-title");
  content = document.getElementById("edit-content");
  addingPost = document.getElementById("edit-add-post");
  const editCancel = document.getElementById("edit-cancel");

  addEditDiv.addEventListener("click", async (e) => {
    if (e.target === addingPost) {
      enableInput(false);
      
      let method = "POST";
      let url = "/api/v1/post";
      
      if (addingPost.textContent === "Update") {
        method = "PATCH";
        url = `/api/v1/post/${addEditDiv.dataset.id}`;
      }
      
      try {
        const response = await fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: title.value,
            content: content.value,
          }),
        });
        
        const data = await response.json();
        if (response.status === 200 || response.status === 201) {
          message.textContent = response.status === 200 ? "The post was updated." : "The post was created.";
          title.value = "";
          content.value = "";
          showPosts(); // Refresh the posts list
        } else {
          message.textContent = data.msg;
        }
      } catch (err) {
        console.log(err);
        message.textContent = "A communication error occurred.";
      }
      enableInput(true);
    }

    if (e.target === editCancel) {
      title.value = "";
      content.value = "";
      addEditDiv.style.display = "none"; // Hide the edit post section
      showPosts();
      message.textContent = ""; // Clear any messages
    }

  });
};

export const showAddEdit = async (postId) => {
  if (!postId) {
    title.value = "";
    content.value = "";
    addingPost.textContent = "add";
    message.textContent = "";
    setDiv(addEditDiv);
  } else {
    enableInput(false);
    try {
      const response = await fetch(`/api/v1/post/${postId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        title.value = data.post.title;
        content.value = data.post.content;
        addingPost.textContent = "Update";
        message.textContent = "";
        addEditDiv.dataset.id = postId;
        setDiv(addEditDiv);
      } else {
        message.textContent = "The post entry was not found.";
        showPosts(); // Refresh the posts list
      }
    } catch (err) {
      console.log(err);
      message.textContent = "A communications error has occurred.";
      showPosts(); // Refresh the posts list
    }
    enableInput(true);
  }
};
