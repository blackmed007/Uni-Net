import axios from 'axios';

const API_URL = 'http://localhost:5003/api/v1';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 second timeout
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Don't override Content-Type for FormData
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          sessionStorage.removeItem('access_token');
          window.location.href = '/login';
          break;
        case 403:
          console.error('Access forbidden:', error.response.data);
          break;
        case 404:
          console.error('Resource not found:', error.response.data);
          break;
        case 422:
          console.error('Validation error:', error.response.data);
          break;
        default:
          console.error('API error:', error.response.data);
      }
    } else if (error.request) {
      console.error('Network error:', error.request);
    }
    return Promise.reject(error);
  }
);

class BlogsAPI {
  // Handle image upload
  static async uploadImage(file, prefix) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('prefix', prefix);

      const response = await api.post('/uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  // Fetch all blogs
  static async getBlogs() {
    try {
      const response = await api.get('/blogs');
      return Array.isArray(response.data) 
        ? response.data.map(blog => this.parseBlogData(blog))
        : [];
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw error;
    }
  }

  // Get single blog
  static async getBlog(blogId) {
    try {
      const response = await api.get(`/blogs/${blogId}`);
      return this.parseBlogData(response.data);
    } catch (error) {
      console.error('Error fetching blog:', error);
      throw error;
    }
  }

  // Create new blog
  static async createBlog(blogData) {
    try {
      // Validate blog data first
      this.validateBlogData(blogData);

      let thumbnailUrl = null;
      let authorProfileUrl = null;

      // Handle image uploads first
      if (blogData.image instanceof File) {
        thumbnailUrl = await this.uploadImage(blogData.image, 'blog-thumbnail');
      }

      if (blogData.authorImage instanceof File) {
        authorProfileUrl = await this.uploadImage(blogData.authorImage, 'author-profile');
      }

      // Prepare the data for the API
      const formattedData = this.formatBlogData({
        ...blogData,
        event_thumbnail: thumbnailUrl || blogData.image,
        author_profile_url: authorProfileUrl || blogData.authorImage
      });

      const response = await api.post('/blogs', formattedData);
      return this.parseBlogData(response.data);
    } catch (error) {
      console.error('Error creating blog:', error);
      throw error;
    }
  }

  // Update blog
  static async updateBlog(blogId, blogData) {
    try {
      // Validate blog data first
      this.validateBlogData(blogData);

      let thumbnailUrl = null;
      let authorProfileUrl = null;

      // Handle image uploads first
      if (blogData.image instanceof File) {
        thumbnailUrl = await this.uploadImage(blogData.image, 'blog-thumbnail');
      }

      if (blogData.authorImage instanceof File) {
        authorProfileUrl = await this.uploadImage(blogData.authorImage, 'author-profile');
      }

      // Prepare the data for the API
      const formattedData = this.formatBlogData({
        ...blogData,
        event_thumbnail: thumbnailUrl || blogData.image,
        author_profile_url: authorProfileUrl || blogData.authorImage
      });

      const response = await api.patch(`/blogs/${blogId}`, formattedData);
      return this.parseBlogData(response.data);
    } catch (error) {
      console.error('Error updating blog:', error);
      throw error;
    }
  }

  // Delete blog
  static async deleteBlog(blogId) {
    try {
      const response = await api.delete(`/blogs/${blogId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting blog:', error);
      throw error;
    }
  }

  // Format blog data for API
  static formatBlogData(blogData) {
    // Remove any undefined or null values
    const formattedData = {
      title: blogData.title?.trim(),
      content: blogData.content,
      author: blogData.author?.trim(),
      category: blogData.category?.trim(),
      author_profile_url: blogData.author_profile_url,
      status: blogData.status,
      excerpt: blogData.excerpt?.trim(),
      event_thumbnail: blogData.event_thumbnail
    };

    // Remove any undefined values
    return Object.entries(formattedData).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key] = value;
      }
      return acc;
    }, {});
  }

  // Parse blog data from API
  static parseBlogData(blogData) {
    if (!blogData) return null;
    
    return {
      id: blogData.id,
      title: blogData.title || '',
      content: blogData.content || '',
      author: blogData.author || '',
      category: blogData.category || '',
      authorImage: blogData.author_profile_url || '',
      status: blogData.status || 'Draft',
      excerpt: blogData.excerpt || '',
      image: blogData.event_thumbnail || null,
      createdAt: blogData.createdAt || new Date().toISOString(),
      updatedAt: blogData.updatedAt || new Date().toISOString()
    };
  }

  // Validate blog data
  static validateBlogData(blogData) {
    const requiredFields = ['title', 'content', 'author', 'category', 'status', 'excerpt'];
    const missingFields = requiredFields.filter(field => 
      !blogData[field] || (typeof blogData[field] === 'string' && !blogData[field].trim())
    );

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Validate image formats
    if (blogData.image && !(blogData.image instanceof File) && typeof blogData.image !== 'string') {
      throw new Error('Invalid image format');
    }

    if (blogData.authorImage && !(blogData.authorImage instanceof File) && typeof blogData.authorImage !== 'string') {
      throw new Error('Invalid author image format');
    }

    return true;
  }
}

export default BlogsAPI;