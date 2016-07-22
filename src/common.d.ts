export interface TNSSessionI {
    connect(token: string): Promise<any>;
    disconnect(): Promise<any>;
}
