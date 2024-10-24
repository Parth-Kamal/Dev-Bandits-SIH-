import { Schema, model } from "mongoose";

const usersSchema = new Schema(
   {
      name: { type: String, required: [true, "User should have a name"] },
      email: {
         type: String,
         unique: true,
         required: [true, "User should have an email"],
      },
      hashedPassword: {
         type: String,
         required: [true, "User should have a password"],
      },
      department: {
         type: String,
         required: [true, "User should have a department"],
      },
      bio: {
         type: String,
         default: "",
      },
      role: { type: String, enum: ["admin", "official"], default: "official" },
      profilePic: { type: String, default: null },
   },
   { timestamps: true },
);

usersSchema.index({ email: 1 });

const Users = model("Users", usersSchema);

export default Users;
