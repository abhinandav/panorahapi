import { createSlice } from '@reduxjs/toolkit';

// Initial state with default servers
const initialState = {
  servers: ['http://127.0.0.1:8001/', 'http://127.0.0.1:8000/',"https://api.panorah.com/"], // Default servers
  selectedServer: null, // No server selected initially
};

const serverSlice = createSlice({
  name: 'server',
  initialState,
  reducers: {
    // Action to set the list of servers
    setServers(state, action) {
      state.servers = action.payload;
    },
    // Action to select a specific server
    selectServer(state, action) {
      state.selectedServer = action.payload;
    },
    // Action to add a new server if it doesn't already exist
    addServer(state, action) {
      if (!state.servers.includes(action.payload)) {
        state.servers.push(action.payload);
      }
    },
  },
});

// Export actions and reducer
export const { setServers, selectServer, addServer } = serverSlice.actions;
export default serverSlice.reducer;
