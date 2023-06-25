const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

let filePath = path.join(__dirname+("/fileDataBase.json"));

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
        if(!(i === index)) newTodoList.push(arr[i]);
    }
    return newTodoList;
}

// Routes

// Getting todoList
app.get('/todos', (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if(err){
            res.send(err);
        }
        res.json(JSON.parse(data));
    });
})

// Getting todos by ID
app.get('/todos/:id', (req, res) => {
    let id = req.params.id;

    fs.readFile(filePath, 'utf8', (err, data) => {
        if(err) throw err;
        var parsedData = JSON.parse(data);
        let index = getIndex(parsedData, id);
        if(index === -1){
            res.status(404).send("Not Found");
        }else{
            res.status(200).json(parsedData[index]);
        }
    });
});

// Creating a todoList using Post
app.post('/todos', (req, res) => {
    let newTodo = {
        id:Math.floor(Math.random()*1000000),
        title:req.body.title,
        description: req.body.description
    }

    fs.readFile(filePath, 'utf8', (err, data) => {
        if(err) throw err;
        var parsedData = JSON.parse(data);
        parsedData.push(newTodo);

        fs.writeFile(filePath, JSON.stringify(parsedData), 'utf8', (err) => {
            if(err) throw err;
            res.status(201).json(newTodo);
        });
    });
});

// Deleting an todo using delete
app.delete('/todos/:id', (req, res) => {
    let id = req.params.id;

    fs.readFile(filePath, 'utf8', (err, data) => {
        if(err) throw err;

        let parsedData = JSON.parse(data);
        let index = getIndex(parsedData, id);

        if(index === -1){
            res.status(404).send("Not Found");
        }else{
            parsedData = deleteAtIndex(parsedData, index);
            fs.writeFile(filePath, JSON.stringify(parsedData), 'utf8', (err) => {
                if(err) throw err;
                res.status(200).json(parsedData);
            });
        }
    });
});

app.get('/', (req, res) => {
    res.sendFile(filePath);
})

app.use((req, res) => {
    res.status(404).send('Page Not Found');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});