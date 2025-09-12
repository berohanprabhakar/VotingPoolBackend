const express = require("express");
const dotenv = require("dotenv");
const { userRouter} = require('')

const app = express();
app.use(express.json())

const PORT = process.env.PORT || 3000;

app.use("/", (req, res) => {
  return res.json("hellow my fan");
});

app.use('user', )


app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});
