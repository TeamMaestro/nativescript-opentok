import {EventData} from 'data/observable';
import {Page} from 'ui/page';
import {isAndroid, isIOS} from 'platform';

import {Demo} from './main-view-model';

export function pageLoaded(args: EventData) {
    var page = <Page>args.object;
    page.bindingContext = new Demo(page);
}

exports.pageLoaded = pageLoaded;