import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors, UsePipes } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../../shared/pipe/zod-validation.pipe";
import { LoggingInterceptor } from "../../shared/interceptors/logging.interceptor";
import { ApiBearerAuth, ApiBody, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { AuthGuard } from "../../shared/guards/auth.guard";
import { PostDto } from '../dto/product.dto';
import { UpdatePostDto } from '../dto/update-product.dto';
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
        description: 'Palavra-chave usada para buscar posts pelo título ou conteúdo.',
        required: true,
        example: 'Postagem'
    })
    @ApiResponse({
        status: 200,
        description: 'A postagem foi encontrada com sucesso.',
        type: PostDto
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
    async searchPosts(@Query('keyword') keyword: string) {
        if (!keyword || keyword.trim() === '') {
            throw new BadRequestException('Keyword must be provided');
        }
        return this.productService.searchPosts(keyword);
    }

    @Get()
    @ApiResponse({
        status: 200,
        description: 'postagens retornadas.',
    })
    async getAllPost(
        @Query('limit')limit: number, 
        @Query('page')page: number) {
        return this.productService.getAllPost(limit, page);
    }

    @Get(':postId')
    @ApiQuery({
        name: 'postId',
        description: 'ID de uma postagem.',
        required: true,
        example: '67886b8d920149a1874cf70'
    })
    @ApiResponse({
        status: 200,
        description: 'A postagem foi encontrada com sucesso.',
        type: PostDto
    })
    async getPostById(@Param('postId' )postId: string) {
        return this.productService.getPostById(postId);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @UsePipes(new ZodValidationPipe(createProductSchema))
    @Post()
    @ApiBody({
        description: 'Dados para criar um novo product.',
        type: PostDto,
      })
    @ApiResponse({
        status: 201,
        description: 'A postagem foi criada com sucesso.',
    })
    async createPost(@Body() {name, category, description, imageUrl}) {
        return this.productService.createPost({name, category,description, imageUrl});
    }
    
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Put(':postId')
    @ApiBody({
        description: 'Postagem de exemplo para ser editado.',
        type: UpdatePostDto,
    })
    @ApiResponse({
        status: 200,
        description: 'A postagem foi editada com sucesso.'
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request.'
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    })
    async updatePost(
        @Param('postId') postId: string,
        @Body() {name, category, description, imageUrl}: CreateProduct,
    ) {
        return this.productService.updatePost(postId, {name, category, description, imageUrl});
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Delete(':postId')
    @ApiResponse({
        status: 200,
        description: 'A postagem foi deletada com sucesso.'
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    })
    async deletePost(@Param('postId') postId: string) {
        return this.productService.deletePost(postId);
    }

}