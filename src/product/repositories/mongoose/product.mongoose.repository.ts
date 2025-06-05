
import { NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IProduct } from "src/product/schemas/models/product.interface";
import { Product } from "src/product/schemas/product.schema";
import { ProductRepository } from "../product.repository";

export class ProductMongooseRepository implements ProductRepository {
    constructor(
        @InjectModel(Product.name) private productModel: Model<Product>,
    ){}
    getAllProduct(limit: number, page: number): Promise<IProduct[]> {
        const offset = (page - 1) * limit;

        return this.productModel.find().skip(offset).limit(limit).exec();
    }
    async getProductById(productId: string): Promise<IProduct> {
        const product = await this.productModel.findById(productId).exec();
        if (!product) {
            throw new NotFoundException(`Product with id ${productId} not found`);
        }
        return product;
    }
    
    async createProduct(product: IProduct): Promise<IProduct> {
        const createStock = new this.productModel(product);

        return await createStock.save();
    }
    async updateProduct(productId: string, product: IProduct): Promise<IProduct> {
        const result = await this.productModel.findByIdAndUpdate(productId, product, { new: true }).exec();
        if(!result){
            throw new NotFoundException(`Product with id ${productId} not found`);
        }
        return result;
    }
    
    async deleteProduct(productId: string): Promise<void> {
        await this.productModel.deleteOne({_id: productId}).exec();
    }

    async searchProducts(keyword: string): Promise<IProduct[]> {
        const searchRegex = new RegExp(keyword, 'i'); // 'i' para case-insensitive
        return this.productModel
            .find({
                $or: [
                    { name: searchRegex },
                    { category: searchRegex },
                ],
            })
            .exec();
    }

}