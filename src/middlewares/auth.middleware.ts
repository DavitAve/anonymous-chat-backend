import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// 1. Расширяем стандартный Request, чтобы TypeScript знал про req.user
export interface AuthRequest extends Request {
  user?: {
    id: string;
    // тут можно добавить другие поля, если они есть в токене
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  // Пропускаем предварительные запросы CORS
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    // Токен приходит в виде "Bearer eyJhbGciOiJIUzI1..."
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Не авторизован: нет токена" });
    }

    // Расшифровываем токен (Убедись, что переменная JWT_SECRET совпадает с той, что при логине)
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };

    // Кладем расшифрованные данные в объект запроса
    req.user = decoded;

    // Передаем управление дальше (в контроллер)
    next();
  } catch (error) {
    return res.status(401).json({ message: "Не авторизован: неверный токен" });
  }
};
