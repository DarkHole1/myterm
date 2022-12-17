import { Readable, Subscriber, Unsubscriber, writable } from "svelte/store";
import { z } from "zod";
import API from "../API";

const RawFolder = z.object({
    id: z.string(),
    name: z.string()
})
type RawFolder = z.infer<typeof RawFolder>

export class Folder implements RawFolder {
    public id: string
    public name: string

    private constructor(data: RawFolder) {
        this.id = data.id
        this.name = data.name
    }

    public static from(data: unknown) {
        return new this(RawFolder.parse(data))
    }

    public static fromArray(data: unknown) {
        return z.array(RawFolder).parse(data).map(e => new this(e))
    }
}

export class Folders implements Readable<Folder[]> {
    folders!: Folder[]
    $store = writable<Folder[]>([])

    constructor() {
        setTimeout(() => this.update())
    }

    async update() {
        const { data } = await API.$api.get<unknown>('/folder.list')
        const folders = Folder.fromArray(data)
        this.folders = folders
        this.$store.set(folders)
    }

    subscribe(run: Subscriber<Folder[]>): Unsubscriber {
        return this.$store.subscribe(run)
    }
}
