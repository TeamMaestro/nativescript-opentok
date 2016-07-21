import { isAndroid } from "platform";

const Session = com.opentok.android.Session;
const Publisher = com.opentok.android.Publisher;
const BaseVideoRenderer = com.opentok.android.BaseVideoRenderer;

export class OpenTok {

    private _session: any;
    private _publisher: any;
    private _context: any;

    constructor() {
        if (!isAndroid) {
            console.log('Not supported for iOS');
            return;
        }
    }

    public init(context: any, apiKey: string, sessionId: string) {
        this._context = context;
        this._session = new Session(context, apiKey, sessionId);
        this._session.setSessionListener(this._session.SessionListener);
        if(this._session) {
            console.log('OpenTok Android Initialized: ' + this._session);
        }
    }

    public doConnect(token: string) {
        let session = this._session;
        if(session) {
            session.connect(token);
        }
    }

    public doPublish(publisherViewContainer: any) {
        let session = this._session;
        if(session) {
            this._publisher = new Publisher(this._context, 'publisher');
            console.log('Init publisher: ' + this._publisher);
            this.attachPublisherView(publisherViewContainer);
            session.publish(this._publisher);
        }
    }

    private attachPublisherView(publisherViewContainer: any) {
        this._publisher.setPublisherListener(this._session.StreamPropertiesListener);
        this._publisher.setCameraListener(this._session.StreamPropertiesListener);
        this._publisher.setStyle(BaseVideoRenderer.STYLE_VIDEO_SCALE, BaseVideoRenderer.STYLE_VIDEO_FILL);
        publisherViewContainer.addView(this._publisher.getView());
    }

    public doSubscribe(stream: any, delegate: any) {

    }

}