import { redirect } from "next/navigation";

export default function SignUpPage() {
  redirect("/acesso?tab=cadastrar");
}
