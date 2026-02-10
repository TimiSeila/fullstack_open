import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [blogFormVisible, setBlogFormVisible] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedInUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedInUser", JSON.stringify(user));
      setUser(user);
      setUsername("");
      setPassword("");
      setSuccess(`Successfully logged in`);
      setTimeout(() => {
        setSuccess("");
      }, 5000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedInUser");
    setUser("");
    setSuccess(`Successfully logged out`);
    setTimeout(() => {
      setSuccess("");
    }, 5000);
  };

  const handleCreateForm = async (e) => {
    e.preventDefault();
    try {
      const newBlog = await blogService.createBlog({ title, author, url });
      setBlogs(blogs.concat(newBlog));
      setBlogFormVisible(false);
      setSuccess(`Blog post '${title}' by ${author} added`);
      setTimeout(() => {
        setSuccess("");
      }, 5000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  return (
    <div>
      {!user && (
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      )}
      <Notification.Error message={error} />
      <Notification.Success message={success} />
      {user && (
        <div>
          <h3>
            Logged in as: {user.name}
            <button onClick={handleLogout}>logout</button>
          </h3>
          <BlogForm
            title={title}
            author={author}
            url={url}
            handleTitleChange={({ target }) => setTitle(target.value)}
            handleAuthorChange={({ target }) => setAuthor(target.value)}
            handleUrlChange={({ target }) => setUrl(target.value)}
            handleSubmit={handleCreateForm}
            handleBlogFormHide={() => setBlogFormVisible(false)}
            handleBlogFormShow={({ target }) => setBlogFormVisible(true)}
            visible={blogFormVisible}
          />
          <h2>blogs</h2>
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
