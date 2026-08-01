// ==========================================
// Wallpaper DB Configuration
// ==========================================

// Uses the same host as the page (works on localhost, ngrok, and Render)
const API_URL = window.location.origin;

// Website Information
const APP_NAME = "Wallpaper DB";
const VERSION = "1.0.0";

// Default Reward
const DEFAULT_REWARD = "No Reward";

// Status
const USER_STATUS = "Active";

// API Actions
const ACTIONS = {
    SIGNUP: "signup",
    LOGIN: "login",
    REWARD: "reward"
};

// Don't edit below this line
Object.freeze(ACTIONS);
