class Terminal {
    public readonly id: string
    public name: string
    public readonly readonly: boolean
    public readonly canEdit: boolean
    public readonly canRestart: boolean

    public host?: string
    public port?: number

    // eslint-disable-next-line
    public constructor(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.readonly = data.readonly;
        this.canEdit = data.editable;
        this.canRestart = true;

        this.host = data.host;
        this.port = data.port;
    }

    public async update(): Promise<boolean> {
        const params = new URLSearchParams([
            ['id', this.id],
            ['name', this.name],
            ['host', this.host+''],
            ['port', this.port+'']
        ]);
        const res = await fetch(`/api/terminal.update?${params.toString()}`, {
            method: 'POST'
        })
        const data: {success: boolean} = await res.json();
        return data.success; 
    }

    // eslint-disable-next-line
    public updateData({ name, host, port }: any): Promise<boolean> {
        this.name = name;
        this.host = host;
        this.port = port;
        return this.update();
    }

    public async restart(): Promise<boolean> {
        const params = new URLSearchParams([
            ['id', this.id]
        ]);
        const res = await fetch(`/api/terminal.restart?${params.toString()}`, {
            method: 'POST'
        })
        const data: {success: boolean} = await res.json();
        return data.success; 
    }

    public link(): string {
        return `/terminal.html#${this.id}`;
    }
}

class API {
    static async fetchTerminalsList(): Promise<Terminal[]> {
        const res = await fetch('/api/terminal.list');
        const data = await res.json();
        return data.map((d: any) => new Terminal(d));
    }
}

export default API;
export type {
    Terminal
};