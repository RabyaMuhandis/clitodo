// import Todo from "../model/taskmodel.js"
// import connectDB from "../config/dbconfig.js";
const Todo = require("../model/taskmodel")
const connectDB= require("../config/dbconfig")
// Routes
// app.get('/', (req, res) => {
//     res.json({ message: 'Todo API chal raha hai!' });
// });


const getTodos = async(req , res)=>{
  try {
        // await connectDB();
        const todos = await Todo.find().sort({ createdAt: -1 });
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
// app.get('/api/todos', async (req, res) => {
//     try {
//         await connectDB();
//         const todos = await Todo.find().sort({ createdAt: -1 });
//         res.json(todos);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });


const postTodos = async(req, res)=>{
      try {
        // await connectDB();
        const todo = new Todo({
            text: req.body.text
        });
        const savedTodo = await todo.save();
        res.status(201).json(savedTodo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
// app.post('/api/todos', async (req, res) => {
//     try {
//         await connectDB();
//         const todo = new Todo({
//             text: req.body.text
//         });
//         const savedTodo = await todo.save();
//         res.status(201).json(savedTodo);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// });

// app.put('/api/todos/:id', async (req, res) => {
//     try {
//         await connectDB();
//         const todo = await Todo.findByIdAndUpdate(
//             req.params.id,
//             {
//                 text: req.body.text,
//                 completed: req.body.completed
//             },
//             { new: true }
//         );
//         if (!todo) {
//             return res.status(404).json({ message: 'Todo nahi mila' });
//         }
//         res.json(todo);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// });

const deleteTodos = async(req, res)=>{
       try {
        // await connectDB();
        const todo = await Todo.findByIdAndDelete(req.params.id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo nahi mila' });
        }
        res.json({ message: 'Todo delete ho gaya', deletedTodo: todo });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
// app.delete('/api/todos/:id', a
// sync (req, res) => {
//     try {
//         await connectDB();
//         const todo = await Todo.findByIdAndDelete(req.params.id);
//         if (!todo) {
//             return res.status(404).json({ message: 'Todo nahi mila' });
//         }
//         res.json({ message: 'Todo delete ho gaya', deletedTodo: todo });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });
// app.listen(3000, () => {
//     console.log('Server is running on port 3000');
// });


// export default  {getTodos, postTodos,deleteTodos}
module.exports = {
    getTodos,
    postTodos,
    deleteTodos
}