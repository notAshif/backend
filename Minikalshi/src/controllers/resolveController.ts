import type { Request, Response } from "express";
import { resolveMarketSchema } from "../types/resolve";
import { Market } from "../models/market";
import { Bet } from "../models/bet";
import { User } from "../models/user";
import { WalletEvent } from "../models/walletEvent";

export const resolveController = {
    async resolve(req: Request, res: Response) {
        try {
            
            const parsed = resolveMarketSchema.safeParse(req.body);

            if (!parsed.success) {
                return res.status(401).json({ message: "Invalid resolve." });
            }

            const { marketId, resolution } = parsed.data;

            const market = await Market.findOne({ _id: marketId });

            if (!market) {
                return res.status(404).json({
                    message: "Market not found."
                })
            }

            if (market.creatorId.toString() !== req.userId) {
                return res.status(403).json({
                    error: "Only creator can resolve",
                });
            }

            if (market.resolution !== null) {
                return res.status(400).json({
                    message: "Market already exist."
                }) 
            }

            const bets = await Bet.find({ marketId });

            if (!bets) {
                return res.status(404).json({
                    message: "Bet not found."
                });
            }

            const totalBet = bets.reduce((acc, curr) => acc + curr.betAmount, 0);

            if (market.side === resolution) {
                
                const payout = totalBet * 2 + (market.initialWager - totalBet);

                await User.updateOne(
                    { _id: market.creatorId },
                    { $inc: { balance: payout } }
                );

                await WalletEvent.create({
                    userId: req.userId,
                    tx_type: "payout",
                    externalId: { marketId },
                    amount: payout
                });

            } else {
                for (const bet of bets) {
                    const payout = bet.betAmount * 2;

                    await User.updateOne(
                        { _id: bet.userId},
                        { $inc: { balance: payout } }
                    );

                    await WalletEvent.create({
                        userId: req.userId,
                        tx_type: "payout",
                        externalId: { marketId, BetId: bet._id },
                        amount: payout
                    });
                }

                const refund = market.initialWager - totalBet;

                if (refund > 0) {
                    await User.updateOne(
                        { _id: market.creatorId },
                        { $inc: { balance: refund } }
                    );

                    await WalletEvent.create({
                        userId: req.userId,
                        tx_type: "refund",
                        externalId: { marketId },
                        amount: refund
                    });
                }
            }

            market.resolution = resolution;
            await market.save();

            return res.json({
                message: "Market resolved successfully",
                resolution,
            });

        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}