"use server";

import { prisma } from "@/lib/prisma";
import { auth,currentUser } from "@clerk/nextjs/server";


export default async function syncUser(){
    const { userId } = await auth();
    
    // userId from auth can be a string | null , but prisma acpects only a string , so
    if (!userId) return null;


    const user = await currentUser();

    // If User already Exist
    const existinguser = await prisma.user.findUnique({
        where : {
            clerkId: userId,
        },
    })
    
    if(existinguser) return existinguser;


    const dbuser = await prisma.user.create({
        data : {
            clerkId : userId,
            name : `${user?.firstName || ""} ${user?.lastName || ""}`,
            username : user?.username ?? user?.emailAddresses[0].emailAddress.split("@")[0] ?? "",
            email : user?.emailAddresses[0].emailAddress ?? "",
            image : user?.imageUrl,
        }
    })

    return dbuser;
}                                                                                                                                                   