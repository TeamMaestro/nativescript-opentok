# Nativescript OpenTok

[![npm](https://img.shields.io/npm/v/nativescript-opentok.svg?maxAge=2592000?style=plastic)](https://www.npmjs.com/package/nativescript-opentok)
[![npm](https://img.shields.io/npm/dt/nativescript-opentok.svg?maxAge=2592000?style=plastic)](https://www.npmjs.com/package/nativescript-opentok)

A Nativescript plugin for the OpenTok iOS and Android SDK.

OpenTok: https://tokbox.com/developer/

## Getting Started

### Requirements
-  API Key with OpenTok. [Get one here](https://dashboard.tokbox.com/signups/new).
-  Ability to generate a valid session id (either through OpenTok account or back-end service)
-  Ability to generate a valid token (either through OpenTok account or back-end service)
-  Opentok.framework requires projects to be built for only armv7 (device); i386 (simulator), armv6, armv7s, and arm64 are not supported.

### Installation
Node Package Manager (NPM)

- `npm install nativescript-opentok --save`

### Integration

#### Routed Sessions
##### View
You will first need to import the custom element into the {N} xml view. This can be accomplished by adding this snippet: `xmlns:OT="nativescript-opentok"` to your existing `Page` element tag.

The basic integration example would include the following declarations for publisher and subscriber. Notice subscriber is any element with `id="subscriber"`.
```
<StackLayout id="subscriber" width="100%" height="100%"></StackLayout>
<OT:TNSOTPublisher id="publisher" verticalAlignment="top" horizontalAlignment="right" margin="10" width="100" height="100"></OT:TNSOTPublisher>
 ```

 Next in your page's binding context (a controller, view model, etc.), you will need to import and hook to the OpenTok implementation.

 ```
import {TNSOTSession, TNSOTPublisher, TNSOTSubscriber} from 'nativescript-opentok';

private _apiKey:string = 'API_KEY';
private _sessionId: string = 'SESSION_ID';
private _token: string = 'TOKEN';

private publisher: TNSOTPublisher;
private subscriber: TNSOTSubscriber;

private session: TNSOTSession;

constructor(private page: Page) {
    super();
    this.session = TNSOTSession.initWithApiKeySessionId(this._apiKey, this._sessionId);
    this.publisher = <TNSOTPublisher> this.page.getViewById('publisher');
    this.subscriber = <TNSOTSubscriber> this.page.getViewById('subscriber');
    this.initPublisher();
    this.initSubscriber();
}

initPublisher() {
    this.session.connect(this._token);
    this.publisher.publish(this.session, '', 'HIGH', '30');
    this.publisher.events.on('streamDestroyed', (result) => {
        console.log('publisher stream destroyed');
    });
}

initSubscriber() {
    this.session.events.on('streamCreated', () => {
        this.subscriber.subscribe(this.session);
    });
}
```

### Special Articles
- [Overlay UI on the Video Stream](https://github.com/sean-perkins/nativescript-opentok/wiki/Overlay-UI-on-Video-Stream)
- [Angular 2 Integration Guide](https://github.com/sean-perkins/nativescript-opentok/wiki/Angular-2-Integration-Guide)
- [Controlling Resolution and FPS](https://github.com/sean-perkins/nativescript-opentok/wiki/Controlling-Frame-Rate-and-Resolution)
- [Event Hooks](https://github.com/sean-perkins/nativescript-opentok/wiki/Event-Hooks)
- [iOS 10 Notice](https://github.com/sean-perkins/nativescript-opentok/wiki/iOS-10-Notice)

### Images
|iPhone|iPad|
|---|---|
|![iPhone Image](http://i.imgur.com/tjnfeQ7.png)|![iPad Image](http://i.imgur.com/2Ubjw0W.png)|

### Notes
- Publishing is not supported in the Simulator because it does not have access to your webcam. You may see a yellow tea-kettle instead.
- `TNS` stands for **T**elerik **N**ative**S**cript
