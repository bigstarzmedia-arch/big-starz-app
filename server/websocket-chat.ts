import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';

/**
 * WebSocket Chat Server for Real-Time Messaging
 * Handles live chat between creators with typing indicators and online status
 */

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
  channelId: string;
}

export interface TypingIndicator {
  userId: string;
  username: string;
  channelId: string;
  isTyping: boolean;
}

export interface OnlineStatus {
  userId: string;
  username: string;
  status: 'online' | 'offline';
  lastSeen?: Date;
}

interface ClientConnection {
  ws: WebSocket;
  userId: string;
  username: string;
  channels: Set<string>;
  isTyping: boolean;
}

export class ChatWebSocketServer {
  private wss: WebSocketServer;
  private clients: Map<string, ClientConnection> = new Map();
  private channels: Map<string, Set<string>> = new Map(); // channelId -> Set of userIds
  private messageHistory: Map<string, ChatMessage[]> = new Map(); // channelId -> messages
  private maxHistoryPerChannel = 100;

  constructor(httpServer: Server) {
    this.wss = new WebSocketServer({ server: httpServer });
    this.setupWebSocketHandlers();
  }

  private setupWebSocketHandlers() {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('New WebSocket connection');

      ws.on('message', (data: string) => {
        try {
          const message = JSON.parse(data);
          this.handleMessage(ws, message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
        }
      });

      ws.on('close', () => {
        this.handleClientDisconnect(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });
  }

  private handleMessage(ws: WebSocket, message: any) {
    const { type, userId, username, channelId, content } = message;

    switch (type) {
      case 'join':
        this.handleJoin(ws, userId, username, channelId);
        break;
      case 'chat':
        this.handleChatMessage(userId, username, channelId, content);
        break;
      case 'typing':
        this.handleTypingIndicator(userId, username, channelId, message.isTyping);
        break;
      case 'leave':
        this.handleLeaveChannel(userId, channelId);
        break;
      default:
        console.warn('Unknown message type:', type);
    }
  }

  private handleJoin(ws: WebSocket, userId: string, username: string, channelId: string) {
    // Register client
    const clientId = `${userId}-${Date.now()}`;
    this.clients.set(clientId, {
      ws,
      userId,
      username,
      channels: new Set([channelId]),
      isTyping: false,
    });

    // Add to channel
    if (!this.channels.has(channelId)) {
      this.channels.set(channelId, new Set());
    }
    this.channels.get(channelId)!.add(userId);

    // Send message history to joining user
    const history = this.messageHistory.get(channelId) || [];
    ws.send(JSON.stringify({
      type: 'history',
      messages: history.slice(-50), // Last 50 messages
    }));

    // Notify others of new user
    this.broadcastToChannel(channelId, {
      type: 'user_joined',
      userId,
      username,
      onlineCount: this.channels.get(channelId)!.size,
    });

    console.log(`User ${username} joined channel ${channelId}`);
  }

  private handleChatMessage(userId: string, username: string, channelId: string, content: string) {
    const chatMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      userId,
      username,
      message: content,
      timestamp: new Date(),
      channelId,
    };

    // Store message
    if (!this.messageHistory.has(channelId)) {
      this.messageHistory.set(channelId, []);
    }
    const messages = this.messageHistory.get(channelId)!;
    messages.push(chatMessage);

    // Keep only last N messages
    if (messages.length > this.maxHistoryPerChannel) {
      messages.shift();
    }

    // Broadcast to channel
    this.broadcastToChannel(channelId, {
      type: 'chat',
      message: chatMessage,
    });
  }

  private handleTypingIndicator(userId: string, username: string, channelId: string, isTyping: boolean) {
    // Update client typing status
    for (const [, client] of this.clients) {
      if (client.userId === userId && client.channels.has(channelId)) {
        client.isTyping = isTyping;
      }
    }

    // Broadcast typing indicator
    this.broadcastToChannel(channelId, {
      type: 'typing',
      userId,
      username,
      isTyping,
    });
  }

  private handleLeaveChannel(userId: string, channelId: string) {
    const channel = this.channels.get(channelId);
    if (channel) {
      channel.delete(userId);
      if (channel.size === 0) {
        this.channels.delete(channelId);
      }
    }

    // Notify others
    this.broadcastToChannel(channelId, {
      type: 'user_left',
      userId,
      onlineCount: this.channels.get(channelId)?.size || 0,
    });
  }

  private handleClientDisconnect(ws: WebSocket) {
    // Find and remove client
    let disconnectedUserId: string | null = null;
    let disconnectedChannels: Set<string> = new Set();

    for (const [clientId, client] of this.clients) {
      if (client.ws === ws) {
        disconnectedUserId = client.userId;
        disconnectedChannels = client.channels;
        this.clients.delete(clientId);
        break;
      }
    }

    // Notify channels of disconnect
    if (disconnectedUserId) {
      for (const channelId of disconnectedChannels) {
        const channel = this.channels.get(channelId);
        if (channel) {
          channel.delete(disconnectedUserId);
          if (channel.size === 0) {
            this.channels.delete(channelId);
          } else {
            this.broadcastToChannel(channelId, {
              type: 'user_left',
              userId: disconnectedUserId,
              onlineCount: channel.size,
            });
          }
        }
      }
    }

    console.log('Client disconnected');
  }

  private broadcastToChannel(channelId: string, data: any) {
    const channel = this.channels.get(channelId);
    if (!channel) return;

    const message = JSON.stringify(data);
    for (const [, client] of this.clients) {
      if (client.channels.has(channelId) && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(message);
      }
    }
  }

  public getChannelInfo(channelId: string) {
    const channel = this.channels.get(channelId);
    return {
      channelId,
      onlineUsers: Array.from(channel || []),
      messageCount: (this.messageHistory.get(channelId) || []).length,
    };
  }

  public getAllChannels() {
    return Array.from(this.channels.entries()).map(([channelId, users]) => ({
      channelId,
      userCount: users.size,
      users: Array.from(users),
    }));
  }
}
