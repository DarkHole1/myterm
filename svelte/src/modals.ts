import { writable } from "svelte/store";
import type { Role } from "./api/roles";

export const user = writable(null)
export const permissions = writable(null)
export const edit = writable(null)
export const restart = writable(null)
export const role = writable<Role | null>(null)
