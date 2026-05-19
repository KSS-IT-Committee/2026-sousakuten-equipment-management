"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { createEquipmentAction, updateEquipmentAction } from "./action";

import styles from "./AddEquipmentForm.module.css";

type EquipmentFormMode = "create" | "edit";

type EquipmentFormValues = {
  id?: number;
  name: string;
  quantity: number;
  picture?: string | null;
};

type AddEquipmentFormProps = {
  mode?: EquipmentFormMode;
  initialValues?: EquipmentFormValues;
};

export function AddEquipmentForm({
  mode = "create",
  initialValues,
}: AddEquipmentFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [preview, setPreview] = useState<string>(initialValues?.picture ?? "");

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

      if (mode === "edit" && initialValues?.id) {
        formData.set("equipmentId", String(initialValues.id));
        await updateEquipmentAction(formData);
      } else {
        await createEquipmentAction(formData);
      }

      router.push("/equipment");
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form ref={formRef} action={handleSubmit} className={styles.form}>
      {mode === "edit" && initialValues?.id ? (
        <input type="hidden" name="equipmentId" value={initialValues.id} />
      ) : null}
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
          defaultValue={initialValues?.name ?? ""}
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
          defaultValue={initialValues?.quantity ?? ""}
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
          {loading
            ? mode === "edit"
              ? "修正中..."
              : "追加中..."
            : mode === "edit"
              ? "修正する"
              : "機器を追加"}
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
