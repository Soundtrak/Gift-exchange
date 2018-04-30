const express = require('express');
const pg = require('pg');

// DB pool config
const pool = new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    port: 5432,
    password: '123456',
    database: 'secretsantadb',
    max: 10
});

// Users can login to the app with valid email/password
// Users cannot login to the app with a blank or missing email
// Users cannot login to the app with a blank or incorrect password
function validUser(user) {
    const validEmail = typeof user.email === 'string' && user.email.trim() !== '';
    const validPassword = typeof user.password === 'string' &&
                                user.password.trim() !== '' &&
                                user.password.trim().length >= 6;

    return validEmail && validPassword;
}

router.post('/signup', (req, res, next) => {
    if(validUser(req.body)) {
        res.json({
            message: 'Valid User. Sign up complete.'
        });
    } else {
        // send an error
        next(new Error('Invalid User.'));
    }
});

