import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IProduct } from "./models/product.interface";
import mongoose, { HydratedDocument } from "mongoose";

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product implements IProduct {

    @Prop({type: mongoose.Schema.Types.ObjectId})
    id?: string;
    @Prop()
    name: string;
    @Prop()
    category: string;
    @Prop()
    description: string;
    @Prop()
    imageUrl: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);