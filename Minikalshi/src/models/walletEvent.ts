import mongoose from "mongoose";

const walletEventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tx_type: {
      type: String,
      enum: ["onramp", "created", "bet", "payout", "refund", "fee"],
      required: true,
    },
    side: {
      type: String,
      enum: ["yes", "no"],
      required: false,
    },
    externalId: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const WalletEvent = mongoose.model("WalletEvent", walletEventSchema);
