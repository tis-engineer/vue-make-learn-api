const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const NeDB = require("nedb");
const db = {
  tasks: new NeDB({
    filename: "data/tasks",
    autoload: true
  })
};

// cors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// 一覧取得
app.get("/tasks", (req, res) => {
  db.tasks.find({}, (err, docs) => {
    res.send(docs);
  });
});

// 新規作成
app.post("/tasks", (req, res) => {
  db.tasks.insert(
    {
      title: req.params.title,
      detail: req.params.detail,
      period: req.params.period
    },
    (err, newDoc) => {
      res.send(newDoc);
    }
  );
});

// 内容更新
app.put("/tasks/:id", (req, res) => {
  db.tasks.update(
    { _id: req.params.id },
    {
      $set: {
        title: req.body.title,
        detail: req.body.detail,
        period: req.body.period
      }
    },
    { upsert: false, returnUpdatedDocs: true },
    (err, numOfDocs, updatedDocs) => {
      res.send(updatedDocs);
    }
  );
});

// 削除
app.delete("/tasks/:id", (req, res) => {
  db.tasks.remove({ _id: req.params.id }, {}, (err, numOfDocs) => {
    res.send();
  });
});

app.listen(3000, () => console.log("listening at port 3000"));
