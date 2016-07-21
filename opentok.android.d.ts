export declare class OpenTok {
    private _session;
    private _publisher;
    private _context;
    constructor();
    init(context: any, apiKey: string, sessionId: string): void;
    doConnect(token: string): void;
    doPublish(publisherViewContainer: any): void;
    private attachPublisherView(publisherViewContainer);
    doSubscribe(stream: any, delegate: any): void;
}
