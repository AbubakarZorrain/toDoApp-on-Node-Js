const express = require('express')
const { json } = require('express/lib/response')
const app = express()
const fs = require('fs')
const dataPath ='./file.json'  // path to our JSON file
const bodyParser = require("body-parser")
// app.use(express.json()
// middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));



// util functions
const saveAccountData = (data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync(dataPath, stringifyData)
}
const getAccountData = () => {
    const jsonData = fs.readFileSync(dataPath)
    return JSON.parse(jsonData)   
}

app.get('/', (req, res) => {

    res.send('hello world!')
})
app.post('/account/addaccount', (req, res) => {
 
    var existAccounts = getAccountData()
    const newAccountId = Math.floor(100000 + Math.random() * 900000)
 
    existAccounts[newAccountId] = req.body
   
    console.log(existAccounts);
    saveAccountData(existAccounts);
    res.send({success: true, msg: 'account added successfully'})
})
// Read - get all accounts from the json file
app.get('/account/list', (req, res) => {
    const accounts = getAccountData()
    res.send(accounts)
  })
app.put('/account/:id', (req, res) => {
    var existAccounts = getAccountData()
    fs.readFile('file.json', 'utf8', (err, data) => {
      const accountId = req.params['id'];
      existAccounts[accountId] = req.body;
      saveAccountData(existAccounts);
      res.send(`accounts with id ${accountId} has been updated`)
    }, true);
  });

  // delete - using delete method
app.delete('/account/delete/:id', (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
      var existAccounts = getAccountData()
      const userId = req.params['id'];
      delete existAccounts[userId]; 
      saveAccountData(existAccounts);
      res.send(`accounts with id ${userId} has been deleted`)
    }, true);
  })
//configure the server port
app.listen(3000, () => {
    console.log('Server runs on port 3000')
})