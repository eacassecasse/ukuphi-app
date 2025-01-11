import * as React from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface FilterProps {
    label: string;
    items: string[]
}
export default function Filter({ filter }: { filter: FilterProps }) {
    return (
        <Select>
            <SelectTrigger className="w-[180px] bg-slate-100 rounded-2xl">
                <SelectValue placeholder={filter.label} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup className="my-2">
                    {
                        filter.items.map((item, index) => (
                            <SelectItem key={index} value={item}>{item}</SelectItem>
                        ))
                    }
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
