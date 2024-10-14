const app = require("./app");

app.listen(8888, (err) => {
    if (err) return err;
    console.log("listening on 8888");
})