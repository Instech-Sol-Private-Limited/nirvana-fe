import React from "react";
import { Field } from "formik";
import Link from "next/link";

interface CustomCheckboxProps {
  name: string;
  label: string;
  linkText?: string;
  link?: string;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  name,
  label,
  linkText,
  link,
}) => {
  return (
    <Field name={name}>
      {({ field, form }: any) => {
        const isChecked = field.value;

        return (
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => form.setFieldValue(name, !isChecked)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M17 3H7C4.79086 3 3 4.79086 3 7V17C3 19.2091 4.79086 21 7 21H17C19.2091 21 21 19.2091 21 17V7C21 4.79086 19.2091 3 17 3Z"
                stroke={isChecked ? "#00732E" : "#A0A0A0"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={isChecked ? "1" : "0.5"}
              />
              {isChecked && (
                <path
                  d="M9 12L11.25 14L15 10"
                  stroke="#00732E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>
            <span className="text-textdark">
              {label}{" "}
              <Link href={`/${link}`} className="text-[#8D1B3D] underline">
                {linkText}
              </Link>
            </span>
          </div>
        );
      }}
    </Field>
  );
};

export default CustomCheckbox;
