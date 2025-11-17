import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react"
import { useLocation } from "react-router-dom";
import { activateAccountApi } from "../../services/authService";
import ActivateSuccess from "./ActivateSuccess";
import ActivateFail from "./ActivateFail";
import Loading from "../../components/Loading/Loading";

export default function ActivateAccount() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const activateAccount = useMutation({
        mutationFn: activateAccountApi,
    })
    useEffect(() => {
        if (token) {
            activateAccount.mutate(token);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);
    if (activateAccount.isPending) {
        return <Loading/>;
    }
    if (activateAccount.isError) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const error = activateAccount.error as any;
        const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            "Unknown error";
        return <ActivateFail message={errorMessage} token={token ?? ""}/>;
    }
    if (activateAccount.isSuccess) {
        return <ActivateSuccess />;
    }
    return <Loading/>;
}
