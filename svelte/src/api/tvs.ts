import { Readable, Subscriber, writable } from "svelte/store";
import { z } from "zod";
import API from "../API";
import { EmptyResult } from "./helpers/result";

const RawTV = z.object({
    id: z.string(),
    name: z.string(),
    host: z.string(),
    port: z.number()
})
type RawTV = z.infer<typeof RawTV>

type Source = "vga" | "hdmi1" | "hdmi2" | "hdmi3" | "component" | "composite" | "usb"
export class TV implements RawTV {
    parent: TVs
    id: string
    name: string
    host: string
    port: number

    private constructor(data: RawTV, parent: TVs) {
        this.id = data.id
        this.name = data.name
        this.host = data.host
        this.port = data.port
        this.parent = parent
    }

    static from(data: unknown, parent: TVs) {
        return new this(RawTV.parse(data), parent)
    }

    static fromArray(data: unknown, parent: TVs) {
        return z.array(RawTV).parse(data).map(e => new this(e, parent))
    }

    async setPower(enable: boolean) {
        const { data } = await API.$api.post<unknown>('/tv.power', {
            id: this.id,
            power: enable
        })

        return EmptyResult.parse(data);
    }

    async setMute(enable: boolean) {
        const { data } = await API.$api.post<unknown>('/tv.mute', {
            id: this.id,
            mute: enable
        })

        return EmptyResult.parse(data);
    }

    async selectSource(source: Source) {
        const { data } = await API.$api.post<unknown>('/tv.source', {
            id: this.id,
            source
        })

        return EmptyResult.parse(data);
    }
}

export class TVs implements Readable<TV[]> {
    $store = writable<TV[]>([])

    async update() {
        const { data } = await API.$api.get<unknown>('/tv.list')
        this.$store.set(TV.fromArray(data, this))
    }

    subscribe(run: Subscriber<TV[]>) {
        return this.$store.subscribe(run)
    }
}