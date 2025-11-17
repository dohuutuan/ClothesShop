import { Box } from "@mui/material";
import Slider from "./Slider";
import "./home.scss";
import ParentCategory from "./ParentCategory";
import GenderCategory from "./GenderCategory";
import BestSeller from "./BestSeller";
import { useQuery } from "@tanstack/react-query";
import { getBestSellingProductsApi, getLatestProductsApi, getSubCategoriesApi } from "../../services/productService";
import ParentCategoryLoading from "../../components/Loading/ParentCategoryLoading";
import LatestProduct from './LatestProduct';
import Chatbot from "./Chatbot";
import PopupChat from "./PopupChat";
import { useState } from "react";
export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(true);
  const { data: genderCategory,
    isPending: isGenderCategoryLoading,
    isError: isGenderCategoryError } = useQuery({
      queryKey: ["genderCategory"],
      queryFn: () => getSubCategoriesApi(),
      staleTime: 1000 * 60 * 30,
    })
  const { data: bestSellingProducts,
    isPending: isBestSellingProductsLoading,
    } = useQuery({
      queryKey: ["bestSellingProducts"],
      queryFn: () => getBestSellingProductsApi(10),
      staleTime: 1000 * 60 * 30,
    })
  const { data: latestProducts,
    isPending: isLatestProductsLoading,
    } = useQuery({
      queryKey: ["latestProducts"],
      queryFn: () => getLatestProductsApi(10),
      staleTime: 1000 * 60 * 30,
    })
if(isBestSellingProductsLoading || isLatestProductsLoading){
  return <div>Loading...</div>;
}
  return (
    <Box className="home" sx={{ backgroundColor: "white" }}>

      <Slider />
      {/* parent categories */}
      <Box sx={{ px: 3, py: 6 }}>
        {
          isGenderCategoryLoading ?
            <ParentCategoryLoading />
            : isGenderCategoryError ? <div>Error loading categories</div>
              : <ParentCategory data={genderCategory} />
        }

        <GenderCategory />
      </Box>
      {/* best seller */}
      <BestSeller data={bestSellingProducts} />
      <LatestProduct data={latestProducts} />
      {/* chatbot */}
      {
        chatOpen && <Chatbot  
        setChatOpen={setChatOpen}
        setPopupOpen={setPopupOpen} />
      }
      {popupOpen && <PopupChat setChatOpen={setChatOpen} setPopupOpen={setPopupOpen} />}

    </Box>
  )
}
