const express = require("express");
const app = express();

const apiRoutes = require("./api/routes/routes");

app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use("/", apiRoutes);

// start node server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});

// error handler for unmatched routes or api calls
app.use((request, response, next) => {
  response.json({
    info: "Method Not Allowed",
  });
});
