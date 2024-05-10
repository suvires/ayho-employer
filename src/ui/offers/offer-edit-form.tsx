"use client";

import { useFormState, useFormStatus } from "react-dom";
import { updateOffer } from "@/lib/actions";
import Image from "next/image";
import {
  Attendance,
  Schedule,
  Position,
  Skill,
  Place,
  Offer,
} from "@/lib/definitions";
import { ProgressBar } from "@/ui/components/progress-bar";
import { CREATE_OFFER_STEPS } from "@/constants";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";

interface FormErrors {
  title?: string[];
  description?: string[];
  salary?: string[];
  positions?: string[];
  skills?: string[];
  places?: string[];
  schedules?: string[];
  attendances?: string[];
}

export default function EditOfferForm({
  offer,
  attendances,
  schedules,
  places,
  positions,
  skills,
}: {
  offer: Offer;
  attendances: Attendance[];
  schedules: Schedule[];
  places: Place[];
  positions: Position[];
  skills: Skill[];
}) {
  const router = useRouter();
  const initialState = { message: "", errors: {} };
  const updateOfferWithId = updateOffer.bind(null, offer.id);
  const [state, dispatch] = useFormState(updateOfferWithId, initialState);
  const lastStep = CREATE_OFFER_STEPS;
  const [currentStep, setCurrentStep] = useState(0);
  const [titleValue, setTitleValue] = useState(offer.title);
  const [descriptionValue, setDescriptionValue] = useState(offer.description);
  const salaryRangeRef = useRef<HTMLInputElement>(null);
  const salaryOutputRef = useRef<HTMLOutputElement>(null);
  const [salaryValue, setSalaryValue] = useState(offer.salary.toString());
  const initialPositionsValue = offer.positions.map((position) => position.id);
  const [positionsValue, setPositionsValue] = useState<number[]>(
    initialPositionsValue
  );
  const initialSkillsValue = offer.skills.map((skill) => skill.id);
  const [skillsValue, setSkillsValue] = useState<number[]>(initialSkillsValue);
  const initialPlacesValue = offer.places.map((place) => place.id);
  const [placesValue, setPlacesValue] = useState<number[]>(initialPlacesValue);
  const initialSchedulesValue = offer.schedules.map((schedule) => schedule.id);
  const [schedulesValue, setSchedulesValue] = useState<number[]>(
    initialSchedulesValue
  );
  const initialAttendancesValue = offer.attendances.map(
    (attendance) => attendance.id
  );
  const [attendancesValue, setAttendancesValue] = useState<number[]>(
    initialAttendancesValue
  );
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (salaryValue && salaryOutputRef.current) {
      const value = Number(salaryValue);
      const min = Number((salaryRangeRef.current as HTMLInputElement).min);
      const max = Number((salaryRangeRef.current as HTMLInputElement).max);
      const relativeValue = ((value - min) * 100) / (max - min);
      salaryOutputRef.current.style.left = `calc(${relativeValue}% + (${
        8 - relativeValue * 0.15
      }px))`;
    }
  }, [salaryValue]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleValue(e.target.value);
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescriptionValue(e.target.value);
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSalaryValue(e.target.value);
  };

  const handlePositionsChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    position_id: number
  ) => {
    const checked = e.target.checked;
    if (checked) {
      setPositionsValue([...positionsValue, position_id]);
    } else {
      setPositionsValue(positionsValue.filter((id) => id !== position_id));
    }
  };

  const handleSkillsChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    skill_id: number
  ) => {
    const checked = e.target.checked;
    if (checked) {
      setSkillsValue([...skillsValue, skill_id]);
    } else {
      setSkillsValue(skillsValue.filter((id) => id !== skill_id));
    }
  };

  const handlePlacesChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    place_id: number
  ) => {
    const checked = e.target.checked;
    if (checked) {
      setPlacesValue([...placesValue, place_id]);
    } else {
      setPlacesValue(placesValue.filter((id) => id !== place_id));
    }
  };

  const handleSchedulesChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    schedule_id: number
  ) => {
    const checked = e.target.checked;
    if (checked) {
      setSchedulesValue([...schedulesValue, schedule_id]);
    } else {
      setSchedulesValue(schedulesValue.filter((id) => id !== schedule_id));
    }
  };

  const handleAttendancesChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    attendance_id: number
  ) => {
    const checked = e.target.checked;
    if (checked) {
      setAttendancesValue([...attendancesValue, attendance_id]);
    } else {
      setAttendancesValue(
        attendancesValue.filter((id) => id !== attendance_id)
      );
    }
  };

  const handleStep = (step: number) => {
    if (currentStep === 0 && step === -1) {
      router.back();
      return;
    }
    if (step > 0) {
      const formSchema = z.object({
        title: z.string().min(1, "El título es obligatorio"),
        description: z.string().min(1, "La descripción es obligatoria"),
        salary: z.string().refine((val: any) => Number(val) > 0, {
          message: "El salario es obligatorio",
        }),
        schedules: z.array(z.string()).nonempty({
          message: "Selecciona al menos un tipo jornada",
        }),
        attendances: z.array(z.string()).nonempty({
          message: "Selecciona al menos una modalidad",
        }),
        skills: z.array(z.string()).nonempty({
          message: "Selecciona al menos una habilidad",
        }),
        places: z.array(z.string()).nonempty({
          message: "Selecciona al menos una provincia",
        }),
        positions: z.array(z.string()).nonempty({
          message: "Selecciona al menos un puesto",
        }),
      });

      let validateFields;
      switch (currentStep) {
        case 0:
          setErrors({});
          const titleSchema = formSchema.pick({ title: true });
          validateFields = titleSchema.safeParse({
            title: titleValue,
          });
          break;
        case 1:
          setErrors({});
          const descriptionSchema = formSchema.pick({ description: true });
          validateFields = descriptionSchema.safeParse({
            description: descriptionValue,
          });
          break;
        case 2:
          setErrors({});
          const positionsSchema = formSchema.pick({ positions: true });
          validateFields = positionsSchema.safeParse({
            positions: positionsValue.map((id) => String(id)),
          });
          break;
        case 3:
          setErrors({});
          const skillsSchema = formSchema.pick({ skills: true });
          validateFields = skillsSchema.safeParse({
            skills: skillsValue.map((id) => String(id)),
          });
          break;
        case 4:
          setErrors({});
          const schedulesSchema = formSchema.pick({ schedules: true });
          validateFields = schedulesSchema.safeParse({
            schedules: schedulesValue.map((id) => String(id)),
          });
          break;
        case 5:
          setErrors({});
          const salarySchema = formSchema.pick({ salary: true });
          validateFields = salarySchema.safeParse({
            salary: salaryValue,
          });
          break;
        case 6:
          setErrors({});
          const attendancesSchema = formSchema.pick({ attendances: true });
          validateFields = attendancesSchema.safeParse({
            attendances: attendancesValue.map((id) => String(id)),
          });
          break;
        case 7:
          setErrors({});
          const placesSchema = formSchema.pick({ places: true });
          validateFields = placesSchema.safeParse({
            places: placesValue.map((id) => String(id)),
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
          className={`step ${currentStep > 0 ? "step--past" : ""} ${
            currentStep === 0 ? "step--current" : ""
          } ${currentStep < 0 ? "step--future" : ""}`}
        >
          <div className="form-group">
            <label htmlFor="title">Título</label>
            <input
              id="title"
              type="text"
              name="title"
              placeholder="Escribe el título de la oferta"
              onChange={handleTitleChange}
              defaultValue={titleValue}
            />
            {errors?.title &&
              errors.title.map((error: string, index: number) => (
                <p className="error" key={index}>
                  {error}
                </p>
              ))}
            {state.errors?.title &&
              state.errors.title.map((error: string, index: number) => (
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
          className={`step ${currentStep > 1 ? "step--past" : ""} ${
            currentStep === 1 ? "step--current" : ""
          } ${currentStep < 1 ? "step--future" : ""}`}
        >
          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe la oferta"
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
          className={`step ${currentStep > 2 ? "step--past" : ""} ${
            currentStep === 2 ? "step--current" : ""
          } ${currentStep < 2 ? "step--future" : ""}`}
        >
          <div className="form-group">
            <h2>Puestos</h2>
            <ul className="tags">
              {positions.map((position) => (
                <li
                  key={position.id}
                  className={
                    positionsValue.includes(position.id) ? "active" : ""
                  }
                >
                  <label htmlFor={`position-${position.id}`}>
                    <input
                      name="positions"
                      type="checkbox"
                      checked={positionsValue.includes(position.id)}
                      id={`position-${position.id}`}
                      value={position.id}
                      onChange={(e) => {
                        handlePositionsChange(e, position.id);
                      }}
                    />
                    {position.name}
                  </label>
                </li>
              ))}
            </ul>
            {errors?.positions &&
              errors.positions.map((error: string, index: number) => (
                <p className="error" key={index}>
                  {error}
                </p>
              ))}
            {state.errors?.positions &&
              state.errors.positions.map((error: string, index: number) => (
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
            <h2>Habilidades</h2>
            <ul className="tags">
              {skills.map((skill) => (
                <li
                  key={skill.id}
                  className={skillsValue.includes(skill.id) ? "active" : ""}
                >
                  <label htmlFor={`skill-${skill.id}`}>
                    <input
                      name="skills"
                      type="checkbox"
                      checked={skillsValue.includes(skill.id)}
                      id={`skill-${skill.id}`}
                      value={skill.id}
                      onChange={(e) => {
                        handleSkillsChange(e, skill.id);
                      }}
                    />
                    {skill.name}
                  </label>
                </li>
              ))}
            </ul>
            {errors?.skills &&
              errors.skills.map((error: string, index: number) => (
                <p className="error" key={index}>
                  {error}
                </p>
              ))}
            {state.errors?.skills &&
              state.errors.skills.map((error: string, index: number) => (
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
          className={`step ${currentStep > 4 ? "step--past" : ""} ${
            currentStep === 4 ? "step--current" : ""
          } ${currentStep < 4 ? "step--future" : ""}`}
        >
          <div className="form-group">
            <h2>Jornada</h2>
            <ul className="tags">
              {schedules.map((schedule) => (
                <li
                  key={schedule.id}
                  className={
                    schedulesValue.includes(schedule.id) ? "active" : ""
                  }
                >
                  <label htmlFor={`schedule-${schedule.id}`}>
                    <input
                      name="schedules"
                      type="checkbox"
                      checked={schedulesValue.includes(schedule.id)}
                      id={`schedule-${schedule.id}`}
                      value={schedule.id}
                      onChange={(e) => {
                        handleSchedulesChange(e, schedule.id);
                      }}
                    />
                    {schedule.name}
                  </label>
                </li>
              ))}
            </ul>
            {errors?.schedules &&
              errors.schedules.map((error: string, index: number) => (
                <p className="error" key={index}>
                  {error}
                </p>
              ))}
            {state.errors?.schedules &&
              state.errors.schedules.map((error: string, index: number) => (
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
          className={`step ${currentStep > 5 ? "step--past" : ""} ${
            currentStep === 5 ? "step--current" : ""
          } ${currentStep < 5 ? "step--future" : ""}`}
        >
          <div className="form-group">
            <label htmlFor="salary">Salario</label>
            <small>Las candidaturas verán el salario de la oferta</small>
            <div className="range">
              <input
                ref={salaryRangeRef}
                type="range"
                min="12000"
                max="100000"
                step="1000"
                id="salary"
                name="salary"
                defaultValue={salaryValue}
                onChange={handleSalaryChange}
              />
              {Number(salaryValue) > 0 && (
                <output htmlFor="salary" ref={salaryOutputRef}>
                  {`${Number(salaryValue)
                    .toLocaleString("es-ES", { useGrouping: true })
                    .replace(/\./g, " ")} €`}
                </output>
              )}
            </div>
            {errors?.salary &&
              errors.salary.map((error: string, index: number) => (
                <p className="error" key={index}>
                  {error}
                </p>
              ))}
            {state.errors?.salary &&
              state.errors.salary.map((error: string, index: number) => (
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
          className={`step ${currentStep > 6 ? "step--past" : ""} ${
            currentStep === 6 ? "step--current" : ""
          } ${currentStep < 6 ? "step--future" : ""}`}
        >
          <div className="form-group">
            <h2>Modalidad</h2>
            <ul className="tags">
              {attendances.map((attendance) => (
                <li
                  key={attendance.id}
                  className={
                    attendancesValue.includes(attendance.id) ? "active" : ""
                  }
                >
                  <label htmlFor={`attendance-${attendance.id}`}>
                    <input
                      name="attendances"
                      type="checkbox"
                      checked={attendancesValue.includes(attendance.id)}
                      id={`attendance-${attendance.id}`}
                      value={attendance.id}
                      onChange={(e) => {
                        handleAttendancesChange(e, attendance.id);
                      }}
                    />
                    {attendance.name}
                  </label>
                </li>
              ))}
            </ul>
            {errors?.attendances &&
              errors.attendances.map((error: string, index: number) => (
                <p className="error" key={index}>
                  {error}
                </p>
              ))}
            {state.errors?.attendances &&
              state.errors.attendances.map((error: string, index: number) => (
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
          className={`step ${currentStep > 7 ? "step--past" : ""} ${
            currentStep === 7 ? "step--current" : ""
          } ${currentStep < 7 ? "step--future" : ""}`}
        >
          <div className="form-group">
            <h2>Provincia</h2>
            <ul className="tags">
              {places.map((place) => (
                <li
                  key={place.id}
                  className={placesValue.includes(place.id) ? "active" : ""}
                >
                  <label htmlFor={`place-${place.id}`}>
                    <input
                      name="places"
                      type="checkbox"
                      checked={placesValue.includes(place.id)}
                      id={`place-${place.id}`}
                      value={place.id}
                      onChange={(e) => {
                        handlePlacesChange(e, place.id);
                      }}
                    />
                    {place.name}
                  </label>
                </li>
              ))}
            </ul>
            {errors?.places &&
              errors.places.map((error: string, index: number) => (
                <p className="error" key={index}>
                  {error}
                </p>
              ))}
            {state.errors?.places &&
              state.errors.places.map((error: string, index: number) => (
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
      {pending ? "Cargando..." : "Actualizar oferta"}
    </button>
  );
}
