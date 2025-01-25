"use client"

import { useSearchParams } from "next/navigation"

export default function AllertError() {
    const serachParams = useSearchParams();

    const error = serachParams.get("error")

        if(!error) return <></>
    return(
        <div className="bg-red-500 text-white font-bold px-8 py-2 rounded">
            Error: {error}
        </div>
    )
}