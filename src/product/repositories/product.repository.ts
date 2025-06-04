import { IProduct } from "../schemas/models/product.interface"

export abstract class ProductRepository {
    abstract getAllProduct(limit: number, page: number): Promise<IProduct[]>;
    abstract getProductById(productId: string): Promise<IProduct>;
    abstract createProduct(product: IProduct): Promise<void>;
    abstract updateProduct(productId: string, product: IProduct): Promise<IProduct>;
    abstract deleteProduct(productId: string): Promise<void>;
    abstract searchProducts(keyword: string): Promise<IProduct[]>;
}