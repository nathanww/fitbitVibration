import document from "document";
import clock from "clock";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import { vibration } from "haptics";
import { me } from "appbit";
import { battery } from "power";
import * as fs from "fs";
import { BodyPresenceSensor } from "body-presence";
const bps = new BodyPresenceSensor();
import * as messaging from "messaging";
const background = document.getElementById("background");
background.style.fill="red";

/*
try {
	let fileBuffer = fs.readFileSync("log.txt", "ascii");
	let data=fileBuffer.split("\n");
	for (let i = 0; i < data.length; i++) { 
	console.log(data[i]);
	}
}
catch (error) {
	let fileBuffer="";
	console.log("Log does not exist");
	
	//if the log does not exist, this is the first day of use, which means that we should 
}
*/
let cycles=0;
let tempFreq=0
let randomFreq=20;
let accumulatedTime=0;
//let OVERHEAD_TIME=21; //additional time for the timer to trigger
let OVERHEAD_TIME=0;
let batWarn = document.getElementById("batWarn");
let myClock = document.getElementById("myClock");
const background = document.getElementById("background");
let vibeMode=0;
let lowLogged=false;
let oldbps="none";
let lastShot=0;

function vibeHires() {
	var foo=0;
	var loops=0;
	var freq=10;
	while (true) {
	console.log("loop "+loops);
	var startTime=Date.now();
	
	vibration.start("confirmation-max");
	console.log("start "+Date.now());
	var loop=true;
	while (loop) {
		console.log(Date.now());
		if (Date.now() > startTime+100) {
			vibration.stop()
			loop=false;
		}
	}
	console.log("stop "+Date.now())
	 loop=true;
	while (loop) {
		console.log(Date.now());
		if (Date.now() > startTime+100) {
			loop=false;
		}
	}
	
	
	loops++;
	}
	
}


function vibe()
{ 
  if (isVibrating) {
    vibration.stop();
  }
  else {
      if (freq > 5) {
        vibration.start("confirmation-max");
      }
    else {
       vibration.start("ring");
    }
   
  }
  isVibrating=!isVibrating;
  if (freq >= 0) {
      clearInterval(timerHandle);
    timerHandle=setInterval(vibe,((1000/freq)/2)-OVERHEAD_TIME);
	
  }
  else {
     clearInterval(timerHandle);
    timerHandle=setInterval(vibe,((1000/randomFreq)/2)-OVERHEAD_TIME);
    accumulatedTime=accumulatedTime+((1000/randomFreq)/2);
    if (accumulatedTime > 10000) {
      accumulatedTime=0;
      randomFreq=Math.floor(Math.random() * (20 - 3) +3);
      console.log(randomFreq);
    }
  }
    

}


function constantVibe()
{ 
vibration.stop();
      vibration.start("confirmation-max");
}
me.appTimeoutEnabled = false; // Disable timeout

let freq=0.5;
let isVibrating=false;
let timerHandle=[];


me.appTimeoutEnabled=false;







//SETS UP CLOCK DISPLAY:
clock.granularity = 'minutes'; // seconds, minutes, hours
clock.ontick = function(evt) {
	
	//check battery 
	if (battery.chargeLevel < 20) {
		batWarn.text="BATTERY LOW";
	}
	else {
		batWarn.text="";
		lowLogged=false;
	}
	if (battery.chargeLevel < 10 && lowLogged==false) {
		lowLogged=true;
	}
	if (bps.present != oldbps) {
		oldbps=bps.present;
	}
	var hours=evt.date.getHours();
	if (hours > 12) {
		hours = hours - 12;
  }
  myClock.text = ("0" + hours).slice(-2) + ":" + ("0" + evt.date.getMinutes()).slice(-2);			  
}

messaging.peerSocket.addEventListener("message", (evt) => {
	background.style.fill="black";
	var result=evt['data'];
	console.log("message:"+result);
  if (result > 0) {
	  freq=evt.data;
	 
	  vibe();
  }
  if (result == -1) {
	  clearInterval(timerHandle);
	  vibration.stop();
	  
  }
  
  if (result == -10) { //do a "one shot" vibration
	  clearInterval(timerHandle);
	  if (Date.now() > lastShot+20000) { //only do it if at least 30 s have elapsed since last triggered
	  vibration.stop();
	  vibration.start("confirmation-max");
	  lastShot=Date.now();
	  }
  }
});

vibeHires();
//me.onunload = closeFile;

//FINISHED SETTING UP CLOCK DISPLAY
//stopVibration();