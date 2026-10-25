/*
 * Write a function that halts the JS thread (make it busy wait) for a given number of milliseconds.
 * During this time the thread should not be able to do anything else.
 * the function should return a promise just like before
 */



function sleep(milliseconds) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    while(Date.now() - startTime < milliseconds){}
    resolve();
  });
}

//Asif code

// function sleep(milliseconds) {
//     return new Promise((resolve, reject) => {
//         const startTime = Date.now();
    
//         for (let i = startTime; i < milliseconds; i++){
//             console.log(Date.now)
//             console.log(startTime)
//         }
//         resolve()
//     })
// }

sleep(2).then(() => console.log("sleep finished"))

console.log("1")
console.log("2");
console.log("3");


module.exports = sleep;
