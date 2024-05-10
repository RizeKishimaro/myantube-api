import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { StreamModule } from "./stream/stream.module";
import { VideoModule } from "./video/video.module";
import { PrismaModule } from "./utils/prisma.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env"],
    }),
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
  providers: [AppService],
})
export class AppModule {}
