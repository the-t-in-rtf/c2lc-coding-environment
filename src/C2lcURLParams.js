// @flow

export default class C2lcURLParams {
    urlSearchParams: URLSearchParams;

    constructor(query: any) {
        this.urlSearchParams = new URLSearchParams(query);
    }

    getVersion() {
        return this.urlSearchParams.get('v');
    }

    getProgram() {
        return this.urlSearchParams.get('p');
    }
}
