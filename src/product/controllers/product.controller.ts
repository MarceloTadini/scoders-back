import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors, UsePipes } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../../shared/pipe/zod-validation.pipe";
import { LoggingInterceptor } from "../../shared/interceptors/logging.interceptor";
import { ApiBearerAuth, ApiBody, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { AuthGuard } from "../../shared/guards/auth.guard";
import { ProductDto } from '../dto/product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductService } from "../services/product.service";

const createProductSchema = z.object({
    name: z.string(),
    category: z.string(),
    description: z.string(),
    imageUrl: z.string().optional(),
});

type CreateProduct = z.infer<typeof createProductSchema>;

@UseInterceptors(LoggingInterceptor)
@Controller('product')
export class ProductController{
    constructor(
        private readonly productService: ProductService
    ){}

    @Get('search')
    @ApiQuery({
        name: 'keyword',
        description: 'Palavra-chave usada para buscar products pelo título ou conteúdo.',
        required: true,
        example: 'Productagem'
    })
    @ApiResponse({
        status: 200,
        description: 'A productagem foi encontrada com sucesso.',
        type: ProductDto
    })
    @ApiResponse({
        status: 400,
        description: 'O ID fornecido é inválido ou está vazio.',
        schema: {
            example: {
                statusCode: 400,
                message: 'Keyword must be provided.',
                error: 'Bad Request',
            },
        },
    })
    async searchProducts(@Query('keyword') keyword: string) {
        if (!keyword || keyword.trim() === '') {
            throw new BadRequestException('Keyword must be provided');
        }
        return this.productService.searchProducts(keyword);
    }

    @Get()
    @ApiResponse({
        status: 200,
        description: 'productagens retornadas.',
    })
    async getAllProduct(
        @Query('limit')limit: number, 
        @Query('page')page: number) {
        return this.productService.getAllProduct(limit, page);
    }

    @Get(':productId')
    @ApiQuery({
        name: 'productId',
        description: 'ID de uma productagem.',
        required: true,
        example: '67886b8d920149a1874cf70'
    })
    @ApiResponse({
        status: 200,
        description: 'A productagem foi encontrada com sucesso.',
        type: ProductDto
    })
    async getProductById(@Param('productId' )productId: string) {
        return this.productService.getProductById(productId);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @UsePipes(new ZodValidationPipe(createProductSchema))
    @Post()
    @ApiBody({
        description: 'Dados para criar um novo product.',
        type: ProductDto,
      })
    @ApiResponse({
        status: 201,
        description: 'A productagem foi criada com sucesso.',
    })
    async createProduct(@Body() {name, category, description, imageUrl}) {
        return this.productService.createProduct({name, category,description, imageUrl});
    }
    
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Put(':productId')
    @ApiBody({
        description: 'Productagem de exemplo para ser editado.',
        type: UpdateProductDto,
    })
    @ApiResponse({
        status: 200,
        description: 'A productagem foi editada com sucesso.'
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request.'
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    })
    async updateProduct(
        @Param('productId') productId: string,
        @Body() {name, category, description, imageUrl}: CreateProduct,
    ) {
        return this.productService.updateProduct(productId, {name, category, description, imageUrl});
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Delete(':productId')
    @ApiResponse({
        status: 200,
        description: 'A productagem foi deletada com sucesso.'
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    })
    async deleteProduct(@Param('productId') productId: string) {
        return this.productService.deleteProduct(productId);
    }

}