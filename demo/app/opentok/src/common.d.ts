/// <reference path="../typings/modules/es6-promise/index.d.ts"/>

import { Promise } from 'es6-promise';

export interface TNSOTSessionI {

    create(sessionId: string): Promise<any>;
    connect(token: string): Promise<any>;
    disconnect(): Promise<any>;
    subscribe(stream: any): Promise<any>;
    unsubscribe(): Promise<any>;
    instance(): any;
    publisher(): any;

}
