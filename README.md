LiveCanvas
==========

Real time white board using WebSockets and node.js

Refresh

P2P - O(N2)

Server maintains list of clients connected.
Each client also has the list of other clients

Server Side - 
When new client joins, 
	Server sends the new client to existing client and updates the list of client copy
	server provides the list of clients

When client leaves
	Server gets the connection close event. Update own copy 
	Send update to the other clients(May be clients get the events so no need to send)

Client Side-

Join -
	Recieve the list of clients 
	Open the sockets to these clients.

New Client - 
	Add the updated client. (Check for duplicate and self)

Client Left
	- Delete the client

SendMessage - 
	Extend the existing logic to Clients[]

Receive -
	Extend the existing logic to Clients[]





