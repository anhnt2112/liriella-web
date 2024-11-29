import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(namespace) {
    if (!this.socket) {
      this.socket = io(`http://localhost:9000/${namespace}`);
      console.log(`Connected to ${namespace}`);
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log("Disconnected from socket");
    }
  }

  getSocket() {
    if (!this.socket) {
      throw new Error("Socket is not initialized. Call connect() first.");
    }
    return this.socket;
  }
}

const socketService = new SocketService();
export default socketService;
