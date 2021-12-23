const express = require('express');
const http = require ('http');
const device = require('express-device');
const socketio = require ('socket.io');

//const popup = require('popups');

const qr = require("qrcode");
const ip = require("ip");
const opn = require('open');

qr.toFile("src/public/qrcode.png", ip.address() + ":8080", { width: 1000 });

const SCALE_FACTOR = 0.9;

let app = express ();
app.use(device.capture());
//app.set("view engine", "png");
app.use(express.static('src/public'));

app.get ('/', (req, res) => {
    if(!"DESKTOP".localeCompare(req.device.type.toUpperCase())) {
        res.sendFile (process.cwd() + '/src/public/code.html');
    } else {
        res.sendFile (process.cwd() + '/src/public/controller.html');
    }
});

const server = http.createServer (app);
const io = socketio(server);

this.clients = [];

//setup mouse server
var spawn = require('child_process').spawn;
var mouse_server = spawn('./src/cmove', [], {interactive:true});
mouse_server.stdin.setEncoding = 'utf-8';
mouse_server.stdout.pipe(process.stdout);

mouse_server.stdout.on('data', data => {
    console.log(`Got some data : ${data}`)
  })
  
  mouse_server.stderr.on('data', data => {
    console.log(`Got some error : ${data}`)
  })

io.on ('connection', function (client) { 
    console.log("client connected.");
    
    client.on('p', msg => {
        let cmd = "m " + Math.floor(msg.x * SCALE_FACTOR) + " " + Math.floor(msg.y * SCALE_FACTOR) + "\n";
        //console.log(cmd)
        mouse_server.stdin.cork();
        mouse_server.stdin.write(cmd);
        mouse_server.stdin.uncork();
    });

    client.on('c', msg => {
        mouse_server.stdin.write("c\n");
    });

    client.on('r', msg => {
        mouse_server.stdin.write("r\n");
    })

    client.on('k', key => {
        mouse_server.stdin.write("k " + key + "\n");
    });

});

process.on('SIGINT', function(){process.exit()})

server.on("error", (err)=>{console.log ("Server error: ", err);})
server.listen (8080, ()=> {console.log ("Server started on " + ip.address() + ":8080");});

opn('http://localhost:8080')