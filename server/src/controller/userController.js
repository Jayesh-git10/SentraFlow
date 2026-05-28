import prisma from "../config/db.js";

export const userRegister = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already registered.",
      });
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
      },
    });

    res.status(201).json({
      success: true,
      user,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};