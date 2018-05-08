const express = require('express');
const router = express.Router();

// DB
const pg = require('pg');

const pool = new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    port: 5432,
    password: '123456',
    database: 'gift_exchange_db',
    max: 10
});

// Basic authentication
const basicAuth = require('basic-auth');

const auth = function (req, res, next) {
    function unauthorized(res) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.sendStatus(401);
    }

    let user = basicAuth(req);

    if (!user || !user.name || !user.pass) {
        return unauthorized(res);
    }

    pool.query('select * from public.users where email = $1 and password = $2', [user.name, user.pass], (err, result) => {
        if (err) {
            console.log(err);
        }
        else if (result.rows.length === 1) {
            delete result.rows.password;
            req.user = result.rows[0];
            console.log('authorized!!');
            return next();
        }
        else {
            return unauthorized(res);
        }
    });
};

// Test route
router.get('/', (req, res) => {
    res.send('working');
});

// Routes

router.post('/user/', addUser);

function validEmail(email)
{
    let re = /[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9.]{2,5}$/;
    return re.test(email);
}

function validPassword(pass) {
    /*
     Passwords must be/have at least:
     -8 characters long, max length anything
     -1 lowercase letter
     -1 capital letter
     -1 number
     -1 special character => !@#$%^&*
    */
    let re = /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/;
    return re.test(pass);
}

// Just makes sure names are type of string and not empty
function validNames(fn, ln) {
    return (fn !== '' && ln !== '' && typeof fn === 'string' && typeof ln === 'string');
}



function addUser(req, res) {
    if (validEmail(req.body.email) && validPassword(req.body.password) && validNames(req.body.fn, req.body.ln)) {
        pool.query('select email from public.users where email = $1', [req.body.email], (err, result) => {
            if (err) {
                console.log(err);
            } else if (result.rows.length === 0){
                pool.query('insert into public.users (email, password, first_name, last_name) ' +
                    'values ($1, $2, $3, $4)', [req.body.email, req.body.password, req.body.fn, req.body.ln], (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.json('Sign up successful.');
                    }
                })
            }else {
                res.json('That email already exists.');
            }
        });
    }

    else if (!validEmail(req.body.email)) {
        //res.sendStatus(400); TODO: I would like to send the error message below as well as set status code to 400.
        res.json('Sign up failed. Invalid email.');
    }
    else if (!validPassword(req.body.password)) {
        //res.sendStatus(400); TODO: I would like to send the error message below as well as set status code to 400.
        res.json('Sign up failed. Invalid password.');
    }
    else if (!validNames(req.body.fn, req.body.ln)) {
        //res.sendStatus(400); TODO: I would like to send the error message below as well as set status code to 400.
        res.json('Sign up failed. Sign up requires first and last name and must be string.');
    }
}


router.get('/user/', auth, getUser);

// Gets all info of user. User id is specified and verified by the basic auth.
function getUser(req, res) {
    pool.query('select * from public.users where user_id = $1', [req.user.user_id], (err, result) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.send(result.rows[0]);
            console.log(result.rows[0]);
        }
    })
}

router.delete('/user/', auth, deleteUser);

function deleteUser(req, res) {
    pool.query('delete from public.users where user_id = $1', [req.user.user_id], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.json('User deleted.');
        }
    })
}

// Gets all the groups that user with :id is in. Also verifies that the user :id matches the basic auth id.
router.get('/user/:id/groups', auth, getGroupsOfUser);

function getGroupsOfUser(req, res) {
    let groups = [];
    if (req.params.id === req.user.user_id.toString()) {
        res.json(groups);

    }else {
        res.sendStatus(403);
    }
}

// Export routes module
module.exports = router;