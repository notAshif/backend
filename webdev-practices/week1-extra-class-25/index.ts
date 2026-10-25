import express from "express";

const app = express();
let requestCount = 0;

app.use((req: any, res: any, next: () => void) => {
    requestCount += 1;

    console.log(
        `Request #${requestCount}: ${req.method} ${req.path}`
    );

    next();
});

app.get("/", (req: any, res: any) => {
    res.send("Welcome!");
});

app.get("/about", (req: any, res: any) => {
    res.send("About this app");
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});