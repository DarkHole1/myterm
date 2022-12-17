import { Readable, Subscriber, writable } from "svelte/store"
import { string, z } from "zod"
import API from "../API"

export class Users implements Readable<User[]> {
    $store = writable<User[]>([])

    constructor() {
        // setTimeout(() => this.update(), 0)
    }

    async update() {
        const { data } = await API.$api.get<unknown>('/user.list')
        this.$store.set(User.fromArray(data, this))
    }

    async create() {
        const res = await API.$api.post('/user.add')
        await this.update()
    }

    subscribe(run: Subscriber<User[]>) {
        return this.$store.subscribe(run)
    }
}

const RawUser = z.object({
    id: z.string(),
    name: z.string(),
    role: z.string()
})
type RawUser = z.infer<typeof RawUser>

export class User implements RawUser {
    private parent: Users
    readonly id: string
    readonly role: string
    readonly name: string

    private constructor(data: RawUser, parent: Users) {
        this.id = data.id
        this.role = data.role
        this.name = data.name
        this.parent = parent
    }

    static from(data: unknown, parent: Users) {
        return new this(RawUser.parse(data), parent)
    }

    static fromArray(data: unknown, parent: Users) {
        return z.array(RawUser).parse(data).map(e => new this(e, parent))
    }

    async update(data: Partial<{ role: string, password: string }>) {
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