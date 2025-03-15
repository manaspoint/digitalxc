const multer = require("multer");
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
}).fields([
  { name: "empData", maxCount: 1 },
  { name: "prevEmpData", maxCount: 1 },
]);

module.exports = upload;
