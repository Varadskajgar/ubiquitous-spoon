import {NextResponse} from "next/server";import {verifyAdmin} from "@/lib/admin";
export async function GET(request:Request){try{const user=await verifyAdmin(request);return NextResponse.json({ok:true,message:`Admin verified: ${user.email}`})}catch(e){return NextResponse.json({ok:false,message:e instanceof Error?e.message:"Forbidden"},{status:403})}}
