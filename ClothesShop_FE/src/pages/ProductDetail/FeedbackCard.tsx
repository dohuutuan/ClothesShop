import { Box, Rating, Stack, Typography } from "@mui/material";
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import type { FeedbackDTO } from "../../types/types";
import dayjs from 'dayjs';
export default function FeedbackCard({data} : {data : FeedbackDTO}) {
    return (
        <Stack direction={"column"}
            sx={{
                borderRadius: "10px",
                backgroundColor: "white",
                p: 3,
                alignItems: "start",
                gap: 1
            }}>
            <Box>
                <Stack direction={"row"}
                    sx={{ gap: 1,
                        alignItems: "end",
                     }}>
                    <Typography sx={{
                        fontSize: { xs: "1.2rem", lg: "16px" },
                        fontWeight: 700,
                        letterSpacing: "-0.5px",
                    }}>
                        {data.userName}
                    </Typography>
                    <span style={{ color: "#797979ff" }}>●</span>
                    <Typography sx={{
                        fontSize: { xs: "1.2rem", lg: "15px" },
                        fontWeight: 500,
                        color: "#797979ff",
                    }}>
                        {dayjs(data.createdAt).format("DD/MM/YYYY")}
                    </Typography>
                </Stack>
                <Rating
                    value={data.rating}
                    precision={1}
                    readOnly
                    size="medium"
                    sx={{ ml: "-2px" }}
                    icon={
                        <StarRoundedIcon
                            sx={{
                                fontSize: "22px",
                                color: 'black',
                            }}
                        />
                    }
                    emptyIcon={
                        <StarRoundedIcon
                            sx={{
                                fontSize: "22px",
                            }}
                        />
                    }
                />
            </Box>
            <Typography sx={{
                fontSize: { xs: "1.2rem", lg: "14px" },
                fontWeight: 500,
                letterSpacing: "-0.5px",
            }}>
                {data.comment}
            </Typography>

        </Stack>
    )
}
