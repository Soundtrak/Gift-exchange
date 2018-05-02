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

router.post('/signup/', addUser);

function addUser(req, res) {
    // Validate email and password (type of email and password length etc...).
    if (validUserSignUpInfo(req.body.email, req.body.password)) {
        pool.query('select email from public.users where email = $1', [req.user.email], (err, result) => {
            if (err) {
                console.log(err)
            } else {
                if (result.rows.length === 0) {
                    pool.query('insert into public.users (email, password, firstName, lastName) values ' +
                        '($1, $2, $3, $4)', [req.body.email, req.body.password, req.body.firstName, req.body.lastName], (err, result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            res.send('Sign Up complete!');
                        }
                    })
                }
            }
        })
    } else {
        console.log('invalid signup info.');
    }
    // Check if email already exists in DB. If so send error, if not, make db insert query.
    //
}

// Users can login to the app with valid email/password
// Users cannot login to the app with a blank or missing email
// Users cannot login to the app with a blank or incorrect password
function validUserSignUpInfo(email, password) {
    const validEmail = typeof email === 'string' && email.trim() !== '';
    const validPassword = typeof password === 'string' &&
        password.trim() !== '' &&
        password.trim().length >= 7;
    if (!validEmail) {
        res.send('Not a valid email adderss.');
        return false;
    }
    if (!validPassword) {
        res.send('Not a valid password. Password must be at least 7 characters.');
        return false;
    }
    else return true;

}