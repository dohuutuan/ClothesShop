import { Box, Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { searchProductsApi } from "../../services/productService";
import Loading from "../../components/Loading/Loading";
import BestSellerCard from "../Home/BestSellerCard";
import PagePagination from "../ProductDetail/PagePagination";
import { useEffect, useState } from "react";

export default function SearchProduct() {
    const keyword = new URLSearchParams(window.location.search).get('keyword') || "";
    const [page, setPage] = useState(1);
    const { data, isPending } = useQuery({
        queryKey: ['search', keyword, page],
        queryFn: () => searchProductsApi(keyword, page, 8),
    });

    useEffect(() => {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }, [keyword]);
    if (isPending) {
        return <Loading />;
    }
    return (
        <Box sx={{ px: 4, py: 3 }}>
            <Stack direction={"row"}
                sx={{
                    flexWrap: "wrap",
                    gap: 2,
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
                    mt:2
                }}
            >
                <PagePagination totalPages={data.totalPages} page={page} setPage={setPage} />
            </Stack>
        </Box>
    )
}
