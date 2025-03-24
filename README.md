# SAML-Authentication-nodejs
SAML Authentication using passport-saml (nodejs, expressjs, reactjs)

Please follow below step -

1. Need to create application in IAM Identity Center
2. create user and assign that user to application
3. after creating application you will get signin url  certificate file. copy signin url and download certificate file.
4. set callback url in application configuration.
    
    Application ACS URL -
        eg. http://localhost:8080/login/callback
        
    Application SAML audience -
        passport-saml


5. attach attribute in attribute mapping

6. repo setup -

    client repo(UI) -
    1. npm install
    2. npm start
    
    Backend repo -
    1. npm install
    2. npm start


