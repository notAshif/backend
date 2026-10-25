const fs = require("fs");

// ## File cleaner
// Read a file, remove all the extra spaces and write it back to the same file.

// For example, if the file input was
// ```
// hello     world    my    name   is       raman
// ```

// After the program runs, the output should be

// ```
// hello world my name is raman
// ```

function cleanFile(filepath) {
    fs.readFile(filepath, "utf-8", (err, data) => {
        if (err) console.log(err);
        const content = data.trim(/\s+/g, " ");
        fs.writeFile(filepath, content, "utf-8", (err) => {
          if (err) console.log(err);
        });
        console.log(data);
    })
}

cleanFile("a.txt");