import redis from 'redis';

const client = redis.createClient({
  port: 6379,
  host: 'bravo_redis',
  password: 'sOmE_sEcUrE_pAsS',
});

client.on('error', (err) => {
  console.log('Error:', err);
});

export const getData = async (key: string): Promise<any> =>
  new Promise((resolve, reject) => {
    client.get(key, (err, data) => {
      if (err) {
        resolve(null);
      }

      resolve(data);
    });
  });

export const setData = async (key: string, value: any) => {
  const response = client.set(key, value, 'EX', 60 * 2);

  if (!response) {
    return false;
  }

  return response;
};

export const clearData = async () => {
  const response = client.flushall();

  if (!response) {
    return false;
  }

  return response;
};
