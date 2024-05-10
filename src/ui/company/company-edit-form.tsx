"use client";

import { useFormState, useFormStatus } from "react-dom";
import { updateCompany } from "@/lib/actions";
import Image from "next/image";
import { CREATE_COMPANY_STEPS } from "@/constants";
import { ChangeEvent, useState } from "react";
import { ProgressBar } from "@/ui/components/progress-bar";
import { Company } from "@/lib/definitions";
import { readFileAsDataURL } from "@/lib/utils";
import { CompanyImage } from "../components/company-image";
import { z } from "zod";

interface FormErrors {
  name?: string[];
  description?: string[];
  image?: string[];
}

export default function EditCompanyForm({ company }: { company: Company }) {
  const initialState = { message: "", errors: {} };
  const [state, dispatch] = useFormState(updateCompany, initialState);
  const lastStep = CREATE_COMPANY_STEPS;
  const [currentStep, setCurrentStep] = useState(1);
  const initialImageValue = `${process.env.NEXT_PUBLIC_BACKEND_URL}${company.image_url}`;
  const [previewImage, setPreviewImage] = useState(initialImageValue);
  const [errors, setErrors] = useState<FormErrors>({});
  const initialCompanyValue = company.name;
  const [companyValue, setCompanyValue] = useState(initialCompanyValue);
  const initialDescriptionValue = company.description;
  const [descriptionValue, setDescriptionValue] = useState(
    initialDescriptionValue
  );

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyValue(e.target.value);
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescriptionValue(e.target.value);
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      try {
        const previewUrl = await readFileAsDataURL(file);
        setPreviewImage(previewUrl);
      } catch (error) {
        console.error("Error reading file: ", error);
      }
    }
  };

  const handleStep = (step: number) => {
    if (step > 0) {
      const formSchema = z.object({
        name: z
          .string()
          .min(1, { message: "El nombre de la empresa es obligatorio" }),
        description: z
          .string()
          .min(1, { message: "El nombre de la empresa es obligatorio" }),
      });
      let validateFields;
      switch (currentStep) {
        case 1:
          setErrors({});
          const nameSchema = formSchema.pick({ name: true });
          validateFields = nameSchema.safeParse({
            name: companyValue,
          });
          break;
        case 2:
          setErrors({});
          const descriptionSchema = formSchema.pick({ description: true });
          validateFields = descriptionSchema.safeParse({
            description: descriptionValue,
          });
          break;
        default:
          validateFields = formSchema.partial().safeParse({});
      }
      if (!validateFields.success) {
        setErrors(validateFields.error.flatten().fieldErrors);
        return;
      }
    }
    setCurrentStep((prevStep) => prevStep + step);
  };

  return (
    <>
      <Image
        src="/images/icons/back.png"
        width={32}
        height={60}
        alt="Atrás"
        className="back"
        priority={true}
        onClick={() => handleStep(-1)}
      />
      <ProgressBar progress={(100 / lastStep) * currentStep} />
      <form className="form" action={dispatch}>
        <div
          className={`step ${currentStep > 1 ? "step--past" : ""} ${
            currentStep === 1 ? "step--current" : ""
          } ${currentStep < 1 ? "step--future" : ""}`}
        >
          <div className="form-group">
            <label htmlFor="company">Empresa</label>
            <input
              id="company"
              name="company"
              type="text"
              placeholder="Escribe el nombre de la empresa"
              onChange={handleCompanyChange}
              defaultValue={companyValue}
            />
            {errors?.name &&
              errors.name.map((error: string, index: number) => (
                <p className="error" key={index}>
                  {error}
                </p>
              ))}
            {state.errors?.name &&
              state.errors.name.map((error: string, index: number) => (
                <p className="error" key={index}>
                  {error}
                </p>
              ))}
          </div>
          <div className="form-footer">
            <button
              type="button"
              onClick={() => {
                handleStep(1);
              }}
              className="btn btn--primary"
            >
              Continuar
            </button>
          </div>
        </div>
        <div
          className={`step ${currentStep > 2 ? "step--past" : ""} ${
            currentStep === 2 ? "step--current" : ""
          } ${currentStep < 2 ? "step--future" : ""}`}
        >
          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              placeholder="Escribe una descripción de la empresa"
              onChange={handleDescriptionChange}
              defaultValue={descriptionValue}
            />
            {errors?.description &&
              errors.description.map((error: string, index: number) => (
                <p className="error" key={index}>
                  {error}
                </p>
              ))}
            {state.errors?.description &&
              state.errors.description.map((error: string, index: number) => (
                <p className="error" key={index}>
                  {error}
                </p>
              ))}
          </div>
          <div className="form-footer">
            <button
              type="button"
              onClick={() => {
                handleStep(1);
              }}
              className="btn btn--primary"
            >
              Continuar
            </button>
          </div>
        </div>

        <div
          className={`step ${currentStep > 3 ? "step--past" : ""} ${
            currentStep === 3 ? "step--current" : ""
          } ${currentStep < 3 ? "step--future" : ""}`}
        >
          <div className="form-group">
            <label htmlFor="image">Logotipo</label>
            <CompanyImage
              src={
                previewImage && !errors.image
                  ? previewImage
                  : "/images/logo-watermark.png"
              }
              editable={true}
              htmlFor="image"
            />
            <input
              type="file"
              id="image"
              name="image"
              accept="image/jpeg, image/png"
              onInput={handleImageChange}
            />
            {state.errors?.image &&
              state.errors.image.map((error: string, index: number) => (
                <p className="error" key={index}>
                  {error}
                </p>
              ))}
          </div>
          <div className="form-footer">
            {state.message && <p className="error">{state.message}</p>}
            <FormButton />
          </div>
        </div>
      </form>
    </>
  );
}
function FormButton() {
  const { pending } = useFormStatus();

  return (
    <button className="btn btn--primary" disabled={pending}>
      {pending ? "Cargando..." : "Actualizar empresa"}
    </button>
  );
}
