import { Readable, Subscriber, writable } from "svelte/store"
import { z } from "zod"
import API from "../API"

const RawRole =
    z.object({
        id: z.string(),
        name: z.string()
    })

type RawRole = z.infer<typeof RawRole>

export class Role {
    private constructor(private data: RawRole) { }

    static from(data: unknown) {
        return new this(RawRole.parse(data))
    }

    static fromArray(data: unknown) {
        return z.array(RawRole).parse(data).map(e => new this(e))
    }

    
    public get name() : string {
        return this.data.name
    }
    
}

export class Roles implements Readable<Role[]> {
    $store = writable<Role[]>([])

    constructor() {
        setTimeout(() => this.update(), 0)
    }

    async update() {
        const { data } = await API.$api.get<unknown>('/role.list')
        this.$store.set(Role.fromArray(data))
    }

    async rename(from: string, to: string) {
        await API.$api.post('/role.rename', null, {
            params: { from, to }
        })

        await this.update()
    }

    subscribe(run: Subscriber<Role[]>) {
        return this.$store.subscribe(run)
    }
}
