import { Readable, Subscriber, writable } from "svelte/store"
import { z } from "zod"
import API from "../API"

const RawTerminal = z.object({
    id: z.string(),
    name: z.string(),
    editable: z.boolean(),
    host: z.string().optional(),
    port: z.number().int().optional()
})
type RawTerminal = z.infer<typeof RawTerminal>

export class Terminal implements RawTerminal {
    parent: Terminals
    id: string
    name: string
    editable: boolean
    host?: string
    port?: number

    private constructor(data: RawTerminal, parent: Terminals) {
        this.id = data.id
        this.name = data.name
        this.editable = data.editable
        this.host = data.host
        this.port = data.port
        this.parent = parent
    }

    static from(data: unknown, parent: Terminals) {
        return new this(RawTerminal.parse(data), parent)
    }

    static fromArray(data: unknown, parent: Terminals) {
        return z.array(RawTerminal).parse(data).map(e => new this(e, parent))
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
        // TODO: make shorter
        const mappedPermissions = Object.fromEntries(await Promise.all(Object.entries(permissions).map(async ([k, v]): Promise<[any, any]> => ([(await API.roles.findOrCreate(k)).id, v]))))
        await API.$api.post('/terminal.permissions', mappedPermissions, {
            params: {
                id: this.id
            }
        });
    }

    link() {
        return `/terminal.html#${this.id}`;
    }
}

export class Terminals implements Readable<Terminal[]> {
    $store = writable<Terminal[]>([])
    folderId: string

    constructor(serverId: string) {
        this.folderId = serverId
        setTimeout(() => this.update(), 0)
    }

    async update() {
        const { data } = await API.$api.get<unknown>('/folder.terminals', {
            params: {
                id: this.folderId
            }
        })

        this.$store.set(Terminal.fromArray(data, this))
    }

    async create() {
        await API.$api.post('/terminal.add', null, {
            params: {
                server: this.folderId
            }
        })
        await this.update()
    }

    subscribe(run: Subscriber<Terminal[]>) {
        return this.$store.subscribe(run)
    }
}