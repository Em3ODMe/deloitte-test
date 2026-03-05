
"use client";

import { Button, Label, Modal, ModalBody, ModalHeader, TextInput } from "flowbite-react";
import { useContext, useState } from "react";
import { ClientContext } from "./ClientSetup";
import type { EventToastType } from "./EventToast";

type EditCityProps = {
    cityId: string;
    population: number;
    rating: number;
    date: string;
    dropSelectedCity: () => void;
    showToast: (type: EventToastType) => void;
    refetch: () => void;
}

export function EditCity({ cityId, population, rating, date, dropSelectedCity, showToast, refetch }: EditCityProps) {
    const client = useContext(ClientContext);
    const [openModal, setOpenModal] = useState(false);
    const [estimatedPopulation, setEstimatedPopulation] = useState(population);
    const [touristRating, setTouristRating] = useState(rating);
    const [dateEstablished, setDateEstablished] = useState(date);

    function onCloseModal() {
        setOpenModal(false);
        setEstimatedPopulation(population);
        setTouristRating(rating);
        setDateEstablished(date);
    }

    function onUpdate() {
        client((c) => c.available[':id'].$put({ param: { id: cityId }, json: { estimatedPopulation, touristRating, dateEstablished } })).then(() => {
            showToast('success');
            onCloseModal();
            refetch();
        }).catch(() => {
            showToast('error');
        })
    }

    function onDelete() {
        client((c) => c.available[':id'].$delete({ param: { id: cityId } })).then(() => {
            showToast('error');
            dropSelectedCity();
        }).catch(() => {
            showToast('error');
        })
    }

    return (
        <>
            <Button onClick={() => setOpenModal(true)}>Edit</Button>
            <Modal show={openModal} size="md" onClose={onCloseModal} popup>
                <ModalHeader />
                <ModalBody>
                    <div className="space-y-6">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">Edit city</h3>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="estimatedPopulation">Estimated population</Label>
                            </div>
                            <TextInput
                                id="estimatedPopulation"
                                type="number"
                                placeholder="1000000"
                                value={estimatedPopulation}
                                onChange={(event) => setEstimatedPopulation(Number(event.target.value))}
                                required
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="touristRating">Tourist rating</Label>
                            </div>
                            <TextInput
                                id="touristRating"
                                type="number"
                                placeholder="1-10"
                                value={touristRating}
                                min={0}
                                max={10}
                                onChange={(event) => {
                                    const value = Number(event.target.value);
                                    if (value < 0) {
                                        setTouristRating(0);
                                    } else if (value > 10) {
                                        setTouristRating(10);
                                    } else {
                                        setTouristRating(value);
                                    }
                                }}
                                required
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="dateEstablished">Date established</Label>
                            </div>
                            <TextInput
                                id="dateEstablished"
                                type="date"
                                placeholder="YYYY-MM-DD"
                                value={dateEstablished}
                                onChange={(event) => setDateEstablished(event.target.value)}
                                required
                            />
                        </div>
                        <div className="w-full flex justify-between gap-2">
                            <Button outline onClick={onUpdate}>Update</Button>
                            <Button color="red" onClick={onDelete}>Delete from database</Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </>
    );
}
