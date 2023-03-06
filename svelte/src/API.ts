import axios from 'axios';
import { readable, Subscriber, Writable, writable } from "svelte/store";
import { Folders } from './api/folders';
import { Roles } from './api/roles';
import { Terminals } from './api/terminals';
import { TVs } from './api/tvs';
import { Users } from './api/users';

const dev = location.hostname == 'localhost' && location.port != "3000";

const API = {
    $api: axios.create({
        baseURL: (dev ? 'https://localhost:3000' : '') + '/api',
        withCredentials: true
    }),
    // users: new Users,
    // folders: new Folders,
    // servers: new Servers,
    // roles: new Roles,
    tvs: new TVs,
    isAdmin: false,
    loggedIn: false,
    $setLoading: (s: boolean) => { },
    loading: readable(true, set => {
        API.$setLoading = set;
        return () => { };
    }),

    async login(username: string, password: string): Promise<boolean> {
        const res = await API.$api.post('/user.login', {
            name: username, password
        });
        if (res.data.success) {
            API.isAdmin = (await API.$api.get('/user.isAdmin')).data;
            // API.roles.update()
            // API.users.update()
            // API.folders.update()
            API.tvs.update()
            API.loggedIn = true;
        }
        return res.data.success;
    },
    async logout() {
        await API.$api.post('/user.logout');
        API.isAdmin = false;
        API.loggedIn = false;
    }
}

async function checkLogin() {
    try {
        API.isAdmin = (await API.$api.get('/user.isAdmin')).data
        // API.users.update()
        // API.roles.update()
        // API.folders.update()
        API.tvs.update()
        API.loggedIn = true;
    } catch (e) {
        API.isAdmin = false;
        API.loggedIn = false;
    }
    API.$setLoading(false);
}

checkLogin();

export default API;