"use client";

import Image from "next/image";
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
  availableImages?: string[];
};

export function AddEquipmentForm({
  mode = "create",
  initialValues,
  availableImages = [],
}: AddEquipmentFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string>(
    initialValues?.picture ?? "",
  );

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

      router.push("/");
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
        <label className={styles.label}>アイコン画像を選択（オプション）</label>
        <div
          className={styles.imageGrid}
          style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
        >
          <div
            onClick={() => setSelectedImage("")}
            style={{
              width: 80,
              height: 80,
              border:
                selectedImage === "" ? "3px solid #007bff" : "1px solid #ccc",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              backgroundColor: "#f5f5f5",
              color: "#666",
              fontSize: "14px",
            }}
          >
            画像なし
          </div>

          {availableImages.map((imgPath) => (
            <div
              key={imgPath}
              onClick={() => setSelectedImage(imgPath)}
              style={{
                width: 80,
                height: 80,
                cursor: "pointer",
                overflow: "hidden",
                borderRadius: 8,
                border:
                  selectedImage === imgPath
                    ? "3px solid #007bff"
                    : "1px solid #ccc",
              }}
            >
              <Image
                src={imgPath}
                alt="icon"
                width={80}
                height={80}
                style={{ objectFit: "cover" }}
              />
            </div>
          ))}
        </div>

        <input type="hidden" name="picture" value={selectedImage} />
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
          onClick={() => router.push("/")}
        >
          キャンセル
        </button>
      </div>
    </form>
  );
}
