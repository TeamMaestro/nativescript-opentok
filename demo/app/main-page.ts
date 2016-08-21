import * as observable from 'data/observable';
import * as pages from 'ui/page';

import app = require("application");
import view = require("ui/core/view");

import {OpenTokDemo} from './main-view-model';
var page;
// Event handler for Page "loaded" event attached in main-page.xml
export function pageLoaded(args: observable.EventData) {

    // Get the event sender
     page = <pages.Page>args.object;
    page.bindingContext = new OpenTokDemo();
    var ot: any = page.getViewById('otPub');
    var otSub: any = page.getViewById('otPub');
    var sl: any = page.getViewById('sl');
    page.bindingContext._session.sessionEvents.on('sessionDidConnect', (result) => {
        console.log('sessionConnected event');
        //   ot.publisher;
        page.bindingContext._session.session.publish(ot.publisher);

        ot.on('didFailWithError', (data) => {
            console.log('error');
            console.dump(data.object.error.errorMessage())
        });
        ot.on('streamCreated', (data) => {
            console.log('created')
        });
        ot.on('streamDestroyed', (data) => {
            console.log('destroyed')
        });
        ot.on('cameraError', (data) => {
            console.log('cameraError');
            console.log(data.object.error.getMessage())
        });
        ot.on('cameraChanged', (data) => {
            console.log('cameraChanged');
            console.dump(data)
        });
        ot.on('streamDestroyed', (data) => {
            console.log('destroyed')
        })
    });
}


export function cycleCamera(){
    var ot: any = page.getViewById('otVideo');
    ot.cycleCamera();
}

