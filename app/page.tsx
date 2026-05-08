import { defaultFooter } from "@/app/components/footer";

export default function Home() {
  return (
    <main className="flex-1 flex items-center justify-center">
      <h1 className="text-4xl font-bold">創作展　貸出備品管理サイト</h1>
      {defaultFooter()}
    </main>
  );
}
