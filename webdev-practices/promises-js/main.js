const fs = require("fs");

//without async the whatever function is call the thread being stuck on every call..
//with async the whatever function we calling the thread doing hes other working while calling a await with function..


//Promise accept function as a input..

//create a promisified version of setTimeout
//create a promisified version of fs.writeFile

//write a promisified function that take a file prefix as an input (a)
// and cleans({prefix}1.txt), {prefix}2.txt, {prefix}3.txt 

//fsReadAndWritePromisified()

//create a promisified version of fs.readFile
//on top of fs.readFile 
function fsReadFilePromise(filename, encoding) {
    return new Promise(function (resolve, reject) {
        fs.readFile(filename, encoding, function (err, data) {
            if (err) {
                reject(err)
            } else {
                resolve(data);
            }
        })
    });
}

//one way to call.
fsReadFilePromise("a.txt", "utf-8")
    .then(data => console.log(data)) // Resolve
    .catch(err => console.log("Error While Reading file", err)) // Reject