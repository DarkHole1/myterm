export function hex2u8a(hex: string) {
    return Uint8Array.from(hex.split(' ').map(n => parseInt(n, 16)))
}