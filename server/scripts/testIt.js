const genUser = require("./userGenerator");
const utils = require("ethereum-cryptography/utils");

const user1 = genUser();
const user2 = genUser();
const user3 = genUser();

console.log("user1: ", user1);
console.log("user2: ", user2);
console.log("user3: ", user3);
