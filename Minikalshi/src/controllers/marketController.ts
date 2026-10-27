import type { Request, Response } from "express";
import { createMarketSchema, placeBetSchema } from "../types/market";
import { User } from "../models/user";
import { Market } from "../models/market";
import { WalletEvent } from "../models/walletEvent";
import { Bet } from "../models/bet";

export const marketController = {
    async create(req: Request, res: Response) {
        try {

            const parsed = createMarketSchema.safeParse(req.body);

            if (!parsed.success) {
                return res.status(401).json({ message: "Invalid expiry." });
            }

            const data = parsed.data;

            if (data.expiry <= new Date()) {
                return res.status(401).json({
                    message: "Invalid expiry."
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
            });

            await WalletEvent.create({
                userId: req.userId,
                tx_type: "created",
                externalId: { marketId: market._id },
                amount: -data.initialWager
            });

            return res.status(200).json({
                id: market._id,
            });
            
        } catch (error: any) {
            return res.status(500).json({
                message: "Internal server error."
            });
        }
    },

    async getMarkets(req: Request, res: Response) {
        try {

            const market = await Market.find().populate("creatorId", "username");

            if (!market) {
                return res.status(404).json({
                    message: "Market not found."
                });
            }

            return res.status(200).json(market);
            
        } catch (error: any) {
            return res.status(500).json({
                message: "Internal server error."
            });
        }
    },

    async placesBet(req: Request, res: Response) {
        try {
            const parsed = placeBetSchema.safeParse(req.body);
            
            if (!parsed.success) {
                return res.status(401).json({ message: "Invalid expiry." });
            }

            const { marketId, amount } = parsed.data;

            const market = await Market.findOne({ _id: marketId });
            
            if (!market) {
                return res.status(404).json({
                    message: "Market not found."
                });
            }

            if (market.resolution !== null) {
                return res.status(400).json({
                    message: "Market already exist."
                });
            }

            if (new Date() >= market.expiry) {
                return res.status(400).json({
                    error: "Market expired.",
                });
            }

            if(market.creatorId.toString() === req.userId) {
                return res.status(400).json({
                    error: "Creator cannot bet against their own market.",
                });
            }

            const existBet = await Bet.find({ marketId });

            if (!existBet) {
                return res.status(400).json({
                    error: "Cannot found placed bet.",
                });
            }

            const totalBet = existBet.reduce((acc, curr) => acc + curr.betAmount, 0);

            if (totalBet > market.initialWager) {
                return res.status(400).json({
                    error: "Bet exceeds remaining available amount",
                });
            }

            const user = await User.findById(req.userId);

            if (!user || user.balance < amount) {
                return res.status(400).json({
                    error: "Insufficient balance",
                });
            }

            user.balance -= amount;
            await user.save();

            const bet = await Bet.create({
                userId: req.userId,
                marketId,
                betAmount: amount
            });
            
            await WalletEvent.create({
                userId: req.userId,
                tx_type: "bet",
                externalId: {
                    betId: bet._id,
                    marketId,
                },
                amount: -amount
            })

            return res.status(200).json({
                betId: bet._id
            })
            
        } catch (error: any) {
            return res.status(500).json({
                message: "Internal server error."
            });
        }
    },
    
    async getBets(req: Request, res: Response) {
        try {
            
            const bets = await Bet.find({userId: req.userId}).populate("marketId");
            if (!bets) {
                return res.status(400).json({
                    message: "Bet not found of current user."
                });
            }

            return res.status(200).json(bets);

        } catch (error: any) {
            return res.status(500).json({
                message: "Internal server error."
            });
        }
    }
}
