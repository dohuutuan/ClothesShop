import { FormControl, MenuItem, Select } from "@mui/material";

function SortingSelect({ value, onChange, items }: {
    value: string | null;
    onChange: (value: string | null) => void;
    items: Array<{ title: string; value: string }>;
}) {
    return (
        <FormControl size="small" sx={{ minWidth: "220px" }}>
            <Select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                displayEmpty
                sx={{
                    fontSize: "14px",
                    borderRadius: "50px",
                }}
            >
                {
                    items.map((option) => (
                        <MenuItem
                            sx={{ fontSize: "14px" }}
                            key={option.value} value={option.value}>
                            {option.title}
                        </MenuItem>
                    ))
                }
            </Select>
        </FormControl>
    );
}
export default SortingSelect;