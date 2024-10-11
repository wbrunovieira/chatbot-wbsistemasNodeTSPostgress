import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import { IoAdapter } from "@nestjs/platform-socket.io";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        cors: { origin: "*", methods: ["GET", "POST"], credentials: true },
    });
    app.useWebSocketAdapter(new IoAdapter(app));
    app.enableCors({
        origin: ["http://localhost:5173", "http://frontend:5173"],
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true,
    });

    await app.listen(3000);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
