export declare class OpenTok {
    _session: any;
    _publisher: any;
    _subscriber: any;
    init(apiKey: string, sessionId: string, delegate: any): void;
    doConnect(token: string): void;
    doDisconnect(): void;
    doPublish(delegate: any, videoLocationX: number, videoLocationY: number, videoWidth: number, videoHeight: number): void;
    doSubscribe(stream: any, delegate: any): void;
    doUnsubscribe(): void;
    cleanupPublisher(): void;
    cleanupSubscriber(): void;
}
