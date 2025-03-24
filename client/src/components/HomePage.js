import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

const HomePage = () => {
    // const [accessToken, setAccessToken] = useState(null);

    // useEffect(() => {
    //     // Retrieve the idToken from the cookie
    //     const token = Cookies.get('accessToken');

    //     if (token) {
    //         setAccessToken(token);
    //     }
    //     ping();

    // }, []);

    // useEffect(() => {
    //     ping();
    //     const interval = setInterval(ping, 2 * 60000);
    //     return () => clearInterval(interval);
    // }, []);

    // const ping = async () => {
    //     try {
    //         const res = await fetch('http://localhost:8080/check_login', {
    //             method: 'get',
    //             headers: {
    //                 'Authorization': `Bearer ${accessToken}`
    //             }
    //         });
    //         console.log(res, '^^^^^^^^^^resping');
    //     } catch (error) {
    //         console.log(error, '^^^^^^^^^^err');
    //     }
    // }

    return (
        <div>
            <h1>Welcome to the Home Page!</h1>
            <p>You're logged in!</p>
            <Link to="/login">Go to Login Page</Link>
        </div>
    );
};

export default HomePage;
