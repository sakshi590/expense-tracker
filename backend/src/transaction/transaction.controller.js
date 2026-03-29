import TransactionModel from "./transaction.model.js";

export const createTransaction = async (req, res) => {
  try {
    const data = req.body;
    const { id } = req.user;
    data.userId = id;

    const transaction = await new TransactionModel(data).save();

    res.json(transaction); // ✅ return saved data
  } catch (err) {
    res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }
};
// export const updateTransaction = async (req, res) => {
//   try {
//     const data = req.body;
//     console.log("BODY:", req.body);
//     const { id } = req.params;
//     const transaction = await TransactionModel.findByIdAndUpdate(id, data, {
//       new: true,
//     });
//     res.json(transaction);
//   } catch (err) {
//     console.log("ERROR:", err); // 👈 add this
//     res.status(400).json({
//       message: err.message, // 👈 show real message
//     });
//   }
// };
export const updateTransaction = async (req, res) => {
  try {
    const data = req.body;
    console.log("BODY:", data);

    const { id } = req.params;

    const transaction = await TransactionModel.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      data,
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json(transaction);
  } catch (err) {
    console.log("ERROR:", err);
    res.status(400).json({
      message: err.message,
    });
  }
};
// export const deleteTransaction = async (req, res) => {
//   try {
//     res.json({
//       message: "Delete Requested",
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: err.message || "Internal Server Error",
//     });
//   }
// };
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await TransactionModel.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    res.json({
      message: "Deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }
};
// export const getTransaction = async (req, res) => {
//   try {
//     res.json({
//       message: "Get Requested",
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: err.message || "Internal Server Error",
//     });
//   }
// };
export const getTransaction = async (req, res) => {
  try {
    const { id } = req.user
    const{page,limit}=req.query
    const skip=(page-1)*limit
    const transactions = await TransactionModel.find({ userId: id }).sort({
      createdAt: -1,
    })
    .find({userId:id})
    .sort({createdAt:-1})
    .skip(skip)
    .limit(limit)
    const total=await TransactionModel.countDocuments({userId:id})
    res.json({
      data:transactions,
      total
    });
    
  } catch (err) {
    res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }
};