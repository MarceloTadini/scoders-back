
import { NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IProduct } from "src/product/schemas/models/product.interface";
import { Product } from "src/product/schemas/product.schema";
import { ProductRepository } from "../product.repository";

export class ProductMongooseRepository implements ProductRepository {
    constructor(
        @InjectModel(Product.name) private postModel: Model<Product>,
    ){}
    getAllPost(limit: number, page: number): Promise<IProduct[]> {
        const offset = (page - 1) * limit;

        return this.postModel.find().skip(offset).limit(limit).exec();
    }
    async getPostById(postId: string): Promise<IProduct> {
        const product = await this.postModel.findById(postId).exec();
        if (!product) {
            throw new NotFoundException(`Post with id ${postId} not found`);
        }
        return product;
    }
    
    async createPost(product: IProduct): Promise<void> {
        const createStock = new this.postModel(product);

        await createStock.save();
    }
    async updatePost(postId: string, product: IProduct): Promise<IProduct> {
        const result = await this.postModel.findByIdAndUpdate(postId, product, { new: true }).exec();
        if(!result){
            throw new NotFoundException(`Post with id ${postId} not found`);
        }
        return result;
    }
    
    async deletePost(postId: string): Promise<void> {
        await this.postModel.deleteOne({_id: postId}).exec();
    }

    async searchPosts(keyword: string): Promise<IProduct[]> {
        const searchRegex = new RegExp(keyword, 'i'); // 'i' para case-insensitive
        return this.postModel
            .find({
                $or: [
                    { title: searchRegex },
                    { content: searchRegex },
                ],
            })
            .exec();
    }

}