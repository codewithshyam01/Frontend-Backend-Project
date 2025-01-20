// Auth state management
let authState = {
    isAuthenticated: false,
    currentUser: null,
    error: null
};

// Load auth state from localStorage
function loadAuthState() {
    const savedAuth = localStorage.getItem('authState');
    if (savedAuth) {
        authState = JSON.parse(savedAuth);
    }
}

// Save auth state to localStorage
function saveAuthState() {
    localStorage.setItem('authState', JSON.stringify(authState));
}

// Render auth screens
function renderLogin() {
    return `
        <div class="auth-container">
            <div class="auth-card">
                <div class="auth-logo">
                    <i class="fas fa-shopping-bag text-4xl text-green-500"></i>
                </div>
                <div class="auth-header">
                    <h2>Welcome Back!</h2>
                    <p>Sign in to continue shopping</p>
                </div>
                <form class="auth-form" onsubmit="handleLogin(event)">
                    <div class="form-group">
                        <div class="input-icon-wrapper">
                            <i class="fas fa-envelope text-gray-400"></i>
                            <input type="email" id="email" placeholder=" " required>
                            <label for="email">Email</label>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="input-icon-wrapper">
                            <i class="fas fa-lock text-gray-400"></i>
                            <input type="password" id="password" placeholder=" " required>
                            <label for="password">Password</label>
                            <button type="button" class="password-toggle" onclick="togglePassword('password')">
                                <i class="fas fa-eye text-gray-400"></i>
                            </button>
                        </div>
                    </div>
                    <div class="flex items-center justify-between mb-4">
                        <label class="flex items-center">
                            <input type="checkbox" class="form-checkbox">
                            <span class="ml-2 text-sm text-gray-600">Remember me</span>
                        </label>
                        <a href="#" class="text-sm text-green-600 hover:text-green-700">Forgot Password?</a>
                    </div>
                    ${authState.error ? `<div class="error-message">${authState.error}</div>` : ''}
                    <button type="submit" class="auth-button ripple">
                        <span>Sign In</span>
                        <i class="fas fa-arrow-right ml-2"></i>
                    </button>
                </form>
                <div class="auth-divider">or continue with</div>
                <div class="social-auth">
                    <button class="social-button google" onclick="socialLogin('google')">
                        <i class="fab fa-google"></i>
                        <span>Google</span>
                    </button>
                    <button class="social-button facebook" onclick="socialLogin('facebook')">
                        <i class="fab fa-facebook"></i>
                        <span>Facebook</span>
                    </button>
                </div>
                <div class="auth-footer">
                    <p>Don't have an account? 
                        <a href="#" onclick="navigate('signup')" class="text-green-600 hover:text-green-700 font-semibold">
                            Create Account
                        </a>
                    </p>
                </div>
            </div>
        </div>
    `;
}

function renderSignup() {
    return `
        <div class="auth-container">
            <div class="auth-card">
                <div class="auth-logo">
                    <i class="fas fa-shopping-bag text-4xl text-green-500"></i>
                </div>
                <div class="auth-header">
                    <h2>Create Account</h2>
                    <p>Join us for a better shopping experience</p>
                </div>
                <form class="auth-form" onsubmit="handleSignup(event)">
                    <div class="form-group">
                        <div class="input-icon-wrapper">
                            <i class="fas fa-user text-gray-400"></i>
                            <input type="text" id="name" placeholder=" " required>
                            <label for="name">Full Name</label>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="input-icon-wrapper">
                            <i class="fas fa-envelope text-gray-400"></i>
                            <input type="email" id="email" placeholder=" " required>
                            <label for="email">Email</label>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="input-icon-wrapper">
                            <i class="fas fa-lock text-gray-400"></i>
                            <input type="password" id="password" placeholder=" " required>
                            <label for="password">Password</label>
                            <button type="button" class="password-toggle" onclick="togglePassword('password')">
                                <i class="fas fa-eye text-gray-400"></i>
                            </button>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="input-icon-wrapper">
                            <i class="fas fa-lock text-gray-400"></i>
                            <input type="password" id="confirmPassword" placeholder=" " required>
                            <label for="confirmPassword">Confirm Password</label>
                            <button type="button" class="password-toggle" onclick="togglePassword('confirmPassword')">
                                <i class="fas fa-eye text-gray-400"></i>
                            </button>
                        </div>
                    </div>
                    <div class="flex items-center mb-4">
                        <input type="checkbox" id="terms" class="form-checkbox" required>
                        <label for="terms" class="ml-2 text-sm text-gray-600">
                            I agree to the <a href="#" class="text-green-600 hover:text-green-700">Terms</a> and 
                            <a href="#" class="text-green-600 hover:text-green-700">Privacy Policy</a>
                        </label>
                    </div>
                    ${authState.error ? `<div class="error-message">${authState.error}</div>` : ''}
                    <button type="submit" class="auth-button ripple">
                        <span>Create Account</span>
                        <i class="fas fa-arrow-right ml-2"></i>
                    </button>
                </form>
                <div class="auth-divider">or sign up with</div>
                <div class="social-auth">
                    <button class="social-button google" onclick="socialLogin('google')">
                        <i class="fab fa-google"></i>
                        <span>Google</span>
                    </button>
                    <button class="social-button facebook" onclick="socialLogin('facebook')">
                        <i class="fab fa-facebook"></i>
                        <span>Facebook</span>
                    </button>
                </div>
                <div class="auth-footer">
                    <p>Already have an account? 
                        <a href="#" onclick="navigate('login')" class="text-green-600 hover:text-green-700 font-semibold">
                            Sign In
                        </a>
                    </p>
                </div>
            </div>
        </div>
    `;
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.parentElement.querySelector('.password-toggle i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Auth handlers
async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Here you would typically make an API call to your backend
        // For demo purposes, we'll simulate a successful login
        const user = {
            email,
            name: email.split('@')[0],
            avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=4CAF50&color=fff`
        };
        
        authState.isAuthenticated = true;
        authState.currentUser = user;
        authState.error = null;
        saveAuthState();
        
        showToast('Successfully logged in!');
        navigate('profile');
    } catch (error) {
        authState.error = 'Invalid email or password';
        renderApp();
    }
}

async function handleSignup(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        authState.error = 'Passwords do not match';
        renderApp();
        return;
    }

    try {
        // Here you would typically make an API call to your backend
        // For demo purposes, we'll simulate a successful signup
        const user = {
            email,
            name,
            avatar: `https://ui-avatars.com/api/?name=${name}&background=4CAF50&color=fff`
        };
        
        authState.isAuthenticated = true;
        authState.currentUser = user;
        authState.error = null;
        saveAuthState();
        
        showToast('Account created successfully!');
        navigate('profile');
    } catch (error) {
        authState.error = 'Error creating account';
        renderApp();
    }
}

function socialLogin(provider) {
    // Here you would implement social login logic
    showToast(`${provider} login coming soon!`);
}

function logout() {
    authState.isAuthenticated = false;
    authState.currentUser = null;
    authState.error = null;
    saveAuthState();
    showToast('Successfully logged out!');
    navigate('login');
}

// Initialize auth state
loadAuthState();
