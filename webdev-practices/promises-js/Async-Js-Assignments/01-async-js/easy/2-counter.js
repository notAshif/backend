// ## Counter without setInterval

// Without using setInterval, try to code a counter in Javascript. There is a hint at the bottom of the file if you get stuck.

// (Hint: setTimeout)

let c = 0;

const startCounter = () => {
    c++;
    console.log(c)

    setTimeout(startCounter, 1000);
}
startCounter();

