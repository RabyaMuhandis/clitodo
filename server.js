// import readline from 'readline'
// import express from 'express'
// import connectDB from './config/dbconfig.js';

// const app = express();
// app.use(express.json());

// connectDB();
// app.listen(3000, () => {
//     console.log('Server chal raha hai port 3000 par');
// });

// const rl = readline.createInterface({
//     // reading and writing data
//     input:process.stdin,
//     output:process.stdout
// })

// const todos =[];
// const showMenu = () => {
//     console.log('\n1. kam add kreyie');
//     console.log(' 2 : kam dekhna hy ');
//     console.log('3 : band kro yr');

//     rl.question('Apna option chunein: ', handleInput);
// }
// const handleInput = (option) => {
// if(option === '1'){
//     rl.question('Apna kam likhein: ', (todo) => {
//         todos.push(todo);
//         console.log(`"${todo}" kam list mein shamil kar diya gaya hai.`);
//         showMenu();
//     });
// }
// else if(option === '2'){
//     console.log('\nApke tamam kam:');
//     todos.forEach((todo, index) => {
//         console.log(`${index + 1}. ${todo}`);
//     });
//     showMenu();
// }
// else if(option === '3'){
//     //exit the app
//     console.log('App band ki ja rahi hai. Khuda hafiz!');
//     rl.close();
// }
// else{
//     console.log('Ghalat option. Barah-e-karam dobara koshish karein.');
//     showMenu();
// }

// }
// showMenu()



import readline from 'readline';
import express from 'express';
import connectDB from './config/dbconfig.js';
import Todo from './model/taskmodel.js';

const app = express();
app.use(express.json());

// Database se connect karein
connectDB();

// REST API Routes
app.get('/api/todos', async (req, res) => {
    try {
        const todos = await Todo.find().sort({ createdAt: -1 });
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/todos', async (req, res) => {
    try {
        const todo = new Todo({
            text: req.body.text
        });
        const savedTodo = await todo.save();
        res.status(201).json(savedTodo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/api/todos/:id', async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.json({ message: 'Todo delete ho gaya' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server chal raha hai port 3000 par');
});

// CLI Interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const showMenu = () => {
    console.log('\n1. kam add kreyie');
    console.log('2. kam dekhna hy');
    console.log('3. kam delete kreyie');
    console.log('4. band kro yr');

    rl.question('Apna option chunein: ', handleInput);
};

const handleInput = async (option) => {
    if (option === '1') {
        rl.question('Apna kam likhein: ', async (todoText) => {
            try {
                const todo = new Todo({ text: todoText });
                await todo.save();
                console.log(`"${todoText}" kam database mein shamil kar diya gaya hai.`);
            } catch (error) {
                console.log('Error:', error.message);
            }
            showMenu();
        });
    } else if (option === '2') {
        try {
            const todos = await Todo.find();
            console.log('\nApke tamam kam (Database se):');
            if (todos.length === 0) {
                console.log('Koi kam nahi hai.');
            } else {
                todos.forEach((todo, index) => {
                    console.log(`${index + 1}. ${todo.text} (ID: ${todo._id})`);
                });
            }
        } catch (error) {
            console.log('Error:', error.message);
        }
        showMenu();
    } else if (option === '3') {
        try {
            const todos = await Todo.find();
            if (todos.length === 0) {
                console.log('Koi kam nahi hai delete karne ke liye.');
                showMenu();
                return;
            }
            
            console.log('\nKam list:');
            todos.forEach((todo, index) => {
                console.log(`${index + 1}. ${todo.text}`);
            });
            
            rl.question('Kis number ka kam delete karna hai? ', async (num) => {
                const index = parseInt(num) - 1;
                if (index >= 0 && index < todos.length) {
                    await Todo.findByIdAndDelete(todos[index]._id);
                    console.log('Kam delete ho gaya!');
                } else {
                    console.log('Ghalat number!');
                }
                showMenu();
            });
        } catch (error) {
            console.log('Error:', error.message);
            showMenu();
        }
    } else if (option === '4') {
        console.log('App band ki ja rahi hai. Khuda hafiz!');
        rl.close();
        process.exit(0);
    } else {
        console.log('Ghalat option. Barah-e-karam dobara koshish karein.');
        showMenu();
    }
};

showMenu();