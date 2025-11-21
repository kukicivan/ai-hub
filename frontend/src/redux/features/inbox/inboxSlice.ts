import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";

export interface InboxState {
  selectedMessageId: string | number | null;
}

const initialState: InboxState = {
  selectedMessageId: null,
};

const inboxSlice = createSlice({
  name: "inbox",
  initialState,
  reducers: {
    setSelectedMessageId: (state, action: PayloadAction<string | number | null>) => {
      state.selectedMessageId = action.payload;
    },
    clearSelectedMessage: (state) => {
      state.selectedMessageId = null;
    },
  },
});

export const { setSelectedMessageId, clearSelectedMessage } = inboxSlice.actions;

export const selectSelectedMessageId = (state: RootState) => state.inbox.selectedMessageId;

export default inboxSlice.reducer;
