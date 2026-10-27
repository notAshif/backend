import mongoose from "mongoose";

const marketSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        initialWager: {
            type: Number,
            required: true,
            min: 0,
        },
        side: {
            type: String,
            enum: ["yes", "no"],
            required: true,
        },
        creatorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        expiry: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ["open", "closed", "resolved", "cancelled"],
            default: "open",
        },
        resolution: {
            type: String,
            enum: ["yes", "no", null],
            default: null,
        },
    },
    { timestamps: true }
);

export const Market = mongoose.model("Market", marketSchema);
