const express = require('express')
const pageRoutes = express.Router();

function pageRoutesWrapper(_store) {
    const store = _store;
    pageRoutes.get('/', (req, res) => {
        if (!req.session.username) {
            res.status(401).end();
            return
        }
        let allPublicDrawings = {}
        let data
        for (let user in store.data) {
            if (!allPublicDrawings[user]) {
                allPublicDrawings[user] = [];
            }
            let usersDrawings = [...store.get(user).drawings]

            for (let i = 0; i < usersDrawings.length; i++) {
                if (usersDrawings[i].isPublic || user === req.session.username) {
                    allPublicDrawings[user].push(usersDrawings[i]);
                }
            }
        }
        res.status(200).send(allPublicDrawings);
    });

    pageRoutes.post('/', (req, res) => {
        if (!req.session.username) {
            res.status(401).end();
            return
        }
        let currentDrawings = [...store.get(`${req.session.username}`).drawings];
        currentDrawings.push(req.body)
        store.set(`${req.session.username}.drawings`, currentDrawings);
        res.status(200).end();
    });

    pageRoutes.delete('/:index', (req, res) => {
        if (!req.session.username) {
            res.status(401).end();
            return
        }
        let currentDrawings = [...store.get(`${req.session.username}.drawings`)];
        let filteredArray = currentDrawings.filter((drawing, index) => {
            return index !== Number(req.params.index)
        })
        store.set(`${req.session.username}.drawings`, filteredArray);
        res.status(200).end()
    });
    return pageRoutes;
}
module.exports = pageRoutesWrapper;