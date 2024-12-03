// Third-party Imports
import { configureStore } from '@reduxjs/toolkit'

// Slice Imports
import chatReducer from '@/redux-store/slices/chat'
import calendarReducer from '@/redux-store/slices/calendar'
import kanbanReducer from '@/redux-store/slices/kanban'
import emailReducer from '@/redux-store/slices/email'
import serverReducer from '@/redux-store/slices/server'
import authReducer from '@/redux-store/slices/auth'


export const store = configureStore({
  reducer: {
    chatReducer,
    calendarReducer,
    kanbanReducer,
    serverReducer,
    server: serverReducer,
    auth: authReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false })
})
