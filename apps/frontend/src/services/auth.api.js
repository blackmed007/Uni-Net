import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

// Input validation rules
const validators = {
    email: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) return 'Email is required';
        if (!emailRegex.test(email)) return 'Invalid email format';
        return null;
    },
    password: (password) => {
        if (!password) return 'Password is required';
        if (password.length < 8) return 'Password must be at least 8 characters';
        return null;
    },
    firstName: (name) => {
        if (!name || name.trim() === '') return 'First name is required';
        if (name.length < 2) return 'First name must be at least 2 characters';
        return null;
    },
    lastName: (name) => {
        if (!name || name.trim() === '') return 'Last name is required';
        if (name.length < 2) return 'Last name must be at least 2 characters';
        return null;
    },
    gender: (gender) => {
        if (!gender) return 'Gender is required';
        if (!['male', 'female'].includes(gender.toLowerCase())) return 'Invalid gender value';
        return null;
    }
};

// Create axios instance with base configuration
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
});

// Add token to requests if it exists
api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
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
            // Handle specific error cases
            switch (error.response.status) {
                case 401:
                    // Unauthorized - clear token and redirect to login
                    AuthAPI.clearToken();
                    window.location.href = '/login';
                    break;
                case 403:
                    // Forbidden - show error page
                    window.location.href = '/error?code=403&message=' + encodeURIComponent(error.response.data.message);
                    break;
                case 404:
                    // Not Found - show error page
                    window.location.href = '/error?code=404&message=Resource not found';
                    break;
                case 500:
                    // Server Error - show error page
                    window.location.href = '/error?code=500&message=Internal server error';
                    break;
                default:
                    // Other errors - show error page with generic message
                    window.location.href = '/error?code=' + error.response.status + '&message=' + encodeURIComponent(error.response.data.message || 'An unexpected error occurred');
            }
        } else if (error.request) {
            // Network error
            window.location.href = '/error?code=network&message=Unable to connect to server';
        }
        return Promise.reject(error);
    }
);

class AuthAPI {
    static setToken(token) {
        if (token) {
            sessionStorage.setItem('access_token', token);
        } else {
            this.clearToken();
        }
    }

    static getToken() {
        return sessionStorage.getItem('access_token');
    }

    static clearToken() {
        sessionStorage.removeItem('access_token');
    }

    static validateSigninData(data) {
        const errors = {};
        const emailError = validators.email(data.email);
        const passwordError = validators.password(data.password);
        
        if (emailError) errors.email = emailError;
        if (passwordError) errors.password = passwordError;
        
        return Object.keys(errors).length > 0 ? errors : null;
    }

    static validateSignupData(data) {
        const errors = {};
        const emailError = validators.email(data.email);
        const passwordError = validators.password(data.password);
        const firstNameError = validators.firstName(data.firstName);
        const lastNameError = validators.lastName(data.lastName);
        
        if (emailError) errors.email = emailError;
        if (passwordError) errors.password = passwordError;
        if (firstNameError) errors.firstName = firstNameError;
        if (lastNameError) errors.lastName = lastNameError;
        
        return Object.keys(errors).length > 0 ? errors : null;
    }

    static validateOnboardData(data) {
        const errors = {};
        const genderError = validators.gender(data.gender);
        
        if (!data.cityId) errors.cityId = 'City is required';
        if (!data.universityId) errors.universityId = 'University is required';
        if (genderError) errors.gender = genderError;
        
        return Object.keys(errors).length > 0 ? errors : null;
    }

    static async signin(signinData) {
        const validationErrors = this.validateSigninData(signinData);
        if (validationErrors) {
            throw new Error(JSON.stringify(validationErrors));
        }

        try {
            const response = await api.post('/auth/signin', {
                email: signinData.email,
                password: signinData.password
            });
            
            if (response.data.access_token) {
                this.setToken(response.data.access_token);
            }
            
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async signup(signupData) {
        const validationErrors = this.validateSignupData(signupData);
        if (validationErrors) {
            throw new Error(JSON.stringify(validationErrors));
        }

        try {
            const formattedData = {
                first_name: signupData.firstName,
                last_name: signupData.lastName,
                email: signupData.email,
                password: signupData.password
            };

            const response = await api.post('/auth/signup', formattedData);
            
            if (response.data.access_token) {
                this.setToken(response.data.access_token);
            }
            
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async onboard(onboardData) {
        const validationErrors = this.validateOnboardData(onboardData);
        if (validationErrors) {
            throw new Error(JSON.stringify(validationErrors));
        }

        try {
            const formattedData = {
                first_name: onboardData.firstName,
                last_name: onboardData.lastName,
                profile_url: onboardData.profileImage || '',
                gender: onboardData.gender.toLowerCase(),
                cityId: onboardData.cityId,
                universityId: onboardData.universityId
            };

            const response = await api.post('/users/onboard', formattedData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static isAuthenticated() {
        return !!this.getToken();
    }

    static logout() {
        this.clearToken();
        window.location.href = '/login';
    }
}

export default AuthAPI;