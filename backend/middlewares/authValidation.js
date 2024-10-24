import yup from "yup";

const registerSchema = yup.object({
   name: yup.string().min(3).max(100).required("Name is required"),
   email: yup
      .string()
      .email("Invalid email format")
      .max(100)
      .required("Email is required"),
   password: yup.string().min(8).max(20).required("Password is required"),
   department: yup.string().required("Department is required"),
   role: yup.string().oneOf(["admin", "official"]).default("official"),
   profilePic: yup.string().nullable(),
});

const loginSchema = yup.object({
   email: yup
      .string()
      .email("Invalid email format")
      .max(100)
      .required("Email is required"),
   password: yup.string().min(8).max(20).required("Password is required"),
});

export const registerValidation = async (req, res, next) => {
   try {
      await registerSchema.validate(req.body, { strict: true });
      next();
   } catch (error) {
      res.status(400).json({ message: "Bad Request", error });
   }
};

export const loginValidation = async (req, res, next) => {
   try {
      await loginSchema.validate(req.body, { strict: true });
      next();
   } catch (error) {
      res.status(400).json({ message: "Bad Request", error });
   }
};
