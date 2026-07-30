const buckets = new Map();

const rateLimit = ({ windowMs, max, keyPrefix = "global", message, keyGenerator }) => {
  return (req, res, next) => {
    const ip = req.ip || req.connection?.remoteAddress || "unknown";
    const customKey = typeof keyGenerator === "function" ? keyGenerator(req) : "";
    const safeCustomKey = String(customKey || "").trim();
    const key = safeCustomKey ? `${keyPrefix}:${safeCustomKey}` : `${keyPrefix}:${ip}`;
    const now = Date.now();

    const entry = buckets.get(key);

    if (!entry || now > entry.resetAt) {
      buckets.set(key, {
        count: 1,
        resetAt: now + windowMs
      });
      return next();
    }

    if (entry.count >= max) {
      return res.status(429).json({
        message: message || "Too many requests. Please try again later."
      });
    }

    entry.count += 1;
    buckets.set(key, entry);
    next();
  };
};

module.exports = rateLimit;
