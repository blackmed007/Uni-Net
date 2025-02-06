import axios from "axios";

const API_URL = "http://localhost:5004/api/v1";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 second timeout
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Don't override Content-Type for FormData
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          sessionStorage.removeItem("access_token");
          window.location.href = "/login";
          break;
        case 403:
          console.error("Access forbidden:", error.response.data);
          break;
        case 404:
          console.error("Resource not found:", error.response.data);
          break;
        case 422:
          console.error("Validation error:", error.response.data);
          break;
        default:
          console.error("API error:", error.response.data);
      }
    } else if (error.request) {
      console.error("Network error:", error.request);
    }
    return Promise.reject(error);
  },
);

class BlogsAPI {
  // Upload image and get URL
  static async uploadImage(file, prefix) {
    try {
      const formData = new FormData();
      formData.append(`${prefix}_image`, file);

      const response = await api.post(
        `/blogs/upload-${prefix}-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response.data.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  }

  // Increment blog views
  static async incrementViews(blogId) {
    try {
      const response = await api.get(`/blogs/${blogId}/view`);
      return this.parseBlogData(response.data);
    } catch (error) {
      console.error("Error incrementing views:", error);
      throw error;
    }
  }

  // Fetch all blogs
  static async getBlogs() {
    try {
      const response = await api.get("/blogs");
      return Array.isArray(response.data)
        ? response.data.map((blog) => this.parseBlogData(blog))
        : [];
    } catch (error) {
      console.error("Error fetching blogs:", error);
      throw error;
    }
  }

  // Get single blog
  static async getBlog(blogId) {
    try {
      const response = await api.get(`/blogs/${blogId}`);
      return this.parseBlogData(response.data);
    } catch (error) {
      console.error("Error fetching blog:", error);
      throw error;
    }
  }

  // Create new blog
  static async createBlog(blogData) {
    try {
      // First upload the images if they exist
      let blogImageUrl = null;
      let authorImageUrl = null;

      if (blogData.blog_image instanceof File) {
        blogImageUrl = await this.uploadImage(blogData.blog_image, "blog");
      }

      if (blogData.author_profile_url instanceof File) {
        authorImageUrl = await this.uploadImage(
          blogData.author_profile_url,
          "author",
        );
      }

      // Create blog post data
      const postData = {
        title: blogData.title,
        content: blogData.content,
        author: blogData.author,
        category: blogData.category,
        status: blogData.status,
        excerpt: blogData.excerpt,
        blog_image: blogImageUrl || blogData.blog_image,
        author_profile_url: authorImageUrl || blogData.author_profile_url,
      };

      const response = await api.post("/blogs", postData);
      return this.parseBlogData(response.data);
    } catch (error) {
      console.error("Error creating blog:", error);
      throw error;
    }
  }

  // Update blog
  static async updateBlog(blogId, blogData) {
    try {
      // First upload any new images if they exist
      let blogImageUrl = null;
      let authorImageUrl = null;

      if (blogData.blog_image instanceof File) {
        blogImageUrl = await this.uploadImage(blogData.blog_image, "blog");
      }

      if (blogData.author_profile_url instanceof File) {
        authorImageUrl = await this.uploadImage(
          blogData.author_profile_url,
          "author",
        );
      }

      // Create update data
      const updateData = {
        ...(blogData.title && { title: blogData.title }),
        ...(blogData.content && { content: blogData.content }),
        ...(blogData.author && { author: blogData.author }),
        ...(blogData.category && { category: blogData.category }),
        ...(blogData.status && { status: blogData.status }),
        ...(blogData.excerpt && { excerpt: blogData.excerpt }),
        ...(blogImageUrl && { blog_image: blogImageUrl }),
        ...(authorImageUrl && { author_profile_url: authorImageUrl }),
      };

      const response = await api.patch(`/blogs/${blogId}`, updateData);
      return this.parseBlogData(response.data);
    } catch (error) {
      console.error("Error updating blog:", error);
      throw error;
    }
  }

  // Delete blog
  static async deleteBlog(blogId) {
    try {
      await api.delete(`/blogs/${blogId}`);
      return true;
    } catch (error) {
      console.error("Error deleting blog:", error);
      throw error;
    }
  }

  // Parse blog data from API
  static parseBlogData(blogData) {
    if (!blogData) return null;

    return {
      id: blogData.id,
      title: blogData.title || "",
      content: blogData.content || "",
      author: blogData.author || "",
      category: blogData.category || "",
      status: blogData.status || "Draft",
      excerpt: blogData.excerpt || "",
      blog_image: blogData.blog_image || null,
      author_profile_url: blogData.author_profile_url || null,
      views: blogData.views || 0,
      createdAt: blogData.createdAt || new Date().toISOString(),
      updatedAt: blogData.updatedAt || new Date().toISOString(),
    };
  }

  // Validate blog data
  static validateBlogData(blogData) {
    const requiredFields = [
      "title",
      "content",
      "author",
      "category",
      "status",
      "excerpt",
    ];
    const missingFields = requiredFields.filter(
      (field) =>
        !blogData[field] ||
        (typeof blogData[field] === "string" && !blogData[field].trim()),
    );

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    // Validate status
    const validStatuses = ["Draft", "Published"];
    if (!validStatuses.includes(blogData.status)) {
      throw new Error('Invalid status. Must be either "Draft" or "Published"');
    }

    return true;
  }
}

export default BlogsAPI;

