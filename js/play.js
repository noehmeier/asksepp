window.onload = function () {
    window.logtext = [];
    window.currenttime = 0;

    // Get a reference to the local "service"
    window.msf.local(function(err, service) {
        if (err) {
            console.log('msf.local error: ' + err);
            return;
        }
        // Create a reference to a communication "channel"
        var channel = service.channel('asksepp');
        window.channel = channel;

        // Connect to the channel
        channel.connect(function (err) {
            if(err) return console.error(err);
            console.log('You are connected');
        });

        // Add a message listener. This is where you will receive messages from mobile devices
        channel.on('getTimeRequest', function(msg, from){
            console.log('getTimeRequest request incoming');
            var actualSceneData = new Object();
            actualSceneData['time'] = window.currenttime;
            actualSceneData['series'] = window.series_title;
            var jsonActualSceneData = JSON.stringify(actualSceneData);
            window.channel.publish('getTimeResponse', jsonActualSceneData);
        });
     
        // Add a listener for when another client connects, such as a mobile device
        channel.on('clientConnect', function(client){
            console.log('client connected');
        });
    });

    document.addEventListener( 'keyup', debug );
    document.addEventListener('keydown', function(e) { 
    	// Back
    	if(e.keyCode == 37) {
    		window.location.href = 'index.html';
    	}
    	console.log(e.keyCode);
    });
    var url_not_available = 'http://vod-level3-psd-progressive.p7s1digital.de/notice/new/not_available_de_640x360.mp4?token=01~~~31343538333936363930~3836343030~0-562304853786eb86d47478dde&ts=1458396690&access_token=s2s_7hack&video=';
    window.url = url_not_available;
    $.getJSON("http://api.7hack.de/v1/videos/4210590?apikey=QIBGG0KX&selection={id,titles{default},images%28subType:%22Teaser,Cover%20Big%22%29{url,subType}}", function(data) {
    	window.series_title = data.response.titles['default'];
    });
    
    $.ajax({
        type: 'GET',
        url: 'http://api.7hack.de/v1/videos/4210590/url?apikey=QIBGG0KX&format=mp4',
        dataType: 'json',
        success: function(data) { 
        	window.data = data;
        	console.log(data);
        	if(window.data.response != null) {
        		window.url = window.data.response.sources['0']['url'];
        		console.log(window.url);
        	}
        },
        data: {},
        async: false
    });
    
    
    var listener = {
        oncurrentplaytime: getCurrentPlayTime
    }
    
    var url = window.url;
   var video = webapis.avplay.open(url);
    // 1920x1080 is fullsize
    webapis.avplay.setDisplayRect(0, 0, 1920, 1080);
    webapis.avplay.setListener(listener);
    webapis.avplay.prepareAsync(play, error);
};


function debug() {
	console.log(window.logtext);
}

function play() {
    webapis.avplay.play();
    webapis.avplay.jumpForward(360000);
    window.logtext.push('play prepare successfully');
}

function getCurrentPlayTime(currenttime) {
	currenttimeX = currenttime / 1000;
	window.currenttime = Math.round(currenttimeX);
	console.log('current time in s: ' + window.currenttime);
}

function listError() {
	window.logtext.push('play prepare failed');
}

function error() {
    window.logtext.push('general error');
}