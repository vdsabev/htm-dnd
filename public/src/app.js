import { html, render } from 'html';
import { createStore } from 'overstate';

import Board from './components/Board.js';
import actions from './actions.js';
import http from './http.js';

// Store
const store = createStore({
  ...window.app.board,
  ...actions,
});

// Render app
const mount = (board) =>
  render(html`<${Board} board=${board} />`, document.querySelector('main'));
mount(store.model);

store.subscribe(mount);

// Save data
/** @type {number | undefined} */ let httpTimer;
let lastSavedData = JSON.stringify(store.model);
store.subscribe((board) => {
  window.clearTimeout(httpTimer);
  httpTimer = setTimeout(() => {
    const body = JSON.stringify(board);
    if (lastSavedData === body) return; // No need to save data

    http
      .patch(`/boards/${board._id}`, { body })
      .then((data) => {
        lastSavedData = JSON.stringify(data);
        if (lastSavedData !== body) {
          // Sync any discrepancies
          store.set(data);
        }
      })
      .catch((error) => {
        window.alert(error.toString());
      });
  }, 300);
});
