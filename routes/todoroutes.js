// import express from 'express'
// import getTodos from '../controllers/todoControllers.js'
// import postTodos from "../controllers/todoControllers.js"
// import deleteTodos from "../controllers/todoControllers.js"

const express = require("express");
const { getTodos, postTodos, deleteTodos } = require("../controllers/todoControllers");

const router = express.Router();

router.get("/todos" , getTodos);
router.post("/todos" , postTodos);
router.delete("/todos:id" , deleteTodos);


// export default router;
module.exports = router
