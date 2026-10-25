const fs = require("fs/promises");

//Callback
function readWrite(inputFile, outputFile, cb) {
    fs.readFile(inputFile, "utf-8", (err, data) => {
        if (err) {
            cb("error while reading..")
        } else {
            fs.writeFile(outputFile, data.toUpperCase(), "utf-8", (err, data) => {
                if (err) {
                    cb("Error while write file")
                } else {
                    cb(null, "");
                }
            });
        }
    });
}

readWrite('a.txt', 'b.txt', (err, data) => {
    if (err) {
        console.log(err);
    } else {
        console.log("done.")
    }
})

function readTimer(n, m, path, cb) {
    fs.readFile(path, "utf-8", (err, data) => {
        if (err) {
            cb("Error While reading file")
        } else {
            setTimeout(() => {
                fs.writeFile(path, data.toUpperCase(), "utf-8", (err, data) => {
                    if (err) {
                        cb("Error while writing file..")
                    } else {
                        setTimeout(() => {
                            cb(null, "")
                        }, m)
                    }
                })
            }, n)
        }
    })
}

readTimer(1000, 2000, "a.txt", (err, data) => {
    if (err) {
        console.log(err)
    } else {
        console.log("Done..")
    }
})


function createCode(filepath, cb) {
    fs.readFile(filepath, "utf-8", (err, data) => {
        if (err) {
            cb("error while reading.")
        }
        const parsedData = JSON.parse(data);
        
        // let counter = 0;

        parsedData.forEach(({ path, contents }) => {
            fs.writeFile(path, contents, "utf-8", (err) => {
                if(err) cb("Error While Writing file..")
                // counter++;
                // if (counter == Array.length) {
                //     cb();
                // }
            });
        });
        cb();
    })
}

createCode("a.txt", (err, data) => {
    if (err) {
        console.log(err)
    } else {
        console.log("All file are well written!");
    }
})


//Promises
//Promises Chaining
fs.readFile("a.txt", "utf-8")
    .then(data => fs.writeFile("b.txt", data.toUpperCase(), "utf-8"))
    .then(() => console.log("done"))
    .then((data) => fs.readFile("c.txt", "utf-8"))


// Write ur own class
function readFilePromisified(filePath) {
    return new Promise((res, rej) => {
        fs.readFile(filePath, "utf-8", (err, data) => {
            if (err) {
                rej("Error while reading file..")
            } else {
                res(data)
            }
        })
    })
}

readFilePromisified("a.txt").then(data => {
    console.log(data)
}).catch(err => {
    console.log(err)
})

function setTimeOutPromisified(n) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, n)
    })
}

setTimeOutPromisified(3000).then(() => {
    console.log("hi there")
})

console.log("1");

setTimeout(() => {
    console.log("2")
}, 3000)

Promise.resolve().then(() => console.log("3"))

console.log("4");

//Async/await
async function main() {
    // await fs.readFile("a.txt", "utf-8", async (err, data) => {
    //     if (err) console.log(err)
        
    //     await fs.writeFile("b.txt", data.toUpperCase(), "utf-8");
    // })

    const data = await fs.readFile("a.txt", "utf-8")
    await fs.writeFile("b.txt", data.toUpperCase(), "utf-8");
    return data;
}

//How JS convert above code 
function main() {
    return new Promise((resolve, reject) => {
        fs.readFile("a.txt", "utf-8")
            .then((data) => fs.writeFile("b.txt", data.toUpperCase(), "utf-8"))
            .then(() => resolve())
    })
}

main().then((data) => console.log(data))
console.log("hi there")