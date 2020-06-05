var dgram = require('dgram')
var client = dgram.createSocket('udp4')
var mcast_addr = '230.185.192.108'
var port = 2204

var data = {}

client.on('listening', function () {
	var address = client.address()
	console.log("UDP Client listening on " + address.address + ":"+ + address.port)
	client.setBroadcast(true)
	client.setMulticastTTL(128)
	client.addMembership(mcast_addr)
})

client.on('message', function(message, remote) {
	var elems = String(message).split(':')
	if (elems[0] in data) {
		data[elems[0]]['instrument'] = elems[1]
		data[elems[0]]['activeLast'] = new Date()
	} else {
		data[elems[0]] = {
			uuid: elems[0],
			instrument: elems[1],
			activeSince: new Date(),
			activeLast: new Date(),
		}
	}
	console.log("MCast msg from : "+remote.address+":"+remote.port+" - "+message)
})

client.bind(port)

var net = require('net')
var server = net.createServer( function(socket) {
	var d = []
	for (let [uuid, val] of Object.entries(data)) {
		if (new Date() - val['activeLast'] < 1000 * 5) {
			var v = val
			d.push({
				uuid: val['uuid'],
				instrument: val['instrument'],
				activeSince: val['activeSince'],
			})
		} else {
			delete data[uuid]
		}
	}
	socket.write(JSON.stringify(d))
	socket.end()
});
server.listen(2205)
