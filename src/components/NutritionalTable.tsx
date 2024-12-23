import React from 'react';
import { ProductFields } from '@/types/ProductTypes';

interface NutritionalTableProps {
  product: ProductFields;
  selectedUnits: number;
  language: 'es' | 'en';
}

type NutrientType =
  | "calories"
  | "fatCalories"
  | "totalFat"
  | "cholesterol"
  | "sodium"
  | "totalCarbohydrates"
  | "protein"
  | "vitaminA"
  | "vitaminC"
  | "calcium"
  | "iron";

const dailyValues: Record<NutrientType, number> = {
  calories: 2000,
  fatCalories: 620,
  totalFat: 65,
  cholesterol: 300,
  sodium: 2400,
  totalCarbohydrates: 300,
  protein: 50,
  vitaminA: 5000,
  vitaminC: 60,
  calcium: 1000,
  iron: 18,
};

const translations = {
  es: {
    nutritionalInfo: "Información nutricional",
    servingSize: "Tamaño de la porción",
    servingContains: "contiene",
    calories: "Calorías",
    fatCalories: "Calorías de las grasas",
    totalFat: "Grasa total",
    saturatedFat: "Grasas saturadas",
    transFat: "Grasas trans",
    cholesterol: "Colesterol",
    sodium: "Sodio",
    totalCarbs: "Total de carbohidratos",
    fiber: "Fibra",
    sugars: "Azúcares",
    protein: "Proteína",
    vitaminA: "Vitamina A",
    vitaminC: "Vitamina C",
    calcium: "Calcio",
    iron: "Hierro",
    amountPerServing: "Cantidad por porción",
    dailyValue: "% Valor Diario*"
  },
  en: {
    nutritionalInfo: "Nutritional Information",
    servingSize: "Serving Size",
    servingContains: "contains",
    calories: "Calories",
    fatCalories: "Fat Calories",
    totalFat: "Total Fat",
    saturatedFat: "Saturated Fat",
    transFat: "Trans Fat",
    cholesterol: "Cholesterol",
    sodium: "Sodium",
    totalCarbs: "Total Carbohydrates",
    fiber: "Fiber",
    sugars: "Sugars",
    protein: "Protein",
    vitaminA: "Vitamin A",
    vitaminC: "Vitamin C",
    calcium: "Calcium",
    iron: "Iron",
    amountPerServing: "Amount Per Serving",
    dailyValue: "% Daily Value*"
  }
} as const;

const calculateDailyPercentage = (
  value: number | undefined,
  nutrient: NutrientType
): number | string => {
  if (value === undefined || value === null || isNaN(value)) {
    return 0;
  }
  return Math.round((value / dailyValues[nutrient]) * 100);
};

const NutritionalTable: React.FC<NutritionalTableProps> = ({ 
  product, 
  selectedUnits, 
  language 
}) => {
  const t = translations[language];

  if (!product?.nutrutionalTable) return null;

  const nt = product.nutrutionalTable.fields;
  const servingSize = ((Number(nt.servingSize)*100) * selectedUnits / product.units).toFixed(0);

  return (
    <div className="w-full bg-white rounded-md overflow-hidden border-2 border-[#936cad] text-sm">
      <div className="border-b border-[#936cad] p-1">
        <h3 className="title-font text-[#936cad] font-bold text-center text-sm">
          {t.nutritionalInfo}
        </h3>
      </div>
      <div className="p-0.5 text-center border-b-8 border-[#936cad]">
        <p className="body-font text-black text-xs">
          {t.servingSize} {t.servingContains} {servingSize}g*
        </p>
      </div>
      <div className="p-0.5">
        <div className="">
          <div className="p-0.5 border-b border-[#936cad]">
            <p className="text-[#936cad] sharp-font font-semibold text-xs">{t.amountPerServing}</p>
          </div>

          <div className="p-0.5 border-b border-[#936cad] flex justify-between">
            <span className="text-[#936cad] title-font text-xs">{t.calories}</span>
            <div className="text-right">
              <span className="text-black mr-1 body-font text-xs">{nt.calories}</span>
              <span className="text-black text-xs body-font">
                {calculateDailyPercentage(nt.calories, "calories")}% 
              </span>
            </div>
          </div>

          <div className="p-0.5 border-b-2 border-[#936cad] flex justify-between">
            <span className="text-[#936cad] title-font text-xs">{t.fatCalories}</span>
            <div className="text-right">
              <span className="text-black mr-1 body-font text-xs">{nt.fatCalories}</span>
              <span className="text-black text-xs body-font">
                {calculateDailyPercentage(nt.fatCalories, "fatCalories")}% 
              </span>
            </div>
          </div>

          <div className="p-0.5 border-b border-[#936cad] text-right">
            <span className="sharp-font text-xs body-font">{t.dailyValue}</span>
          </div>

          <div className="divide-y divide-[#936cad]">
            {[
              { label: t.totalFat, value: nt.totalFat, unit: 'g', nutrient: 'totalFat' as NutrientType },
              { label: t.saturatedFat, value: nt.fatCalories, unit: 'mg', nutrient: null },
              { label: t.transFat, value: 0, unit: 'mg', nutrient: null },
              { label: t.cholesterol, value: nt.cholesterol, unit: 'mg', nutrient: 'cholesterol' as NutrientType },
              { label: t.sodium, value: nt.sodium, unit: 'mg', nutrient: 'sodium' as NutrientType },
              { label: t.totalCarbs, value: nt.totalCarbohydrates, unit: 'g', nutrient: 'totalCarbohydrates' as NutrientType },
              { label: t.fiber, value: 0, unit: 'g', nutrient: null },
              { label: t.sugars, value: 4, unit: 'g', nutrient: null },
              { label: t.protein, value: nt.protein, unit: 'g', nutrient: 'protein' as NutrientType },
            ].map((item, index) => (
              <div key={index} className="p-0.5 flex justify-between">
                <span className="text-[#936cad] title-font text-xs">{item.label}</span>
                <div className="flex gap-0.5">
                  <span className="text-black body-font text-xs">{item.value}{item.unit}</span>
                  {item.nutrient && (
                    <span className="text-black text-xs body-font">
                      {calculateDailyPercentage(item.value, item.nutrient)}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-0.5 border-t-8 border-[#936cad] grid grid-cols-2 gap-0.5">
            <div className="flex justify-between">
              <span className="text-[#936cad] body-font text-xs">{t.vitaminA}</span>
              <span className="text-black body-font text-xs">
                {calculateDailyPercentage(nt.vitaminA, "vitaminA")}% 
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#936cad] body-font text-xs">{t.vitaminC}</span>
              <span className="text-black body-font text-xs">
                {calculateDailyPercentage(nt.vitaminC, "vitaminC")}% 
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#936cad] body-font text-xs">{t.calcium}</span>
              <span className="text-black body-font text-xs">
                {calculateDailyPercentage(nt.calcium, "calcium")}% 
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#936cad] body-font text-xs">{t.iron}</span>
              <span className="text-black body-font text-xs">
                {calculateDailyPercentage(nt.iron, "iron")}% 
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionalTable;