import {
    prop,
    getModelForClass,
    modelOptions,
    index,
  } from "@typegoose/typegoose";
  
  @modelOptions({ schemaOptions: { timestamps: true } })
  @index({ coin: 1, createdAt: -1 }) // Compound index for efficient queries

  export class CryptoStatsClass {
    @prop({ required: true })
    coin!: string;
  
    @prop({ required: true })
    priceUsd!: number;
  
    @prop({ required: true })
    marketCapUsd!: number;
  
    @prop({ required: true })
    change24h!: number;
  }
  
export const CryptoStats = getModelForClass(CryptoStatsClass); 