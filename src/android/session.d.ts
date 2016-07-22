export declare class OTSession {
    private _session;
    private _publisher;
    private _context;
    private _subscriber;
    constructor();
    init(apiKey: string, sessionId: string): void;
    doConnect(token: string): void;
    doPublish(publisherViewContainer: any): void;
    private attachPublisherView(publisherViewContainer);
    doSubscribe(stream: any): void;
}
