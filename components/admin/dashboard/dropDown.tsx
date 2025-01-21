import React from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DropDown {
    items: string[],
    value: string,
    setvalue: (value: string) => void;
}

const DropDown = ({ items, value, setvalue }: DropDown) => {
    return (
        <DropdownMenu>
           <DropdownMenuTrigger>
    <div className='px-4 py-2 bg-gray-200 text-gray-800 border-2 border-darkBorder rounded-md hover:bg-gray-300 transition duration-150'>
        {value ? value : "Select"}
    </div>
</DropdownMenuTrigger>
            <DropdownMenuContent className="mb-1 max-h-60 overflow-y-auto scrollbar-hide">
                <DropdownMenuSeparator className='overflow-scroll scrollbar-hide' />
                {items.map((e, index) => (
                    <DropdownMenuItem key={index} onClick={() => setvalue(e)}>
                        {e}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default DropDown;
