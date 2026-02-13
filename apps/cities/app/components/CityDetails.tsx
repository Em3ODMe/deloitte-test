"use client";

import { useCallback, useContext, useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import type { CityData } from "crud-api";
import { ClientContext } from "./ClientSetup";
import { EditCity } from "./EditCity";
import type { EventToastType } from "./EventToast";

type CityDetailsProps = {
    city: string;
    dropSelectedCity: () => void;
    showToast: (type: EventToastType) => void
}

export const CityDetails = ({ city, dropSelectedCity, showToast }: CityDetailsProps) => {
    const client = useContext(ClientContext);
    const [cityData, setCityData] = useState<CityData | null>(null);

    const drop = () => {
        dropSelectedCity();
        setCityData(null);
    }

    const fetch = useCallback(() => {
        if (!city) return;
        client((c) => c.available[':name'].$get({ param: { name: city } })).then((res) => {
            setCityData(res);
        })
    }, [city, client])

    useEffect(() => {
        fetch();
    }, [city, fetch])

    return cityData && (
        <div className="overflow-x-auto w-full">
            <Table>
                <TableHead >
                    <TableRow >
                        <TableHeadCell>Param</TableHeadCell>
                        <TableHeadCell>Value</TableHeadCell>
                        <TableHeadCell>
                            <span className="sr-only">Edit</span>
                        </TableHeadCell>
                    </TableRow>
                </TableHead>
                <TableBody className="divide-y">
                    {Object.entries(cityData).filter(([key]) => key !== 'id').map(([key, value], index) => (
                        <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800" key={`${key}-${index}`}>
                            <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white capitalize">
                                {key}
                            </TableCell>
                            <TableCell>{value}</TableCell>
                            <TableCell>
                                {key === 'name' && (
                                    <EditCity
                                        cityId={cityData.id}
                                        population={cityData.estimatedPopulation}
                                        rating={cityData.touristRating ?? 0}
                                        date={cityData.dateEstablished ?? ''}
                                        dropSelectedCity={drop}
                                        showToast={showToast}
                                        refetch={fetch}
                                    />
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}