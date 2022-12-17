import debug from "debug";
import mongoose from "mongoose";

const log = debug('scripts:helper:connection')

export async function withConnection(url: string, target: () => Promise<void>) {
    log('Connecting to %o...', url)
    await mongoose.connect(url)
    log('Connected!')
    try {
        await target()
    } finally {
        await mongoose.disconnect()
    }
}