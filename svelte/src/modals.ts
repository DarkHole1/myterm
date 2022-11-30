import { writable } from "svelte/store";
import type { Terminal } from "./API";
import type { Role } from "./api/roles";

export const user = writable(null)
export const permissions = writable(null)
export const edit = writable<Terminal | null>(null)
export const restart = writable(null)
export const role = writable<Role | null>(null)
