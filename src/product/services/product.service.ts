import { Inject, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { IProduct } from '../schemas/models/product.interface';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ProductGateway } from '../gateways/product.gateway';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    private readonly productRepository: ProductRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly productGateway: ProductGateway,
  ) {}

  async getAllProduct(limit: number, page: number) {
    try {
      const cacheKey = `products:limit:${limit}:page:${page}`;
      
      // Verificar cache
      const cached = await this.cacheManager.get(cacheKey);
      if (cached) {
        this.logger.log('🔄 Dados retornados do cache Redis');
        return cached;
      }

      // Buscar no banco
      this.logger.log('🔍 Buscando produtos no banco de dados');
      const products = await this.productRepository.getAllProduct(limit, page);
      
      // Salvar no cache (TTL de 60 segundos)
      await this.cacheManager.set(cacheKey, products, 60000);
      this.logger.log('💾 Produtos salvos no cache Redis');
      
      return products;
    } catch (error) {
      this.logger.error('Erro ao buscar produtos:', error);
      throw error;
    }
  }

  async getProductById(productId: string) {
    try {
      const cacheKey = `product:${productId}`;
      
      // Verificar cache
      const cached = await this.cacheManager.get(cacheKey);
      if (cached) {
        this.logger.log(`🔄 Produto ${productId} retornado do cache`);
        return cached;
      }

      // Buscar no banco
      const product = await this.productRepository.getProductById(productId);
      if (!product) {
        throw new NotFoundException('Product not found');
      }

      // Salvar no cache
      await this.cacheManager.set(cacheKey, product, 60000);
      this.logger.log(`💾 Produto ${productId} salvo no cache`);
      
      return product;
    } catch (error) {
      this.logger.error(`Erro ao buscar produto ${productId}:`, error);
      throw error;
    }
  }

  async createProduct(product: IProduct) {
    try {
      const created = await this.productRepository.createProduct(product);
      
      // Limpar cache relacionado
      await this.clearProductsCache();
      
      // Emitir evento WebSocket
      this.productGateway.emitNewProduct(created);
      this.logger.log(`✅ Produto criado: ${created}`);
      
      return created;
    } catch (error) {
      this.logger.error('Erro ao criar produto:', error);
      throw error;
    }
  }

  async updateProduct(productId: string, product: IProduct) {
    try {
      const updated = await this.productRepository.updateProduct(productId, product);
      if (!updated) {
        throw new NotFoundException('Product not found');
      }

      // Limpar cache específico e geral
      await this.cacheManager.del(`product:${productId}`);
      await this.clearProductsCache();
      
      this.productGateway.emitProductUpdate(updated);
      this.logger.log(`✅ Produto atualizado: ${productId}`);
      return updated;
    } catch (error) {
      this.logger.error(`Erro ao atualizar produto ${productId}:`, error);
      throw error;
    }
  }

  async deleteProduct(productId: string) {
    try {
      const result = await this.productRepository.deleteProduct(productId);
      
      // Limpar cache
      await this.cacheManager.del(`product:${productId}`);
      await this.clearProductsCache();
      
      this.logger.log(`🗑️ Produto deletado: ${productId}`);
      return result;
    } catch (error) {
      this.logger.error(`Erro ao deletar produto ${productId}:`, error);
      throw error;
    }
  }

  async searchProducts(keyword: string) {
    try {
      const cacheKey = `search:${keyword.toLowerCase()}`;
      
      // Verificar cache
      const cached = await this.cacheManager.get(cacheKey);
      if (cached) {
        this.logger.log(`🔄 Busca "${keyword}" retornada do cache`);
        return cached;
      }

      // Buscar no banco
      const products = await this.productRepository.searchProducts(keyword);
      
      // Salvar no cache (TTL menor para buscas)
      await this.cacheManager.set(cacheKey, products, 30000);
      this.logger.log(`💾 Busca "${keyword}" salva no cache`);
      
      return products;
    } catch (error) {
      this.logger.error(`Erro ao buscar produtos com "${keyword}":`, error);
      throw error;
    }
  }

  private async clearProductsCache() {
    try {
      // Limpar cache de listagem (aproximação - idealmente usar padrão de chaves)
      const keys = ['products:limit:10:page:1', 'products:limit:20:page:1', 'products:limit:undefined:page:undefined']; // Ajuste conforme necessário
      for (const key of keys) {
        await this.cacheManager.del(key);
      }
      this.logger.log('🧹 Cache de produtos limpo');
    } catch (error) {
      this.logger.error('Erro ao limpar cache:', error);
    }
  }
}