import {useState} from 'react'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import './App.css'
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    TypingIndicator
} from '@chatscope/chat-ui-kit-react'

function App() {
    const [typing, setTyping] = useState(false)
    const [messages, setMessages] = useState([
        {
            message: "Привет, я Помощник",
            sender: "bot",
            direction: "incoming"
        }
    ])
const handleSend = async(message) => {
        const newMessage = {
            message: message,
            sender:"user",
            direction: "outgoing"
        }
        const newMessages = [...messages,newMessage]
    setMessages(newMessages)
    setTyping(true)
    await processMessageToChatGPT(newMessages)
}
    async function processMessageToChatGPT(chatMessages) {
        let apiMessages = chatMessages.map((messageObject) => {
            let role = "";
            if (messageObject.sender === "bot") {
                role = "assistant"
            } else {
                role = "user"
            }
            return {role: role, content: messageObject.message}
        })
        const systemMessage = {
            role: "system",
            content: "Explain all concepts like I am 10 years old."
        }
        const apiRequestBody = {
            "model": "gpt-4o",
            "messages": [
                systemMessage,
                ...apiMessages
            ]
        }
        await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + import.meta.env.VITE_OPENAI_API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(apiRequestBody)
        }).then(data => data.json()).then(data => {
            console.log(data)
            setMessages([...chatMessages, {
                message: data.choices[0].message.content,
                sender: "ChatGPT",
                direction: "incoming"

            }]);
            setTyping(false);
        })
    }
    return (
        <>
        <div style={{position: "relative", height: 800, width: 700}}>
            <MainContainer>
                <ChatContainer>
                    <MessageList
                        scrollBehavior="smooth"
                        typingIndicator={typing ? <TypingIndicator content="Помощник печатает..."/> : null}
                    >
                        {messages?.map((message, i) => {
                            return <Message key={i} model={message}/>
                        })}
                    </MessageList>
                    <MessageInput
                        placeholder={'Пишите сообщение здесь'}
                        onSend={(message) => handleSend(message)}
                        autoFocus
                    />
                </ChatContainer>
            </MainContainer>
        </div>
        </>
    )
}

export default App
