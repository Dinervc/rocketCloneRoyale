export interface PeerInputFrame {
  tick: number;
  move: -1 | 0 | 1;
  fire: boolean;
  aimX: number;
  aimY: number;
}

export class P2PHostRelay {
  private channels = new Map<string, RTCDataChannel>();

  addChannel(peerId: string, channel: RTCDataChannel): void {
    this.channels.set(peerId, channel);
  }

  broadcast(event: unknown): void {
    const payload = JSON.stringify(event);
    this.channels.forEach((channel) => {
      if (channel.readyState === "open") channel.send(payload);
    });
  }
}
