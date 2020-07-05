import { promisify } from "util";
import app from "@core/application";

export const setex = async (key: string, time: number, value: string) => {

  const setex = promisify(app.cache.setex).bind(app.cache);
  return await setex(key, time, value);
}

export const del = async (key: string) => {
  const del = promisify(app.cache.del).bind(app.cache);
  //@ts-ignore
  return await del(key);
}

export const get = async (key: string) => {
  const get = promisify(app.cache.get).bind(app.cache);
  return await get(key);
}

export const wipe = async () => {
  const wipe = promisify(app.cache.flushall).bind(app.cache);
  return await wipe();
}