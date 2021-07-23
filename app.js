const express = require('express');
const app = express();
var server = require('http').createServer(app);
const io = require("socket.io")(server)
const port = 3000
const simu = require('./simu/simulator');
const mongoConnect = require('./mongodb/mongo');
const adminRoutes = require('./mongodb/mongofetch');
const CarsRoutes = require('./routes/cards');
const KafkaConsumer = require('./Kafka/kafkaConsume');

//------------ kafka------------
const kafka = require('./Kafka/kafkaProduce');
const bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//------------

app.set('view engine', 'ejs');
app.use(express.static("public"));

app.get('/', (req, res) => res.send("<a href='/bigml'>Send</a> <br/><a href=''>View</a>"));
app.get('/bigml', (req, res) => res.render('./pages/BigML'));
app.use(CarsRoutes);

//{title:card.section},{Number_of_cars:card.Number_of_cars},{Precent_of_cars:card.Precent_of_cars}
app.use('/fetch', adminRoutes.fetchAll);

//------------ Socket.io ----------------
io.on("connection", (socket) => {
    console.log("new user connected");
    // socket.on("totalWaitingCalls", (msg) => { console.log(msg.totalWaiting) });
    socket.on("callDetails", (msg) => { console.log(msg);kafka.publish(msg) });
});



//------------------- kafka -----------
/* Kafka Producer Configuration */
//const myProducer = require('./simulator');
//myProducer.GenerateData(kafka);
//
//const client1 = new kafka.KafkaClient({kafkaHost: "localhost:9092"});





//------------------------------------

server.listen(port, () => console.log(`Ariel app listening at http://localhost:${port}`));


