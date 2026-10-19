/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Order, HotelTableInfo } from '../types/restaurant';

export type WebSocketEventType =
  | 'CONNECTED'
  | 'NEW_ORDER'
  | 'ORDER_UPDATED'
  | 'TABLE_ROTATED'
  | 'ALL_TABLES_ROTATED';

export interface WebSocketMessage {
  type: WebSocketEventType;
  order?: Order;
  table?: HotelTableInfo;
  tables?: HotelTableInfo[];
  message?: string;
  timestamp?: string;
}

type EventListener = (msg: WebSocketMessage) => void;

class RealtimeWebSocketService {
  private ws: WebSocket | null = null;
  private listeners: Set<EventListener> = new Set();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private isConnecting = false;
  private isExplicitlyClosed = false;
  private retryDelayMs = 1500;

  constructor() {
    if (typeof window !== 'undefined') {
      this.connect();
    }
  }

  public connect(): void {
    if (typeof window === 'undefined') return;
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.isExplicitlyClosed = false;
    this.isConnecting = true;

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.isConnecting = false;
        this.retryDelayMs = 1500;
      };

      this.ws.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          this.notifyListeners(data);
        } catch (e) {
          console.warn('WebSocket message parse error:', e);
        }
      };

      this.ws.onclose = () => {
        this.isConnecting = false;
        if (!this.isExplicitlyClosed) {
          this.scheduleReconnect();
        }
      };

      this.ws.onerror = () => {
        this.isConnecting = false;
        if (this.ws) {
          this.ws.close();
        }
      };
    } catch (err) {
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    this.reconnectTimer = setTimeout(() => {
      this.retryDelayMs = Math.min(this.retryDelayMs * 1.5, 15000);
      this.connect();
    }, this.retryDelayMs);
  }

  private notifyListeners(msg: WebSocketMessage): void {
    this.listeners.forEach((cb) => {
      try {
        cb(msg);
      } catch (err) {
        console.error('Error in WebSocket listener:', err);
      }
    });
  }

  public subscribe(cb: EventListener): () => void {
    this.listeners.add(cb);
    if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
      this.connect();
    }
    return () => {
      this.listeners.delete(cb);
    };
  }

  public onNewOrder(cb: (order: Order) => void): () => void {
    return this.subscribe((msg) => {
      if (msg.type === 'NEW_ORDER' && msg.order) {
        cb(msg.order);
      }
    });
  }

  public onOrderUpdated(cb: (order: Order) => void): () => void {
    return this.subscribe((msg) => {
      if (msg.type === 'ORDER_UPDATED' && msg.order) {
        cb(msg.order);
      }
    });
  }

  public onTableRotated(cb: (table: HotelTableInfo) => void): () => void {
    return this.subscribe((msg) => {
      if (msg.type === 'TABLE_ROTATED' && msg.table) {
        cb(msg.table);
      }
    });
  }

  public isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  public close(): void {
    this.isExplicitlyClosed = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const realtimeWs = new RealtimeWebSocketService();
