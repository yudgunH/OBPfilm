import dotenv from "dotenv";
dotenv.config(); // Load biến môi trường trước khi khởi động server

import app from "./app"; // Import Express App từ `app.ts`
import sequelize from "./config/database"; // Import kết nối database

const PORT = Number(process.env.PORT) || 5000;

const startServer = async () => {
  try {
    await sequelize.sync(); // Kết nối database
    console.log("✅ Database connected successfully!");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Unable to connect to database:", error);
    process.exit(1);
  }
};

startServer();
