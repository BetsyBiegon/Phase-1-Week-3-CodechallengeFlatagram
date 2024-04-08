document.addEventListener("DOMContentLoaded", () => {
  const baseUrl = "http://localhost:3000";
  const imageId = 1; // Assuming we're working with the image ID 1

  const imageContainer = document.getElementById("image-container");
  const likesCounter = document.getElementById("likes-count");
  const commentForm = document.getElementById("comment-form");
  const commentInput = document.getElementById("comment-input");
  const commentsList = document.getElementById("comments-list");
  const title = document.getElementById("card-title");

  // Function to fetch image data and update UI
  const fetchImage = async () => {
    try {
      const response = await fetch(`${baseUrl}/images/${imageId}`);
      const imageData = await response.json();

      // Update UI with image data
      title.textContent = imageData.title;
      imageContainer.setAttribute("src", imageData.image);
      likesCounter.textContent = imageData.likes;

      // Clear comments list before appending new comments
      commentsList.innerHTML = "";
      imageData.comments.forEach(comment => {
        const li = document.createElement("li");
        li.textContent = comment.content;
        commentsList.appendChild(li);
      });
    } catch (error) {
      console.error("Error fetching image data:", error);
    }
  };

  // Function to handle like button click
  const handleLike = async () => {
    try {
      const response = await fetch(`${baseUrl}/images/${imageId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ likes: parseInt(likesCounter.textContent) + 1 })
      });

      if (response.ok) {
        // Increment likes counter and update UI
        likesCounter.textContent = parseInt(likesCounter.textContent) + 1;
      } else {
        console.error("Failed to update likes");
      }
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  // Function to handle comment submission
  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    const commentContent = commentInput.value.trim();

    if (commentContent === "") return;

    try {
      const response = await fetch(`${baseUrl}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          imageId: imageId,
          content: commentContent
        })
      });

      if (response.ok) {
        // Clear input field, fetch image data to update comments, and reset form
        commentInput.value = "";
        fetchImage();
        commentForm.reset();
      } else {
        console.error("Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // Event listeners
  document.getElementById("like-button").addEventListener("click", handleLike);
  (commentForm.addEventListener("post", handleCommentSubmit)) 

  // Fetch image data when the page loads
  fetchImage();
});
