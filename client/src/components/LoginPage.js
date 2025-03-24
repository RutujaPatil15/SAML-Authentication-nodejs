import React from 'react';
// import { Link } from 'react-router-dom';

const LoginPage = () => {
    const handleLogin = async () => {
        try {
            // API Gateway URL pointing to the /login endpoint
            const apiUrl = 'http://localhost:8080/isuserloggedin';

            // Initiating a GET request to start the SAML flow
            const response = await fetch(apiUrl, {
                method: 'GET'
            });
            console.log(response, '^^^^^^^^^^^response');
            if (response.status === 401) {
                redirectToLogin();
            }
            else {
                const redirectUrl = response.headers.get('Location');
                window.location.href = redirectUrl;
            }
        } catch (error) {
            console.error('Error during SAML authentication initiation:', error);
        }
    };

    // Redirect to login
    const redirectToLogin = () => {
        console.log('Login clicked');
        window.location.replace("http://localhost:8080/login"); //backend api  
        // window.location.href = 'http://localhost:8080/login'
    };

    return (
        <div>
            <h1>Login Page</h1>
            <form>
                {/* Add your login form fields here */}
                <button onClick={handleLogin}>Login</button>
            </form>
            {/* <Link to="/">Go to Home Page</Link> */}
        </div>
    );
};

export default LoginPage;
