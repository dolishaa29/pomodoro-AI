import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginDTO } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async register(createUserDTO: CreateUserDTO) {
        const hashedPassword = await bcrypt.hash(createUserDTO.password, 10);
        const user = await this.usersService.createUser({
            email: createUserDTO.email,
            firstName: createUserDTO.firstName,
            lastName: createUserDTO.lastName,
            password: hashedPassword,
        });
        return this.stripPassword(user);
    }

    async login(loginDTO: LoginDTO) {
        const user = await this.usersService.findUserByEmail(loginDTO.email);
        if (!user || !(await bcrypt.compare(loginDTO.password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const accessToken = await this.jwtService.signAsync({
            sub: user.id,
            email: user.email,
        });

        return { accessToken, user: this.stripPassword(user) };
    }

    async getProfile(userId: number) {
        const user = await this.usersService.findUserById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        return this.stripPassword(user);
    }

    private stripPassword(user: User) {
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        };
    }
}
