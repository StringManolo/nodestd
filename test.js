
const std = require("./std").std();

console.log(1);

console.log(std.evalScript("8*8"));

let text = std.loadFile("./helloWorld.js");
console.log(text);

loadScript("./helloWorld.js");

std.exit(1);

console.log("Never print this"); 
