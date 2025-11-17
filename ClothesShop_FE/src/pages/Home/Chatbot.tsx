import { Box, IconButton, Stack, TextField, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { addMessage, type ChatMessage } from "../../store/slices/chatSlice";
import { GoogleGenAI } from "@google/genai";
import { useRef, useState } from "react";
import MessageLoading from "../../components/Loading/MessageLoading";
const schema = yup.object({
    message: yup.string().required("Message is required"),
});
export default function Chatbot({
    setChatOpen,
    setPopupOpen
}: {
    setChatOpen: (open: boolean) => void;
    setPopupOpen: (open: boolean) => void;
}) {
    const inputRef = useRef<HTMLDivElement | null>(null);
    const [lineCount, setLineCount] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const handleInput = () => {
        if (inputRef.current) {
            const textarea = inputRef.current.querySelector("textarea");
            const lines = textarea?.value?.split("\n").length || 1;
            setLineCount(lines);
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const messages = useSelector((state: any) => state.chat.messages);
    const dispatch = useDispatch();
    const { register, handleSubmit, reset } = useForm({
        resolver: yupResolver(schema),
    });
    const onSubmit = (data: { message: string }) => {
        const newMessage: ChatMessage = {
            id: Date.now().toString(),
            role: "user",
            content: data.message,
            createdAt: new Date().toISOString(),
        };
        dispatch(addMessage(newMessage));
        sendMessage(data.message);
        reset();
    };
    const ai = new GoogleGenAI({
        apiKey: "xxx",
    });

    async function sendMessage(message: string) {
        setIsLoading(true);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const contextMessages = messages.slice(-10).map((msg: { role: any; content: any; }) => ({
            role: msg.role,
            parts: [{ text: msg.content }]
        }));

        const systemPrompt = {
            role: "user",
            parts: [{
                text: `
Bạn là một chuyên gia thời trang trong cửa hàng quần áo tên là Zest.
Hãy tư vấn cho khách hàng về cách phối đồ, chọn size, chọn chất liệu phù hợp với từng dáng người, màu da và thời tiết.
Không trả lời các câu hỏi ngoài lĩnh vực thời trang.
Trả lời ngắn gọn không quá 50 chữ, thân thiện, chuyên nghiệp. Đây là câu chào đầu tiên: nếu conversation chưa bắt đầu, hãy nói:
"Chào bạn! Rất vui được gặp bạn tại Zest. Tôi là chuyên gia thời trang ở đây, sẵn lòng giúp bạn khám phá những phong cách ưng ý nhất."
`
            }]
        };

        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                systemPrompt,
                ...contextMessages,
                {
                    role: "user",
                    parts: [{ text: message }]
                }
            ]
        });

        dispatch(addMessage({
            id: Date.now().toString(),
            role: "model",
            content: result.candidates?.[0]?.content?.parts?.[0].text || "Xin lỗi, tôi chưa rõ câu hỏi của bạn.",
            createdAt: new Date().toISOString(),
        }));

        setIsLoading(false);
    }

    return (
        <Stack direction={"column"} sx={{
            position: "fixed",
            bottom: 0,
            right: 30,
            boxShadow: "rgba(124, 124, 124, 0.2) 0px 2px 8px 0px",
            height: "450px",
            zIndex: 1000,
            width: "20rem",
            borderRadius: "10px 10px 0 0",
            overflow: "hidden",
        }}>
            <Stack direction={"row"} sx={{
                backgroundColor: "#4557ffff",
                p: 1,
                justifyContent: "space-between",
                alignItems: "center",
            }}>
                <Stack direction={"row"} sx={{
                    gap: 1,
                    alignItems: "center",
                }}>
                    <Box sx={{
                        width: "11%",
                        overflow: "hidden",
                        borderRadius: "50%",
                        aspectRatio: "1/1",
    
                    }}>
                        <img style={{
                            width: "100%",
                            height: "100%", objectFit: "cover",
    
                        }} src="https://i.pinimg.com/1200x/8f/c1/3f/8fc13f9eeca50acb2c8f2c9b02bd231e.jpg" alt="" />
                    </Box>
                    <Typography sx={{
                        fontSize: "14px",
                        color: "white",
                        fontWeight: 500,
                    }}>
                        Chatbot AI tư vấn thời trang
                    </Typography>
                </Stack>
                <Box>
                    <IconButton size="small" onClick={() => { setChatOpen(false); setPopupOpen(true) }}>
                        <CloseIcon sx={{ color: "white" }} />
                    </IconButton>
                </Box>
            </Stack>
            <Stack direction="column" sx={{
                height: "100%",
                overflowY: "auto",
                backgroundColor: "#EBEDF2",
                p: 2,
                gap: 1,
            }}>
                {
                    messages.length === 0 && (
                        <Typography sx={{
                            fontSize: "14px",
                            color: "#888",
                            textAlign: "center",
                            mt:3
                        }}>
                            Hãy bắt đầu cuộc trò chuyện với tôi!
                        </Typography>
                    )
                }
                {
                    messages.map((message: ChatMessage) => (
                        <Typography
                            key={message.id}
                            sx={{
                                fontSize: "14px",
                                backgroundColor: message.role == "user" ? "#4557ff" : "#ffffff",
                                borderRadius: message.role == "user" ? "10px 10px 0px 10px" : "10px 10px 10px 0px",
                                color: message.role == "user" ? "white" : "black",
                                px: 1.5,
                                py: 1,
                                alignSelf: message.role == "user" ? "flex-end" : "flex-start",
                                maxWidth: "80%",
                            }}
                        >
                            {message.content}
                        </Typography>
                    ))
                } 
                {
                    isLoading && <MessageLoading loading={isLoading} />
                }

            </Stack>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack direction={"row"} sx={{
                    backgroundColor: "white",
                    p: 1,
                    gap: 1.5,
                    alignItems: "center",
                    borderTop: "1px solid #ccc",
                }}>
                    <TextField
                        {...register("message")}
                        size="small"
                        multiline
                        minRows={1}
                        maxRows={5}
                        inputRef={(el) => {
                            inputRef.current = el?.parentNode?.parentNode;
                        }}
                        onInput={handleInput}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: lineCount > 1 ? "20px" : "999px",
                                height: "auto",
                            },
                            "& .MuiInputBase-input::placeholder": {
                                fontSize: "12px",
                                color: "#888",
                            },
                            "& .MuiInputBase-input": {
                                fontSize: "12px",
                                color: "black",
                            },
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(onSubmit)();
                            }
                        }}
                        placeholder="Type your message..."
                        variant="outlined" fullWidth />
                    <Box>
                        <IconButton size="small" type="submit">
                            <SendIcon sx={{ color: "#4557ff" }} />
                        </IconButton>
                    </Box>

                </Stack>
            </form>
        </Stack>
    )
}
