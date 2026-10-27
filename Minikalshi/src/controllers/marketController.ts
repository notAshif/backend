import type { Request, Response } from "express";
import { createMarketSchema, placeBetSchema } from "../zods/market";
import { User } from "../models/user";
import { Market } from "../models/market";
import { WalletEvent } from "../models/walletEvent";
import { Bet } from "../models/bet";

export const marketController = {
    async create(req: Request, res: Response) {
        try {
            const parsed = createMarketSchema.safeParse(req.body);

            if (!parsed.success) {
                return res.status(400).json({ message: "Invalid market payload or expiry." });
            }

            const data = parsed.data;

            if (data.expiry <= new Date()) {
                return res.status(400).json({
                    message: "Expiry must be in the future."
                });
            }

            const user = await User.findById(req.userId);

            if (!user || user.balance < data.initialWager) {
                return res.status(400).json({
                    message: "Insufficient balance."
                });
            }

            user.balance -= data.initialWager;
            await user.save();

            const market = await Market.create({
                ...data,
                creatorId: req.userId,
                status: "open",
            });

            await WalletEvent.create({
                userId: req.userId,
                tx_type: "created",
                side: data.side,
                externalId: { marketId: market._id },
                amount: -data.initialWager
            });

            return res.status(201).json({
                id: market._id,
            });

        } catch (error: unknown) {
            console.error("Create market error:", error);
            return res.status(500).json({
                message: "Internal server error."
            });
        }
    },

    async getMarkets(req: Request, res: Response) {
        try {
            const markets = await Market.find().populate("creatorId", "username");

            return res.status(200).json(markets);

        } catch (error: unknown) {
            console.error("Get markets error:", error);
            return res.status(500).json({
                message: "Internal server error."
            });
        }
    },

    async placesBet(req: Request, res: Response) {
        try {
            const parsed = placeBetSchema.safeParse(req.body);

            if (!parsed.success) {
                return res.status(400).json({ message: "Invalid bet request payload." });
            }

            const { marketId, side, amount } = parsed.data;

            const market = await Market.findById(marketId);

            if (!market) {
                return res.status(404).json({
                    message: "Market not found."
                });
            }

            if (market.resolution !== null || market.status === "resolved") {
                return res.status(400).json({
                    message: "Market is already resolved."
                });
            }

            if (new Date() >= market.expiry) {
                return res.status(400).json({
                    error: "Market expired.",
                });
            }

            if (market.creatorId.toString() === req.userId) {
                return res.status(400).json({
                    error: "Creator cannot bet against their own market.",
                });
            }

            const existingBets = await Bet.find({ marketId });
            const totalBet = existingBets.reduce((acc, curr) => acc + curr.betAmount, 0);

            if (amount + totalBet > market.initialWager) {
                const remainingAvailable = market.initialWager - totalBet;
                return res.status(400).json({
                    error: `Bet exceeds available wager. Only $${remainingAvailable} remaining.`,
                });
            }

            const user = await User.findById(req.userId);

            if (!user || user.balance < amount) {
                return res.status(400).json({
                    error: "Insufficient balance.",
                });
            }

            user.balance -= amount;
            await user.save();

            const bet = await Bet.create({
                userId: req.userId,
                marketId,
                side,
                betAmount: amount
            });

            await WalletEvent.create({
                userId: req.userId,
                tx_type: "bet",
                side,
                externalId: {
                    betId: bet._id,
                    marketId,
                },
                amount: -amount
            });

            return res.status(201).json({
                betId: bet._id,
                remainingWager: market.initialWager - (totalBet + amount)
            });

        } catch (error: unknown) {
            console.error("Place bet error:", error);
            return res.status(500).json({
                message: "Internal server error."
            });
        }
    },

    async getBets(req: Request, res: Response) {
        try {
            const bets = await Bet.find({ userId: req.userId }).populate("marketId");
            return res.status(200).json(bets);

        } catch (error: unknown) {
            console.error("Get bets error:", error);
            return res.status(500).json({
                message: "Internal server error."
            });
        }
    }
};
