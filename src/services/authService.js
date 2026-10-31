import { request } from "./http";
import { firstOf } from "./utils";

export const authService = {
    async login(email, password) {
        const json = await request('/login',{method: 'POST', body: {email, password} } )
        return json.data.access_token
    },
    async me() {
        const json = await request('/me')
        return firstOf(json.data)
    },
}