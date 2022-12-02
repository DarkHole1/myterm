import { writable } from "svelte/store";
import type { Terminal, User } from "./API";
import type { Role } from "./api/roles";

export const user = writable<User | null>(null)
export const permissions = writable<Terminal | null>(null)
export const edit = writable<Terminal | null>(null)
export const restart = writable(null)
export const role = writable<Role | null>(null)
