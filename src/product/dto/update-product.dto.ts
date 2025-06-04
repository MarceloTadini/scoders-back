import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiProperty({ example: '67886b8d920149a1874cf70', description: 'ID único da productagem a ser atualizada.' })
  id: string;

  @ApiProperty({ example: 'Meu primeiro product atualizado', description: 'Título atualizado da productagem.', required: false })
  title?: string;

  @ApiProperty({ example: 'Uma introdução breve atualizada.', description: 'Introdução atualizada da productagem.', required: false })
  intro?: string;

  @ApiProperty({ example: 'Aqui está o conteúdo atualizado.', description: 'Conteúdo atualizado da productagem.', required: false })
  content?: string;

  @ApiProperty({ example: 'https://meusite.com/imagem-nova.png', description: 'URL atualizada de uma imagem.', required: false })
  imageUrl?: string;

  @ApiProperty({ example: 'https://meusite.com/video-novo.mp4', description: 'URL atualizada de um vídeo.', required: false })
  videoUrl?: string;
}
