const express = require('express');
const router = express.Router();

// DB
const pg = require('pg');

const pool = new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    port: 5432,
    password: '123456',
    database: 'secretsantadb',
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

router.get('/user/', auth, getUser);

function getUser(req, res) {
    pool.query('select * from public.users where user_id = $1', [req.user.id], (err, result) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.send(result.rows);
        }
    })
}

router.get('/user/:id/groups', auth, getGroupsOfUser);

function getGroupsOfUser(req, res) {
    let groups = [];
    if (req.params.id === req.user.id.toString()) {
        res.json(groups);

    }else {
        res.sendStatus(401);
    }
}
// Export routes module
module.exports = router;