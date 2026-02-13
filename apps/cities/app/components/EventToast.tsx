
import { Toast, ToastToggle } from "flowbite-react";
import { HiCheck, HiX } from "react-icons/hi";

export type EventToastType = 'success' | 'error';

export function EventToast({ type }: { type: EventToastType }) {
    return (
        <div className="flex flex-col gap-4 fixed bottom-16 right-8 z-50">
            {type === 'success' && (
                <Toast>
                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                        <HiCheck className="h-5 w-5" />
                    </div>
                    <div className="ml-3 text-sm font-normal">City has been updated.</div>
                    <ToastToggle />
                </Toast>
            )}
            {type === 'error' && (
                <Toast>
                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                        <HiX className="h-5 w-5" />
                    </div>
                    <div className="ml-3 text-sm font-normal">City has been deleted.</div>
                    <ToastToggle />
                </Toast>
            )}
        </div>
    );
}
