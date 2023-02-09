const router = require("express").Router();
const mongoose = require("mongoose");

let conn = mongoose.connection;

conn.once("open", () => {
  let gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "ProductPhotos",
  });

  router.get("/products/:id", async (req, res) => {
    let objectId = new mongoose.Types.ObjectId(req.params.id);
    gridfsBucket.find({ _id: objectId }).toArray((err, file) => {
      if (err) return console.warn(err);
      if (!file || file.length === 0)
        return res.status(404).send("File not found");
      file = file[0];

      if (
        file.contentType == "image/jpeg" ||
        file.contentType == "image/png" ||
        file.contentType == "image/jpg"
      ) {
        let data = [];
        let readstream = gridfsBucket.openDownloadStream(file._id);

        readstream.on("data", (chunk) => data.push(chunk));
        readstream.on("end", () => {
          data = Buffer.concat(data);
          let img = Buffer(data).toString("base64");
          return res.json(img);
        });
      } else res.end();
    });
  });
});

module.exports = router;
