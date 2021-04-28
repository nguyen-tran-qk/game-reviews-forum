export type User = {
    id: string,
    username: String,
    role: 'ADMIN' | 'MEMBER',
    token: string
};