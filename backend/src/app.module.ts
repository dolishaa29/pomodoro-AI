import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports:[ConfigModule],
      useFactory:async(config:ConfigService)=>({
        type:'postgres',
        host:config.get<string>('DB_HOST'),
        port:parseInt(config.get<string>('DB_PORT', '5432'), 10),
        username:config.get<string>('DB_USERNAME'),
        password:config.get<string>('DB_PASSWORD'),
        database:config.get<string>('DB_DATABASE'),
        synchronize:true,
        autoLoadEntities:true,
      }),
      inject:[ConfigService]
    }),
    AuthModule,
    UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
