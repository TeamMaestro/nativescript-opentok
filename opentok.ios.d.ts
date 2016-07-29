/// <reference path="./typings/modules/es6-promise/index.d.ts"/>

import { TNSOTSessionI } from './src/common';
import { Promise } from 'es6-promise';

export declare class TNSOTSession implements TNSOTSessionI {

    constructor(apiKey: string);

    create(sessionId: string): Promise<any>;

    connect(token: string): Promise<any>;

    disconnect(): Promise<any>;

    publish(videoLocationX?: number, videoLocationY?: number, videoWidth?: number, videoHeight?: number): Promise<any>;

    subscribe(stream: any): Promise<any>;

    unsubscribe(): Promise<any>;

    cleanupPublisher();

    cleanupSubscriber();

    instance(): any;

    publisher(): any;

}