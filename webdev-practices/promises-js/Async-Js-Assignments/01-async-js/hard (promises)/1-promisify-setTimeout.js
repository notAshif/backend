/*
    Write a function that returns a promise that resolves after n seconds have passed, where n is passed as an argument to the function.
*/


function WaitForMe(n) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve(), n*1000)
  })
}

WaitForMe(3).then(() => console.log("3 second passed from my life..."))

function wait(n) {
    let p = new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, n * 1000);
    });
    return p;
  }
  
  module.exports = wait;