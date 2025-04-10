const ws = require('ws')
const mongoose = require('mongoose')
const User = require("./models/user")
const Answer = require("./models/answer");
const answer = require('./models/answer');

// const URL = "mongodb://127.0.0.1:27017";
const URL = "mongodb://127.0.0.1:27017/quiz";

mongoose
	.connect(URL)
	.then(() => console.log(`Connected to MongoDB`))
	.catch((err) => console.log(`DB connection error: ${err}`))


const wss = new ws.Server({
	port: 5000,
}, () => console.log(`server started on 5000`))



const usersArr = [];
let screen = 'start';
let clients = new Set();

wss.on('connection', function connection(ws) {
	clients.add(ws);
	ws.on('close', () => {
		userCount = clients.size;
		clients.delete(ws);

		let message = {
			event: 'clientscount',
			clients: clients.size,
		}

		broadcastMessage(message)
	})

	ws.on('message', function(message) {
		message = JSON.parse(message) // обмен сообщениями происходит в строковом формате
		message.clients = clients.size;
		// screen = message.screen

		console.log(`message => `,message)


		switch (message.event) {
			case 'connection':
				message.screen = screen
				if (!usersArr.includes(message.id)) usersArr.push(message.id)
				broadcastMessage(message)

				User.findOne({ userID: Number(message.id) })
					.then((e) => {
						if(!e) {
							User.create({
									userID: Number(message.id),
									datetime: Date.now()
								})
								// .then(e => console.log(`Добавили пользователя в БД => `,e) )
						}
					})

				break;
			case 'message':
				message.admin == true ? ws.send(JSON.stringify(message)) : broadcastMessage(message)
				break;


			case 'settings':
				screen = message.screen ? message.screen : 'start'
				broadcastMessage(message)
				break;


			case 'answer':
				if(message.admin == true) {
					Answer.create({
						userID: Number(message.id),
						questionID: Number(message.questionID),
						choiceID: Number(message.answerID),
						datetime: Date.now(),
						admin: true
					})
					.then(e => {
						// console.log(`Добавили голос в БД => `,e)
						// message.voting = true
						// ws.send(JSON.stringify(message))
						broadcastMessage(message)
					})
				} else {
					Answer.findOne({userID: Number(message.id), choiceID: Number(message.answerID)})
						.then((e) => {
							if(!e) {
								Answer.create({
										userID: Number(message.id),
										questionID: Number(message.questionID),
										choiceID: Number(message.answerID),
										datetime: Date.now(),
										// datetime: Date.now().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }),
										admin: false
									})
									.then(e => {
										// console.log(`Добавили голос в БД => `,e)
										// message.voting = true
										// ws.send(JSON.stringify(message))
										broadcastMessage(message)
									})
							}
						})

				}
				break;
			case 'checkvoteduser':
				Answer.findOne({userID: message.id, questionID: message.questionID})
					.then(answer => {
						message.voting = answer ? true : false
						message.votingID = answer ? answer.choiceID : false
						ws.send(JSON.stringify(message))
					})
				break;
			case 'checkresult':
				// mongoose.model
				Answer
					.aggregate([
						{$match: {questionID: message.questionID},},
						{$group:{_id: "$choiceID", count: {$sum: 1}}},
						{$sort: {_id: 1}}
						])
					// .aggregate().group( {_id: "$choiceID", count: {$sum: 1}} ).sort({_id: 1})
					.then(results => {
						message.results = results
						let count = 0;
						results.forEach(res => {
							count += res.count
						})
						 console.log(`message.results => `,message.results)


						if(results) {
							if(!message.noBroadcast) broadcastMessage(message)
							// if(message.admin == true) ws.send(JSON.stringify(message))
							// message.admin == true ? ws.send(JSON.stringify(message)) :
							// if (message.adminScreen != screen) {
							// 	ws.send(JSON.stringify(message))
							// }
						}
					})
				// questionID
					break;
			case 'admincheckresult':
				// mongoose.model
				Answer
					.aggregate([
						{$match: {questionID: message.questionID},},
						{$group:{_id: "$choiceID", count: {$sum: 1}}},
						{$sort: {_id: 1}}
						])
					// .aggregate().group( {_id: "$choiceID", count: {$sum: 1}} ).sort({_id: 1})
					.then(results => {
						message.results = results
						let count = 0;
						results.forEach(res => {
							count += res.count
						})
						 console.log(`message.results => `,message.results)


						if(results) {
							ws.send(JSON.stringify(message))
							// message.admin == true ? ws.send(JSON.stringify(message)) :
							// if (message.adminScreen != screen) {
							// 	ws.send(JSON.stringify(message))
							// }
						}
					})
				// questionID
					break;
					case 'countvoted':
						// mongoose.model
						Answer.countDocuments({ admin: false, questionID: message.questionID })
							.then(result => {
								message.countvoted = result ? result : 0;
								ws.send(JSON.stringify(message))
							})

						// questionID
							break;
			case 'clearquestion':
				if(message.admin == true) {
					Answer.deleteMany({questionID: message.questionID})
						.then(e => {
							broadcastMessage(message)
						})
				}

		}

	})

})







// отправим сообщение всем подключенным на данный момент клиентам
function broadcastMessage(message) {
	// console.log(`wss.clients.size => `,wss.clients.size)

	wss.clients.forEach( client => {
		message.users = usersArr;
		message.screen = screen;
		client.send(JSON.stringify(message))
	} )
}