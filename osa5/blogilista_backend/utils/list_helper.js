const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((prev, item) => {
    return prev + item.likes;
  }, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const maxLikes = blogs.reduce((prev, item) => Math.max(prev, item.likes), 0);
  const listOfFavoriteBlogs = blogs.filter((item) => item.likes === maxLikes);

  return listOfFavoriteBlogs[0];
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;

  const authorCounts = blogs.reduce((prev, item) => {
    prev[item.author] = (prev[item.author] || 0) + 1;
    return prev;
  }, {});

  let topAuthor = null;
  let maxBlogs = 0;

  for (const author in authorCounts) {
    if (authorCounts[author] > maxBlogs) {
      maxBlogs = authorCounts[author];
      topAuthor = author;
    }
  }

  return {
    author: topAuthor,
    blogs: maxBlogs,
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null;

  const authorLikes = blogs.reduce((prev, item) => {
    prev[item.author] = (prev[item.author] || 0) + item.likes;
    return prev;
  }, {});

  let topAuthor = null;
  let maxLikes = 0;

  for (const author in authorLikes) {
    if (authorLikes[author] > maxLikes) {
      maxLikes = authorLikes[author];
      topAuthor = author;
    }
  }

  return {
    author: topAuthor,
    likes: maxLikes,
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
