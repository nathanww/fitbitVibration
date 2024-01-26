import { me as companion } from "companion"
import { peerSocket } from "messaging";
const intervalID = setInterval(pingServer, 1000);

function pingServer() {
	console.log("pinging");
const url = "https://biostream-1024.appspot.com/getps?user=vibration"
let fetchInit = {method: 'GET'}
/*
fetch(url, fetchInit)
  .then(function(response) {
    if (response.ok) {
      response.text().then((text)=> {
		  console.log("result:"+text);
	  if (text.indexOf("data") == -1) { //this is real data and not the "no data" placeholder
		  peerSocket.send(parseInt(text));
	  }
	  else {
		  peerSocket.send(-100);
	  }
});
	  
	  
    } else {
      response.text().then(text => console.log(`Server response: not OK (${text})`))
	  peerSocket.send(-200);
    }
  })
  .catch(function(err) {
    console.log(`fetch error (${err}).`)
	peerSocket.send(-200);
  })
}*/


fetch(url, fetchInit)
  .then(function(response) {
    if (response.ok) {
      response.text().then(function(value) {
		  console.log("server:"+value);
		  if (value.indexOf("data") == -1) { //this is real data and not the "no data" placeholder
		  peerSocket.send(parseInt(value));
		}
		else {
		  //peerSocket.send(-100);
		}
		});
    }
  })
  .catch(function(err) {
    console.log(`fetch error (${err}).`)
  })
  }