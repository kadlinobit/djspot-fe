import { WebSocket as WSClient } from 'ws';
import type { Peer } from 'crossws';

function buildUpstreamUrl(peer: Peer): string {
    // apiBaseURL already uses 127.0.0.1, safe for server-side connection
    const config = useRuntimeConfig();
    const base = (config.public.apiBaseURL as string)
        .replace(/^http/, 'ws')
        .replace(/\/$/, '') + '/websocket';

    try {
        // Forward query params (e.g. ?access_token=...) from the client request
        const search = new URL(peer.request.url, 'http://localhost').search;
        return base + search;
    } catch {
        return base;
    }
}

type ConnState = { upstream: WSClient; queue: string[] };
const connections = new Map<string, ConnState>();

export default defineWebSocketHandler({
    open(peer) {
        const queue: string[] = [];
        const upstream = new WSClient(buildUpstreamUrl(peer));

        connections.set(peer.id, { upstream, queue });

        upstream.on('open', () => {
            for (const msg of queue) upstream.send(msg);
            queue.length = 0;
        });

        upstream.on('message', (data) => {
            peer.send(data.toString());
        });

        upstream.on('close', (code) => peer.close(code));

        upstream.on('error', () => peer.close(1011, 'upstream error'));
    },

    message(peer, message) {
        const conn = connections.get(peer.id);
        if (!conn) return;
        const text = message.text();
        if (conn.upstream.readyState === WSClient.OPEN) {
            conn.upstream.send(text);
        } else {
            conn.queue.push(text);
        }
    },

    close(peer) {
        const conn = connections.get(peer.id);
        conn?.upstream.close();
        connections.delete(peer.id);
    },

    error(peer) {
        const conn = connections.get(peer.id);
        conn?.upstream.close();
        connections.delete(peer.id);
    }
});
