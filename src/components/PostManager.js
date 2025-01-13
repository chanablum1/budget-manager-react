import React, { useState, useEffect } from "react";
import axios from "axios";

function PostManager() {
  const [posts, setPosts] = useState([]);
  const [formValues, setFormValues] = useState({ title: "", content: "" });
  const [message, setMessage] = useState("");
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPosts = async () => {
    try {
      const response = await axios.get("https://budget-management-system-1fqb.onrender.com/forum/posts/", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setPosts(response.data);
    } catch (error) {
      console.error("Error loading posts:", error);
      setMessage("Failed to load posts.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://budget-management-system-1fqb.onrender.com/forum/posts/",
        formValues,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setMessage("Post created successfully!");
      setFormValues({ title: "", content: "" });
      loadPosts();
    } catch (error) {
      console.error("Error creating post:", error);
      setMessage("Failed to create post. Please try again.");
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await axios.post(
        `https://budget-management-system-1fqb.onrender.com/forum/posts/${postId}/like/`,
        {},
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, likes: response.data.likes, isLiked: !post.isLiked }
            : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">🌟 Forum</h1>
      
      {/* טופס להוספת פוסט חדש */}
      <div className="card shadow-sm mb-5">
        <div className="card-body">
          <h3 className="card-title">Create a New Post</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                placeholder="Enter post title"
                value={formValues.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="content" className="form-label">
                Content
              </label>
              <textarea
                className="form-control"
                id="content"
                name="content"
                rows="4"
                placeholder="Write your post here"
                value={formValues.content}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Publish
            </button>
          </form>
          {message && <p className="mt-3 text-center">{message}</p>}
        </div>
      </div>

      {/* רשימת פוסטים */}
      <div>
        <h3>Community Posts</h3>
        {posts.length === 0 ? (
          <p className="text-muted">No posts available yet. Be the first to share!</p>
        ) : (
          <div className="row">
            {posts.map((post) => (
              <div className="col-md-4 mb-4" key={post.id}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{post.title}</h5>
                    <p className="card-text">{post.content}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">By: {post.author || "Anonymous"}</small>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleLike(post.id)}
                      >
                        {post.isLiked ? "👎 Unlike" : "👍 Like"}
                      </button>
                    </div>
                    <p className="mt-2 mb-0 text-end text-muted">
                      {post.likes} {post.likes === 1 ? "Like" : "Likes"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PostManager;
