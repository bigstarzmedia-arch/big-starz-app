/**
 * Socket.io Real-Time WebSocket Server
 * Handles live comments, gift notifications, and subscriber count updates
 */

import { Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";

// getDb will be injected at runtime
let getDb: any;

interface LiveStreamRoom {
  streamId: string;
  creatorId: string;
  viewerCount: number;
  activeViewers: Set<string>;
}

interface GiftNotification {
  giftId: string;
  senderId: string;
  senderName: string;
  giftType: string;
  giftValue: number;
  timestamp: number;
}

interface SubscriberUpdate {
  userId: string;
  newCount: number;
  milestone?: number;
}

class WebSocketServer {
  private io: SocketIOServer;
  private liveStreams: Map<string, LiveStreamRoom> = new Map();
  private userSockets: Map<string, Set<string>> = new Map(); // userId -> socketIds

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
      transports: ["websocket", "polling"],
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.io.on("connection", (socket: Socket) => {
      console.log(`[WebSocket] User connected: ${socket.id}`);

      // User joins
      socket.on("user:join", (data: { userId: string; username: string }) => {
        this.handleUserJoin(socket, data);
      });

      // User joins live stream
      socket.on("stream:join", (data: { streamId: string; userId: string }) => {
        this.handleStreamJoin(socket, data);
      });

      // User leaves live stream
      socket.on("stream:leave", (data: { streamId: string; userId: string }) => {
        this.handleStreamLeave(socket, data);
      });

      // Live comment posted
      socket.on("comment:post", (data: { streamId: string; userId: string; message: string; username: string }) => {
        this.handleCommentPost(socket, data);
      });

      // Gift sent
      socket.on("gift:send", (data: { streamId: string; senderId: string; senderName: string; giftType: string; giftValue: number }) => {
        this.handleGiftSend(socket, data);
      });

      // Subscriber count update
      socket.on("subscriber:update", (data: { userId: string; newCount: number }) => {
        this.handleSubscriberUpdate(socket, data);
      });

      // User disconnects
      socket.on("disconnect", () => {
        this.handleUserDisconnect(socket);
      });
    });
  }

  private handleUserJoin(socket: Socket, data: { userId: string; username: string }) {
    const { userId } = data;

    // Track socket to user
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId)!.add(socket.id);

    socket.data.userId = userId;
    socket.data.username = data.username;

    console.log(`[WebSocket] User ${userId} joined`);
  }

  private handleStreamJoin(socket: Socket, data: { streamId: string; userId: string }) {
    const { streamId, userId } = data;

    // Create or get live stream room
    if (!this.liveStreams.has(streamId)) {
      this.liveStreams.set(streamId, {
        streamId,
        creatorId: userId,
        viewerCount: 0,
        activeViewers: new Set(),
      });
    }

    const stream = this.liveStreams.get(streamId)!;
    stream.activeViewers.add(socket.id);
    stream.viewerCount = stream.activeViewers.size;

    // Join Socket.io room
    socket.join(`stream:${streamId}`);

    // Broadcast viewer count update
    this.io.to(`stream:${streamId}`).emit("stream:viewers", {
      streamId,
      viewerCount: stream.viewerCount,
    });

    console.log(`[WebSocket] User ${userId} joined stream ${streamId}. Viewers: ${stream.viewerCount}`);
  }

  private handleStreamLeave(socket: Socket, data: { streamId: string; userId: string }) {
    const { streamId } = data;

    const stream = this.liveStreams.get(streamId);
    if (stream) {
      stream.activeViewers.delete(socket.id);
      stream.viewerCount = stream.activeViewers.size;

      // Broadcast updated viewer count
      this.io.to(`stream:${streamId}`).emit("stream:viewers", {
        streamId,
        viewerCount: stream.viewerCount,
      });

      // Remove stream if no viewers
      if (stream.viewerCount === 0) {
        this.liveStreams.delete(streamId);
      }
    }

    socket.leave(`stream:${streamId}`);
    console.log(`[WebSocket] User left stream ${streamId}`);
  }

  private handleCommentPost(socket: Socket, data: { streamId: string; userId: string; message: string; username: string }) {
    const { streamId, userId, message, username } = data;

    const comment = {
      id: `comment-${Date.now()}-${Math.random()}`,
      userId,
      username,
      message,
      timestamp: Date.now(),
      isPinned: false,
    };

    // Broadcast comment to all viewers in stream
    this.io.to(`stream:${streamId}`).emit("comment:new", comment);

    console.log(`[WebSocket] Comment posted in stream ${streamId}: ${message}`);
  }

  private async handleGiftSend(socket: Socket, data: { streamId: string; senderId: string; senderName: string; giftType: string; giftValue: number }) {
    const { streamId, senderId, senderName, giftType, giftValue } = data;

    const giftNotification: GiftNotification = {
      giftId: `gift-${Date.now()}-${Math.random()}`,
      senderId,
      senderName,
      giftType,
      giftValue,
      timestamp: Date.now(),
    };

    // Broadcast gift notification to stream
    this.io.to(`stream:${streamId}`).emit("gift:received", giftNotification);

    // Store gift in database
    try {
      const db = await getDb();
      // Insert into giftTransactions table
      console.log(`[WebSocket] Gift ${giftType} (${giftValue}) sent in stream ${streamId}`);
    } catch (error) {
      console.error(`[WebSocket] Error storing gift transaction:`, error);
    }
  }

  private async handleSubscriberUpdate(socket: Socket, data: { userId: string; newCount: number }) {
    const { userId, newCount } = data;

    let milestone: number | undefined;

    // Check for 1k milestone
    if (newCount >= 1000) {
      milestone = 1000;

      // Update database to enable casting fees
      try {
        const db = await getDb();
        console.log(`[WebSocket] User ${userId} reached 1k subscribers milestone!`);
      } catch (error) {
        console.error(`[WebSocket] Error updating subscriber milestone:`, error);
      }
    }

    const update: SubscriberUpdate = {
      userId,
      newCount,
      milestone,
    };

    // Notify user of subscriber update
    const userSockets = this.userSockets.get(userId);
    if (userSockets) {
      userSockets.forEach((socketId) => {
        this.io.to(socketId).emit("subscriber:updated", update);
      });
    }

    // Broadcast milestone achievement to all users
    if (milestone) {
      this.io.emit("milestone:achieved", {
        userId,
        milestone,
        timestamp: Date.now(),
      });
    }

    console.log(`[WebSocket] Subscriber update for user ${userId}: ${newCount}`);
  }

  private handleUserDisconnect(socket: Socket) {
    const userId = socket.data.userId;

    if (userId) {
      const userSockets = this.userSockets.get(userId);
      if (userSockets) {
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          this.userSockets.delete(userId);
        }
      }
    }

    console.log(`[WebSocket] User disconnected: ${socket.id}`);
  }

  /**
   * Broadcast live comment to all viewers
   */
  public broadcastComment(streamId: string, comment: any) {
    this.io.to(`stream:${streamId}`).emit("comment:new", comment);
  }

  /**
   * Broadcast gift notification
   */
  public broadcastGift(streamId: string, gift: GiftNotification) {
    this.io.to(`stream:${streamId}`).emit("gift:received", gift);
  }

  /**
   * Broadcast subscriber milestone
   */
  public broadcastMilestone(userId: string, milestone: number) {
    this.io.emit("milestone:achieved", {
      userId,
      milestone,
      timestamp: Date.now(),
    });
  }

  /**
   * Get live stream stats
   */
  public getStreamStats(streamId: string) {
    const stream = this.liveStreams.get(streamId);
    return stream
      ? {
          streamId,
          viewerCount: stream.viewerCount,
          isLive: true,
        }
      : null;
  }

  /**
   * Get all active streams
   */
  public getActiveStreams() {
    return Array.from(this.liveStreams.values()).map((stream) => ({
      streamId: stream.streamId,
      creatorId: stream.creatorId,
      viewerCount: stream.viewerCount,
    }));
  }
}

export { WebSocketServer, LiveStreamRoom, GiftNotification, SubscriberUpdate };
