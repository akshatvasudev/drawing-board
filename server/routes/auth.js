const express = require('express')
const authRoutes = express.Router();

function authRoutesWrapper(_store) {
    const store = _store;
    authRoutes.get('/', (req, res) => {
        if (req.session && req.session.username) res.send({ username: req.session.username })
        else res.send(false)
    })

    authRoutes.delete('/', (req, res) => {
        if (req.session.username) {
            req.session.destroy(err => {
                if (err) throw (err);
                res.clearCookie('userAuthStatus');
                res.send(200);
            });
        } else {
            res.status(401).send({ message: 'No such user' });
        }
    })

    authRoutes.post('/signup', (req, res) => {
        if (store.get(req.body.username)) {
            res.status(401).send({ message: 'Username already exists' })
            return;
        }
        let newUserData = { password: req.body.password, drawings: [] };
        store.set({
            [req.body.username]: newUserData
        });
        req.session.username = req.body.username;
        req.session.save();
        res.end();
    });


    authRoutes.post('/', (req, res) => {
        if (!store.get(req.body.username)) {
            res.status(401).send({ message: 'No user found' })
            return
        }
        if (store.get(req.body.username).password !== req.body.password) {
            res.status(401).send({ message: 'Wrong credentials' })
            return
        }
        req.session.username = req.body.username;
        req.session.save();

        res.end();
    });
    return authRoutes;
}
module.exports = authRoutesWrapper;