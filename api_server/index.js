var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var request = require('superagent');
var request = require('request');
var db = require('./db');

//open server
server.listen(3001);
console.log('Listening on port 3001...');
app.get('/', function(req, res) {
  res.send('Hello Seattle\n');
});

io.on('connection', function (socket) {
  io.emit('this', { will: 'be received by everyone'});

  socket.on('get_friends', function (data) {
    db.query('SELECT * FROM friends', function(err, results){
        if(err){ console.log('there has been an error !!')};
        else {
          console.log(results);
          socket.emit('send_friends', results);
        }
    });
    //socket.emit('send_friends', );
  });

  socket.on('disconnect', function () {
    io.emit('user disconnected');
  });
  
});

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "-" + month + "-" + day;

}

app.get('/make_payment/:payer_id/:merchant_id/:amount', function(req, res) {
   var requestJson = {
  		"merchant_id": req.params.merchant_id,
  		"medium": "balance",
  		"purchase_date": getDateTime(),
  		"amount": Number(req.params.amount),
  		"status": "pending",
  		"description": "string"
	}
	//make payment
	request.post({
  		headers: {'content-type' : 'application/json'},
  		url:     'http://api.reimaginebanking.com/accounts/'+ req.params.payer_id +'/purchases?key=861704f6d70baf3cb968b49f6f4c9ef5',
  		body:   JSON.stringify(requestJson)
		}, function(error, response, body){
  			res.send(body);
		});
});

app.get('/make_transfer/:contributor/:payee/:amount', function(req, res){
	var requestJson = {
  		"medium": "balance",
  		"payee_id": req.params.payee,
  		"amount": Number(req.params.amount),
  		"transaction_date": getDateTime(),
  		"status": "pending",
  		"description": "string"
	}
	request.post({
		headers: {'content-type' : 'application/json'},
		url:     'http://api.reimaginebanking.com/accounts/'+ req.params.contributor +'/transfers?key=861704f6d70baf3cb968b49f6f4c9ef5',
		body:    JSON.stringify(requestJson)
	},function(error, response, body){
		res.send(body);
	});
});


//res.json({"employees":[
//    	{"firstName":req.params.name, "lastName":"Doe"},
//   	{"firstName":"Anna", "lastName":"Smith"},
//    	{"firstName":"Peter", "lastName":"Jones"}
//	]});
