const { v4: uuidv4} = require('uuid')
var dgram = require('dgram')
var server = dgram.createSocket('udp4')
var mcast_addr = '230.185.192.108'
var port = 2204
var uuid = uuidv4()
var instrument = ""
var sound = ""
instrument = process.argv[2]
const instrumentMap = {
	'piano':'ti-ta-ti',
	'trumpet':'pouet',
	'flute':'flute',
	'violin':'gzi-gzi',
	'drum':'boum-boum'
}
sound = instrumentMap[instrument];
var message = uuid+":"+instrument+":"+sound
server.bind(port, function() {

	server.setMulticastTTL(128)
	server.addMembership(mcast_addr)
})

setInterval(broadcastNew, 1000)

function broadcastNew() {
	server.send(message, 0, message.length, port, mcast_addr)
	console.log("Sent "+message+" to the hall")
}
