import { html, render, useEffect, useMemo, useReducer, useRef } from '../lib/preact';

import Board from './components/Board.js';
import actions from './actions.js';
import http from './http.js';

// State management
function reducer(state, { type, args }) {
  return { ...state, ...actions[type]?.call(state, ...args) };
}

function createDispatchActions(dispatch) {
  return Object.keys(actions).reduce(
    (dispatchActions, key) => ({
      ...dispatchActions,
      [key]: (...args) => dispatch({ type: key, args }),
    }),
    {}
  );
}

// Render app
const App = () => {
  const [board, dispatch] = useReducer(reducer, window.app.board);

  /** @type {typeof actions} */
  const proxiedActions = useMemo(
    () => createDispatchActions(dispatch),
    [dispatch]
  );

  // Save data
  const lastSavedBoard = useRef(null);
  useEffect(() => {
    lastSavedBoard.value ||= JSON.stringify(window.app.board);

    const httpTimer = setTimeout(() => {
      const body = JSON.stringify(board);
      if (lastSavedBoard.value === body) return; // No need to save data

      http
        .patch(`/boards/${board._id}`, { body })
        .then((board) => {
          lastSavedBoard.value = JSON.stringify(board);
          if (lastSavedBoard.value !== body) {
            // Sync any discrepancies
            proxiedActions.set(board);
          }
        })
        .catch((error) => {
          window.alert(error.toString());
        });
    }, 300);

    return () => window.clearTimeout(httpTimer);
  }, [board]);

  return html`<${Board} board=${board} actions=${proxiedActions} />`;
};

render(html`<${App} />`, document.querySelector('main'));
