import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  servers: ['http://127.0.0.1:8001/', 'http://127.0.0.1:8000/',"https://api.panorah.com/"],
  selectedServer: null, 
};

const serverSlice = createSlice({
  name: 'server',
  initialState,
  reducers: {
    setServers(state, action) {
      state.servers = action.payload;
    },
    selectServer(state, action) {
      state.selectedServer = action.payload;
    },
    addServer(state, action) {
      if (!state.servers.includes(action.payload)) {
        state.servers.push(action.payload);
      }
    },
  },
});

export const { setServers, selectServer, addServer } = serverSlice.actions;
export default serverSlice.reducer;
