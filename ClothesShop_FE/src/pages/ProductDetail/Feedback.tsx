import { Box, Grid, Rating, Stack, Typography } from "@mui/material";
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import SortingSelect from "./SortingSelect";
import type { FeedbackPagedResponseDTO } from "../../types/types";
import FeedbackCard from "./FeedbackCard";
import PagePagination from "./PagePagination";
const filter = [
    {
        title: "Tất cả",
        value: 0,
    },
    {
        title: "5",
        value: 5,
    },
    {
        title: "4",
        value: 4,
    },
    {
        title: "3",
        value: 3,
    },
    {
        title: "2",
        value: 2,
    },
    {
        title: "1",
        value: 1,
    }
];
const items: Array<{ title: string; value: string }> = [
    {
        title: "Đánh giá: cao tới thấp",
        value: "star:desc"
    },
    {
        title: "Đánh giá: thấp tới cao",
        value: "star:asc"
    },
    {
        title: "Thời gian: gần đây nhất",
        value: "created_at:desc"
    },
    {
        title: "Thời gian: xa nhất",
        value: "created_at:asc"
    }
]
export default function Feedback({
    page,
    setPage,
    
    setStarFilter,
    starFilter,
    setSortOption,
    sortOption,
    feedback
}: {
    page: number;
    setPage: (page: number) => void;
    pageSize: number;
    setPageSize: (size: number) => void;
    setStarFilter: (value: number | null) => void;
    starFilter: number | null;
    setSortOption: (value: string | null) => void;
    sortOption: string | null;
    feedback: FeedbackPagedResponseDTO;
}) {
    return (
        <Box sx={{
            backgroundColor: "#F2F2F2",
            px: 8,
            py: 6,
        }}>
            <Grid container>
                <Grid size={4}>
                    <Typography variant="h6"
                        sx={{
                            textTransform: "uppercase",
                            fontWeight: 600,
                            fontSize: { xs: "1.2rem", lg: "37px" },
                            maxWidth: "70%",

                        }}>
                        Đánh giá sản phẩm
                    </Typography>
                    <Box sx={{ mt: 4 }}>
                        <Typography sx={{
                            fontSize: { xs: "0.8rem", lg: "14px" },
                            color: "#797979ff",
                            fontWeight: 600,
                            letterSpacing: "-0.5px",
                        }}>
                            Phân loại xếp hạng
                        </Typography>
                        <Stack direction={"column"}
                            sx={{
                                gap: 2,
                                mt: 1
                            }}>
                            {
                                filter.map((item, index) => (
                                    <Stack key={index} direction={"row"}
                                        onClick={() => setStarFilter(item.value)}
                                        sx={{ gap: 1, alignItems: "center",
                                            cursor: "pointer"
                                         }}>
                                        <Stack direction={"row"}
                                            sx={{
                                                width: { xs: "30px", lg: "20px" },
                                                aspectRatio: "1/1",
                                                border: "1px solid black",
                                                borderRadius: "5px",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}>
                                            <Box
                                                sx={{
                                                    width: "70%",
                                                    aspectRatio: "1/1",
                                                    backgroundColor: starFilter === item.value ? "#3f3ddd" : "transparent",
                                                    borderRadius: "2px",
                                                }}
                                            />
                                        </Stack>
                                        <Typography sx={{
                                            fontSize: { xs: "0.8rem", lg: "16px" },
                                            fontWeight: 600,
                                        }}>
                                            {item.title}
                                        </Typography>
                                        {item.value != 0 &&
                                            <Rating
                                                value={item.value}
                                                precision={1}
                                                readOnly
                                                size="medium"
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
                                        }
                                    </Stack>
                                ))
                            }
                        </Stack>
                    </Box>
                </Grid>
                <Grid size={8}>
                    <Stack direction={"row"} sx={{ gap: 1.5 }}>
                        <Typography sx={{
                            fontSize: { xs: "1.2rem", lg: "70px" },
                            fontWeight: 700,
                            letterSpacing: "-0.5px",
                        }}>
                            {feedback.averageRating.toFixed(1)}
                        </Typography>
                        <Stack direction={"column"}
                            sx={{
                                justifyContent: "end",
                                alignItems: "start",
                            }}>
                            <Rating
                                value={feedback.averageRating}
                                precision={0.1}
                                readOnly
                                size="medium"
                                icon={
                                    <StarRoundedIcon
                                        sx={{
                                            fontSize: "70px",
                                            color: '#F8C600',
                                        }}
                                    />
                                }
                                emptyIcon={
                                    <StarRoundedIcon
                                        sx={{
                                            fontSize: "72px",
                                        }}
                                    />
                                }
                            />
                            <Typography sx={{
                                fontSize: { xs: "0.8rem", lg: "14px" },
                                color: "#797979ff",
                                fontWeight: 500,
                                letterSpacing: "-0.5px",
                                pl: 1
                            }}>
                                Dựa trên {feedback.ratingCount} đánh giá đến từ khách hàng
                            </Typography>
                        </Stack>
                    </Stack>
                    {/* feedback */}
                    <Stack direction={"column"}
                        sx={{
                            gap: 2,
                        }}>
                        <Stack direction={"row"}
                            sx={{
                                mt: 3,
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}>
                            <Typography sx={{
                                fontSize: { xs: "0.8rem", lg: "14px" },
                                color: "#797979ff",
                                fontWeight: 500,
                                letterSpacing: "-0.5px",
                            }}>
                                Hiển thị đánh giá <b>
                                    {((feedback.page * feedback.pageSize) - (feedback.pageSize - 1))}-{feedback.page * feedback.pageSize}</b>
                            </Typography>
                            <SortingSelect items={items} value={sortOption}
                                onChange={(value) => setSortOption(value)} />
                        </Stack>
                        {feedback.feedbacks.map((item, index) => (
                            <FeedbackCard key={index} data={item} />
                        ))}
                        <Stack direction={"row"}
                            sx={{
                                justifyContent: "end",
                            }}>
                            <PagePagination page={page} setPage={setPage} totalPages={feedback.totalPages}/>
                        </Stack>
                    </Stack>

                </Grid>
            </Grid>
        </Box>
    )
}
