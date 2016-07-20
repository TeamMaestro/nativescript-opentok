import * as observable from 'data/observable';
import * as pages from 'ui/page';
import {HelloWorldModel} from './main-view-model';

import {OpenTok} from 'nativescript-opentok';


// Event handler for Page "loaded" event attached in main-page.xml
export function pageLoaded(args: observable.EventData) {


    // Get the event sender
    var page = <pages.Page>args.object;
    // page.bindingContext = new HelloWorldModel();

    var sessionID = '2_MX40NTYxNDE5Mn5-MTQ2ODk5NjUxMTM0MH5kaGRGY3ErdGUzVTFTY1N2TTJCUllkZ0x-fg';
    var token = 'T1==cGFydG5lcl9pZD00NTYxNDE5MiZzaWc9ZTQzMTE0YjQ2M2ZlYWMzODZiZDYyZWJjYWJjZjM1ZWE2OTM0NGY1ODpzZXNzaW9uX2lkPTJfTVg0ME5UWXhOREU1TW41LU1UUTJPRGs1TmpVeE1UTTBNSDVrYUdSR1kzRXJkR1V6VlRGVFkxTjJUVEpDVWxsa1oweC1mZyZjcmVhdGVfdGltZT0xNDY4OTk2NTM0Jm5vbmNlPTAuMTE4ODU0NDgwNTYyNzMxNjImcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTQ3MTU4ODUzNA==';

    var openTok = new OpenTok();

    openTok.init('45614192', sessionID, page.ios);
    openTok.doConnect(token);
    openTok.doPublish(page.ios);
}