export const messageStateChange = async (chatState: any[]) => {
    const updatedChatState = chatState.map((msg, index) => 
        index === chatState.length - 1 ? { ...msg, sent: true } : msg
    );
    return updatedChatState
}