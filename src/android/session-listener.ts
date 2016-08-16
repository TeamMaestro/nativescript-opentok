// import {Observable, EventData} from 'data/observable';
// import * as app from 'application';

// declare var com: any;

// const SessionListener = com.opentok.android.Session.SessionListener;

// export class TNSSessionListener {

//     public sessionEvents: Observable;

//     private listener: any;
//     private sessionDidConnectEvent: EventData;

//     constructor(emitEvents?: boolean) {
//         if(emitEvents) {
//             this.setupEvents();
//         }
//         this.listener = new com.opentok.android.Session.SessionListener({
//             /**
//              * Invoked when the client connects to the OpenTok session.
//              *
//              * @param {*} session The session your client connected to.
//              */
//             onConnected(session: any) {
//                 console.log('CONNECTED **********');
//                 if(this.sessionEvents) {
//                     this.sessionEvents.notify(this.sessionDidConnectEvent);
//                 }
//             },
//             /**
//              * Invoked when the client is no longer connected to the OpenTok session.
//              *
//              * @param {*} session The session your client disconnected from.
//              */
//             onDisconnected(session: any) {

//             },
//             /**
//              * Invoked when something goes wrong when connecting or connected to the session.
//              * After this method is invoked, the Session should be treated as dead and unavailable.
//              * Do not attempt to reconnect or to call other methods of the Session object.
//              *
//              * @param {*} session The session in which the error occured.
//              * @param {*} error An error describing the cause for error.
//              */
//             onError(session: any, error: any) {

//             },
//             /**
//              * Invoked when another client stops publishing a stream to this OpenTok session.
//              *
//              * @param {*} session The session from which the stream was removed.
//              * @param {*} stream A Stream object representing the dropped stream, which can be used to identify a Subscriber.
//              */
//             onStreamDropped(session: any, stream: any) {

//             },
//            /**
//             * Invoked when a there is a new stream published by another client in this OpenTok session.
//             *
//             * @param {*} session The session in which the stream was added.
//             * @param {*} stream A Stream object representing the new stream, which can be used to create a Subscriber.
//             */
//             onStreamReceived(session: any, stream: any) {

//             }
//         });

//         console.log('SessionEvents ---- ' + this.sessionEvents);

//         return this.listener;
//     }


//     // private _sessionDidDisconnectEvent: EventData;
//     // private _sessionDidReconnectEvent: EventData;
//     // private _sessionDidBeginReconnectingEvent: EventData;
//     // private _streamCreatedEvent: EventData;
//     // private _didFailWithErrorEvent: EventData;
//     // private _connectionDestroyedEvent: EventData;
//     // private _connectionCreatedEvent: EventData;
//     // private _archiveStartedWithId: EventData;
//     // private _archiveStoppedWithId: EventData;


//     private setupEvents() {
//         this.sessionEvents = new Observable();
//         this.sessionDidConnectEvent = {
//             eventName: 'sessionDidConnect',
//             object: app.android.context
//         };
//     }
//     //      this._sessionDidDisconnectEvent = {
//     //         eventName: 'sessionDidDisconnect',
//     //         object: app.android.context
//     //     };
//     //     this._sessionDidReconnectEvent = {
//     //         eventName: 'sessionDidReconnect',
//     //         object: app.android.context
//     //     };
//     //     this._sessionDidBeginReconnectingEvent = {
//     //         eventName: 'sessionDidBeginReconnecting',
//     //         object: app.android.context
//     //     };
//     //     this._streamCreatedEvent = {
//     //         eventName: 'streamCreated',
//     //         object: app.android.context
//     //     };
//     //     this._didFailWithErrorEvent = {
//     //         eventName: 'didFailWithError',
//     //         object: app.android.context
//     //     };
//     //     this._connectionDestroyedEvent = {
//     //         eventName: 'connectionDestroyed',
//     //         object: app.android.context
//     //     };
//     //     this._connectionCreatedEvent = {
//     //         eventName: 'connectionCreated',
//     //         object: app.android.context
//     //     };
//     //     this._archiveStartedWithId = {
//     //         eventName: 'archiveStartedWithId',
//     //         object: app.android.context
//     //     };
//     //     this._archiveStoppedWithId = {
//     //         eventName: 'archiveStoppedWithId',
//     //         object: app.android.context
//     //     };
//     // }

// }