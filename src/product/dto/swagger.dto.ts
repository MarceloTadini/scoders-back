import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
  @ApiProperty({ example: 'Televisão', description: 'Nome do Produto' })
  name: string;

  @ApiProperty({ example: 'Eletrônico', description: 'Categoria do produto' })
  category: string;

  @ApiProperty({ example: 'Smart TV 50 polegadas', description: 'Descrição do produto' })
  description: string;

  @ApiProperty({ example: 'https://meusite.com/imagem.png', description: 'URL de uma imagem relacionada.', required: false })
  imageUrl?: string;
}


export class UpdateProductDto {
    @ApiProperty({ example: '67886b8d920149a1874cf70', description: 'ID único da productagem a ser atualizada.' })
    id: string;
  
    @ApiProperty({ example: 'Televisão', description: 'Nome do Produto', required: false })
    name?: string;
  
    @ApiProperty({ example: 'Eletrônico', description: 'Categoria do produto', required: false })
    category?: string;
  
    @ApiProperty({ example: 'Smart TV 50 polegadas', description: 'Descrição do produto', required: false })
    description?: string;
  
    @ApiProperty({ example: 'https://meusite.com/imagem.png', description: 'URL de uma imagem relacionada.', required: false })
    imageUrl?: string;
  }
  