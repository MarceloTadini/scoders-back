import { Injectable, NotFoundException } from "@nestjs/common";
import { ProductRepository } from "../repositories/product.repository";
import { IProduct } from "../schemas/models/product.interface";

@Injectable()
export class ProductService {
    constructor(private readonly postRepository: ProductRepository) { 
    }

    async getAllPost(limit: number, page: number) {
        return this.postRepository.getAllPost(limit, page);
    }

    async getPostById(postId: string) {
        const product = await this.postRepository.getPostById(postId);
        if(!product) throw new NotFoundException('Post not found');
        return product;
    }

    async createPost(product) {
        return this.postRepository.createPost(product);
    }

    async updatePost(postId: string, product: IProduct) {
        const updatedPost = await this.postRepository.updatePost(postId, product);
        if (!updatedPost) throw new NotFoundException('Post not found');
        return updatedPost;
    }
    
    async deletePost(postId: string) {
        return this.postRepository.deletePost(postId);
    }

    async searchPosts(keyword: string) {
        return this.postRepository.searchPosts(keyword);
    }
    
}