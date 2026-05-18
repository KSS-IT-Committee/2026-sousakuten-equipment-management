"use client";
import { createDeductionAction } from "@/lib/action";

export function DeductionForTest() {
  const testadd = async () => {
    await createDeductionAction({
      className: "2B",
      content: "ああああさああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ",
      points: 5,
    });
  }
  return (
    <button onClick={testadd}>テスト減点追加</button>
  );
}
