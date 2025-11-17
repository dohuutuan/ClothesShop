import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function PagePagination({ page, setPage, totalPages }: {
    page: number;
    setPage: (page: number) => void;
    totalPages: number;
}) {
    return (
        <Stack spacing={2}>
            <Pagination
                size='large'
                hidePrevButton={page === 1}
                hideNextButton={page === totalPages}
                onChange={(_, value) => {
                    setPage(value);
                }}
                page={page}
                count={totalPages}
                renderItem={(item) => (
                    <PaginationItem
                        slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                        {...item}
                    />
                )}
            />
        </Stack>
    );
}