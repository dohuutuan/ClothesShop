import { Autocomplete, Divider, Grid, TextField, Typography } from '@mui/material'
import PaymentMethod from './PaymentMethod';
import { Controller, useWatch } from "react-hook-form";
import { getDistrictListApi, getProvinceListApi, getWardListApi } from '../../services/addressService';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Loading from '../../components/Loading/Loading';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function OrderForm({ register,
    errors,
    control,
    setValue,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getValues }: any) {
    const selectedProvince = useWatch({ control, name: "province" });
    const selectedDistrict = useWatch({ control, name: "district" });
    const [districtOptions, setDistrictOptions] = useState([]);
    const [wardOptions, setWardOptions] = useState([]);
    const { data: provinces, isPending } = useQuery({
        queryKey: ['provinces'],
        queryFn: getProvinceListApi,
        staleTime: 1000 * 10 * 60, // 10 minutes
    });
    useEffect(() => {
        if (selectedProvince?.id) {
            const fetchDistricts = async () => {
                try {
                    const res = await getDistrictListApi(selectedProvince.id);
                    setDistrictOptions(res || []);

                    const currentDistrict = getValues("district");
                    // Nếu district hiện tại KHÔNG thuộc danh sách mới, reset
                    if (
                        currentDistrict &&
                        !res.some((d: any) => d.id === currentDistrict.id)
                    ) {
                        setValue("district", null);
                        setValue("ward", null);
                    }
                } catch (error) {
                    console.error("Failed to fetch districts", error);
                }
            };
            fetchDistricts();
        }
    }, [selectedProvince, getValues, setValue]);


    useEffect(() => {
        if (selectedDistrict?.id) {
            const fetchWards = async () => {
                try {
                    const res = await getWardListApi(selectedDistrict.id);
                    setWardOptions(res || []);

                    const currentWard = getValues("ward");
                    // Nếu ward hiện tại KHÔNG thuộc danh sách mới, reset
                    if (
                        currentWard &&
                        !res.some((w: any) => w.id === currentWard.id)
                    ) {
                        setValue("ward", null);
                    }
                } catch (error) {
                    console.error("Failed to fetch wards", error);
                }
            };
            fetchWards();
        }
    }, [selectedDistrict, getValues, setValue]);

    if (isPending) {
        return <Loading />;
    }
    return (
        <>
            <Typography sx={{
                fontSize: { xs: "1rem", lg: "30px" },
                fontWeight: 600,
                letterSpacing: "-1px",
            }}>
                Thông tin vận chuyển
            </Typography>

            <Grid container sx={{
                mt: 3,
            }}
                rowSpacing={2}
                columnSpacing={1} >
                <Grid size={6}>
                    <TextField label="Họ và tên"
                        {...register("fullName")}
                        error={!!errors.fullName}
                        helperText={errors.fullName?.message}
                        fullWidth
                        size="small"
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "50px"
                            },
                            "& .MuiInputLabel-root": {
                                fontSize: "14px",
                            }
                        }} />
                </Grid>
                <Grid size={6}>
                    <TextField label="Số điện thoại"
                        {...register("phone")}
                        error={!!errors.phone}
                        helperText={errors.phone?.message}
                        fullWidth
                        size="small"
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "40px"
                            },
                            "& .MuiInputLabel-root": {
                                fontSize: "14px",
                            }
                        }} />
                </Grid>
                <Grid size={12}>
                    <TextField label="Email"
                        {...register("email")}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        fullWidth
                        size="small"
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "40px"
                            },
                            "& .MuiInputLabel-root": {
                                fontSize: "14px",
                            }
                        }} />
                </Grid>
                <Grid size={12}>
                    <TextField label="Địa chỉ"
                        {...register("address")}
                        error={!!errors.address}
                        helperText={errors.address?.message}
                        fullWidth
                        size="small"
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "40px"
                            },
                            "& .MuiInputLabel-root": {
                                fontSize: "14px",
                            }
                        }} />
                </Grid>
                <Grid size={4}>
                    <Controller
                        name="province"
                        control={control}
                        render={({ field }) => (
                            <Autocomplete
                                {...field}
                                options={provinces}
                                getOptionLabel={(option) => option.name || ""}
                                onChange={(_, value) => {
                                    field.onChange(value);
                                }}
                                value={field.value || null}
                                size="small"
                                disableClearable
                                disablePortal
                                fullWidth
                                renderInput={(params) => (
                                    <TextField
                                        error={!!errors.province}
                                        helperText={errors.province?.message}
                                        {...params}
                                        label="Chọn tỉnh/thành phố"
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: "50px"
                                            },
                                            "& .MuiInputLabel-root": {
                                                fontSize: "14px"
                                            },
                                            "& .MuiInputLabel-shrink": {
                                                fontSize: "14px"
                                            },
                                            "& .MuiInputBase-input": {
                                                fontSize: "14px"
                                            },
                                            "& .MuiAutocomplete-option": {
                                                fontSize: "14px"
                                            },
                                        }}
                                    />
                                )}
                            />
                        )}
                    />
                </Grid>

                <Grid size={4}>
                    <Controller
                        name="district"
                        control={control}
                        render={({ field }) => (
                            <Autocomplete
                                disabled={!selectedProvince?.id}
                                {...field}
                                options={districtOptions}
                                getOptionLabel={(option) => option.name || ""}
                                onChange={(_, value) => {
                                    field.onChange(value);
                                }}
                                value={field.value || null}
                                size="small"
                                disableClearable
                                disablePortal
                                fullWidth
                                renderInput={(params) => (
                                    <TextField
                                        error={!!errors.district}
                                        helperText={errors.district?.message}
                                        {...params}
                                        label="Chọn quận/huyện"
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: "50px"
                                            },
                                            "& .MuiInputLabel-root": {
                                                fontSize: "14px"
                                            },
                                            "& .MuiInputLabel-shrink": {
                                                fontSize: "14px"
                                            },
                                            "& .MuiInputBase-input": {
                                                fontSize: "14px"
                                            },
                                            "& .MuiAutocomplete-option": {
                                                fontSize: "14px"
                                            },
                                        }}
                                    />
                                )}
                            />
                        )}
                    />
                </Grid>

                <Grid size={4}>
                    <Controller
                        name="ward"
                        control={control}
                        render={({ field }) => (
                            <Autocomplete
                                disabled={!selectedDistrict?.id}
                                {...field}
                                options={wardOptions}
                                getOptionLabel={(option) => option.name || ""}
                                onChange={(_, value) => {
                                    field.onChange(value);
                                }}
                                value={field.value || null}
                                size="small"
                                disableClearable
                                disablePortal
                                fullWidth
                                renderInput={(params) => (
                                    <TextField
                                        error={!!errors.ward}
                                        helperText={errors.ward?.message}
                                        {...params}
                                        label="Chọn phường/xã"
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: "50px"
                                            },
                                            "& .MuiInputLabel-root": {
                                                fontSize: "14px"
                                            },
                                            "& .MuiInputLabel-shrink": {
                                                fontSize: "14px"
                                            },
                                            "& .MuiInputBase-input": {
                                                fontSize: "14px"
                                            },
                                            "& .MuiAutocomplete-option": {
                                                fontSize: "14px"
                                            },
                                        }}
                                    />
                                )}
                            />
                        )}
                    />
                </Grid>
                <Grid size={12}>
                    <Divider sx={{
                        borderColor: '#b79e9eff',
                        mt: 2
                    }} />
                </Grid>
                <Grid size={12} >
                    <Typography sx={{
                        fontSize: { xs: "1rem", lg: "30px" },
                        fontWeight: 600,
                        letterSpacing: "-1px",
                    }}>
                        Hình thức thanh toán
                    </Typography>
                </Grid>
                <Grid size={12}>
                    <PaymentMethod selectedPaymentMethod={selectedPaymentMethod} setSelectedPaymentMethod={setSelectedPaymentMethod} />
                </Grid>
            </Grid>

        </>

    )
}
