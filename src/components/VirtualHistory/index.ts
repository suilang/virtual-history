import { addQuery, getQuery, removeQuery } from '@/utils/Qs';

export class VirtualHistory {
    /**
     * Whether to use virtual route. By default, this parameter is disabled
     */
    useVirtual = false;

    /**
     * Primary site domain name with protocol header when the virtual route is used
     */
    _origin: string;

    /**
     * An object that stores query when using virtual routing
     */
    _query: { [key: string]: string } = {};

    /**
     * An object that stores state when virtual routing is used
     */
    _state: { [key: string]: string } = {};

    _path = '';

    eventListener: Array<() => void> = [];
    /**
     * Whether to print operation logs
     */
    enableLog = false;

    log = console.log;

    constructor(opts: {
        useVirtual?: boolean;
        origin?: string;
        path?: string;
        query?: { [key: string]: string };
        state?: { [key: string]: string };
    }) {
        this.init(opts);
    }

    init = (opts: {
        useVirtual?: boolean;
        origin?: string;
        path?: string;
        query?: { [key: string]: string };
        state?: { [key: string]: string };
    }) => {
        if (!opts.useVirtual) {
            window.removeEventListener('popstate', this.handleHistoryChange);
            this.destory();
            window.addEventListener('popstate', this.handleHistoryChange);
            return;
        }
        this.useVirtual = true;
        this._origin = opts.origin || '';
        this._path = opts.path || '';
        this._query = opts.query || {};
        this._state = opts.state || {};
    };
    /**
     * If a virtual route is not used, the url is changed directly by using the browser's history.pushState \
     * Otherwise save the query to this._query
     * @param state
     * @returns
     */
    pushQuery = (query: { [key: string]: string }, delKeys?: string[]) => {
        if (typeof query !== 'object') {
            return;
        }

        if (!this.useVirtual) {
            history.pushState(null, '', addQuery(location.href, query, delKeys));
            return;
        }
        this.enableLog && this.log('browser history pushQuery', { query, delKeys });
        this._query = { ...this._query, ...query };
        delKeys?.forEach((key) => {
            delete this._query[key];
        });
    };
    /**
     * If a virtual route is not used, the url is changed directly by using the browser's history.replaceState \
     * Otherwise, the corresponding key in this._query is deleted
     * @param state
     * @returns
     */
    removeQuery = (delKeys?: string[]) => {
        if (!this.useVirtual) {
            history.replaceState(null, '', removeQuery(location.href, delKeys));
            return;
        }
        delKeys?.forEach((key) => {
            delete this._query[key];
        });
    };

    /**
     * To change the route, the path must contain /
     * @param path
     * @param state
     * @returns
     */
    push = (path: string, opts: { state?: { [key: string]: string }; query?: { [key: string]: string } } = {}) => {
        const { state = null, query = {} } = opts;
        if (!this.useVirtual) {
            history.pushState(state, '', addQuery(location.origin + path, query));
            // Manually trigger the popstate event so that the application can update its state and UI
            const event = new PopStateEvent('popstate', { state });
            window.dispatchEvent(event);
            return;
        }
        this.enableLog && this.log('browser history push', { state, path });
        this._path = path;
        this._state = state;
        this.eventListener.forEach((e) => e());
    };

    handleHistoryChange = () => {
        this.eventListener.forEach((e) => e());
    };

    /**
     * Clear listening function
     */
    clearEvent = () => {
        this.eventListener.length = 0;
    };

    destory = () => {
        this.clearEvent();
        window.removeEventListener('popstate', this.handleHistoryChange);
    }

    get href() {
        if (this.useVirtual) {
            return addQuery(this._origin + this._path, this._query);
        }
        return location.href;
    }

    get path() {
        if (!this.useVirtual) {
            return location.pathname;
        }
        return this._path;
    }

    get query() {
        if (!this.useVirtual) {
            return getQuery();
        }
        return this._query;
    }

    get origin() {
        if (!this.useVirtual) {
            return location.origin;
        }
        return this._origin;
    }

    get state() {
        if (!this.useVirtual) {
            return history.state;
        }
        return this._state;
    }
}
