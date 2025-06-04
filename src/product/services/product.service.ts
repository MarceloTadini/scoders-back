import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { IProduct } from '../schemas/models/product.interface';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ProductGateway } from '../gateways/product.gateway';


@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly productGateway: ProductGateway,
  ) {}

  async getAllProduct(limit: number, page: number) {
    const cacheKey = `products:limit:${limit}:page:${page}`;
    const cached = await this.cacheManager.get(cacheKey);

    if (cached) return cached;

    const products = await this.productRepository.getAllProduct(limit, page);
    await this.cacheManager.set(cacheKey, products, 60); // cache 60s
    return products;
  }

  async getProductById(productId: string) {
    const product = await this.productRepository.getProductById(productId);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async createProduct(product: IProduct) {
    const created = await this.productRepository.createProduct(product);
    this.productGateway.emitNewProduct(created);
    return created;
  }

  async updateProduct(productId: string, product: IProduct) {
    const updated = await this.productRepository.updateProduct(productId, product);
    if (!updated) throw new NotFoundException('Product not found');
    return updated;
  }

  async deleteProduct(productId: string) {
    return this.productRepository.deleteProduct(productId);
  }

  async searchProducts(keyword: string) {
    return this.productRepository.searchProducts(keyword);
  }
}
