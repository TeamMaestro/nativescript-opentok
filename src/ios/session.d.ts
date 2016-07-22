import { TNSSessionI } from '../common';
export declare class TNSSession extends TNSSessionI {
    static ObjCProtocols: any[];
    private _session;
    private _publisher;
    private _subscriber;
    private _uiview;
    init(apiKey: string, sessionId: string): void;
    connect(token: string): Promise<any>;
    disconnect(): Promise<any>;
    publish(videoLocationX: number, videoLocationY: number, videoWidth: number, videoHeight: number): void;
    subscribe(stream: any, delegate: any): void;
    unsubscribe(): void;
    cleanupPublisher(): void;
    cleanupSubscriber(): void;
    subscriberDidConnectToStream(subscriberKit: any): void;
}
