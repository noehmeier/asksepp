window.onload = function () {
    // TODO:: Do your initialization job
    window.logtext = [];

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
        channel.on('fireMissile', function(msg, from){
            console.log(from.attributes.name + ' says, ' + msg);
            if(msg == 'testText') {
                console.log('testText request incoming');
                window.channel.publish('getTime', 'DumyTime xx.xx.xx');
            }
        });
     
        // Add a listener for when another client connects, such as a mobile device
        channel.on('clientConnect', function(client){
            console.log('client connected');
        });
    });

    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName == "back")
	try {
	    tizen.application.getCurrentApplication().exit();
	} catch (ignore) {
	}
    });
    document.addEventListener( 'keyup', debug );
    document.addEventListener( 'keydown', setFocusElement );
};

function debug() {
	console.log(window.logtext);
}