function sendDmMsg(username, msg, fUsername, io) {
    var dmFile;
    var tryOrCatch;

    try {
        dmFile = require(`../personal/${username}&${fUsername}.json`);
        tryOrCatch = 'try';
    } catch (err) {
        dmFile = require(`../personal/${fUsername}&${username}.json`);
        tryOrCatch = 'catch';
    }

    dmFile.chat.push({
        [username]: msg
    });

    if (tryOrCatch == 'try') {
        fs.writeFile(`../personal/${username}&${fUsername}.json`, JSON.stringify(dmFile), (err) => {
            if (err) console.log(err);
        });
    } else {
        fs.writeFile(`../personal/${fUsername}&${username}.json`, JSON.stringify(dmFile), (err) => {
            if (err) console.log(err);
        });
    }

    io.emit('recive-msg-dm', dmFile.chat);
}

module.exports = sendDmMsg;