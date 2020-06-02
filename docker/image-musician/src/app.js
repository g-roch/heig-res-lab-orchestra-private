const { v4: uuidv4} = require('uuid')
var dgram = require('dgram')
var server = dgram.createSocket('udp4')
var mcast_addr = '230.185.192.108'
var port = 2204
var uuid = uuidv4()
var instrument = ""
var sound = ""
instrument = process.argv[2]
switch(instrument) {
	case "piano":
		sound = "ti-ta-ti"
		break
	case "trumpet":
		sound = "pouet"
		break
	case "flute":
		sound = "trulu"
		break
	case "violin":
		sound = "gzi-gzi"
		break
	case "drum":
		sound = "boum-boum"
		break
	default:
		instrument = "piano"
		sound = "ti-ta-ti"
		break
}
var message = uuid+":"+instrument+":"+sound
server.bind(port, function() {
	server.setBroadcast(true)
	server.setMulticastTTL(128)
	server.addMembership(mcast_addr)
})

setInterval(broadcastNew, 1000)

function broadcastNew() {
	server.send(message, 0, message.length, port, mcast_addr)
	console.log("Sent "+message+" to the hall")
}
