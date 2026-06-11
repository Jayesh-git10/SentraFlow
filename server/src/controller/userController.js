import prisma from "../config/db.js";
import bcrypt from "bcrypt"

export const userRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if(!name || !email || !password){
      return res.status(400).json({
        success:false,
        message : "All feilds are reqquired"
      })
    }
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
    const hashedPassword = await bcrypt.hash(password , 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password : hashedPassword
      },
    });

    const {hashedPassword:_,...safeUser} = user; 

    res.status(201).json({
      success: true,
      user : safeUser,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const userLogin = async (req,res)=>{
  try {
    const {email , password} = req.body;

    if(!email || !password){
      return res.status(400).json({
        success:false,
        message : "All feilds are reqquired"
      })
    }

    const existingUser = await prisma.user.findUnique({
      where : {
        email,
      }
    })

    if(!existingUser){
      return res.status(400).json({
        success : false,
        message : "User not found ! Register First"
      })
    }

    const isMatch = await bcrypt.compare(
      password,
      existingUser.password
    )

    if(!isMatch){
      return res.status(400).json({
        success : false,
        message : "Wrong password"
      })
    }
    return res.status(200).json({
      success : true,
      message : "Login Successful",
      user:{
        id : existingUser.id,
        name : existingUser.name,
        email : existingUser.email
      }
    })

  } catch (error) {
    res.status(500).json({
      success : false,
      error : error.message
    })
  }
}