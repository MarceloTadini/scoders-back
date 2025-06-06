import { Module} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';
import { ProductRepository } from './repositories/product.repository';
import { ProductMongooseRepository } from './repositories/mongoose/product.mongoose.repository';
import { ProductService } from './services/product.service';
import { ProductController } from './controllers/product.controller';
import { ProductGateway } from './gateways/product.gateway';

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Product.name,
            schema: ProductSchema,
        }])
    ],
    providers: [
        {
            provide: ProductRepository,
            useClass: ProductMongooseRepository,
        },
        ProductService,
        ProductGateway,
    ],
    controllers: [
        ProductController,
    ]
})
export class ProductModule {}
