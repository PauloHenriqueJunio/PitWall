import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DriverModule } from './driver/driver.module';
import { LapsModule } from './laps/laps.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'admin_password',
      database: 'pitwall_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    DriverModule,
    LapsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
