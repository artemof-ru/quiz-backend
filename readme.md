db.users.insert({
	userID: 0,
	login: "admin",
	pass: "JEx83-FSOe",
	selectScreen: "start"
})

db.users.findOne({userID: 0})

db.questions.insertMany([
	{questionID: 1, title: "Какого цвета ленту перерезать?"},
	{questionID: 2, title: "Какие ноты в аромате вы чувствуете?"},
	{questionID: 3, title: "Какой плейлист сыграть?"},
	{questionID: 4, title: "Что вам понравилось больше всего в новом офисе?"},
])

db.choices.insertMany([
	{choiceID: 1, questionID: 1, title: "Синюю"},
	{choiceID: 2, questionID: 1, title: "Оранжевую"},
	{choiceID: 3, questionID: 2, title: "Персик"},
	{choiceID: 4, questionID: 2, title: "Маракуйя"},
	{choiceID: 5, questionID: 2, title: "Смородина"},
	{choiceID: 6, questionID: 2, title: "Цветы"},
	{choiceID: 7, questionID: 3, title: "Новогодний"},
	{choiceID: 8, questionID: 3, title: "Рабочий"},
	{choiceID: 9, questionID: 4, title: "Слушать приятную музыку"},
	{choiceID: 10, questionID: 4, title: "Ощущать вкус"},
	{choiceID: 11, questionID: 4, title: "Любоваться интерьером"},
	{choiceID: 12, questionID: 4, title: "Прикасаться к дизайнерским текстурам"},
	{choiceID: 13, questionID: 4, title: "Чувствовать аромат"},
	{choiceID: 14, questionID: 4, title: "Экономить время"},
	{choiceID: 15, questionID: 4, title: "Абсолютно всё"},
])