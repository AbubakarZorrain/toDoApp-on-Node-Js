const express = require('express');
const app = express();
const fs = require('fs');
const dataPath = './file.json';
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');
const hbs = require('express-handlebars');
app.engine('hbs', hbs({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
	secret: 'verygoodsecret',
	resave: false,
	saveUninitialized: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



// util functions
const saveAccountData = (data) => {
	const stringifyData = JSON.stringify(data);
	fs.writeFileSync(dataPath, stringifyData);
};
const getAccountData = () => {
	const jsonData = fs.readFileSync(dataPath);
	return JSON.parse(jsonData);
};
app.get('/login', (req, res) => {
	res.render('index');
});
app.get('/', (req, res) => {
  var existAccounts = getAccountData();
  console.log(existAccounts.task);
  res.render('index', {existAccounts: existAccounts});
});
app.post('/addtodo', (req, res) => {
	try {
		var existAccounts = getAccountData();
		const newAccountId = Math.floor(100000 + Math.random() * 900000);

		existAccounts[newAccountId] = req.body;

		saveAccountData(existAccounts);
		// send message to client
		res.render('index', { message: 'Todo added successfully' });
		// res.send({ success: true, msg: 'account added successfully' });
	} catch (error) {
		res.send(error);
	}
});
// Read - get all accounts from the json file
app.get('/alltodo', (req, res) => {
	const accounts = getAccountData();
	res.send(accounts);
});
app.put('/updatetodo/:id', (req, res) => {
	var existAccounts = getAccountData();
	fs.readFile('file.json', 'utf8', () => {
		const accountId = req.params.id;
		existAccounts[accountId] = req.body;
		saveAccountData(existAccounts);
		res.send(`accounts with id ${accountId} has been updated`);
	}, true);
});

// delete - using delete method
app.delete('/todo/delete/:id', (req, res) => {
	fs.readFile(dataPath, 'utf8', () => {
		var existAccounts = getAccountData();
		const userId = req.params['id'];
		delete existAccounts[userId];
		saveAccountData(existAccounts);
		res.send(`accounts with id ${userId} has been deleted`);
	}, true);
});
//configure the server port
app.listen(3000, () => {
	console.log('Server runs on port 3000');
});