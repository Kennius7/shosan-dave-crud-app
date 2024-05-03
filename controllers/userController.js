const User = require("../models/user");
const Notes = require("../models/Notes");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");


const getAllUsers = asyncHandler(async (req, res) => {
    const user = await User.find().select("-password").lean();
    if (!user?.length) {
        return res.status(400).json({ msg: "No user found!" })
    }
    res.status(200).json(user);
})

const createNewUsers = asyncHandler(async (req, res) => {
    const { username, password, roles } = req.body;
    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ msg: "All fields are required!" })
    }

    const duplicateUser = await User.findOne({ username }).lean().exec();

    if (duplicateUser) {
        return res.status(409).json({ msg: "Duplicate Username" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userObject = { username, "password": hashedPassword, roles };
    const user = await User.create(userObject);

    if (user) {
        res.status(201).json({ msg: `New user ${username} created!` });
    } else { res.status(400).json({ msg: "Invalid user data received!" }) }
})

const updateUsers = asyncHandler(async (req, res) => {
    const { username, password, roles, id, active } = req.body;
    if (!username || !Array.isArray(roles) || !roles.length || !id || typeof active !== "boolean") {
        return res.status(400).json({ msg: "All fields are required" })
    }

    const user = await User.findById(id).exec();

    if (!user) {
        return res.status(400).json({ msg: "User not found" });
    }

    const duplicateUser = await User.findOne({ username }).lean().exec()

    if (duplicateUser && duplicateUser?._id.toString() !== id) {
        return res.status(409).json({ msg: "Duplicate username" });
    }

    user.username = username;
    user.roles = roles;
    user.active = active;

    if (password) {
        user.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await user.save();

    res.json({ msg: `User ${updatedUser.username} updated!` })
})

const deleteUsers = asyncHandler(async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ msg: "ID required" })
    }

    const notes = await Notes.findOne({ user: id }).lean().exec();

    if (notes) {
        return res.status(400).json({ msg: "User has assigned notes!" })
    }

    const user = await User.findById(id).exec();

    if (!user) {
        return res.status(400).json({ msg: "User not found!" });
    }

    await user.deleteOne();

    const message = `Username ${user.username} with an ID: ${user._id} deleted!`;

    res.json({ msg: message });
})


module.exports = {
    getAllUsers,
    createNewUsers,
    updateUsers,
    deleteUsers
}

