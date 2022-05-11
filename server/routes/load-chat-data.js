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
    } else {
        // loadPersonalChat();
    }
});

module.exports = router;
