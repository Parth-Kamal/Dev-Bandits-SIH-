import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import Users from "../models/users.js";

export const register = async (req, res) => {
   try {
      const { name, email, password, department, role, profilePic } = req.body;
      const user = await Users.findOne({ email });
      if (user) {
         return res.status(409).json({
            message: "User already exists, you can login",
            success: false,
         });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new Users({
         name,
         email,
         hashedPassword,
         department,
         role,
         profilePic,
      });
      await newUser.save();
      res.status(201).json({ message: "Register Success", success: true });
   } catch (error) {
      res.status(500).json({
         message: "Internal Server Error",
         success: false,
      });
   }
};

export const login = async (req, res) => {
   try {
      const { email, password } = req.body;
      const user = await Users.findOne({ email });
      if (!user) {
         return res.status(401).json({
            message: "Auth failed email not registered",
            success: false,
         });
      }
      const isPassEqual = await bcrypt.compare(password, user.hashedPassword);
      if (!isPassEqual) {
         return res.status(403).json({
            message: "Auth failed email or password incorrect",
            success: false,
         });
      }
      const { hashedPassword, createdAt, updatedAt, __v, ...userInfo } = user._doc;
      const jwtToken = jwt.sign({ ...userInfo }, process.env.JWT_SECRET, {
         expiresIn: "24h",
      });

      res.status(200).json({
         message: "Login Success",
         success: true,
         token: jwtToken,
         user: userInfo,
      });
   } catch (error) {
      console.error("Login error:", error); // Log the error to identify the issue
      res.status(500).json({
         message: "Internal Server Error",
         success: false,
      });
   }
};

export const updateUser = async (req, res) => {
   try {
      const { name, department, bio } = req.body;
      const userId = req.user._id; // Assuming user ID is extracted from JWT token

      const updatedUser = await Users.findByIdAndUpdate(
         userId,
         { name, department, bio },
         { new: true }, // Return the updated user data
      );

      if (!updatedUser) {
         return res.status(404).json({ message: "User not found", success: false });
      }

      res.status(200).json({
         message: "User updated successfully",
         success: true,
         user: updatedUser,
      });
   } catch (error) {
      res.status(500).json({
         message: "Internal Server Error",
         success: false,
      });
   }
};
