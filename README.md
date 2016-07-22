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
import {OpenTok} from 'nativescript-opentok';
```
Instantiate the OpenTok class and initialize using your API key and session id. Connect using a valid token and publish to the page you want to append the video stream to. 
```
export function pageLoaded(args: observable.EventData) {

    var page = <pages.Page>args.object;
    
    var openTok = new OpenTok();
    openTok.init('API_KEY', 'SESSION_ID', page.ios);
    openTok.doConnect('TOKEN');
    openTok.doPublish();
}
```

### Images

![alt text](resources/example.png "Example OpenTok ")

### Notes
- Publishing is not supported in the Simulator because it does not have access to your webcam.

### References
- https://github.com/thepatrick/Opentok-HelloWorld-Swift
- https://github.com/EddyVerbruggen/nativescript-barcodescanner (Android camera access code)
