import connectDB from "../../../middleware/db/mongodb";
import Admin from "../../../models/AdminModel";

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      const count = await Admin.countDocuments();
      res.status(200).json({ count });
    } catch (error) {
      console.error("Error fetching admin count:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default connectDB(handler);
