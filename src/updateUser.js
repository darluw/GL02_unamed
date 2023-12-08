const colors = require('colors');
const fs = require('fs');

let updateUser = (user) => {
    let jsonData = fs.readFileSync("../utils/users.json", "utf8");
    let jsonContent = JSON.parse(jsonData);
    let users = jsonContent.users;
    let index = users.findIndex((u) => u.username === user.username);
    users[index] = user;
    jsonContent.users = users;
    fs.writeFileSync("../utils/users.json", JSON.stringify(jsonContent));
}

module.exports = { updateUser };