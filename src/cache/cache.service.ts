import { Injectable } from '@nestjs/common';
import { envs } from 'src/config/envs';
import Redis from 'ioredis'

@Injectable()
export class CacheService {
  private readonly redis = new Redis({
    host: envs.REDIS_HOST,
    port: envs.REDIS_PORT
  })

  async get<T>(key:string){
    const data = await this.redis.get(key)
    if(!data) return null;
    const object = JSON.parse(data) as T;
    return object;
  }

  async set(key:string, value:any){
    await this.redis.set(key, JSON.stringify(value))
  }

  async delete(key:string){
    await this.redis.del(key)
  }
}
