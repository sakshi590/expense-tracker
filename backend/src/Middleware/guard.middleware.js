import jwt from "jsonwebtoken";

// ✅ Forgot password token guard
export const verifyTokenGuard = async (req, res, next) => {
  const authorization = req.headers["authorization"];

  if (!authorization) {
    return res.status(400).send("Bad request");
  }

  const [type, token] = authorization.split(" ");

  if (type !== "Bearer") {
    return res.status(400).send("Bad request");
  }

  const payload = jwt.verify(token, process.env.FORGOT_TOKEN_SECRET);
  req.user = payload;

  next();
};

// ✅ Common invalid handler
const invalid = async (res) => {
  res.cookie("authToken", null, {
    httpOnly: true,
    secure: process.env.ENVIRONMENT !== "DEV",
    sameSite: process.env.ENVIRONMENT === "DEV" ? "lax" : "none",
    path: "/",
    domain: undefined,
    maxAge: 0,
  });

  return res.status(400).json({ message: "Bad Request" });
};

// ✅ Auth middleware (user + admin allowed)
export const adminUserGuard = (req, res, next) => {
  let token;

  const authorization = req.headers["authorization"];
  if (authorization) {
    const [type, t] = authorization.split(" ");
    if (type === "Bearer") {
      token = t;
    }
  }

  if (!token && req.cookies.authToken) {
    token = req.cookies.authToken;
  }

  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }

  try {
    const payload = jwt.verify(token, process.env.AUTH_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid token" });
  }
};

// // ✅ Admin only guard
// export const adminGuard = (req, res, next) => {
//   if (req.user.role !== "admin") {
//     return res.status(403).json({ message: "Admin access only" });
//   }
//   next();
// };