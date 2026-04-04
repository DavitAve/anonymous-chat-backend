import { Response } from "express";
import { User } from "../models/user.model";
import { AuthRequest } from "../middlewares/auth.middleware";

export const deleteAccount = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Не авторизован" });
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.status(200).json({ message: "Аккаунт успешно удален" });
  } catch (error) {
    console.error("Ошибка при удалении аккаунта:", error);
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
};
