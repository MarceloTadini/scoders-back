import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service'; 
import { UserService } from 'src/user/services/user.service'; 
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto, createUserSchema } from 'src/user/dto/create-user.dto';
import { ZodValidationPipe } from 'src/shared/pipe/zod-validation.pipe';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {}

    @Post('login')
    @ApiBody({
        description: 'login de exemplo.',
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'marcelo@teste.com' },
                password: { type: 'string', example: 'senha123' },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'retorno do access_token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hcmNlbG9AdGVzdGUuY29tIiwic3ViIjoiNjc4ODc2N2FmNzk4MmRlNTE1MGQ5MDk3Iiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MzcwNzM2NjcsImV4cCI6MTczNzA3NzI2N30.TYgESpm65v0_JI8eMHtYRMm5FFqmBQp3DRyasz3crgQ'
    })
    @ApiResponse({
        status: 401,
        description: 'Invalid credentials.',
    })
    async login(@Body() body: { email: string; password: string }) {
        const user = await this.authService.validateUser(body.email, body.password);
        return this.authService.login(user);
    }

    @Post('register')
    @ApiBody({
        description: 'login a ser criado.',
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'marcelo@teste.com' },
                password: { type: 'string', example: 'senha123' },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'usuario criado com sucesso.',
    })
    @ApiResponse({
        status: 409,
        description: 'email em uso.',
    })
    @Post('register')
    async register(
      @Body(new ZodValidationPipe(createUserSchema)) body: CreateUserDto,
    ) {
      return this.userService.createUser(body);
    }
}

