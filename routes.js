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
            console.log(req.user);
            console.log('authorized!!');
            return next();
        }
        else {
            return unauthorized(res);
        }
    });
};

// test route
router.get('/', (req, res) => {
    res.send('working');
});

// Routes

router.get('/user/', auth, getUser);

router.get('/group/', getAllGroups);

router.get('/group/:id', getGroup);

router.get('/group/user/:id', getGroupsOfUser);

router.get('/user/group/:id', getUsersOfGroup);

router.get('/pairing/user/:id', getPairingsOfUser);

router.get('/pairing/user/:id', getPairingsOfUserInGroup);

router.get('/pairing/group/:id', getPairingsOfGroup);

// controller functions

function getUser(req, res) {
    pool.query('select * from public.users where id = $1', [req.user.id], (err, result) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.send(result.rows.id);
        }
    })
}

function getAllGroups(req, res) {

}

function getGroup(req, res) {

}

function getGroupsOfUser(req, res) {

}

function getUsersOfGroup(req, res) {

}

function getPairingsOfUser(req, res) {

}

function getPairingsOfUserInGroup(req, res) {

}

function getPairingsOfGroup(req, res) {

}

// Export routes module
module.exports = router;