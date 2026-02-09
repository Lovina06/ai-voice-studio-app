"use client";

import { usePathname } from "next/navigation";
import { Breadcrumb, BreadcrumbPage } from "../ui/breadcrumb";
import path from "path";


export default function BreadCrumbPageClient (){
    const pathname=usePathname();
    const getPageTitle=(path:string)=>{
        
    
    switch(path){
        case "/dashboard":
            return "Dashboard";
        case "/dashboard/create":
            return "Create"
        case "/dashboard/settings":
            return "Settings";
            default:
                return "Dashboard";
    }
    };
    return (
        <BreadcrumbPage className="text-foreground text-sm font-medium">
            {getPageTitle(pathname)}
        </BreadcrumbPage>
    );
}
