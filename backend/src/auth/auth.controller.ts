import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginDTO } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

interface AuthenticatedRequest extends Request {
    user: { userId: number; email: string };
}

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    async register(@Body() createUserDTO: CreateUserDTO) {
        return this.authService.register(createUserDTO);
    }

    @Post('login')
    async login(@Body() loginDTO: LoginDTO) {
        return this.authService.login(loginDTO);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async profile(@Req() req: AuthenticatedRequest) {
        return this.authService.getProfile(req.user.userId);
    }
}
