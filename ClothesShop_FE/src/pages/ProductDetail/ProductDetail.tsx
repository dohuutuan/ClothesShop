import { Box } from "@mui/material";
import ProductOverall from "./ProductOverall";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Loading from "../../components/Loading/Loading";
import { useParams } from "react-router-dom";
import { getProductDescriptionApi, getProductDetailApi, getProductFeedbackApi } from "../../services/productService";
import { useEffect, useState } from "react";
import Description from "./Description";
import Privilege from "./Privilege";
import Feedback from "./Feedback";
export default function ProductDetail() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [starFilter, setStarFilter] = useState<number | null>(0);
    const [sortOption, setSortOption] = useState<string | null>("star:desc");
    const { id } = useParams();
    const parsedId = Number(id);
    const isValidId = !isNaN(parsedId) && parsedId > 0;

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, [id]);

    const { data: productDetail, isPending } = useQuery({
        queryKey: ["productDetail", parsedId],
        queryFn: () => getProductDetailApi(parsedId),
        enabled: isValidId, // chỉ gọi khi ID hợp lệ
        staleTime: 5 * 60 * 1000,
    });
    const { data: description, isPending: isPendingDescription } = useQuery({
        queryKey: ["productDescription", parsedId],
        queryFn: () => getProductDescriptionApi(parsedId),
        enabled: isValidId, // chỉ gọi khi ID hợp lệ
        staleTime: 5 * 60 * 1000,
    });
    const { data: feedback, isPending: isPendingFeedback } = useQuery({
        queryKey: ["productFeedback", page, pageSize, starFilter, sortOption],
        queryFn: () => getProductFeedbackApi(productDetail?.productId, page, pageSize, starFilter, sortOption), // Assuming productId is 1 for this example
        staleTime: 5 * 60 * 1000,
        enabled: !!productDetail,
        placeholderData: keepPreviousData
    });
    if (isPending || isPendingDescription || isPendingFeedback) {
        return <Loading />;
    }
    return (
        <Box sx={{ pt: 0, backgroundColor: "white" }}>
            {productDetail && <ProductOverall product={productDetail} />}
            {description && (
                <Description image={productDetail?.colors[0]?.images[0]} description={description} />
            )}
            {/* <Privilege /> */}
            <Privilege />
            {/* Feedback */}
            {feedback &&
                <Feedback page={page}
                    setPage={setPage}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    setStarFilter={setStarFilter}
                    starFilter={starFilter}
                    setSortOption={setSortOption}
                    sortOption={sortOption}
                    feedback={feedback} />}

        </Box>
    )

}
