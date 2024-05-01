import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { StreamModule } from "./stream/stream.module";
import { VideoModule } from './video/video.module';
import { PrismaService } from "./utils/prisma.service";

@Module({
  imports: [
    AuthModule,
    UsersModule,
    JwtModule.register({
      global: true,
      secret: "aes256-sha",
      signOptions: {
        expiresIn: "7d",
      },
    }),
    StreamModule,
    VideoModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
