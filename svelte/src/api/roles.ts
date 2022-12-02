import { Readable, Subscriber, writable } from "svelte/store"
import { z } from "zod"
import API from "../API"

const RawRole = z.object({
    id: z.string(),
    name: z.string()
})

type RawRole = z.infer<typeof RawRole>

const Result = z.discriminatedUnion("success", [
    z.object({
        success: z.literal(true),
        data: z.unknown()
    }),
    z.object({
        success: z.literal(false)
    })
])

type Result = z.infer<typeof Result>

export class Role {
    private constructor(private data: RawRole) { }

    // Converts from data
    static from(data: unknown) {
        return new this(RawRole.parse(data))
    }

    static fromArray(data: unknown) {
        return z.array(RawRole).parse(data).map(e => new this(e))
    }

    public get name(): string {
        return this.data.name
    }

    public get id(): string {
        return this.data.id
    }
}

export class Roles implements Readable<Role[]> {
    roles!: Role[]
    $store = writable<Role[]>([])

    constructor() {
        setTimeout(() => this.update(), 0)
    }

    async findOrCreate(name: string): Promise<Role> {
        let role = this.findLocal(name)
        if (role) {
            return role
        }
        return await this.create(name)
    }

    private findLocal(name: string): Role | null {
        for (const role of this.roles) {
            if (role.name == name) {
                return role
            }
        }

        return null
    }

    async create(name: string): Promise<Role> {
        const { data } = await API.$api.post<unknown>('/role.create', { name })
        const res = Result.parse(data)
        if (!res.success) {
            throw 'Can\'t create role'
        }

        await this.update()
        return Role.from(res.data)
    }

    async update() {
        const { data } = await API.$api.get<unknown>('/role.list')
        const roles = Role.fromArray(data)
        this.roles = roles
        this.$store.set(roles)
    }

    async rename(from: Role, to: string) {
        await API.$api.post('/role.rename', null, {
            params: { from: from.name, to }
        })

        await this.update()
    }

    subscribe(run: Subscriber<Role[]>) {
        return this.$store.subscribe(run)
    }
}
