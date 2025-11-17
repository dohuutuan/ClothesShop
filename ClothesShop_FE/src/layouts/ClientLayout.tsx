import { Navigate, Outlet } from "react-router-dom";
import Header from '../components/Header/Header';
import Footer from './../components/Footer';
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

export default function ClientLayout() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const role = useSelector((state: any) => state.auth.role);
    const headerRef = useRef<HTMLDivElement>(null!);
    const [headerHeight, setHeaderHeight] = useState(0);

    useEffect(() => {
        if (headerRef.current) {
            setHeaderHeight(headerRef.current.offsetHeight);
        }
    }, []);

    if(role?.toLowerCase() === 'admin') {
        return <Navigate to="/admin/dashboard" />;
    }

    return (
        <>
            <Header headerRef={headerRef}/>
            <main style={{ paddingTop: `${headerHeight}px` }}>
                <Outlet />
            </main>
            <Footer />
        </>
    )
}
