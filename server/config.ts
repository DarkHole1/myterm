import fs from 'fs';

class Config {
    private _data: any;

    public recordSessions: boolean;
    public sessionBytesCount: number;
    public dropBytes: number;

    constructor(filename: string) {
        this._data = fs.readFileSync(filename);
        this.recordSessions = Boolean(this._data.recordSessions);
        this.sessionBytesCount = Number(this._data.sessionBytesCount) || 0;
        this.dropBytes = Number(this._data.dropBytes) || 0;
    }
}

export default Config;