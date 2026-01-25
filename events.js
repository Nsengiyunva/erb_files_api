import IORedis from 'ioredis';

export const publisher = new IORedis();
export const subscriber = new IORedis();
