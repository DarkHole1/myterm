import { writable } from "svelte/store";
import type { Role } from "./api/roles";
import type { Terminal } from "./api/terminals";
import type { User } from "./api/users";

export const user = writable<User | null>(null)
export const permissions = writable<Terminal | null>(null)
export const edit = writable<Terminal | null>(null)
export const restart = writable<Terminal | null>(null)
export const role = writable<Role | null>(null)
