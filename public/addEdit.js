import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showPosts } from "./post.js";

let addEditDiv = null;
let picture = null;
let title = null;
let content = null;
let addingPost = null;

export const handleAddEdit = () => {
  addEditDiv = document.getElementById("edit-post");
  picture = document.getElementById("picture");
  title = document.getElementById("title");
  content = document.getElementById("content");
  addingPost = document.getElementById("adding-post");
  const editCancel = document.getElementById("edit-cancel");

  addEditDiv.addEventListener("click", async (e) => {
    if (e.target === addingPost) {
      enableInput(false);
      
      let method = "POST";
      let url = "/api/v1/post";
      
      if (addingPost.textContent === "update") {
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
            picture: picture.value,
            title: title.value,
            content: content.value,
          }),
        });
        
        const data = await response.json();
        if (response.status === 200 || response.status === 201) {
          if (response.status === 200) {
            message.textContent = "The post was updated.";
          } else {
            message.textContent = "The post was created.";
          }

          // Clear fields after successful operation
          picture.value = "";
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
  });
};

export const showAddEdit = async (postId) => {
  if (!postId) {
    picture.value = "";
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
        picture.value = data.post.picture;
        title.value = data.post.title;
        content.value = data.post.content;
        addingPost.textContent = "update";
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

