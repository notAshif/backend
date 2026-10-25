const fs = require("fs")

// ## Write to a file

// Using the fs library again, try to write to the contents of a file.
// You can use the fs library to as a black box, the goal is to understand async tasks.

const data = "Hello there :-))))";

console.log("Start")

fs.writeFile("content.txt", data, "utf-8", (err) => {
    if (err) console.log(err);
    console.log("File written successfully!");
});

console.log("End")