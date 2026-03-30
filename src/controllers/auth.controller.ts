import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "7d", // Токен живет 7 дней
  });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    // 1. Проверяем, нет ли уже такого юзера
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      res
        .status(400)
        .json({
          message: "Пользователь с таким email или именем уже существует",
        });
      return;
    }

    // 2. Хешируем пароль (превращаем в нечитаемую строку)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Создаем юзера в базе
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // 4. Генерируем токен
    const token = generateToken(newUser._id.toString());

    // 5. Отправляем ответ без пароля
    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        isPremium: newUser.isPremium,
        traits: newUser.traits,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Ошибка сервера при регистрации" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // 1. Ищем юзера по email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Неверный email или пароль" });
      return;
    }

    // 2. Сравниваем пароли
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Неверный email или пароль" });
      return;
    }

    // 3. Генерируем токен
    const token = generateToken(user._id.toString());

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isPremium: user.isPremium,
        traits: user.traits,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Ошибка сервера при входе" });
  }
};
