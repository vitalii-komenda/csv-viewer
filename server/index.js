const express = require('express')
const UsersService = require('./services/users-service')
const app = express()
const fileUpload = require('express-fileupload');
const json = require('express-json');
const fs = require('fs')


app.set('views', './server/views')
app.set('view engine', 'pug')
app.use(fileUpload())
app.use(json())
app.use('/spa', express.static('spa'))

app.get('/', function (req, res) {
  res.render('index.pug', { title: 'CSV viewer'})
})

app.post('/search', function (req, res) {
    const data = UsersService.search(req.body.query);
    res.json({results: data});
})

app.get('/info', function (req, res) {
    const isEmpty = UsersService.isEmpty();
    res.json({isCsvImported: isEmpty});
})

app.post('/import', function (req, res) {
  if (!req.files) {
    res.json({error: "No files were uploaded"});
    return;
  }
  req.files.file.mv('./uploads/data.csv', function (err) {
    if (err) {
      res.json({error: err});
    }
    else {
      res.json({result: 'File uploaded!'});
      // async parsing
      UsersService.parse('uploads/data.csv').then(()=>{
        console.log("File parsed");
      }).catch((err)=>{
        console.error("File parsing error", err);
      })
    }
  });
})



app.listen(3000, function () {
  console.log('CSV viewer listening on port 3000!')
})