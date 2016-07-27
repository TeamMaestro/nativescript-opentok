# Nativescript OpenTok

A Nativescript plugin for the OpenTok iOS and (coming soon Android) SDK.

OpenTok: https://tokbox.com/developer/

## Getting Started

### Requirements
-  API Key with OpenTok. [Get one here](https://dashboard.tokbox.com/signups/new).
-  Ability to generate a valid session id (either through OpenTok account or back-end service)
-  Ability to generate a valid token (either through OpenTok account or back-end service)
-  Opentok.framework requires projects to be built for only armv7 (device); i386 (simulator), armv6, armv7s, and arm64 are not supported.

### Installation
Node Package Manager (NPM)

`npm install nativescript-opentok --save`

### Integration
Import OpenTok nativescript plugin into your Nativescript page (i.e. main-page.ts)
```
import {TNSOTSession} from 'nativescript-opentok';
```
Instantiate the OpenTok class and initialize using your API key and session id. Connect using a valid token and publish to the page you want to append the video stream to. 
```
this.session = new TNSOTSession('API_KEY');
this.session.create(this.getSessionID()).then((result) => {
    this.session.connect(this.getToken()).then((result) => {
        this.session.publish(100, 100, 100, 100);
    }, (err) => {
        console.log('Error connecting');
    });
}, (err) => {});
this._session.instance().sessionEvents.on('sessionDidConnect',  (eventData) => {
    console.log('sessionDidConnect', eventData);
});

private getSessionID() {
    return '';// session id string
}

private getToken() {
    return '';// token string
}
```

### Images

# <img src="http://i.imgur.com/PxyZEFX.jpg" />

### Notes
- Publishing is not supported in the Simulator because it does not have access to your webcam.
- `TNS` stands for **T**elerik **N**ative**S**cript

### References
- https://github.com/thepatrick/Opentok-HelloWorld-Swift
- https://github.com/EddyVerbruggen/nativescript-barcodescanner (Android camera access code)
