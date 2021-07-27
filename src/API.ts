class Terminal {

}

class API {
    static fetchTerminalsList(): Promise<Terminal[]> {
        return Promise.resolve([
            {
                name: "SW_SERVICE",
                canEdit: true,
                canRestart: true,
                readonly: true
            },
            {
                name: "ISP1",
                canEdit: false,
                canRestart: true,
                readonly: false
            },
            {
                name: "ISP2",
                canEdit: true,
                canRestart: false,
                readonly: false
            },
            {
                name: "SW1",
                canEdit: true,
                canRestart: true,
                readonly: false
            },
            {
                name: "SW2",
                canEdit: true,
                canRestart: true,
                readonly: false
            },
            {
                name: "R1",
                canEdit: true,
                canRestart: true,
                readonly: false
            },
            {
                name: "_unused1",
                canEdit: true,
                canRestart: true,
                readonly: false
            },
            {
                name: "_unused2",
                canEdit: true,
                canRestart: true,
                readonly: false
            },
        ]);
    }
}

export default API;
export type {
    Terminal
};