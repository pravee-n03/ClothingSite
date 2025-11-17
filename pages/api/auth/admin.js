import connectDB from "../../../middleware/db/mongodb";
import signupController from "../../../controller/authController/adminSignupController";
import loginController from "../../../controller/authController/loginController";
import logoutController from "../../../controller/authController/logoutCountroller";
import { clientAccessController } from "../../../controller/authController/clientAccessController";

const reqHandler = async (req, res) => {
  try {
    if (req.method === "POST") {
      await signupController(req, res);
    } else if (req.method === "GET") {
      await clientAccessController(req, res, true);
    } else if (req.method === "PUT") {
      await loginController(req, res, true);
    } else if (req.method === "DELETE") {
      await logoutController(req, res);
    } else {
      res.status(422).json({ message: "req_method_not_supported" });
    }
  } catch (error) {
    console.error("API route error:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: error.message || "Internal server error" });
    }
  }
};
export default connectDB(reqHandler);
