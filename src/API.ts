class Terminal {
    public readonly id: string
    public name: string
    public readonly: boolean
    public canEdit: boolean
    public canRestart: boolean

    public host?: string
    public port?: number

    public constructor(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.readonly = data.readonly;
        this.canEdit = data.editable;
        this.canRestart = true;

        this.host = data.host;
        this.port = data.port;
    }

    public update(): void {
        // TODO
    }

    public link(): string {
        return `/terminal.html#${this.id}`;
    }
}

const TEST_DATA = [
    {
        id: "fffeee",
        name: "SW_SERVICE",
        editable: true,
        readonly: true
    },
    {
        id: "fffeee",
        name: "ISP1",
        editable: false,
        readonly: false
    },
    {
        id: "fffeee",
        name: "ISP2",
        editable: true,
        readonly: false
    },
    {
        id: "fffeee",
        name: "SW1",
        editable: true,
        readonly: false
    },
];

class API {
    static fetchTerminalsList(): Promise<Terminal[]> {
        return Promise.resolve(TEST_DATA.map(d => new Terminal(d)));
    }
}

export default API;
export type {
    Terminal
};