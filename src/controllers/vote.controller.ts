import { Request, Response } from "express";
import { Vote } from "../models/vote.model";

export const submitVote = async (req: Request, res: Response) => {
  try {
    const { feature, vote } = req.body;

    if (!feature || !["yes", "no"].includes(vote)) {
      return res
        .status(400)
        .json({ message: "Неверные данные для голосования" });
    }

    await Vote.create({ feature, vote });

    res.status(201).json({ message: "Голос успешно учтен" });
  } catch (error) {
    console.error("Ошибка при сохранении голоса:", error);
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
};
