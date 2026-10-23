"use client"
import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
    baseURL:"https://bazar-dor-gilt-seven.vercel.app"
})
export const {signIn,signUp,signOut,useSession,updateUser}=authClient;