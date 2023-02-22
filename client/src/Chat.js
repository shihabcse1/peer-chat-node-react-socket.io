import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

const Chat = ({ socket, username, room }) => {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [isShowEmojiPicker, setIsShowEmojiPIcker] = useState(false);

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time:
                    new Date(Date.now()).getHours() +
                    ":" +
                    new Date(Date.now()).getMinutes(),
            };

            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
        }
    };

    const showEmojiPicker = () => {
        if (isShowEmojiPicker) {
            setIsShowEmojiPIcker(false);
        } else {
            setIsShowEmojiPIcker(true);
        }
    };

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
        });
    }, [socket]);
    return (
        <div className="chat-window">
            <div className="chat-header">
                <span class="dot"></span>
                <p>{username}</p>
            </div>
            <div className="chat-body">
                <ScrollToBottom className="message-container">
                    {messageList.map((messageContent) => {
                        return (
                            <div
                                className="message"
                                id={
                                    username === messageContent.author
                                        ? "you"
                                        : "other"
                                }
                            >
                                <div>
                                    <div className="message-content">
                                        <p>{messageContent.message}</p>
                                    </div>
                                    <div className="message-meta">
                                        <p id="time">{messageContent.time}</p>
                                        <p id="author">
                                            {messageContent.author}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </ScrollToBottom>
                {isShowEmojiPicker && <EmojiPicker height={300} width={200} />}
            </div>
            <div className="chat-footer">
                <button onClick={showEmojiPicker}>
                    <span class="bi bi-emoji-smile smile-face"></span>
                </button>
                <input
                    type="text"
                    value={currentMessage}
                    placeholder="Write your msg"
                    onChange={(event) => {
                        setCurrentMessage(event.target.value);
                    }}
                    onKeyPress={(event) => {
                        event.key === "Enter" && sendMessage();
                    }}
                />
                <button onClick={sendMessage}>
                    <i class="bi bi-chat-dots"></i>
                </button>
            </div>
        </div>
    );
};

export default Chat;
