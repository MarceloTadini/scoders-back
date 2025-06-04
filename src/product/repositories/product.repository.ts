import { IProduct } from "../schemas/models/product.interface"

export abstract class ProductRepository {
    abstract getAllPost(limit: number, page: number): Promise<IProduct[]>;
    abstract getPostById(postId: string): Promise<IProduct>;
    abstract createPost(product: IProduct): Promise<void>;
    abstract updatePost(postId: string, product: IProduct): Promise<IProduct>;
    abstract deletePost(postId: string): Promise<void>;
    abstract searchPosts(keyword: string): Promise<IProduct[]>;
}