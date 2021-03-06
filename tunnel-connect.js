'use strict';

/*
node tunnel-connect.js 127.0.0.1:8080 forward 127.0.0.1:1111 127.0.0.1:4444

node tunnel-connect.js rooter-188023.appspot.com:80 forward 127.0.0.1:1111 127.0.0.1:4444

node tunnel-connect.js enigmatic-shore-89928.herokuapp.com:80 forward dev72-pafil.msc.tiama.priv:1111 127.0.0.1:4444


forward 127.0.0.1:22 127.0.0.1:22
forward dev71-pafil.msc.tiama.priv:22 ftp.phpnet.org:22
forward dev71-pafil.msc.tiama.priv:21 ftp.phpnet.org:21
forward dev71-pafil.msc.tiama.priv:20 ftp.phpnet.org:20
forward dev71-pafil:1111 127.0.0.1:4444
*/

const net = require('net'),
    dns = require('dns'),
    readline = require('readline'),
    util = require('util');

var http = require('http');
var qs = require('querystring');
var url = require('url');

var lint = 0
var requestpend=0

var fs = require('fs');
//var myWstream = fs.createWriteStream('dataclient.txt');

var buffin = new Uint8Array(); //

const EOF_CODE = '\n'

console.log = console.error;
const split_host_port = require('./lib/split_host_port.js');
const tunnelUtil = require('./lib/tunnel.js');

function show_usage() {
    console.log('Create a TCP tunnel for TCP port forwarding/reversing.');
    console.log('Usage:');
    console.log('  tunnel.js connect [host:]port [-source [localAddress:]port] ...');
    console.log('Note:');
    console.log('  IPv6 address must be wrapped by square brackets, e.g. [::1]:8080');
    show_usage_tunnel_instruction();
    process.exit(1);
}

function show_usage_tunnel_instruction() {
    console.log('You can input instructions from arguments or standard input:');
    console.log('  forward [localAddress:]port [destHOST:]PORT');
    console.log('  reverse [localADDRESS:]PORT [destHost:]port');
    console.log('You can input instructions from arguments or standard input:');
    console.log('  end-forward [[localAddress:]port]');
    console.log('  end-reverse [[localADDRESS:]PORT]');
    console.log('  list');
    console.log('Notes:');
    console.log('  Uppercase args just means they are in sense of the tunnel server.');
    console.log('  IPv6 address must be wrapped by square brackets, e.g. [::1]:8080');
}
var server = 1



function randNameElite()  {
  var pairs = "..lexegezacebiso"
              "usesarmaindirea."
              "eratenberalaveti"
              "edorquanteisrion";
  
  var pair1 = 2 * Math.floor(Math.random() * (pairs.length / 2));
  var pair2 = 2 * Math.floor(Math.random() * (pairs.length / 2));
  var pair3 = 2 * Math.floor(Math.random() * (pairs.length / 2));
  var pair4 = 2 * Math.floor(Math.random() * (pairs.length / 2));

  var name = "";
  name += pairs.substr(pair1, 2);
  name += pairs.substr(pair2, 2);
  name += pairs.substr(pair3, 2);
  name += pairs.substr(pair4, 2);
  name = name.replace(/[.]/g, "");
  
  return name;
} // randNameElite



var tlocalsrv
var thost 
var tport

 var ftpool = function( ) {
	
			var name= "/l-"+ randNameElite()+  "/mycloud/"+randNameElite()

			
                    push_http(tlocalsrv, thost, tport, name);
					console.log("pending:"+ requestpend + " name:" + name);
					
					if (requestpend>10) 
						
					 setTimeout( ftpool , 2000)
				 else
					 setTimeout( ftpool , 250)
					 
                }
				
				

function main(args) {
    if (!args.length || args[0] === '--help') return show_usage();
    let [host, port] = split_host_port(args.shift());
    if (!port) return show_usage();
    if (port != split_host_port.port_s) return console.log('invalid port: ' + split_host_port.port_s);

    let localAddress, localPort;
    if (args[0] === '-source') {
        args.shift();
        if (!args.length) return show_usage();
        [localAddress, localPort] = split_host_port(args.shift());
        if (localPort != split_host_port.port_s) return console.log('invalid port: ' + split_host_port.port_s);
    }
    console.log('Using parameters ' + JSON.stringify({
        host,
        port,
        localAddress,
        localPort
    }, null, '    '));

    fs.truncate('dataclient.txt', function(error, content) {})

    resolve_address(localAddress, localAddress => {

        // local server
        net.createServer(localsrv => {
            var a

            server = server + 1
            for (a = 0; a < 1; a += 1) {

                push_http(localsrv, host, port, "/reset");
                lint = 0;
            }

            setTimeout(function() {

                for (a = 0; a < 20; a += 1)
					{

                    push_http(localsrv, host, port, "F1#" + a.toString(16) + "\t-\t0\t0\n");
						}
						
						tlocalsrv=localsrv 
						thost =host
						tport=port
                setTimeout( ftpool , 250)


                localsrv.on('data', buf => {
                  

                    if (buf.length > 0)
                        buffin = Buffer.concat([buffin, buf]);
                    else
                        buffin = buf

                    				console.log("<<<<:::::::::::::::::::::::::::::::::::ser= "+server+" : "  +  buffin.slice( 0,12) )

                    while (buffin.length) {
                        var pos = buffin.indexOf(EOF_CODE);
                        let n1 = '' + buffin.slice(0, pos)

                        n1 = n1.split('\t');
 
                        var leninc
                        if (n1[2] == "127.0.0.1"  ||  n1[2] =="ftp.phpnet.org"  )
                            leninc = 0
                        else
                            leninc = parseInt(n1[2], 16);

                        console.log("\r\n lg " + leninc + " buflen  " + (buffin.length - pos - 1))

                        if (leninc > buffin.length - pos - 1 || buffin.length < 11) {
                            console.log("\r\n !!!!!!!!!!!!!!!! atttend  ")
                            return;
                        }

                        if (leninc == 0) {
                            push_http(localsrv, host, port, buffin.slice(0, pos + 1));

                        } else
                            push_http(localsrv, host, port, buffin.slice(0, leninc + pos + 1));

                        buffin = buffin.slice(leninc + pos + 1)
      //                  console.log("\r\n rest  " + buffin.length + " pos:" + pos + "  :" + buffin.slice(0, 5))
                        if (buffin.length > 0 && buffin.slice(0, 1) != 'F') {
                            console.log("\r\n!!!!!!!!!!!!!!!!!!stop!!!!!!!!!!!!!!!!!!!!!!")
                            return;

                        }

                    }

                })

            }, 1000);

        }).listen({
            host: "127.0.0.1",
            port: 9999
        }, function() {
            console.log(`local server Listening at [${this.address().address}]:${this.address().port}`);

        }).on('error', e => console.log('' + e));

        //     tunnelUtil.setdebug(myWstream);
        // connect au server local qui fera unt comm http

        let tunnel = net.connect(9999, "127.0.0.1", () => {
                console.log(`Connected ici to [${tunnel.remoteAddress}]:${tunnel.remotePort} source [${tunnel.localAddress}]:${tunnel.localPort}`)

            }

        );
        tunnel.on('close', () => process.exit(0));

        console.log("init stream ")
        //	myWstream.write("init");

        tunnelUtil.init_mux_tunnel(tunnel, "client", host);

        while (args.length && run_tunnel_instruction(tunnel, args)) {}
        readline.createInterface({
            input: process.stdin
        }).on('line', line => {
            run_tunnel_instruction(tunnel, line.trim().split(/\s+/));
        });
    });

    //initial connect  

}

function run_tunnel_instruction(tunnel, args) {
    if (!args.length) return false;
    let instruction = args.shift();
    switch (instruction) {
        case 't':
            tunnelUtil.tunnel_list(tunnel, 0)
            return true;
        case 'forward':
        case 'reverse':
            {
                if (args.length < 2) break;
                let [localAddress, localPort] = split_host_port(args.shift());
                if (localPort != split_host_port.port_s) return (console.log('invalid port: ' + split_host_port.port_s), false);
                let [destHost, destPort] = split_host_port(args.shift());
                if (!destPort) break;
                if (destPort != split_host_port.port_s) return (console.log('invalid port: ' + split_host_port.port_s), false);

                if (instruction === 'forward') {
                    tunnelUtil.create_forwarder_listener(tunnel, localAddress, localPort, destHost, destPort);
                } else {
                    console.log('Request peer to create forwarder ' + JSON.stringify({
                        localAddress,
                        localPort,
                        destHost,
                        destPort
                    }, null, '    '));
                    tunnel.write(`\tforward\t${localAddress}\t${localPort}\t${destHost}\t${destPort}\n`);
                }
                return true;
            }
        case 'end-forward':
        case 'end-reverse':
            {
                let [localAddress, localPort] = split_host_port(args.shift() || '');
                if (localPort != split_host_port.port_s) return (console.log('invalid port: ' + split_host_port.port_s), false);

                if (instruction === 'end-forward') {
                    tunnelUtil.end_forwarder_listener(tunnel, localAddress, localPort);
                } else {
                    console.log('Request peer to end forwarder ' + JSON.stringify({
                        localAddress,
                        localPort
                    }, null, '    '));
                    tunnel.write(`\tend-forward\t${localAddress}\t${localPort}\n`);
                }
                return true;
            }
        case 'list':
            {
                for (let forwarderId in tunnel._listenerMap) {
                    console.log('Forwarder: ' + util.inspect(tunnel._listenerMap[forwarderId].info, {
                        breakLength: Infinity
                    }))
                }
                for (let forwarderId in tunnel._targetMap) {
                    console.log('Reverser:  ' + util.inspect(tunnel._targetMap[forwarderId].info, {
                        breakLength: Infinity
                    }))
                }
                return true;
            }
        case '?':
        case 'help':
            show_usage_tunnel_instruction();
            return true;
    }
    console.log('Invalid tunnel instruction. To see help, input ?');
    return false;
}

function resolve_address(host, on_complete) {
    if (!host || net.isIP(host)) return on_complete(host);
    dns.lookup(host, (e, address) => {
        if (e) console.log('failed to get IP. ' + e);
        on_complete(address);
    });
}

main(process.argv.slice(2)); //script args is start from the 3rd.

var tablelist = new Object();

let indata = new Uint8Array(); // 
var curp = 0;
var flagdo = 0;
let last = 0;

var req = 0

var curread = 9999999

function push_http(localsrv, host, port, senddata) {
    req++;


    var senddata1 = senddata; //encodeURIComponent(senddata)

    var path = "/scope";

    if (senddata == "/")
        path = senddata;

    let base64data = new Buffer(senddata1).toString('base64');
    var len1 = ''

    if (senddata.slice(0,2) == "/l" || senddata == "/reset")
        path = senddata;
    else {

		requestpend=0
		
        lint = lint + 1
        var len1 = lint + " " + base64data.length + "\n"

        let n = '' + senddata.slice(0, 20)
        let y = n.split(':');

        var curo = parseInt(y[1], 16);

        if (senddata.slice(0, 1) != 'F') {
            console.log('       >>>>err send [' + senddata.slice(0, 2) + '] total:' + curo);
            return -1
        } else
            console.log('        >>>>http send [' + senddata.slice(0, 11) + '] total:' + curo);

    }

    var options = {
        port: port,
        hostname: host,
        path: path,
        method: 'POST',
        headers: {
            'Connection': 'keep-alive',
            'Content-Type': 'octet-stream',
            'Content-Transfer-Encoding': 'base64',
            'Cache-Control': 'no-cache',
            'Cache-Control': 'no-store',
            'Cache-Control': 'must-revalidate',
            //		 'Transfer-encoding': 'chunked',
            'Content-Length': Buffer.byteLength(base64data) + len1.length,
            //                   'Connection': 'close'                         
        }
    };
    //  console.log(" try to send http "+host+" port:" +port + " data= {"+senddata1+"}   localsrv: "+localsrv);

    var tunnelhttp = http.request(options, (res) => {
        res.setEncoding(null);

        let chunckin = ''

        res.on('end', () => {

            let chunk = chunckin
            chunckin = ''

            if (chunk.length) {
                console.log("\r\n  \r\n--------------------------------------in in in in:" + chunk.length)
				requestpend=0
            }
			else
				requestpend=requestpend+1;
				
			
            while (chunk.length) {

                if (chunk.length > 0 && chunk.slice(0, 4) != '::::') {
                    console.log("\r\n \r\n-----------reject ::")
                    //		myWstream.write("\r\n \r\n:::::::::chunkr::::::::::::::::::::::::::::::::::::::::::::reject ::");
                    //		myWstream.write(chunk);
                    console.log(chunk)
                    return 0
                }

                //			console.log(chunk.slice(0, 50))
                let n = '' + chunk.slice(4, 20)
                let y = n.split(' ');
                let v = 0
                v = parseInt(y[0], 10);
                var vo = parseInt(y[1], 10);
                console.log("[" + vo + "]");
                let pos = 1 + chunk.indexOf('!');

                let chunkdebut = chunk.slice(pos, pos + v)
                chunk = chunk.slice(pos + v) //reste

                //		console.log("["+req+"] in" + (pos+v) + " "+ chunkdebut.length + " v:" + chunk.length)

                if (chunkdebut.length != v) {
                    console.log(" ereur" + chunkdebut.length + " v:" + v)
                    process.exit(1)
                }

                tablelist[vo] = chunkdebut
                //		  console.log("push:"+vo);

                if (vo < curread) {
                    curread = vo
                    console.log("init at nbelement:" + vo);
                }
            }

            for (var key in tablelist) {
                if (key == curread) {
                    var chunkdebut = tablelist[curread];
                    delete tablelist[curread];
                    // console.log("pop:"+curread);
                    curread++

                } else
                    continue

                if (chunkdebut.length) {
					
				
                    var chunkb = Buffer.from(chunkdebut, 'base64')
                    //          indata = indata + chunkb;

                    if (indata.length > 0)
                        indata = Buffer.concat([indata, chunkb]);
                    else
                        indata = chunkb

                    if (indata.length > 0) {
                        let updata1
                        updata1 = indata 

                        let chunkr = Buffer(chunkdebut, 'base64')

                        if (chunkr[0] != 70 && flagdo == 0) {
                            console.log("\r\n \r\n:::::::::::::::::::::::::::::::::::::::::::::::::::::reject ::" + chunkr[0])
                            console.log("rej:" + updata1.slice(0, 100))
                            return 0
                        }

                        if (flagdo == 1) {
                             updata1 = updata1.slice(curp);
                         }

                        flagdo = 0;

							
                        while (updata1.length) {

                            let pos = updata1.indexOf(EOF_CODE);

                            if (updata1[0] != 70) //F
                            {
                                console.log("erreur!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!:" + updata1[0]);
                                console.log("erreur:" + '{' + updata1.slice(0, 11) + "}")
                                //console.log ("txt:"+updata1)

                                process.exit(1)
                            }

                            let n = '' + updata1.slice(0, pos)
                            let y = n.split('\t');
                            let v = 0
                            v = parseInt(y[2], 16);

                            //                           console.log( updata1.length + '{'  + updata1.slice(0,12)+"}" ) 

                            if (pos + v + 1 <= updata1.length && pos != -1) {
                                localsrv.write(updata1.slice(0, pos + v + 1));

							
								
                                curp = curp + pos + v + 1

                                var updata2 = updata1.slice(pos + v + 1)
  
                                updata1 = updata2
                            } else {

                                //       indata=""
                                flagdo = 1

                                break
                            }

                            if (updata1.length == 0) { //console.log( "fin ")
                                indata = indata.slice(0, 0)
                                curp = 0;
  
                                break;

                            } 
                        }

                    }

                }

            } //while top	 

            if (Object.keys(tablelist).length)
                console.log("wait for " + curread + "nbelement:" + Object.keys(tablelist).length)

            /*		
			        setTimeout(function() {
                push_http(localsrv, host, port, "/longpool");
            }, 100)
		*/

        });

        res.on('data', (chunck) => {
            chunckin = chunckin + chunck
        })

    });

    tunnelhttp.on('error', (chunk) => {
        console.log('err :' + chunk)
        // console.log( 'err :' +chunk ) 
        /*				        setTimeout(function() {
                push_http(localsrv, host, port, "/longpool");
            }, 300)
		*/

    });

    tunnelhttp.on('close', () => {
			
	
        return 0;
    });

    //         console.log( '***** http send to remote ');

    tunnelhttp.write(len1);
    tunnelhttp.write(base64data);

    tunnelhttp.end();
    return 0;
}