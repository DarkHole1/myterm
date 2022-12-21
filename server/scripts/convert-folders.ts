import debug from "debug";
import mongoose from "mongoose";
import { COMServerModel } from "../models/com-server";
import { FolderModel } from "../models/folder";
import { TerminalModel } from "../models/terminal";
import { withConnection } from "./helper-connection";

const log = debug("scripts:convert-folders")
const url = process.argv[2]

async function main() {
    log('Starting converting...')
    const servers = await COMServerModel.find()
    if (!servers || servers.length == 0) {
        log('No servers found 🤔')
        await mongoose.disconnect()
        return
    }

    log('Find %d servers', servers.length)
    for (const server of servers) {
        const terminals = await TerminalModel.find({
            server: server._id
        })

        if(!terminals || terminals.length == 0) {
            log('No terminals found for server %o', server.name)
            continue
        }

        for(const terminal of terminals) {
            terminal.host = server.host;
            await terminal.save()
        }

        const folder = new FolderModel({
            name: server.name,
            terminals: terminals.map(t => t._id)
        })

        await folder.save()
    }
}

withConnection(url, main).then(() => {
    log('Task ended succesfully')
}, e => {
    log(e)
})