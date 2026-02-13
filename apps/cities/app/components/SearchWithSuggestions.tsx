"use client";

import React, { useState, useEffect, useRef, useContext } from 'react';
import { TextInput, ListGroup, ListGroupItem } from 'flowbite-react';
import { ClientContext } from './ClientSetup';

type SearchWithSuggestionsProps = {
    setSelectedCity: (city: string) => void;
    placeholder?: string;
    query?: string;
    setQuery: (query: string) => void;
}

export default function SearchWithSuggestions({ setSelectedCity, placeholder, query, setQuery }: SearchWithSuggestionsProps) {
    const client = useContext(ClientContext);
    const [cities, setCities] = useState<string[]>([]);

    useEffect(() => {
        client((c) => c.all.$get()).then((res) => {
            setCities(res);
        }).catch(() => {
            client((c) => c.list[":cursor{[0-9]+}?"].$get({ param: { cursor: undefined } })).then((res) => {
                setCities(res.entries.map((city) => city.name));
            })
        })

    }, [client])

    // const [query, setQuery] = useState("");
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        if (value.length > 0) {
            const filtered = cities.filter((item) =>
                item.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredSuggestions(filtered);
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    };

    const handleSelect = (item: string) => {
        setQuery(item);
        setSelectedCity(item);
        setIsOpen(false);
    };

    return (
        <div className="w-full relative" ref={wrapperRef}>
            {/* Flowbite TextInput */}
            <TextInput
                id="search"
                type="text"
                placeholder={placeholder}
                required
                value={query || ''}
                disabled={cities.length === 0}
                onChange={handleInputChange}
                onFocus={() => query && query.length > 0 && setIsOpen(true)}
                autoComplete="off"
            />

            {/* Suggestion Dropdown */}
            {isOpen && filteredSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-700 dark:border-gray-600 max-h-96 overflow-y-auto">
                    <ListGroup className="w-full">
                        {filteredSuggestions.map((suggestion, index) => (
                            <ListGroupItem
                                key={index}
                                onClick={() => handleSelect(suggestion)}
                                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                                {suggestion}
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                </div>
            )}
        </div>
    );
}