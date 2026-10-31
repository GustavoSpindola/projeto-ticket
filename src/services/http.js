const BASE_URL = '/api/v2'
const TOKEN_KEY = 'access_token'

export const tokenStorage = {
    get: () =>  localStorage.getItem(TOKEN_KEY),
    set: (token) => localStorage.setItem(TOKEN_KEY, token),
    clear: () => localStorage.removeItem(TOKEN_KEY),
}

export class ApiError extends Error {
    constructor(message, status) {
        super(message)
        this.status = status
    }
}

function extractMessage(body){
    if (Array.isArray(body?.detail)) return body.detail.map((d) => d.msg).join(', ')
    if (typeof body?.detail === "string") return body.detail
    if(body?.message) return body.message
    return 'Não foi possível concluir. Tente novamente'   
}

export async function request(path, {method = 'GET', body} = {}) {
    const headers = {'Content-Type': 'application/json'}
    const token = tokenStorage.get()
    if (token) headers.Authorization = `Bearer ${token}`

    const response = await fetch(`${BASE_URL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body): undefined,
    } )

    const json = await response.json().catch(() => null)

    if (response.status === 401 && token) {
        tokenStorage.clear()
        window.dispatchEvent(new Event('auth:expired'))
    }

    if (!response.ok) throw new ApiError(extractMessage(json), response.status)

    return json
}



