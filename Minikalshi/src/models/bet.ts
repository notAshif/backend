import mongoose from "mongoose";

const betSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        marketId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Market",
            required: true,
        },
        betAmount: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    { timestamps: true }
);

betSchema.index({ userId: 1, marketId: 1 });

export const Bet = mongoose.model("Bet", betSchema);