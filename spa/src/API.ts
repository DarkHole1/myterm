class Terminal {
    public readonly id: string
    public name: string
    public readonly serverId: number
    public readonly serverName: string;
    public readonly readonly: boolean
    public readonly canEdit: boolean
    public readonly canRestart: boolean

    public host?: string
    public port?: number

    // eslint-disable-next-line
    public constructor(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.serverId = data.serverId;
        this.serverName = data.serverName;
        this.readonly = data.readonly;
        this.canEdit = data.editable;
        this.canRestart = true;

        this.host = data.host;
        this.port = data.port;
    }

    public async update(): Promise<boolean> {
        const params = new URLSearchParams([
            ['id', this.id],
            ['name', this.name],
            ['host', this.host+''],
            ['port', this.port+'']
        ]);
        const res = await fetch(`/api/terminal.update?${params.toString()}`, {
            method: 'POST'
        })
        const data: {success: boolean} = await res.json();
        return data.success; 
    }

    // eslint-disable-next-line
    public updateData({ name, host, port }: any): Promise<boolean> {
        this.name = name;
        this.host = host;
        this.port = port;
        return this.update();
    }

    public async restart(): Promise<boolean> {
        const params = new URLSearchParams([
            ['id', this.id]
        ]);
        const res = await fetch(`/api/terminal.restart?${params.toString()}`, {
            method: 'POST'
        })
        const data: {success: boolean} = await res.json();
        return data.success; 
    }

    public link(): string {
        return `/terminal.html#${this.id}`;
    }
}

class COMServer {
    public readonly terminals: Terminal[];
    public readonly name: string;
    public readonly id: number;
    public readonly host?: string;

    constructor(id: number, props: { name: string, host?: string }, terminals: Terminal[]) {
        this.id = id;
        this.name = props.name;
        this.host = props.host;
        this.terminals = terminals;
    }
}

class API {
    static async fetchTerminalsList(): Promise<Terminal[]> {
        const res = await fetch('/api/terminal.list');
        const data = await res.json();
        // eslint-disable-next-line
        return data.map((d: any) => new Terminal(d));
    }

    static async fetchTerminalsListByServer(): Promise<COMServer[]> {
        const terminals = await this.fetchTerminalsList();
        const map: Map<number, {name: string, host?: string}> = new Map();
        for (const terminal of terminals) {
            if(terminal.serverId in map) continue;
            map.set(terminal.serverId, {
                name: terminal.serverName,
                host: terminal.host
            })
        }
        return Array.from(map.entries()).map(([id, value]) => new COMServer(id, value, terminals.filter(e => e.serverId == id)));
    }
}

export default API;
export type {
    Terminal, COMServer
};