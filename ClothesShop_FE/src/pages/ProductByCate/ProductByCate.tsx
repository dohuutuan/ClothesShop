import { useQuery } from "@tanstack/react-query"
import { getProductsByCategoryApi } from "../../services/productService";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import { Box, Stack } from "@mui/material";
import BestSellerCard from "../Home/BestSellerCard";
import PagePagination from "../ProductDetail/PagePagination";
import { useEffect, useState } from "react";
import SortingSelect from "../ProductDetail/SortingSelect";
const items: Array<{ title: string; value: string }> = [
    {
        title: "Giá: cao tới thấp",
        value: "price:desc"
    },
    {
        title: "Giá: thấp tới cao",
        value: "price:asc"
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
export default function ProductByCate() {
    const { slug } = useParams();
    console.log(slug);
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState<string | null>("price:asc");
    
    const { data, isPending } = useQuery({
        queryKey: ["productByCate", slug, page, sort],
        queryFn: () => getProductsByCategoryApi(slug || "", page, 8, sort),
    });
    useEffect(() => {
        scrollTo(0, 0);
    }, [slug]);
    if (isPending) {
        return <Loading />
    }
    return (
        <Box sx={{ px: 4, py: 3 }}>
            <Box>
                <SortingSelect value={sort}
                    onChange={(value) => setSort(value)}
                    items={items} />
            </Box>
            <Stack direction={"row"}
                sx={{
                    flexWrap: "wrap",
                    gap: 2,
                    mt:2
                }}>
                {
                    data && data.items.map((item: any, index: number) => (
                        <Box sx={{
                            width: "22%",
                        }}>
                            <BestSellerCard key={index} product={item} />
                        </Box>
                    ))
                }
            </Stack>
            <Stack direction={"row"}
                sx={{
                    justifyContent: "center",
                    alignItems: "center",
                    mt: 2
                }}
            >
                <PagePagination totalPages={data.totalPages} page={page} setPage={setPage} />
            </Stack>
        </Box>
    )
}
