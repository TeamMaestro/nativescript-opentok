export declare class OpenTok {
    init(apiKey: string, sessionId: string, delegate: any): void;
    doConnect(token: string): void;
    doPublish(videoLocationX: number, videoLocationY: number, videoWidth: number, videoHeight: number): void;
    doSubscribe(stream: any, delegate: any): void;
}
