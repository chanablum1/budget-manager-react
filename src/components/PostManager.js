import React, { useState, useEffect } from "react"
import axios from "axios"

function PostManager() {
  const [posts, setPosts] = useState([]) // רשימת הפוסטים
  const [formValues, setFormValues] = useState({ title: "", content: "" }) // ערכים בטופס
  const [message, setMessage] = useState("") // הודעת סטטוס
  const authToken = localStorage.getItem("authToken") // טוקן

  // טוען את הפוסטים מהבאקן
  useEffect(() => {
    loadPosts()
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadPosts = async () => {
    try {
      const response = await axios.get("https://budget-management-system-1fqb.onrender.com/forum/posts/", {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      setPosts(response.data)
    } catch (error) {
      console.error("Error loading posts:", error)
      setMessage("Failed to load posts.")
    }
  }

  // שינוי הערכים בטופס
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormValues({ ...formValues, [name]: value })
  }

  // שליחת טופס להוספת פוסט חדש
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axios.post(
        "https://budget-management-system-1fqb.onrender.com/forum/posts/",
        formValues,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      )
      setMessage("Post created successfully!")
      setFormValues({ title: "", content: "" })
      loadPosts() // טוען מחדש את הפוסטים
    } catch (error) {
      console.error("Error creating post:", error)
      setMessage("Failed to create post. Please try again.")
    }
  }

  const handleLike = async (postId) => {
    try {
      const response = await axios.post(
        `https://budget-management-system-1fqb.onrender.com/forum/posts/${postId}/like/`,
        {}, // אין צורך בגוף בקשה
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      )

      // עדכון הפוסט במצב המקומי
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, likes: response.data.likes, isLiked: !post.isLiked }
            : post
        )
      )
    } catch (error) {
      console.error("Error liking post:", error)
    }
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center">Forum</h1>

      {/* טופס להוספת פוסט חדש */}
      <div className="card my-4">
        <div className="card-body">
          <h3>Create a New Post</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={formValues.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="content">Content</label>
              <textarea
                className="form-control"
                id="content"
                name="content"
                rows="5"
                value={formValues.content}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
          {message && <p className="mt-3">{message}</p>}
        </div>
      </div>

      {/* רשימת פוסטים */}
      <div>
        <h3>Posts</h3>
        {posts.length === 0 ? (
          <p>No posts available.</p>
        ) : (
          <ul className="list-group">
            {posts.map((post) => (
              <li key={post.id} className="list-group-item">
                <h5>{post.title}</h5>
                <p>{post.content}</p>
                <small>By: {post.author || "Unknown"}</small>
                <div className="d-flex align-items-center mt-2">
                  <button
                    // className="btn btn-outline-primary btn-sm"
                    className="btn btn-sm btn-outline-primary"

                    onClick={() => handleLike(post.id)} // פונקציה ללחיצה על לייק
                  >
                    {post.isLiked ? "👎" : "👍"}

                    {/* {post.isLiked ? "Unlike" : "Like"} מציג מצב הלייק */}
                  </button>

                  <span className="ml-2">{post.likes} Likes</span>{" "}
                  {/* הצגת כמות לייקים */}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default PostManager
