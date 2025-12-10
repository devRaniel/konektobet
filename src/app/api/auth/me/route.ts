// import { NextRequest, NextResponse } from "next/server";
// import { verifyToken } from "@/lib/jwt";
// import { users } from "@/lib/db";

// export async function GET(req: NextRequest) {
//   const auth = req.headers.get("authorization");
//   if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   const token = auth.split(" ")[1];
//   const payload: any = verifyToken(token);

//   if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   const user = users.find(u => u.id === payload.id);
//   if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

//   return NextResponse.json({ id: user.id, username: user.username, email: user.email });
// }
