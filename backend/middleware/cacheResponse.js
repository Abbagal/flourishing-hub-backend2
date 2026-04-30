import { cache } from "../utils/cache.js";

export const cacheResponse = (prefix, ttlSeconds) => async (req, res, next) => {
  const userPart = req.user?.id ? `:${req.user.id}` : "";
  const key = `${prefix}${userPart}:${req.originalUrl}`;
  const cached = cache.get(key);

  if (cached) {
    return res.status(200).json(JSON.parse(cached));
  }

  const originalJson = res.json.bind(res);

  res.json = (payload) => {
    if (res.statusCode < 400) {
      cache.set(key, JSON.stringify(payload), ttlSeconds);
    }

    return originalJson(payload);
  };

  next();
};



