import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
  @ApiProperty({ example: 'Meu primeiro product', description: 'Título da productagem.' })
  title: string;

  @ApiProperty({ example: 'Uma introdução breve sobre o conteúdo.', description: 'Uma introdução da productagem.' })
  intro: string;

  @ApiProperty({ example: 'Aqui está o conteúdo detalhado do meu product.', description: 'O conteúdo completo da productagem.' })
  content: string;

  @ApiProperty({ example: 'https://meusite.com/imagem.png', description: 'URL de uma imagem relacionada.', required: false })
  imageUrl?: string;

  @ApiProperty({ example: 'https://meusite.com/video.mp4', description: 'URL de um vídeo relacionado.', required: false })
  videoUrl?: string;
}