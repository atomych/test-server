const express = require("express");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const port = 443;

let users = JSON.parse(fs.readFileSync("./database/users.json"));
let images = JSON.parse(fs.readFileSync("./database/images.json"));
const login = require("./database/login.json");

const app = express();
app.use(cors());
app.set("view engine", "pug");
app.use(express.static("public"));
app.use(express.json({limit: '1mb'}));

app.get("/main", (req, res) => {
  res.render("main", {
    users: users.users,
    images: images.images,
  });
});

app.get("/auth", (req, res) => {
  res.render("auth");
});

app.get("/edit", (req, res) => {
  res.render("edit", {
    users: users.users,
    images: images.images,
  });
})

app.post("/api/auth", (req, res) => {
  const reqLogin = req.body.login;
  const reqPass = req.body.password;

  if (
    reqLogin == login.admin.login &&
    bcrypt.compareSync(reqPass, login.admin.hashedPass)
  ) {
    res.send(
      JSON.stringify({
        login: true,
        tocken: jwt.sign({ login: "admin" }, login.admin.secretKey, {
          expiresIn: "1h",
        }),
      })
    );
  } else {
    res.send(
      JSON.stringify({
        login: false,
        tocken: null,
      })
    );
  }
});

app.post("/api/check-auth", (req, res) => {
  if (req.headers["authorization"]) {
    const tocken = req.headers["authorization"].split(" ")[1];

    jwt.verify(tocken, login.admin.secretKey, function(err, decoded) {
      if (err) res.status(500);
      if (decoded.login == "admin") res.send(JSON.stringify({login: true}));
      else res.status(500);
    })
  } else {
    res.status(500);
  }
})

app.post("/api/admin-access/users", (req, res) => {
  if (req.headers["authorization"]) {
    const tocken = req.headers["authorization"].split(" ")[1];
    jwt.verify(tocken, login.admin.secretKey, function(err, decoded) {
      if (err) res.status(500).send(JSON.stringify({ type: "invalid-token" }));
      if (decoded.login == "admin") {
        const data = req.body;
        if (data) {
          fs.writeFileSync("./database/users.json", JSON.stringify(data));
          users = JSON.parse(fs.readFileSync("./database/users.json"));
          res.status(200).send(JSON.stringify({ type: "changes-applied" }));
        } else {  
          res.status(500);
        }
      }
      else res.status(500);
    })
  }
})

app.post("/api/admin-access/images", (req, res) => {
  if (req.headers["authorization"]) {
    const tocken = req.headers["authorization"].split(" ")[1];
    jwt.verify(tocken, login.admin.secretKey, function(err, decoded) {
      if (err) res.status(500).send(JSON.stringify({ type: "invalid-token" }));
      if (decoded.login == "admin") {
        const data = req.body;
        if (data) {
          const base64Image = data.dataURL.split(';base64,').pop();
          const path = `/images/user-img${data.id}.${data.ext}`;
          if (images.images[`${data.id}`]) {
            const oldPath = images.images[`${data.id}`];
            if (path != oldPath) {
              fs.unlinkSync(`./public${oldPath}`);
            }
          }
          fs.writeFileSync(`./public${path}`, base64Image, {encoding: 'base64'});
          images.images[`${data.id}`] = path;
          fs.writeFileSync("./database/images.json", JSON.stringify(images));
          images = JSON.parse(fs.readFileSync("./database/images.json"));
          res.status(200).send(JSON.stringify({ type: "changes-applied" }));
        } else {  
          res.status(500);
        }
      }
      else res.status(500);
    })
  }
})

app.listen(port);
