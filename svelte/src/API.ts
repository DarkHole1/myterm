import axios from 'axios';
import { Subscriber, Writable, writable } from "svelte/store";

class Users {
    $store: Writable<User[]> = writable([])

    constructor() {
        setTimeout(() => this.update(), 0)
    }

    async update() {
        const { data } = await API.$api.get('/user.list')
        this.$store.set(data.map(user => new User(user, this)))
    }

    subscribe(run: Subscriber<User[]>) {
        return this.$store.subscribe(run)
    }
}

class Servers {
    $store: Writable<Server[]> = writable([])

    constructor() {
        setTimeout(() => this.update(), 0)
    }

    async update() {
        const { data } = await API.$api.get('/comserver.list')
        this.$store.set(data.map(server => new Server(server, this)))
    }

    subscribe(run: Subscriber<Server[]>) {
        return this.$store.subscribe(run)
    }
}

class Terminals {
    $store: Writable<Server[]> = writable([])
    serverId: string

    constructor(serverId: string) {
        this.serverId = serverId
        setTimeout(() => this.update(), 0)
    }

    async update() {
        const { data } = await API.$api.get('/comserver.terminals', {
            params: {
                id: this.serverId
            }
        })
        this.$store.set(data.map(terminal => new Terminal(terminal, this)))
    }

    subscribe(run: Subscriber<Server[]>) {
        return this.$store.subscribe(run)
    }
}

const API = {
    $api: axios.create({
        baseURL: 'https://localhost:3000/api'
    }),
    users: new Users,
    servers: new Servers,
    isAdmin: true,

    login(username: string, password: string) {
        API.$api = axios.create({
            baseURL: API.$api.defaults.baseURL,
            auth: {
                username, password
            }
        })

        API.users.update()
        API.servers.update()
    },
    logout() {
        API.$api = axios.create({
            baseURL: API.$api.defaults.baseURL
        })
    }
}

class User {
    parent: Users
    id: string

    // TODO: Add validation
    constructor(data: any, parent: Users) {
        Object.assign(this, data)
        this.parent = parent
    }

    async update(data: { role: string, password: string }) {
        await API.$api.post('/user.update', data, {
            params: { id: this.id }
        })
        await this.parent.update()
    }
}

class Server {
    parent: Servers
    terminals: Terminals
    id: string

    // TODO: Add validation
    constructor(data: any, parent: Servers) {
        Object.assign(this, data)
        this.parent = parent
        this.terminals = new Terminals(this.id)
    }
}

class Terminal {
    parent: Terminals
    id: string
    editable: boolean

    // TODO: Add validation
    constructor(data: any, parent: Terminals) {
        Object.assign(this, data)
        this.parent = parent
    }

    public get canRestart(): boolean {
        return true;
    }

    public get canEdit(): boolean {
        return this.editable;
    }

    async restart() {
        await API.$api.post('/terminal.restart', null, {
            params: { id: this.id }
        })
        await this.parent.update();
    }

}

API.login('root', 'toor')
export default API;

// type Permissions = { show: boolean, write: boolean }

// class Terminal {
//     public readonly id: string
//     public name: string
//     public readonly comPort: number
//     public readonly serverName: string;
//     public readonly readonly: boolean
//     public readonly canEdit: boolean
//     public readonly canRestart: boolean
//     public readonly canChangePermissions: boolean

//     public host?: string
//     public port?: number

//     // eslint-disable-next-line
//     public constructor(data: any) {
//         this.id = data.id;
//         this.name = data.name;
//         this.comPort = data.comPort;
//         this.serverName = data.serverName;
//         this.readonly = data.readonly;
//         this.canEdit = data.editable;
//         this.canRestart = true;
//         this.canChangePermissions = data.editable;

//         this.host = data.host;
//         this.port = data.port;
//     }

//     public async update(): Promise<boolean> {
//         const params = new URLSearchParams([
//             ['id', this.id],
//             ['name', this.name],
//             ['host', this.host + ''],
//             ['port', this.port + '']
//         ]);
//         const res = await api.post<{ success: boolean }>(`/terminal.update?${params.toString()}`, {})
//         return res.data.success;
//     }

//     public async changePermissions(newPermissions: Map<string, Permissions>): Promise<boolean> {
//         const res = await api.post<{ success: boolean }>(`/terminal.permissions?id=${this.id}`, newPermissions);
//         return res.data.success;
//     }

//     public async permissions(): Promise<Map<string, Permissions>> {
//         const res = await api.get(`/terminal.permissions?id=${this.id}`);
//         return res.data;
//     }

//     // eslint-disable-next-line
//     public updateData({ name, host, port }: any): Promise<boolean> {
//         this.name = name;
//         this.host = host;
//         this.port = port;
//         return this.update();
//     }

//     public async restart(): Promise<boolean> {
//         const params = new URLSearchParams([
//             ['id', this.id]
//         ]);
//         const res = await api.post<{ success: boolean }>(`/terminal.restart?${params.toString()}`)
//         return res.data.success;
//     }

//     public link(): string {
//         return `/terminal.html#${this.id}`;
//     }
// }

// class User {
//     public readonly id = '';
//     public readonly name = '';
//     public role = '';

//     // eslint-disable-next-line
//     constructor(data: any) {
//         if (typeof data.id == 'string') {
//             this.id = data.id;
//         }

//         if (typeof data.role == 'string') {
//             this.role = data.role;
//         }

//         if (typeof data.name == 'string') {
//             this.name = data.name;
//         }
//     }

//     async update(data: { role?: string, password?: string }): Promise<boolean> {
//         const res = await api.post<{success: boolean}>(`/user.update?id=${this.id}`, data);
//         return res.data.success;
//     }
// }

// class COMServer {
//     public readonly terminals: Terminal[];
//     public readonly name: string;
//     public readonly id: string;
//     public readonly host?: string;

//     constructor(props: { id: string, name: string, host?: string }, terminals: Terminal[] = []) {
//         this.id = props.id;
//         this.name = props.name;
//         this.host = props.host;
//         this.terminals = terminals;
//     }

//     async fetchTerminals(): Promise<Terminal[]> {
//         const res = await api.get(`/comserver.terminals?id=${this.id}`);
//         const data = res.data;
//         // eslint-disable-next-line
//         return data.map((d: any) => new Terminal(d));
//     }
// }

// class API {
//     static async fetchTerminalsList(): Promise<Terminal[]> {
//         const res = await api.get('/terminal.list');
//         const data = res.data;
//         // eslint-disable-next-line
//         return data.map((d: any) => new Terminal(d));
//     }

//     static async fetchTerminalsListByServer(): Promise<COMServer[]> {
//         const terminals = await this.fetchTerminalsList();
//         const map: Map<string, { name: string, host?: string }> = new Map();
//         for (const terminal of terminals) {
//             if (terminal.serverName in map) continue;
//             map.set(terminal.serverName, {
//                 name: terminal.serverName,
//                 host: terminal.host
//             })
//         }
//         return Array.from(map.entries()).map(([id, value]) => new COMServer({ ...value, id: '' }, terminals.filter(e => e.serverName == id)));
//     }

//     static async fetchServersList(): Promise<COMServer[]> {
//         const res = await api.get('/comserver.list');
//         const data = res.data;
//         // eslint-disable-next-line
//         return data.map((d: any) => new COMServer(d));
//     }

//     static async isAdmin(): Promise<boolean> {
//         const res = await api.get<boolean>('/user.isAdmin');
//         return await res.data;
//     }

//     static async fetchUsersList(): Promise<User[]> {
//         const res = await api.get('/user.list');
//         // eslint-disable-next-line
//         return res.data.map((e: any) => new User(e));
//     }
// }

// export default API;
// export type {
//     Terminal, COMServer, User
// };