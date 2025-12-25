
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
let cachedDb = null;

const connectDB = async () => {
    if (cachedDb) {
        return cachedDb;
    }
    
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        cachedDb = db;
        console.log('MongoDB connected');
        return db;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};

// Todo Schema (yahan directly define kar rahe hain)
const todoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Todo = mongoose.models.Todo || mongoose.model('Todo', todoSchema);

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Todo API chal raha hai!' });
});

app.get('/api/todos', async (req, res) => {
    try {
        await connectDB();
        const todos = await Todo.find().sort({ createdAt: -1 });
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/todos', async (req, res) => {
    try {
        await connectDB();
        const todo = new Todo({
            text: req.body.text
        });
        const savedTodo = await todo.save();
        res.status(201).json(savedTodo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/api/todos/:id', async (req, res) => {
    try {
        await connectDB();
        const todo = await Todo.findByIdAndUpdate(
            req.params.id,
            {
                text: req.body.text,
                completed: req.body.completed
            },
            { new: true }
        );
        if (!todo) {
            return res.status(404).json({ message: 'Todo nahi mila' });
        }
        res.json(todo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/api/todos/:id', async (req, res) => {
    try {
        await connectDB();
        const todo = await Todo.findByIdAndDelete(req.params.id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo nahi mila' });
        }
        res.json({ message: 'Todo delete ho gaya', deletedTodo: todo });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Vercel ke liye export
export default app;