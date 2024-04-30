// const User = require("../models/user");
const Notes = require("../models/Notes");
const asyncHandler = require("express-async-handler");



const getAllNotes = asyncHandler(async (req, res) => {
    const note = await Notes.find();
    if (!note?.length) {
        return res.status(400).json({ msg: "No notes found!" })
    }
    res.status(200).json(note);
})

const createNewNotes = asyncHandler(async (req, res) => {
    const { user, title, text, username } = req.body;
    if (!user || !title || !text || !username) {
        return res.status(400).json({ msg: "All fields are required!" })
    }

    const duplicateNotes = await Notes.findOne({ title, text }).lean().exec();

    if (duplicateNotes) {
        return res.status(409).json({ msg: "Duplicate Notes" });
    }

    const noteObject = { user, title, text, username };
    const note = await Notes.create(noteObject);

    if (note) {
        res.status(201).json({ msg: `New note (${title}) created!` });
    } else { res.status(400).json({ msg: "Invalid data received!" }) }
})

const updateNotes = asyncHandler(async (req, res) => {
    const { title, text, id } = req.body;
    if (!text || !title || !id) {
        return res.status(400).json({ msg: "All fields are required." })
    }

    const note = await Notes.findById(id).exec();

    if (!note) {
        return res.status(400).json({ msg: "Note not found" });
    }

    note.title = title;
    note.text = text;

    const updatedNote = await note.save();

    res.json({ msg: `Note (${updatedNote.title}) updated!` })
})

const deleteNotes = asyncHandler(async (req, res) => {
    const { id, title } = req.body;
    if (!id) {
        return res.status(400).json({ msg: "ID required" })
    }

    const notes = await Notes.findById(id).exec();

    if (!notes) {
        return res.status(400).json({ msg: "Note not found!" });
    }

    await notes.deleteOne();
    const message = `Note with a Title: [${title}] deleted!`;
    res.json({ msg: message });
})


module.exports = {
    getAllNotes,
    createNewNotes,
    updateNotes,
    deleteNotes
}


/*
User ids::

"_id": "6627c32de0a95117ad4213e1",
"username": "Shosan Boggs",

"_id": "662cee5043a0396deb008288",
"username": "Kara Boggs",

"_id": "662cee9243a0396deb00828c",
"username": "Emeka Ike",

"_id": "662ceeb043a0396deb00828f",
"username": "John Doe",

"_id": "662f8b3f5d25cb6f9c1f0006",
"username": "Enya Thomas",

*/



/*
{
    "username": "Enya Thomas",
    "password": "enya123",
    "user": "662f8b3f5d25cb6f9c1f0006",
    "title": "Introduction to Content Writing",
    "text": "This is the first line of production when it comes to content creation."
}

{
    "username": "Enya Thomas",
    "user": "662f8b3f5d25cb6f9c1f0006",
    "title": "Getting an Airpod",
    "text": "I went to the market yesterday to get an airpod. It was so nice."
}
*/


