import React, { useState } from "react";

const BlogForm = ({
  handleSubmit,
  handleTitleChange,
  handleAuthorChange,
  handleUrlChange,
  title,
  author,
  url,
  handleBlogFormHide,
  handleBlogFormShow,
  visible,
}) => {
  if (visible) {
    return (
      <>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              title:
              <input type="text" value={title} onChange={handleTitleChange} />
            </label>
          </div>
          <div>
            <label>
              author:
              <input type="text" value={author} onChange={handleAuthorChange} />
            </label>
          </div>
          <div>
            <label>
              url:
              <input type="text" value={url} onChange={handleUrlChange} />
            </label>
          </div>
          <button type="submit">create</button>
        </form>
        <button onClick={handleBlogFormHide}>cancel</button>
      </>
    );
  } else {
    return <button onClick={handleBlogFormShow}>create new blog</button>;
  }
};

export default BlogForm;
