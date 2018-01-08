this is an Ack from tunnel.js  + proxis.js
Combine an http tunnel and remote proxis 
all requests are performed in http, so it will bypass most stick firewall.

support https request.

use:

server:
-------
node tunnel-connect.js XXXXXXXXX:80 forward 127.0.0.1:1111 127.0.0.1:4444
with XXXXXXXXX=your server address or name


client (run localy on your pc)
-------
node prx.js -p 4444


your browser 
-----------
set proxy use to  port 1111


from your browser you can use a debug file
open 
http:XXXXXXXXX/debugon


http:XXXXXXXXX/debugoff
