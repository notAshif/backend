/*
 * Write 3 different functions that return promises that resolve after t1, t2, and t3 seconds respectively.
 * Write a function that sequentially calls all 3 of these functions in order.
 * Return a promise chain which return the time in milliseconds it takes to complete the entire operation.
 * Compare it with the results from 3-promise-all.js
 */

function wait1(t) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, t * 1000);
  });
}

function wait2(t) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, t * 1000);
  });
}

function wait3(t) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, t * 1000);
  });
}

function calculateTime(t1, t2, t3) {
  const start = Date.now();
  return wait1(t1)
    .then(() => wait2(t2))
    .then(() => wait3(t3))
    .then(() => {
      const end = Date.now();
      return end - start;
    });
}

calculateTime(1, 2, 3).then((time) => {
  console.log(`Time total: ${time} ms`);
});

module.exports = calculateTime;


/**
 * In all-promises.js task i create three different function with same argument which is t. The all 3 func return promises.
 * the calculateTime function do first we need a start & end Time.. So for eg 1000 returning a Promise.all with 3 wait func with t1, t2, t3
 * What promise.all actually do its concurrently wait for all 3 wait function to complete there operation and at the end it will return a maximum of t1, t2 & t3.
 * eg:-
 * calculateTime(1, 2, 3) -> wait1(1*1000) => 1s, wait2(2*2000) => 2s, wait3(3*1000) => 3s approximately 3000ms
 * 
 * Now In Promise-chain the calculation call the all 3 wait function Sequentially or 1 by 1 & the try to adding all times like (t1+t2+t3)
 * the promise chain execute 3 wait function Sequential
 * 
 * eg:- calculateTime(1, 2, 3) -> wait1(1*1000) => 1s, wait2(2*2000) => 2s, wait3(3*1000) => 6000ms
 * 
 * different:
 * promise.all
 *      - concurrent execution
 *      - start time is all time together
 *      - total duration is approximately 3000ms  
 *  Promise chain
 *      - execute sequentially
 *      - one start time after another
 *      - approximately 6000ms  
 * 
 */