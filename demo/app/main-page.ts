import {EventData} from 'data/observable';
import {Page} from 'ui/page';
import {isAndroid, isIOS} from 'platform';

import {Demo} from './main-view-model';
import {TNSOTPublisher, TNSOTSession} from 'nativescript-opentok';

export function pageLoaded(args: EventData) {
    var page = <Page>args.object;
    page.bindingContext = new Demo();
}

export function publisherLoaded(args: EventData) {
    let publisher = <TNSOTPublisher> args.object;
    if(isAndroid) {
        console.log('OpenTok Publisher Native Android: ' + publisher.android);
    }
    else if(isIOS) {
        console.log('OpenTok Publisher Native iOS: ' + publisher.ios);
    }
    // connectToSession(_publisherToken);
}


exports.pageLoaded = pageLoaded;