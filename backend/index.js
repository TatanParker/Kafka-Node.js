'use strict'


/*MONGO CONFIG*/

var url = 'mongodb://localhost:27017/nodekafka';
var options = {useNewUrlParser: true, useUnifiedTopology: true};

var mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect(url, options)
.then(() => {
	console.log('Conexion hecha de puta madre');
})


/*create schema*/
var Schema = mongoose.Schema;
var MessageSchema = Schema({message : String});
var MessageModel = mongoose.model('MessageModel', MessageSchema );



/*KAFKA CONFIG*/

const kafka = require('kafka-node');
 
const client = new kafka.KafkaClient({kafkaHost: '127.0.0.1:9092'});
 
/* Consumidor */
var consumer = new kafka.Consumer(client, [ { topic: 'test' } ]);
consumer.on('message', function (message) {
        console.log(message);
    });

/* Productor */

var producer = new kafka.Producer(client);
var counter;
producer.on('ready', function () {
 	counter = 0;
 	var message;
    setInterval(function(i) {
    	counter=counter+5;
    	message = "Mensaje automático cada 5 seg. Total: "+counter+" seg.";

        producer.send( [ { topic: "test", messages: message } ], function (err,data) {} );


        var mongomessage = new MessageModel();
        mongomessage.message = message;
        mongomessage.save((err,messageStored) => {
        	console.log('message saved');
        })


        }, 5000);
 
 
    });







 
