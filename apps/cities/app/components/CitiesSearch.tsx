"use client";

import { useState } from "react";
import { CityDetails } from "./CityDetails";
import SearchWithSuggestions from "./SearchWithSuggestions";
import { EventToast, EventToastType } from "./EventToast";

export const CitiesSearch = () => {
    const [query, setQuery] = useState<string>();
    const [selectedCitiy, setSelectedCitiy] = useState<string | undefined>(undefined);
    const [toastType, setToastType] = useState<EventToastType | null>(null);

    const showToast = (type: EventToastType) => {
        setToastType(type);
        setTimeout(() => {
            setToastType(null);
        }, 3000);
    }

    const dropSelectedCity = () => {
        setQuery(undefined);
        setSelectedCitiy(undefined);
    }

    return (
        <div className="flex flex-col gap-4">
            <SearchWithSuggestions setSelectedCity={setSelectedCitiy} placeholder="Search city from database..." query={query} setQuery={setQuery} />
            {selectedCitiy && <CityDetails city={selectedCitiy} dropSelectedCity={dropSelectedCity} showToast={showToast} />}
            {toastType && <EventToast type={toastType} />}
        </div>
    )
}