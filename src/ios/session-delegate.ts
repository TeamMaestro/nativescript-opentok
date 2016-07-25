import {Observable, EventData} from 'data/observable';
import {topmost} from 'ui/frame';

declare var OTSessionDelegate: any;

export class TNSOTSessionDelegate extends NSObject implements OTSessionDelegate {

    public static ObjCProtocols = [OTSessionDelegate];

    public sessionEvents: Observable;

    private _sessionDidConnectEvent: EventData;
    private _sessionDidDisconnectEvent: EventData;
    private _sessionDidReconnectEvent: EventData;
    private _sessionDidBeginReconnectingEvent: EventData;
    private _streamCreatedEvent: EventData;
    private _didFailWithErrorEvent: EventData;
    private _connectionDestroyedEvent: EventData;
    private _connectionCreatedEvent: EventData;
    private _archiveStartedWithId: EventData;
    private _archiveStoppedWithId: EventData;

    initSession(emitEvents?: boolean) {
        if(emitEvents) {
            this.setupEvents();
        }
    }

    /**
     * Sent when the client connects to the session.
     *
     * @param {*} session The OTSession instance that sent this message.
     */
    sessionDidConnect(session: any) {
        if(this.sessionEvents) {
            this.sessionEvents.notify(this._sessionDidConnectEvent);
        }
    }

    /**
     * Sent when the client disconnects from the session.
     *
     * @param {*} session The OTSession instance that sent this message.
     */
    sessionDidDisconnect(session: any) {
        if(this.sessionEvents) {
            this.sessionEvents.notify(this._sessionDidDisconnectEvent);
        }
    }

    /**
     * Sent when the local client has reconnected to the OpenTok session after its network connection was lost temporarily.
     *
     * @param {*} session The OTSession instance that sent this message.
     */
    sessionDidReconnect(session:any) {
        if(this.sessionEvents) {
            this.sessionEvents.notify(this._sessionDidReconnectEvent);
        }
    }

    /**
     * Sent when the local client has lost its connection to an OpenTok session and is trying to reconnect.
     * @param {*} session The OTSession instance that sent this message.
     */
    sessionDidBeginReconnecting(session: any) {
        if(this.sessionEvents) {
            this.sessionEvents.notify(this._sessionDidBeginReconnectingEvent);
        }
    }

    /**
     * Sent when a new stream is created in this session.
     *
     * @param {*} session The OTSession instance that sent this message.
     * @param {*} stream The stream associated with this event.
     */
    sessionStreamCreated(session: any, stream: any) {
        if(this.sessionEvents) {
            this.sessionEvents.notify(this._streamCreatedEvent);
        }
    }

    /**
     * Sent if the session fails to connect, some time after your application invokes OTSession.connectWithToken
     *
     * @param {*} session The OTSession instance that sent this message.
     * @param {*} error An OTError object describing the issue. The OTSessionErrorCode enum defines values for the code property of this object.
     */
    sessionDidFailWithError(session: any, error: any) {
        if(this.sessionEvents) {
            this.sessionEvents.notify(this._didFailWithErrorEvent);
        }
    }

    /**
     * Sent when another client disconnects from the session. The connection object represents the connection that the client had to the session.
     *
     * @param {*} session The OTSession instance that sent this message.
     * @param {*} connection The OTConnection object for the client that disconnected from the session.
     */
    sessionConnectionDestroyed(session: any, connection: any) {
        if(this.sessionEvents) {
            this.sessionEvents.notify(this._connectionDestroyedEvent);
        }
    }

    /**
     * Sent when another client connects to the session. The connection object represents the client’s connection.
     *
     * @param {*} session The OTSession instance that sent this message.
     * @param {*} connection The new OTConnection object.
     */
    sessionConnectionCreated(session: any, connection: any) {
        if(this.sessionEvents) {
            this.sessionEvents.notify(this._connectionCreatedEvent);
        }
    }

    /**
     * Sent when an archive recording of a session starts. If you connect to a session in which recording is already in progress, this message is sent when you connect.
     *
     * @param {*} session The OTSession instance that sent this message.
     * @param {string} archiveId The unique ID of the archive.
     * @param {string} [name] The name of the archive (if one was provided when the archive was created).
     */
    sessionArchiveStartedWithId(session:any, archiveId: string, name?: string) {
        if(this.sessionEvents) {
            this.sessionEvents.notify(this._archiveStartedWithId);
        }
    }

    /**
     * Sent when an archive recording of a session stops.
     *
     * @param {*} session The OTSession instance that sent this message.
     * @param {string} archiveId The unique ID of the archive.
     */
    sessionArchiveStoppedWithId(session: any, archiveId: string) {
        if(this.sessionEvents) {
            this.sessionEvents.notify(this._archiveStoppedWithId);
        }
    }

    /**
     * Sets up the event data objects for hooking into OTSessionDelegate events
     *
     * @private
     */
    private setupEvents() {
        this.sessionEvents = new Observable();
        this._sessionDidConnectEvent = {
            eventName: 'sessionDidConnect',
            object: topmost().currentPage.ios
        };
        this._sessionDidDisconnectEvent = {
            eventName: 'sessionDidDisconnect',
            object: topmost().currentPage.ios
        };
        this._sessionDidReconnectEvent = {
            eventName: 'sessionDidReconnect',
            object: topmost().currentPage.ios
        };
        this._sessionDidBeginReconnectingEvent = {
            eventName: 'sessionDidBeginReconnecting',
            object: topmost().currentPage.ios
        };
        this._streamCreatedEvent = {
            eventName: 'streamCreated',
            object: topmost().currentPage.ios
        };
        this._didFailWithErrorEvent = {
            eventName: 'didFailWithError',
            object: topmost().currentPage.ios
        };
        this._connectionDestroyedEvent = {
            eventName: 'connectionDestroyed',
            object: topmost().currentPage.ios
        };
        this._connectionCreatedEvent = {
            eventName: 'connectionCreated',
            object: topmost().currentPage.ios
        };
        this._archiveStartedWithId = {
            eventName: 'archiveStartedWithId',
            object: topmost().currentPage.ios
        };
        this._archiveStoppedWithId = {
            eventName: 'archiveStoppedWithId',
            object: topmost().currentPage.ios
        };
    }

}
