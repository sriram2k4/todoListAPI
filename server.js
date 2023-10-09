const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());
let todoList = [];

// Functions
function getIndex(arr, id) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === parseInt(id)) return i;
    }
    return -1;
}

function deleteAtIndex(arr, index) {
    let newTodoList = [];
    for (let i = 0; i < arr.length; i++) {
        if (!(i === index)) newTodoList.push(arr[i]);
    }
    return newTodoList;
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
})

// Getting todoList
app.get('/todos', (req, res) => {
    res.json(todoList);
})

// Getting todos by ID
app.get('/todos/:id', (req, res) => {
    let id = req.params.id;
    let index = getIndex(todoList, id);

    if (index === -1) {
        res.status(404).send("Not Found");
    } else {
        res.status(200).json(todoList[index]);
    }
});

// Creating a todoList using Post
app.post('/todos', (req, res) => {
    let newTodo = {
        id: Math.floor(Math.random() * 1000000),
        title: req.body.title,
        description: req.body.description
    }
    todoList.push(newTodo);
    res.status(201).json(newTodo);
});

// Deleting an todo using delete
app.delete('/todos/:id', (req, res) => {
    let id = req.params.id;
    let index = getIndex(todoList, id);

    if (index === -1) {
        res.status(404).send("Not Found");
    } else {
        todoList = deleteAtIndex(todoList, index);
        res.status(200).send(todoList);
    }
});

// Deleting all todos
app.delete("/alltodos", (req, res) => {
    todoList = [];
    res.status(200).send(todoList);
});

app.use((req, res) => {
    res.status(404).send('Page Not Found');
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});