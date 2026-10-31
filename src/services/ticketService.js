import { request } from "./http";
import { firstOf } from "./utils";

export const ticketService = {
    async create({title, description}) {
        const json = await request('/tickets', {
            method: 'POST',
            body: {title: title.trim(), description: description.trim()},
        })
        return firstOf(json.data)
    },
}

