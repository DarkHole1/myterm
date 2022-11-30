import axios from 'axios';
import { readable, Subscriber, Writable, writable } from "svelte/store";
import { Roles } from './api/roles';

class Users {
    $store: Writable<User[]> = writable([])

    constructor() {
        // setTimeout(() => this.update(), 0)
    }

    async update() {
        const { data } = await API.$api.get('/user.list')
        this.$store.set(data.map((user: any) => new User(user, this)))
    }

    async create() {
        const res = await API.$api.post('/user.add')
        await this.update()
    }

    subscribe(run: Subscriber<User[]>) {
        return this.$store.subscribe(run)
    }
}

class Servers {
    $store: Writable<Server[]> = writable([])

    constructor() {
        // setTimeout(() => this.update(), 0)
    }

    async update() {
        const { data } = await API.$api.get('/comserver.list')
        this.$store.set(data.map((server: any) => new Server(server, this)))
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
        this.$store.set(data.map((terminal: any) => new Terminal(terminal, this)))
    }

    async create() {
        const res = await API.$api.post('/terminal.add', null, {
            params: {
                server: this.serverId
            }
        })
        await this.update()
    }

    subscribe(run: Subscriber<Server[]>) {
        return this.$store.subscribe(run)
    }
}

const dev = location.hostname == 'localhost' && location.port != "3000";

const API = {
    $api: axios.create({
        baseURL: (dev ? 'https://localhost:3000' : '') + '/api',
        withCredentials: true
    }),
    users: new Users,
    servers: new Servers,
    roles: new Roles,
    isAdmin: false,
    loggedIn: false,
    $setLoading: (s: boolean) => { },
    loading: readable(true, set => {
        API.$setLoading = set;
        return () => { };
    }),

    async login(username: string, password: string) {
        const res = await API.$api.post('/user.login', {
            name: username, password
        });
        if (res.data.success) {
            API.isAdmin = (await API.$api.get('/user.isAdmin')).data;
            API.users.update()
            API.servers.update()
            API.loggedIn = true;
        }
        return res.data.success;
    },
    async logout() {
        await API.$api.post('/user.logout');
        API.isAdmin = false;
        API.loggedIn = false;
    }
}

async function checkLogin() {
    try {
        API.isAdmin = (await API.$api.get('/user.isAdmin')).data
        API.users.update()
        API.servers.update()
        API.loggedIn = true;
    } catch (e) {
        API.isAdmin = false;
        API.loggedIn = false;
    }
    API.$setLoading(false);
}

checkLogin();

class User {
    parent: Users
    id!: string

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

    async delete() {
        await API.$api.delete('/user', {
            params: {
                id: this.id
            }
        })
        await this.parent.update()
    }
}

class Server {
    parent: Servers
    terminals: Terminals
    id!: string

    // TODO: Add validation
    constructor(data: any, parent: Servers) {
        Object.assign(this, data)
        this.parent = parent
        this.terminals = new Terminals(this.id)
    }
}

export class Terminal {
    parent: Terminals
    id!: string
    editable!: boolean
    host?: string
    port?: number
    name!: string

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


    public get canChangePermissions(): boolean {
        return this.editable;
    }


    async restart() {
        await API.$api.post('/terminal.restart', null, {
            params: { id: this.id }
        })
        await this.parent.update();
    }

    async update(data: { name?: string, host?: string, port?: string }) {
        await API.$api.post('/terminal.update', null, {
            params: {
                id: this.id,
                ...data
            }
        })
        await this.parent.update();
    }

    async delete() {
        await API.$api.delete('/terminal', {
            params: {
                id: this.id
            }
        })
        await this.parent.update()
    }

    async getPermissions(): Promise<object> {
        let res = await API.$api.get('/terminal.permissions', {
            params: {
                id: this.id
            }
        })
        return res.data;
    }

    async setPermissions(permissions: object) {
        await API.$api.post('/terminal.permissions', permissions, {
            params: {
                id: this.id
            }
        });
    }

    link() {
        return `/terminal.html#${this.id}`;
    }
}

export default API;