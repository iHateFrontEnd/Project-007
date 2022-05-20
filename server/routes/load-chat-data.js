const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    const groupName = req.body.groupName;

    if (req.body.toLoad == 'group') {
        let groupFile = require(`../groups/${groupName}.json`);

        res.send({
            permittedUsers: groupFile.permittedUsers,
            requestedUsers: groupFile.requestedUsers,
            chat: groupFile.chat,
            groupName: groupName
        });

        res.end();
    } else if (req.body.toLoad == 'dm') {
        const fUsername = req.body.fUsername;
        const username = req.body.username;

        try {
            var dmFile = require(`../personal/${fUsername}&${username}.json`);

            res.send({
                fUsername: fUsername,
                chat: dmFile.chat
            });
        } catch (err) {

            var dmFile = require(`../personal/${username}&${fUsername}.json`);

            res.send({
                fUsername: fUsername,
                chat: dmFile.chat
            });
        }
    }

    res.end();
});

module.exports = router;
