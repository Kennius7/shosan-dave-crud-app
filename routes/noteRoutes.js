const express = require("express");
const router = express.Router();
const noteController = require("../controllers/noteController");



router.route("/")
    .get(noteController.getAllNotes)
    .post(noteController.createNewNotes)
    .patch(noteController.updateNotes)
    .delete(noteController.deleteNotes)

module.exports = router



