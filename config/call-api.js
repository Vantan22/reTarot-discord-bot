import api from "./axios.js";
import redis from "./redis.js";

const callApi = {
  get: async (author_id, url, params) => {
    console.log("Author id🚀: ", author_id);
    try {
      const accessToken = await redis.get(`${author_id}_accessToken`);
      console.log("Access token🚀: ", accessToken);
      const response = await api.request({
        url,
        method: "GET",
        params,
        headers: {
          Cookie: `accessToken=${accessToken}`,
        },
      });
      return response;
    } catch (error) {
      console.error(error);
    }
  },

  post: async (author_id, url, data) => {
    console.log("Author id🚀: ", author_id);
    try {
      const accessToken = await redis.get(`${author_id}_accessToken`);
      console.log("Access token🚀: ", accessToken);
      const response = await api.request({
        url,
        method: "POST",
        data,
        headers: {
          Cookie: `accessToken=${accessToken}`,
        },
      });
      return response;
    } catch (error) {
      console.error(error);
    }
  },

  put: async (author_id, url, data) => {
    console.log("Author id🚀: ", author_id);
    try {
      const accessToken = await redis.get(`${author_id}_accessToken`);
      console.log("Access token🚀: ", accessToken);
      const response = await api.request({
        url,
        method: "PUT",
        data,
        headers: {
          Cookie: `accessToken=${accessToken}`,
        },
      });
      return response;
    } catch (error) {
      console.error(error);
    }
  },

  delete: async (author_id, url) => {
    console.log("Author id🚀: ", author_id);
    try {
      const accessToken = await redis.get(`${author_id}_accessToken`);
      console.log("Access token🚀: ", accessToken);
      const response = await api.request({
        url,
        method: "DELETE",
        headers: {
          Cookie: `accessToken=${accessToken}`,
        },
      });
      return response;
    } catch (error) {
      console.error(error);
    }
  },
};

export default callApi;
