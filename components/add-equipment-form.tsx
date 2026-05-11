"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { createEquipmentAction } from "@/components/equipment-action";
import styles from "@/styles/add-equipment-form.module.css";

export function AddEquipmentForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [preview, setPreview] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      setLoading(true);
      setError("");

      const name = formData.get("name") as string;
      const quantity = parseInt(formData.get("quantity") as string);

      if (!name.trim()) {
        setError("機器名を入力してください");
        return;
      }

      if (!quantity || quantity <= 0) {
        setError("数量は1以上の数字を入力してください");
        return;
      }

      let picture: string | undefined;
      if (preview) {
        picture = preview;
      }

      await createEquipmentAction({
        name,
        quantity,
        picture,
      });

      router.push("/equipment");
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form ref={formRef} action={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.label}>
          機器名 <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="例: プロジェクター"
          className={styles.input}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="quantity" className={styles.label}>
          数量 <span className={styles.required}>*</span>
        </label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          placeholder="例: 5"
          className={styles.input}
          min="1"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="picture" className={styles.label}>
          画像（オプション）
        </label>
        <input
          type="file"
          id="picture"
          name="picture"
          accept="image/*"
          className={styles.fileInput}
          onChange={handleImageChange}
        />
        {preview && (
          <div className={styles.previewContainer}>
            <img src={preview} alt="Preview" className={styles.preview} />
          </div>
        )}
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.buttonGroup}>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? "追加中..." : "機器を追加"}
        </button>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={() => router.back()}
        >
          キャンセル
        </button>
      </div>
    </form>
  );
}
