window.onload = start;

async function start() {
    await obtainIP();
    
    if (localStorage.getItem('authenticated')) {
        const series = await apiGetSeries();
        loadHomePage();  // If authenticated, load the home page
    } else {
        loadLoginPage();  // If not authenticated, load the login page
    }

}
// ---API ip---
// Var to save the ip
let api_ip = '';

// Function to obtain api ip from .txt file
async function obtainIP() {
    try {
        const response = await fetch('API-IP.php');
        if (response.ok) {
            api_ip = await response.text();
            console.log("IP obtenida:", api_ip);
        } else {
            console.error('Error al obtener la IP:', response.status);
        }
    } catch (error) {
        console.error('Hubo un error al leer la IP:', error);
    }
}

// ---API calls---
// Login
async function apiLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const data = {
        "email": email,
        "password": password
    };

    try {
        const response = await fetch(`http://${api_ip}:3000/api/login`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        
        if (response.ok) {
            const result = await response.json();
            localStorage.setItem('authenticated', true);  // Store authentication status
            localStorage.setItem('token', result.token);  // Store token
            const series = apiGetSeries();
            console.log(series);
            loadHomePage(series);  // Load home page
        } else {
            console.error('Error en la solicitud:', response.status, response.statusText);
        }
    } catch (error) {
        console.log(error);
    }
}
// Load series
async function apiGetSeries() {
    try {
        const response = await fetch(`http://${api_ip}:3000/api/series`, {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json'
            },
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log(result);
            return result;
        } else {
            console.error('Error en la solicitud:', response.status, response.statusText);
        }
    } catch (error) {
        console.log(error);
    }
}
// ---Functions---
// Function that loads the login page
function loadLoginPage() {
    loadComponent(Login);

    const registerLink = document.getElementById('registerLink');
    registerLink.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent link execution
        loadRegisterForm();       // Load registration form
    });

    const loginButton = document.getElementById('loginButton');
    loginButton.addEventListener('click', apiLogin);  // Call API to login user

}

// Function that loads register form
function loadRegisterForm() {
    loadComponent(Register);

    const loginLink = document.getElementById('loginLink');
    loginLink.addEventListener('click', (event) => {
        loadLoginPage();
    });
    
}

// Function that loads the home page
function loadHomePage(series) {
    loadComponent(() => HomePage(series));
}


// Function that loads component
function loadComponent(component) {
    const appElement = document.getElementById('body');
    appElement.innerHTML = component();
}

// ---Components---
// Login component
function Login() {
    return `
    <div class="login-container">
        <h2>Iniciar Sesión</h2>
        <input type="text" placeholder="Email" id="email" required>
        <input type="password" placeholder="Contraseña" id="password" required>
        <button type="submit" id="loginButton">Login</button>
        <a href="#" id="registerLink">
            ¿No tienes una cuenta? Registrate acá.
        </a>
    </div>
    `;
}

// Register Component
function Register() {
    return `
    <div class="register-container">
        <h2>Registro</h2>
        <input type="text" placeholder="Nombre">
        <input type="text" placeholder="Apellidos">
        <input type="email" placeholder="Email" required>
        <input type="password" placeholder="Contraseña" required>
        <button>Registrarse</button>
        <button id="loginLink">Volver</button>
    </div>
    `;
}

// Home component
function HomePage(series) {
    // To finalize
    console.log(series);
    return `
    <div class="home-container">
        <h1>Bienvenido a la Página Principal</h1>
        <button id="logoutButton">Cerrar Sesión</button>
    </div>
    `;
}

