const net = require('net');
var fs = require('fs');
var http = require('http');
var qs       = require('querystring');
var url = require('url');
var httpreponsestream = require('stream');
var buffer = require('buffer')

 console.log = console.error;
const split_host_port = require('./lib/split_host_port.js');
const tunnelUtil = require('./lib/tunnel.js');

var myWstream = fs.createWriteStream('datas.txt');
var myRstream = fs.createReadStream('datas.txt');

 	const EOF_CODE = '\n'
var debugging = 0;
 
var regex_hostport = /^([^:]+)(:([0-9]+))?$/;
 
function getHostPortFromString( hostString, defaultPort ) {
  var host = hostString;
  var port = defaultPort;
 
  var result = regex_hostport.exec( hostString );
  if ( result != null ) {
    host = result[1];
    if ( result[2] != null ) {
      port = result[3];
    }
  }
 
  return( [ host, port ] );
}
 
// handle a HTTP proxy request


function httpUserRequest( userRequest, userResponse ) {
  if ( debugging ) {
    console.log( '  > request: %s', userRequest.url );
  }
  userRequest.setMaxListeners(200);
  
  var httpVersion = userRequest['httpVersion'];
  var hostport = getHostPortFromString( userRequest.headers['host'], 80 );
 
  // have to extract the path from the requested URL
  var path = userRequest.url;
  result = /^[a-zA-Z]+:\/\/[^\/]+(\/.*)?$/.exec( userRequest.url );
  if ( result ) {
    if ( result[1].length > 0 ) {
      path = result[1];
    } else {
      path = "/";
    }
  }
 
  var options = {
    'host': hostport[0],
    'port': hostport[1],
    'method': userRequest.method,
    'path': path,
    'agent': userRequest.agent,
    'auth': userRequest.auth,
    'headers': userRequest.headers,

  };
 
  if ( debugging ) {
    console.log( '  > options: %s', JSON.stringify( options, null, 2 ) );
  }
 
   	 	 myWstream.write("\r\n<br><br> -----> in  Normal proxy question  <br><br>");
		  myWstream.write(JSON.stringify( options, null, 2 ));
				 
				 
				 
 
 if  (  hostport[0]== "http.00.s.sophosxl.net")
	{console.log( ' ignore ::::::::::::::::::::::::::::::::::::::'+hostport[0])
	 userResponse.end();
	 return;
	}
 if  (  hostport[0]== "www.google-analytics.com")
	{console.log( ' ignore ::::::::::::::::::::::::::::::::::::::'+hostport[0])
	 userResponse.end();
	 return;
	}
 
 
  var proxyRequest = http.request(
    options,
    function ( proxyResponse ) {
      if ( debugging ) {
        console.log( '  > request headers: %s', JSON.stringify( options['headers'], null, 2 ) );
      }
 
      if ( debugging ) {
        console.log( '  < response %d headers: %s', proxyResponse.statusCode, JSON.stringify( proxyResponse.headers, null, 2 ) );
      }
 
      userResponse.writeHead(
        proxyResponse.statusCode,
        proxyResponse.headers
      );
 
      proxyResponse.on(
        'data',
        function (chunk) {
          if ( debugging ) {
            console.log( '  < chunk = %d bytes', chunk.length );
          }
          userResponse.write( chunk );
		  
		  		  
		  	 	 myWstream.write("\r\n<br><br>  > Norma proxyResponse data  <br><br>");
		  	 	 myWstream.write(chunk);
				 
        }
      );
 
      proxyResponse.on(
        'end',
        function () {
          if ( debugging ) {
            console.log( '  < END' );
			 	 	 myWstream.write("\r\n<br><br>  > Norma proxyResponse < END  <br><br>");
          }
          userResponse.end();
        }
      );
    }
  );
 
  proxyRequest.on(
    'error',
    function ( error ) {
      userResponse.writeHead( 500 );
      userResponse.write(
        "<h1>500 Error</h1>\r\n" +
        "<p>Error was <pre>" + error + "</pre></p>\r\n" +
        "</body></html>\r\n"
      );
      userResponse.end();
    }
  );
 
  userRequest.addListener(
    'data',
    function (chunk) {
      if ( debugging ) {
        console.log( '  > chunk = %d bytes', chunk.length );
      }
      proxyRequest.write( chunk );
	  		  		  
		  	 	 myWstream.write("\r\n<br><br>  > Norma  userRequest proxyRequest.write  <br><br>");
		  	 	 myWstream.write(chunk);

				 
    }
  );
 
  userRequest.addListener(
    'end',
    function () {
      proxyRequest.end();
	  	 	 myWstream.write("\r\n<br><br>  > Norma addListener END  <br><br>");
    }
  );
}
 
 

 
function main() {




		

		
  var port = 4444; // default port if none on command line
 var domaine="rooter-188023.appspot.com";
	
	  // check for any command line arguments
  for ( var argn = 2; argn < process.argv.length; argn++ ) {
    if ( process.argv[argn] === '-p' ) {
      port = parseInt( process.argv[argn + 1] );
      argn++;
      continue;
    }

    if ( process.argv[argn] === '-m' ) {
      domaine =  process.argv[argn + 1] ;
	  console.log("req domaine is:"+domaine);
	  argn++;
      continue;
    }
 
    if ( process.argv[argn] === '-d' ) {
      debugging = 1;
      continue;
    }
  }
   
       tunnelUtil.setdebug(myWstream);

  
 // localAddress= "rooter-188023.appspot.com";
 //  localAddress= "8080-dot-2986899-dot-devshell.appspot.com";
  
 localAddress= "localhost"; 
   localPorto = process.env.PORT || 8080 ;
   localPort= parseInt(localPorto)
   localPort2=  5001
   
  console.log('Using parameters ' + JSON.stringify({localAddress, localPort,domaine}, null, '    '));
 

  net.createServer(tunnel => {
    const tag = `[Tunnel~[${tunnel.remoteAddress}]:${tunnel.remotePort}] `;
    console.log(`${tag}Connected from tun [${tunnel.remoteAddress}]:${tunnel.remotePort}`);
  
  
    tunnelUtil.init_mux_tunnel(tunnel, tag, /*isTunnelServer:*/true, myWstream);

	    setInterval( function ()  {
                          tunnelUtil.tunnel_list(tunnel,0)           
                                     }, 3000)
																			  
	}).listen({host: localAddress, port: localPort2}, function () {
 	
     console.log(`local net Listening at [${this.address().address}]:${this.address().port}`);
  }).on('error', e => console.log('' + e));

  
 
	  
  
   // comm montante 
var tablelist = new Object();


let mrealStream=null		
	
  // local server
let  recbody= new Uint8Array() ;// Buffer.alloc(0)
let lgbody=0;

var recbody1=""

var curread=9999999
 
let updata = new Uint8Array(); //
let indata = new Uint8Array(); //

		
var		lastvo=0
var 	leninc=0
	
var order=0;
var orderread=1;		
var server = http.createServer(function(request, response) {
		
		  server.setMaxListeners(2000); 
		  

	
	if (request.method === 'GET') {
		
				
			response.writeHead(200 )
				
	
	//	myRstream.pipe ( response)
	
		     response.write("<html>\r\n<body>\r\n" )
	
			fs.readFile( 'datas.txt' , function (error,content)
			{
			if (error)
						console.log("read error  ")
			else
			{response.write(content);
				response.write("<body></html>\r\n" )
	
				response.end();	
			 fs.truncate( 'datas.txt', function (error,content){} )
	
			}
			});
			


			
		
		 
			
	}
	
if (request.method === 'POST') {
 //		console.log("POST ")
			
			var body= new Uint8Array(); //	
		var parsedBody =  url.parse(request.url).pathname;
	

	 
	    request.on('data', function (data) {           // from web
		 if (body.length>0)
					body = Buffer.concat([body , data] );
				 else
					 body=data
				 
				 
		//	body +=data;          
		});

	
		request.on('end', function (data) {

		if ( parsedBody == "/reset")
			{	console.log(" reset  ")
				response.writeHead(200, {'Content-Type': 'octet-stream' , 		})
				response.end();
			
				var mt= "\r\n<br>!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!<br>reset";
		  	 	 myWstream.write(mt );
	
	
	
				curread=1
  	
				 for (var key in tablelist)   
					{ 
					delete tablelist[key];
					}
	
						
			}
			
		else
			if ( parsedBody == "/")
			{
				
				console.log(" get log  ")
				response.writeHead(200, {'Content-Type': 'octet-stream' , 

				 'Transfer-encoding': 'chunked',
   
   
				'Connection': 'close'
				});
 	
	
			response (myRstream.pipe(response ))
			response.end();	
			
		
			} 
		else		
			{
				
				if ( parsedBody == "/longpool")
				{
	
	
				response.writeHead(200, {'Content-Type': 'octet-stream' , 
				'Content-length': recbody.length,
				'Connection': 'close'
				});
 	
					
				var lg=0
				let min=99999999
				 while ( recbody.length   ) 
					 {
					 if (recbody.length > 0 && recbody.slice(0, 4) != '::::') {
								console.log("\r\n \r\n-----------reject ::")
								console.log(recbody.slice(0, 50))
								return
							}

				//	console.log(recbody.slice(0, 10))
					let n = '' + recbody.slice(4, 20)
					let y = n.split(' ');
					let v = 0
					v = parseInt(y[0], 10);

					var 	curo = parseInt(y[1], 10);
					
					if (curo < min)
						min= curo
					
					
			//	if  (curo> orderread+1)
		//	{console.log("ship block :"+curo+ " cur="+orderread)
		//			return
		//		}
		
	//	console.log("curo"+curo)
					orderread=curo

					let pos = 1 + recbody.indexOf('!');

			  
					let chunkdebuttot = recbody.slice(0,pos+v)
					let chunkdebut = recbody.slice(pos,pos+v)

					recbody = recbody.slice(pos+v)            //reste
	

				   let base64data = chunkdebuttot;
				
					response.write(base64data);
					
					lg=lg+ base64data.length
					
		/*			if (lg>32000)
					{
									console.log("lg:"+ lg + "min " +min+ "-"+curo)

				response.end();
						return;
					}*/
			
					 }
					 
				delete  recbody
				recbody=  new Uint8Array();//Buffer.alloc(0);	
				lgbody=0;
				if (lg!=0)
				{//			console.log("lg:"+ lg + " "+curo)
				var mt= "\r\n<br><br> lg :"+ lg + " <br><br>";
		  	 	 myWstream.write(mt );
				}	 
		
				response.end();
			
						
				}
				else
				{
				
				response.writeHead(200, {'Content-Type': 'octet-stream' , 
				'Content-length': 0,
				'Connection': 'close'
				});
				response.end()
					
	
			if (leninc==0)
				{
				// recupere longeur attendu
				let n = '' + body.slice(0, 20)
				
				let n1 =  n.split('\n');
				var n2 =  n1[0].split(' ');	
		
				  leninc = parseInt(n2[1], 10);
			
				console.log( " ")
				console.log( "------------------------------- ")
				console.log( " len data is : "+leninc  + " order:"+n2[0] )
				}
				
		//	 indata=body
			 
			if (body.length) {
				var chunkb = Buffer(body, 'binary')
	          
				  if (indata.length>0)
					indata = Buffer.concat([indata , chunkb] );
				 else
					 indata=chunkb
				  }
				  
			if (indata.length < leninc)
				return;
			else
				leninc=0;
			
		
		//			console.log( " raw data is : ["+ indata.slice(0,25)+"]" )

			// recupere sequence
			var pos = indata.indexOf(EOF_CODE);
	
			let n1 = ''+ indata.slice(0,pos)
		    var n2 =  n1.split(' ');	
	
	        var vo  = parseInt(n2[0], 10);
			
	//				console.log( " pos is : "+pos +  " vo:"+vo  )
	
			// payload
			let n22 = ''+ indata.slice(pos+1)
			
			
				indata=''
		//	let ch = new Buffer.from(n22, 'base64')
		  let ch  =   Buffer.from(n22,'base64');
		  
				
			
			updata=	ch
			console.log( " data is : "+  updata.slice(0,11) )
				
			 body=""
			if ( updata.slice(0, 2)  != "F1" )
					{
					console.log( " error data is : "+ updata.slice(0, 1) )
						return
					}
		
	
	//		console.log("!!!!!!vo ["+vo+"]" );

	//		console.log("!!!!!!");
			
			var er= "vo ["+  vo+  "]"  
		    myWstream.write(er);
				
				
			if (vo != lastvo+1)
			{
//				console.log("  errrrrrreeeeuuuurrrrr        vo ["+vo+"]" + lastvo  );
					
//				var er1= "  errrrrrreeeeuuuurrrrr        vo ["+  vo+  "]" + lastvo 
//				myWstream.write(er1);
			}
			
			lastvo=vo;
			
			if (vo < curread  &&  vo !=0)
				{curread=vo
  			    console.log("init at nbelement:"+vo);
				var er= "init at nbelement:"+vo
				myWstream.write(er);

				 for (var key in tablelist)   
					{ 
					delete tablelist[key];
					}
							
				}
				tablelist[vo] =updata 
			
	
			 for (var key in tablelist)   
					{ 
					if (key == curread  ||  key ==0)
						{
			            console.log(" key" +key + " "+ curread) 

							 updata=tablelist[curread];
							delete tablelist[curread];
							 // console.log("pop:"+curread);
				
							if (key != 0)
							curread++
						
						}	
					else
						{  console.log(" wait " +curread);
					
						var er= "<br> wait " +curread
					//	if  (key >  curread+20)
					//		curread=curread+1
						
						myWstream.write(er);

					continue
						}
			
				if (updata.length >0)
					{
						//		console.log("in<<<<<<<<<<<<<<<<<<<<<<<<<in data "+ Buffer.byteLength(updata).toString()+  "("+ body.length+")")
			
					var er= "<div>in -data----------------------------- "+ Buffer.byteLength(updata).toString(16)+ " " +Buffer.byteLength(updata).toString(10) +  "("+ body.length+")</div>" 
					myWstream.write(er);
					}
				 
			 
				body=""
					
				if  (mrealStream)
					{
					 myWstream.write("-writedirect");

					mrealStream.write(updata);
					updata=""
				
					}
				else
					if (mrealStream==null)
						{
						 myWstream.write("-mrealStream null-");
		
						mrealStream = net.connect(  localPort2, () => {
					
								var er= "<div>write -connect------ "+ Buffer.byteLength(updata).toString(16)+ " " +Buffer.byteLength(updata).toString(10) +  "("+ body.length+")</div>" 
					
								 myWstream.write(er);

							
								mrealStream.write(updata);
								updata=""
								response.end();
								
								mrealStream.on("data" ,(buf) =>             // from tunnel
									{
										
										order=order+1 
									  let base64data =  Buffer(buf).toString('base64');
									  lgbody=base64data.length
									//	recbody +=buf;
									let entete="::::"+lgbody+" "+order+" !";
									  let buf1= Buffer(entete,'binary')
									
									 let buf2= Buffer(base64data,'binary')							
									
										 var pack=Buffer.concat([buf1 , buf2] );
										if (recbody.length==0 )
											recbody= pack;
										else
											recbody= Buffer.concat([recbody , pack] );
											 
										// 	console.log('bufer'+pack.length+" "+buf2.length)
										
								//				myWstream.write(buf);
									})
				
			
								} );
						}	
					
					}

					
				}	 
			}
				
			
		});
	
			
	}
	
});

server.listen(localPort);
console.log("Server http  is listening at:"+localPort);

	 
  
 
 
 
 

  if ( debugging ) {
    console.log( 'server proxis listening on port ' + port );
  }
  
 
  // start HTTP server with custom request handler callback function
  var server = http.createServer( httpUserRequest ).listen(port);
 
  // add handler for HTTPS (which issues a CONNECT to the proxy)
  server.addListener(
    'connect',
    function ( request, socketRequest, bodyhead ) {
      var url = request['url'];
      var httpVersion = request['httpVersion'];
 

 
      var hostport = getHostPortFromString( url, 443 );
 
   //   if ( debugging )
        console.log( '  = will connect to %s:%s', hostport[0], hostport[1] );
 
 
 		var tc= '<br><br> < server will connect to'+hostport[0]+ " " +hostport[1]
        myWstream.write(tc)

		
      if  ( hostport[0] == "www.google-analytics.com")
		  {console.log( ' ignore ssl ::::::::::::::::::::::::::::::::::::::'+hostport[0])
	  socketRequest.end();
	 return;
	}
	
	
 
      // set up TCP connection
      var proxySocket = new net.Socket();
      proxySocket.connect(
        parseInt( hostport[1] ), hostport[0],
        function () {
    //      if ( debugging )
            console.log( ' server < connected to %s/%s', hostport[0], hostport[1] );
 
          if ( debugging )
            console.log( ' server > writing head of length %d', bodyhead.length );
 
		var tc= '<br><br> < connected to'+hostport[0]+ " " +hostport[1]
        myWstream.write(tc)
 
        myWstream.write(bodyhead)
 
          proxySocket.write( bodyhead );
 
          // tell the caller the connection was successfully established
          socketRequest.write( "HTTP/" + httpVersion + " 200 Connection established\r\n\r\n" );

		  myWstream.write("<br><br>HTTP/" + httpVersion + " 200 Connection established\r\n\r\n<br><br>")
 
 
        }
      );
 
      proxySocket.on(
        'data',
        function ( chunk ) {
			
						 
   //       if ( debugging )
  //          console.log( '  < data length = %d', chunk.length );
     
	 myWstream.write("\r\n<br><br> proxySocket chunk\r\n<br><br>");
	 myWstream.write(chunk)
	 
          socketRequest.write( chunk );
        }
      );
 
      proxySocket.on(
        'end',
        function () {
          if ( debugging )
            console.log( '  < end' );
 
          socketRequest.end();
		  
		 	 myWstream.write("\r\n<br><br> < proxySocket.end\r\n<br><br>");

			 
        }
      );
 
      socketRequest.on(
        'data',
        function ( chunk ) {
          if ( debugging )
            console.log( '  > data length = %d', chunk.length );
 /*
 					 console.log( '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<socketRequest buf ' + chunk.length ) 
					 console.log(  chunk ) 
					 console.log( '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<fin buf '  ) 
					console.log( '')
					console.log( '')
	*/				 
 
          proxySocket.write( chunk );
		  
		  var t= "<br><br>  socketRequest.data in"  +  chunk.length + " <br><br>"
		  	 	 myWstream.write(t);
		  	 	 myWstream.write(chunk);

        }
      );
 
      socketRequest.on(
        'end',
        function () {
          if ( debugging )
            console.log( '  > end' );
		
		
 		 	 myWstream.write("\r\n<br><br>  > socketRequest.end  <br><br> ");

          proxySocket.end();
        }
      );
 
      proxySocket.on(
        'error',
        function ( err ) {
        	     console.log( '  proxySocket error %s', err );
 
          socketRequest.write( "HTTP/" + httpVersion + " 500 Connection error1\r\n\r\n" );
          if ( debugging ) {
            console.log( '  < ERR: %s', err );
			
			var er=' \r\n<br><br> < proxySocket.ERR:'+ err + "<br><br>" 
			 myWstream.write(er);

						 
          }
         socketRequest.end();  // rmove for test
        }
      );
 
      socketRequest.on(
        'error',
        function ( err ) {
          if ( debugging ) {
            console.log( '  > ERR: %s', err );
       console.log( ' socketRequest error %s', err );
		var er=' \r\n<br><br> < socketRequest.ERR:'+err + "<br><br>" 
			 myWstream.write(er);

          }
          proxySocket.end();
        }
      );
    }
  ); // HTTPS connect listener
  
  
}
 
 
 
 
 
 
main();