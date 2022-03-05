type Permissions = { show: boolean, write: boolean }

class Terminal {
    public readonly id: string
    public name: string
    public readonly comPort: number
    public readonly serverName: string;
    public readonly readonly: boolean
    public readonly canEdit: boolean
    public readonly canRestart: boolean
    public readonly canChangePermissions: boolean

    public host?: string
    public port?: number

    // eslint-disable-next-line
    public constructor(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.comPort = data.comPort;
        this.serverName = data.serverName;
        this.readonly = data.readonly;
        this.canEdit = data.editable;
        this.canRestart = true;
        this.canChangePermissions = data.editable;

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

    public async changePermissions(newPermissions : Map<string, Permissions>) : Promise<boolean> {
        const res = await fetch(`/api/terminal.permissions?id=${this.id}`, {
            method: 'POST',
            body: JSON.stringify(newPermissions),
            headers: [
                ["Content-Type", "application/json"]
            ]
        })
        const data: {success: boolean} = await res.json();
        return data.success;
    }

    public async permissions() : Promise<Map<string, Permissions>> {
        const res = await fetch(`/api/terminal.permissions?id=${this.id}`);
        return await res.json();
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

class User {
    public readonly id = '';
    public readonly name = '';
    public role = '';
    
    // eslint-disable-next-line
    constructor(data: any) {
        if(typeof data.id == 'string') {
            this.id = data.id;
        }

        if(typeof data.role == 'string') {
            this.role = data.role;
        }

        if(typeof data.name == 'string') {
            this.name = data.name;
        }
    }

    async update(data: { role?: string, password?: string }) : Promise<boolean> {
        const res = await fetch(`/api/user.update?id=${this.id}`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: [
                ["Content-Type", "application/json"]
            ]
        })
        return (await res.json()).success;
    }
}

class COMServer {
    public readonly terminals: Terminal[];
    public readonly name: string;
    public readonly id: string;
    public readonly host?: string;

    constructor(props: { id: string, name: string, host?: string }, terminals: Terminal[] = []) {
        this.id = props.id;
        this.name = props.name;
        this.host = props.host;
        this.terminals = terminals;
    }

    async fetchTerminals() : Promise<Terminal[]> {
        const res = await fetch(`/api/comserver.terminals?id=${this.id}`);
        const data = await res.json();
        // eslint-disable-next-line
        return data.map((d: any) => new Terminal(d));
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
        const map: Map<string, {name: string, host?: string}> = new Map();
        for (const terminal of terminals) {
            if(terminal.serverName in map) continue;
            map.set(terminal.serverName, {
                name: terminal.serverName,
                host: terminal.host
            })
        }
        return Array.from(map.entries()).map(([id, value]) => new COMServer({ ...value, id: '' }, terminals.filter(e => e.serverName == id)));
    }

    static async fetchServersList(): Promise<COMServer[]> {
        const res = await fetch('/api/comserver.list');
        const data = await res.json();
        // eslint-disable-next-line
        return data.map((d: any) => new COMServer(d));
    }

    static async isAdmin() : Promise<boolean> {
        const res = await fetch('/api/user.isAdmin');
        return await res.json();
    }

    static async fetchUsersList() : Promise<User[]> {
        const res = await fetch('/api/user.list');
        // eslint-disable-next-line
        return (await res.json()).map((e: any) => new User(e));
    }
}

export default API;
export type {
    Terminal, COMServer, User
};