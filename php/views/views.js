window.onload = start;

async function start() {
    await obtainIP();
    
    if (localStorage.getItem('authenticated')) {
        const series = await apiGetSeries();
        loadHomePage(series);  // If authenticated, load the home page
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
            const series = await apiGetSeries();
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
    let token = "";

    if (localStorage.getItem('token')) {
        token = localStorage.getItem('token');
    } else {
        console.error("No hay token en la sesión.");
        return;
    }

    try {
        const response = await fetch(`http://${api_ip}:3000/api/series`, {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
        });
        
        if (response.ok) {
            const result = await response.json();
            return result;
        } else {
            console.error('Error en la solicitud:', response.status, response.statusText);
        }
    } catch (error) {
        console.log(error);
    }
}
// Load top ten series
async function apiGetTopTenSeries(){
    let token = "";

    if (localStorage.getItem('token')) {
        token = localStorage.getItem('token');
    } else {
        console.error("No hay token en la sesión.");
        return;
    }

    try {
        const response = await fetch(`http://${api_ip}:3000/api/series/toprated`, {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
        });
        
        if (response.ok) {
            const result = await response.json();
            return result;
        } else {
            console.error('Error en la solicitud:', response.status, response.statusText);
        }
    } catch (error) {
        console.log(error);
    }
}

// Rate series
async function rateSeries(id, num){
    let token = "";

    const data = {
        "puntuacionTotal": num
    }

    if (localStorage.getItem('token')) {
        token = localStorage.getItem('token');
    } else {
        console.error("No hay token en la sesión.");
        return;
    }

    try {
        const response = await fetch(`http://${api_ip}:3000/api/series/${id}`, {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(data)
            
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
// Register users
async function apiRegister() {
    
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
    const homeContent = HomePage(series);
    loadComponent(() => homeContent);
    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', (event) => {
        localStorage.removeItem('authenticated');  // Remove authentication status
        localStorage.removeItem('token');  // Remove token
        loadLoginPage();
    });
    if(document.getElementById('topTenButton')){
        const topTenButton = document.getElementById('topTenButton');
        topTenButton.addEventListener('click', async () => {
            const topTenSeries = await apiGetTopTenSeries(); 
            loadTopTenPage(topTenSeries);
        });
    }
    console.log(series);
    // Create cards
    series.forEach(serie => {
        const divCard = document.createElement('div');
        divCard.className = 'card';
        // Stars
        const divStar = document.createElement('div');
        divStar.className ='star-rating';
        for(let i = 0; i < 5; i++) {
            const star = document.createElement('img');
            star.className = 'img-star';
            star.src = './views/assets/icons/star-off.png';
            star.setAttribute('data-index', i + 1); 

            star.addEventListener('mouseenter', () => {
                star.src = './views/assets/icons/star.png';
                
                const index = parseInt(star.getAttribute('data-index'));
                const allStars = divStar.querySelectorAll('.img-star');

                allStars.forEach((s, j) => {
                    
                    if (j < index) {
                        s.src = './views/assets/icons/star.png';
                    } else {
                        s.src = './views/assets/icons/star-off.png'; 
                    }
                });

            });
            star.addEventListener('mouseleave', () => {
                star.src = './views/assets/icons/star-off.png';
                const index = parseInt(star.getAttribute('data-index'));
                const allStars = divStar.querySelectorAll('.img-star');

                allStars.forEach((star) => {
                    star.src = './views/assets/icons/star-off.png';
                });
            });
            star.addEventListener('click', () => {
                rateSeries(serie._id, parseInt(star.getAttribute('data-index'))); // Rate series
            });
            divStar.appendChild(star);
        }

        const image = document.createElement('img');
        image.src = serie.imagen;
        const title = document.createElement('h3');
        title.textContent = serie.titulo;
        divCard.appendChild(image);
        divCard.appendChild(title);
        divCard.appendChild(divStar);
        document.getElementById("series").appendChild(divCard);
    });
}

// Function that loads top ten page
async function loadTopTenPage(topTenSeries) {
    loadComponent(HomePageTen);
    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', (event) => {
        localStorage.removeItem('authenticated');  // Remove authentication status
        localStorage.removeItem('token');  // Remove token
        loadLoginPage();
    });

    if(document.getElementById('verTodasButton')){
        const verTodasButton = document.getElementById('verTodasButton');
        verTodasButton.addEventListener('click', async () => {
            const series = await apiGetSeries(); 
            loadHomePage(series);
        });
    }

    topTenSeries.forEach(serie => {
        const divCard = document.createElement('div');
        divCard.className = 'card';
        const image = document.createElement('img');
        image.src = serie.imagen;
        const title = document.createElement('h3');
        title.textContent = serie.titulo;
        divCard.appendChild(image);
        divCard.appendChild(title);
        document.getElementById("series").appendChild(divCard);
    });
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
function HomePage() {
    return `
    <header><h1>Series Mogara</h1></header>
    <div class="home-container">
        <button id="topTenButton" class="topTenButton">Ver top 10 series</button>
        <div id="series" class="series"></div>
        <button id="logoutButton" class="logoutButton">Cerrar Sesión</button>
    </div>
    <footer>
        <div class="footer-content">
            <p>&copy; 2025 TuEmpresa. Todos los derechos reservados.</p>
            <p>
                <a href="#">Política de Privacidad</a> | 
                <a href="#">Términos de Servicio</a>
            </p>
        </div>
    </footer>
    `;
}

function HomePageTen() {
    return `
    <header><h1>Series Mogara</h1></header>
    <div class="home-container">
        <h2>Top 10 series</h2>
        <button id="verTodasButton" class="verTodasButton">Ver todas las series</button>
        <div id="series" class="series"></div>
        <button id="logoutButton" class="logoutButton">Cerrar Sesión</button>
    </div>
        <footer>
        <div class="footer-content">
            <p>&copy; 2025 Mogara. Todos los derechos reservados.</p>
            <p>
                <a href="#">Política de Privacidad</a> | 
                <a href="#">Términos de Servicio</a>
            </p>
        </div>
    </footer>
    `;
}

