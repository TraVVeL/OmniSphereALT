import { toParams, toQuery } from './utils';

class PopupWindow {
  constructor(id, url, options = {}) {
    this.id = id;
    this.url = url;
    this.options = options;
  }

  open() {
    const { url, id, options } = this;

    this.window = window.open(url, id, toQuery(options, ','));
  }

  close() {
    this.cancel();
    this.window.close();
  }

  poll() {
    return new Promise((resolve, reject) => {
      this._intervalId = window.setInterval(() => {
        try {
          if (!this.window || this.window.closed) {
            this.close();
            return reject(new Error('Popup was closed'));
          }

          if (this.window.location.href === this.url || this.window.location.pathname === 'blank') {
            return;
          }

          const params = toParams(this.window.location.search.replace(/^\?/, ''));
          this.close();
          resolve(params);
        } catch (error) {
          // Handle cross-origin access errors
        }
      }, 500);
    });
  }

  cancel() {
    if (this._intervalId) {
      window.clearInterval(this._intervalId);
      this._intervalId = null;
    }
  }

  static open(...args) {
    const popup = new this(...args);
    popup.open();
    return popup.poll();
  }
}

export default PopupWindow;
