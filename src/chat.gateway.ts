import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    OnGatewayInit,
    WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
@WebSocketGateway({
    cors: {
        origin: ["http://localhost:5173", "http://frontend:5173"],
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true,
    },
})
export class ChatGateway implements OnGatewayInit {
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger("ChatGateway");

    afterInit(server: Server) {
        this.logger.log("WebSocket Server Initialized");
    }

    handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    @SubscribeMessage("messageToServer")
    handleMessage(
        @MessageBody() message: { text: string; user: string }
    ): void {
        this.logger.log(
            `Message received: ${message.text} from ${message.user}`
        );
        // Broadcast the message to all clients
        this.server.emit("messageToClient", {
            text: `Resposta do servidor: ${message.text}`,
            user: "Bot",
        });
    }
}
