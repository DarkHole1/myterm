class Credentials {
    private _name: string;
    private _password: string;

    constructor(name: string, password: string) {
        this._name = name;
        this._password = password;
    }

    getCredentials(): { name: string, password: string } {
        return {name: this._name, password: this._password};
    }

    static fromBasicAuth(basicAuth?: string): Credentials {
        const b64auth: string = (basicAuth || '').split(' ')[1] || '';
        const [login, password]: string[] = Buffer.from(b64auth, 'base64').toString().split(':');
        return new Credentials(login, password);
    }
}

export default Credentials;