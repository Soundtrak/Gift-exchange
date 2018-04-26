const express = require('express');
const pg = require('pg');
const router = express.Router();

// DB pool config
const pool = new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    port: 5432,
    password: '123456',
    database: 'secretsantadb',
    max: 10
});

// DB test
/*pool.connect((err, db, done) => {
    if(err) {
        return console.log(err);
    }
    else {
        db.query('SELECT * FROM public.users', (err, table) => {
            done();
            if (err) {
                console.log(err);
            }
            else {
                console.log(table);
            }
        })
    }
});*/

// Routes
// Login Page get request (sends html file for login/sign up)
router.get('/', (req, res) => {
   res.sendfile("index.html");
});

// Login post request
// TODO: why does post have a warning?
router.post('/login', (req, res) => {
    let user_name = req.body.user;
    let password = req.body.password;
    res.send('un: ' + user_name + ' and pw: ' + password + '.');
    pool.connect((err, db, done) => {
        if(err) {
            return console.log(err);
        }
        else {
            db.query('SELECT * FROM public.users', (err, table) => {
                done();
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(table.rows[0].username);
                    if(user_name === table.rows[0].username && password === table.rows[0].password) {
                        console.log('Login Success!')
                    }
                }
            })
        }
    });
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

module.exports = router;