class Terminal {

}

class API {
    static fetchTerminalsList(): Promise<Terminal[]> {
        return Promise.resolve([
            {
              name: "SW_SERVICE",
              canEdit: true,
              canRestart: true,
            },
            {
              name: "ISP1",
              canEdit: false,
              canRestart: true,
            },
            {
              name: "ISP2",
              canEdit: true,
              canRestart: false,
            },
            {
              name: "SW1",
              canEdit: true,
              canRestart: true,
            },
            {
              name: "SW2",
              canEdit: true,
              canRestart: true,
            },
            {
              name: "R1",
              canEdit: true,
              canRestart: true,
            },
            {
              name: "_unused1",
              canEdit: true,
              canRestart: true,
            },
            {
              name: "_unused2",
              canEdit: true,
              canRestart: true,
            },
          ]);
    }
}

export default API;
export type {
    Terminal
};