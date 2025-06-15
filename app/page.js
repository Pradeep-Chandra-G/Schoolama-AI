// // app/page.tsx (or .js)
// import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { UserButton } from "@clerk/nextjs";

// export default function Home() {
//   const { userId } = auth();

//   if (!userId) {
//     redirect("/sign-in");
//   }

//   return (
//     <div>
//       <h2>
//         <UserButton />
//       </h2>
//     </div>
//   );
// }


// app/page.js
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


export default function Home() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }
}