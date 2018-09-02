import SockjsClient from 'sockjs-client';
import autobind from 'autobind-decorator';
import { format as urlFormat } from 'url';

@autobind
export default class HotClient {
  constructor({
    port = 6001,
    protocol = window.location.protocol,
    hostname = window.location.hostname
  }) {
    this.connection = new SockjsClient(
      urlFormat({
        protocol,
        hostname,
        port,
        pathname: '/sockjs-node'
      })
    );
    this.connection.onclose = this.handleClose;
    this.connection.onmessage = this.handleMessage;
    this.handleConnected();
  }

  handleConnected() {
    this.onConnected();
  }

  handleClose() {
    this.onClose();
  }

  handleMessage(e) {
    const message = JSON.parse(e.data);
    switch (message.type) {
      case 'hash':
        this.onHash(message);
        break;
      case 'still-ok':
        this.onStillOk(message);
        break;
      case 'ok':
        this.onOk(message);
        break;
      case 'content-changed':
        this.onContentChanged(message);
        break;
      case 'warnings':
        this.onWarnings(message);
        break;
      case 'errors':
        this.onErrors(message);
        break;
    }
  }

  onConnected() {
    return true;
  }

  onClose() {
    return true;
  }

  onHash() {
    return true;
  }

  onStillOk() {
    return true;
  }

  onOk() {
    return true;
  }

  onContentChanged() {
    return true;
  }

  onWarnings() {
    return true;
  }

  onErrors() {
    return true;
  }
}
