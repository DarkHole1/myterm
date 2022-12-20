import type { Role } from "./api/roles"
import type { Terminal } from "./api/terminals"
import type { User } from "./api/users"

interface Events {
    createUser: () => void
    changeUser: (user: User) => void
    changeTerminalPermissions: (terminal: Terminal) => void
    restartTerminal: (terminal: Terminal) => void
    editTerminal: (terminal: Terminal) => void
    renameRole: (role: Role) => void
}

type EventHandlers = Partial<{
    [key in keyof Events]: Events[key][]
}>

const eventHandlers: EventHandlers = { }

export const events = {
    on<T extends keyof Events>(event: T, handler: Events[T]) {
        if (!(event in eventHandlers)) {
            eventHandlers[event] = []
        }
        eventHandlers[event]!.push(handler)
    },
    dispatch<T extends keyof Events>(event: T, ...values: Parameters<Events[T]>) {
        const handlers = eventHandlers[event]
        if (!handlers) return
        for (const handler of handlers) {
            // @ts-ignore: TypeScript forgots type of values 😢
            handler(...values)
        }
    }
}
