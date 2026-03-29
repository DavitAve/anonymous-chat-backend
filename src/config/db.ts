import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI не найден в файле .env");
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB успешно подключена: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Ошибка подключения к MongoDB:", error);
    process.exit(1); // Останавливаем сервер, если база недоступна
  }
};
