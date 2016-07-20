export declare class OpenTok {
    static ObjCProtocols: any[];
    private _session;
    private _publisher;
    private _subscriber;
    private _uiview;
    init(apiKey: string, sessionId: string, delegate: any): void;
    doConnect(token: string): void;
    doDisconnect(): void;
    doPublish(videoLocationX: number, videoLocationY: number, videoWidth: number, videoHeight: number): void;
    doSubscribe(stream: any, delegate: any): void;
    doUnsubscribe(): void;
    cleanupPublisher(): void;
    cleanupSubscriber(): void;
    subscriberDidConnectToStream(subscriber: any): void;
}
