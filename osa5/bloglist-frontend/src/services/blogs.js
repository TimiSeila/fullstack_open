import axios from "axios";
const baseUrl = "/api/blogs";

const getAll = async () => {
  try {
    const response = await axios.get(baseUrl);
    return response.data;
  } catch (err) {
    throw new Error(err.response.data.error);
  }
};

const createBlog = async (newBlog) => {
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(window.localStorage.getItem("loggedInUser")).token}`,
    },
  };

  console.log(newBlog);

  try {
    const response = await axios.post(baseUrl, newBlog, config);
    return response.data;
  } catch (err) {
    throw new Error(err.response.data.error);
  }
};

export default { getAll, createBlog };
