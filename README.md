# Nativescript OpenTok

[![npm](https://img.shields.io/npm/v/nativescript-opentok.svg?maxAge=2592000?style=plastic)](https://www.npmjs.com/package/nativescript-opentok) 
[![npm](https://img.shields.io/npm/dt/nativescript-opentok.svg?maxAge=2592000?style=plastic)](https://www.npmjs.com/package/nativescript-opentok)

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

- `npm install nativescript-opentok --save`

### Integration

#### Routed Sessions 
##### View
You will first need to import the custom element into the {N} xml view. This can be accomplished by adding this snippet: `xmlns:OT="nativescript-opentok"` to your existing `Page` element tag. 

The basic integration example would include the following declarations for publisher and subscriber. Notice subscriber is any element with `id="subscriber"`. You will need to provide a valid sessionId, api (key) and token to the publisher element. 
```
<OT:TNSOTPublisher sessionId="{{ sessionId }}" api="{{ api }}" token="{{ publisherToken }}"></OT:TNSOTPublisher>
<StackLayout id="subscriber" verticalAlignment="top" horizontalAlignment="right" margin="10" width="100" height="100"></StackLayout>
 ```


### Images

![Image](http://i.imgur.com/2okX9Sb.png)

### Notes
- Publishing is not supported in the Simulator because it does not have access to your webcam. You may see a yellow tea-kettle instead.
- `TNS` stands for **T**elerik **N**ative**S**cript
