import { Stack } from "@mui/material";
import PulseLoader from "react-spinners/PulseLoader";
export default function MessageLoading({loading}: {loading?: boolean}) {
    return (
        <Stack direction={"row"} sx={{
            width: "10%",
            backgroundColor: "white",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "999px 999px 999px 0px",
            px:3,
            py:1
        }}>
            <PulseLoader
                size={5}
                loading={loading}
                speedMultiplier={0.7}
            />
        </Stack>
    )
}
