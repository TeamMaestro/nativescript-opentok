import {Observable, EventData} from 'data/observable';
import {topmost} from 'ui/frame';
import * as app from 'application';

declare var com: any;

const SessionListener = com.opentok.android.Session.SessionListener;

export class TNSSessionListener implements SessionListener {

    public sessionEvents: Observable;

    private _sessionDidConnectEvent: EventData;

    initSession(emitEvents?: boolean) {
        if(emitEvents) {
            this.setupEvents();
        }
    }

    /**
     * Invoked when the client connects to the OpenTok session.
     *
     * @param {*} session The session your client connected to.
     */
    onConnected(session: any) {
        if(this.sessionEvents) {
            this.sessionEvents.notify(this._sessionDidConnectEvent);
        }
    }

    /**
     * Invoked when the client is no longer connected to the OpenTok session.
     *
     * @param {*} session The session your client disconnected from.
     */
    onDisconnected(session: any) {

    }

    /**
     * Invoked when something goes wrong when connecting or connected to the session.
     * After this method is invoked, the Session should be treated as dead and unavailable.
     * Do not attempt to reconnect or to call other methods of the Session object.
     *
     * @param {*} session The session in which the error occured.
     * @param {*} error An error describing the cause for error.
     */
    onError(session: any, error: any) {

    }

    /**
     * Invoked when another client stops publishing a stream to this OpenTok session.
     *
     * @param {*} session The session from which the stream was removed.
     * @param {*} stream A Stream object representing the dropped stream, which can be used to identify a Subscriber.
     */
    onStreamDropped(session: any, stream: any) {

    }

    /**
     * Invoked when a there is a new stream published by another client in this OpenTok session.
     *
     * @param {*} session The session in which the stream was added.
     * @param {*} stream A Stream object representing the new stream, which can be used to create a Subscriber.
     */
    onStreamReceived(session: any, stream: any) {

    }

    private setupEvents() {
        this.sessionEvents = new Observable();
        this._sessionDidConnectEvent = {
            eventName: 'sessionDidConnect',
            object: app.android.context
        };
    }

}