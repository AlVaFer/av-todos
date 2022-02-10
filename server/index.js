'use strict';

const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const bodyParser = require('body-parser');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const paramIdValidator = require('./middleware/id-param-validator').idParamValidator;

const adapter = new FileSync('./data/tasks.json');
const db = low(adapter);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});


app.get('/tasks/', (req, res) => {
  const { pageCount, pageNumber } = req.query;
  if (pageCount && pageNumber) {
    const endIndex = pageCount * pageNumber;
    const startIndex = endIndex - pageCount;
    const rangeOfTasks = db.get('tasks')
      .slice()
      .reverse()
      .slice(startIndex, endIndex)
      .value();
    return res.status(200).json(rangeOfTasks);
  }

  const tasks = db.get('tasks').value();
  return res.status(200).json(tasks);
});


app.get('/tasks/total', (req, res) => {
  const tasksTotal = db.get('tasks').size().value();
  return res.status(200).json(tasksTotal);
});


app.get('/task/:id', paramIdValidator, (req, res) => {
  const taskId = req.params.id;
  const task = db.get('tasks').find({ id: taskId }).value();

  if (task) {
    return res.status(200).json(task);
  }

  return res.status(404).json({
    message: 'Tareas no encontradas',
  });
});


app.put('/task/update/:id', paramIdValidator, (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const taskId = req.params.id;
  const task = db.get('tasks').find({ id: taskId });

  const taskUpdated = () => {
    res.status(200).json({
      message: 'Tarea actualizada',
    });
    io.emit('taskUpdates', 'task-edited');
  };

  if (task) {
    const updatedTask = task.assign({ title, description }).write();
    return updatedTask
      ? taskUpdated()
      : res.status(500).json({
        message: 'Internal server error',
      });
  }

  return res.status(404).json({
    message: 'Not found',
  });
});


app.post('/task/create', (req, res) => {
  const tasks = db.get('tasks');
  const lastItem = tasks.last(1).value();
  const newTaskId = lastItem ? parseInt(lastItem.id, 10) + 1 : 1;
  const newTask = {
    id: (newTaskId).toString(),
    title: req.body.title,
    description: req.body.description
  };
  const createdTask = tasks.push(newTask).write();

  const taskCreated = () => {
    res.status(201).json({
      message: 'Tarea creada',
    });
    io.emit('taskUpdates', 'task-created');
  };

  return createdTask.length > 0
    ? taskCreated()
    : res.status(500).json({
      message: 'Internal server error',
    });
});


app.delete('/task/delete/:id', paramIdValidator, (req, res) => {
  const taskId = req.params.id;
  const tasks = db.get('tasks');
  const task = tasks.find({ id: taskId });

  if (task) {
    const removedTask = tasks.remove({ id: taskId }).write();

    const taskDeleted = () => {
      res.status(200).json({
        message: 'Tarea borrada',
      });
      io.emit('taskUpdates', 'task-deleted');
    };

    return removedTask.length > 0
      ? taskDeleted()
      : res.status(500).json({
        message: 'Internal server error',
      });
  }

  return res.status(404).json({
    message: 'Not found',
  });
});

server.listen(9001, () => {
  process.stdout.write('The server is available on http://localhost:9001/\n');
});
