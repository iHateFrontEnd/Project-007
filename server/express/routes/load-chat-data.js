const express = require('express');
const router = express.Router();
const usersFile = require('../../users.json');

router.post('/', (req, res) => {
    const groupName = req.body.groupName;

    if (req.body.toLoad == 'group') {
        let groupFile = require(`../../groups/${groupName}.json`);

        res.json({
            permittedUsers: groupFile.permittedUsers,
            requestedUsers: groupFile.requestedUsers,
            chat: groupFile.chat,
            groupName: groupName
        });

    } else if (req.body.toLoad == 'dm') {
        const userIndex = req.body.userIndex;
        const fUsername = req.body.fUsername;

        var chatFileName = '';

        //finding chat file name
        for (let i = 0; i <= usersFile.users[userIndex].friends.length - 1; i++) {
            if (usersFile.users[userIndex].friends[i].username == fUsername) {
                chatFileName = usersFile.users[userIndex].friends[i].chatFile;
                break;
            }
        }

        const chatFile = require(`../../personal/${chatFileName}`);

        res.json(chatFile);
    }
});

module.exports = router;