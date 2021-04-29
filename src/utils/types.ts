export type User = {
    id: string,
    username: String,
    role: 'ADMIN' | 'MEMBER',
    token: string
};

export enum Genre {
    Shooter = 'shooter',
    Fighting = 'fighting',
    Survival = 'survival',
    BattleRoyale = 'battleRoyale',
    Adventure = 'adventure',
    RPG = 'rpg',
    MMORPG = 'mmorpg',
    Simulation = 'simulation',
    Strategy = 'strategy',
    Sports = 'sports'
};

export type Game = {
    id: string,
    title: string,
    description?: string,
    images?: string[],
    genres?: Genre[],
    price?: number,
    studio?: string,
    publishedDate?: string
}
