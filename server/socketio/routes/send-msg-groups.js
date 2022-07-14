function sendGroupsMsg(username, typedMsg, groupName, io) {
    let group = require(`../groups/${groupName}.json`);

    group.chat.push({ [username]: typedMsg });

    fs.writeFile(`../groups/${groupName}.json`, JSON.stringify(group, null, 2), (err) => {
        if (err) {
            console.log(err);
        }
    });

    io.emit('recive-msg-groups', group.chat);
}

module.exports = sendGroupsMsg;