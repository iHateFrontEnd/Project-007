const express = require('express');
const router = express.Router();
const fs = require('fs');
var groupsFile = require('../groups.json');
var usersFile = require('../users.json');

router.post('/', (req, res) => {
    try {

        req.body.newGroupName = req.body.newGroupName.replaceAll(' ', '-');
    } catch (err) {
        //pass
    }

    console.log(req.body);

    const newGroupName = req.body.newGroupName;
    const groupName = req.body.groupName;
    const userIndex = req.body.userIndex;

    //modifying the groups.json
    var groupIndex = -1;

    for (let i = 0; i <= groupsFile.groups.length; i++) {
        groupIndex++;

        if (groupsFile.groups[i] == groupName) break;
    }

    groupsFile.groups.splice(groupIndex, 1);
    groupsFile.groups.push(newGroupName);

    fs.writeFile('./groups.json', JSON.stringify(groupsFile), (err) => {
        if (err) console.log(err);
    });

    //modifying users.json
    groupIndex = -1;

    for (let i = 0; i <= usersFile.users[userIndex].groups.length; i++) {
        groupIndex++;

        if (usersFile.users[userIndex].groups[i] == groupName) break;
    }

    usersFile.users[userIndex].groups.splice(groupIndex, 1);
    usersFile.users[userIndex].groups.push(newGroupName);

    fs.writeFile('./users.json', JSON.stringify(usersFile), (err) => {
        if (err) console.log(err);
    });

    //modifying the main group/chat file
    var groupFile = require(`../groups/${groupName}.json`);

    groupFile.groupName = newGroupName;

    fs.writeFile(`./groups/${groupName}.json`, JSON.stringify(groupFile), (err) => {
        if (err) console.log(err);
    });

    //renaming the main groups/chat file
    fs.rename(`./groups/${groupName}.json`, `./groups/${newGroupName}.json`, (err) => {
        if (err) console.log(err);
    });

    const chatData = {
        groups: usersFile.users[userIndex].groups,
        friends: usersFile.users[userIndex].friends
    }

    const currentGroupData = {
        requestedUsers: groupFile.requestedUsers,
        permittedUsers: groupFile.permittedUsers
    }

    res.json({
        chatData,
        currentGroupData
    });

    res.end();
});

module.exports = router;