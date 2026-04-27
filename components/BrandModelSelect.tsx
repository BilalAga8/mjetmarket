"use client";

import { useState } from "react";
import { carBrands, brandNames } from "@/data/carBrands";

interface Props {
  brand: string;
  model: string;
  onBrandChange: (v: string) => void;
  onModelChange: (v: string) => void;
  selectClass: string;
  inputClass: string;
  labelClass: string;
}

function initBrandSel(brand: string) {
  if (!brand) return "";
  return brandNames.includes(brand) ? brand : "Tjetër";
}

function initModelSel(brand: string, model: string) {
  if (!model) return "";
  const list = carBrands[brand] ?? [];
  if (!list.length) return "";
  return list.includes(model) ? model : "Tjetër";
}

export default function BrandModelSelect({
  brand, model,
  onBrandChange, onModelChange,
  selectClass, inputClass, labelClass,
}: Readonly<Props>) {
  const [brandSel, setBrandSel] = useState(() => initBrandSel(brand));
  const [modelSel, setModelSel] = useState(() => initModelSel(brand, model));

  const modelList = brandSel && brandSel !== "Tjetër" ? (carBrands[brandSel] ?? []) : [];
  const showCustomBrand = brandSel === "Tjetër";
  const showModelDropdown = !showCustomBrand && modelList.length > 0;
  const showCustomModel = showModelDropdown && modelSel === "Tjetër";

  function handleBrandChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const v = e.target.value;
    setBrandSel(v);
    setModelSel("");
    onModelChange("");
    onBrandChange(v === "Tjetër" ? "" : v);
  }

  function handleModelChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const v = e.target.value;
    setModelSel(v);
    onModelChange(v === "Tjetër" ? "" : v);
  }

  return (
    <>
      {/* Marka */}
      <div>
        <label className={labelClass}>Marka *</label>
        <select value={brandSel} onChange={handleBrandChange} className={selectClass}>
          <option value="">Zgjidh markën</option>
          {brandNames.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
          <option value="Tjetër">Tjetër (shkruaj vetë)</option>
        </select>
        {showCustomBrand && (
          <input
            value={brand}
            onChange={(e) => onBrandChange(e.target.value)}
            placeholder="Shkruaj markën..."
            className={inputClass + " mt-2"}
          />
        )}
      </div>

      {/* Modeli */}
      <div>
        <label className={labelClass}>Modeli *</label>
        {showModelDropdown ? (
          <>
            <select value={modelSel} onChange={handleModelChange} className={selectClass}>
              <option value="">Zgjidh modelin</option>
              {modelList.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
              <option value="Tjetër">Tjetër (shkruaj vetë)</option>
            </select>
            {showCustomModel && (
              <input
                value={model}
                onChange={(e) => onModelChange(e.target.value)}
                placeholder="Shkruaj modelin..."
                className={inputClass + " mt-2"}
              />
            )}
          </>
        ) : (
          <input
            value={model}
            onChange={(e) => onModelChange(e.target.value)}
            placeholder="p.sh. 320d"
            className={inputClass}
            disabled={!brandSel}
          />
        )}
      </div>
    </>
  );
}
