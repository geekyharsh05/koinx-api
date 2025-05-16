import {
    prop,
    getModelForClass,
    modelOptions,
    type DocumentType,
  } from "@typegoose/typegoose";
  
  @modelOptions({ schemaOptions: { timestamps: true } })
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