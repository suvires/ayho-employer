"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { signIn } from "@/auth";
import {
  ROLE,
  API_ROUTES,
  MAX_UPLOAD_SIZE,
  ACCEPTED_IMAGE_TYPES,
} from "@/constants";
import { AuthError } from "next-auth";

const authenticateSchema = z.object({
  email: z
    .string()
    .min(1, "El email es obligatorio")
    .email("Escribe un email válido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export async function authenticate(prevState: any, formData: FormData) {
  try {
    const email = formData.get("email");
    const password = formData.get("password");

    const validatedFields = authenticateSchema.safeParse({
      password,
      email,
    });

    if (!validatedFields.success) {
      return {
        ...prevState,
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Revisa los errores de validación",
      };
    }

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { message: "Email o contraseña incorrectos" };
        default:
          return { message: "Sign in error: " + error.message };
      }
    }
    throw error;
  }
  revalidatePath("/offers");
  redirect("/offers");
}

const createUserSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  email: z
    .string()
    .min(1, "El email es boligatorio")
    .email("Escribe un email válido"),
  password: z
    .string()
    .min(1, "La contraseña es obligatoria")
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).*$/,
      "La contraseña debe tener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial."
    ),
});

export async function createUser(prevState: any, formData: FormData) {
  const name = formData.get("fullname");
  const password = formData.get("password");
  const email = formData.get("email");

  const validatedFields = createUserSchema.safeParse({
    name,
    password,
    email,
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Revisa los errores de validación",
    };
  }

  const role = ROLE.RECRUITER;

  try {
    const res = await fetch(
      `${process.env.BACKEND_URL}/${API_ROUTES.SIGN_UP}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      return {
        ...prevState,
        message: "API error: " + errorData.message,
      };
    }
  } catch (error: any) {
    return {
      message: "Sign up error: " + error.message,
    };
  }

  await authenticate(prevState, formData);
}

const createCompanySchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().min(1, "La descripción es obligatoria"),
  image: z
    .any()
    .refine((file: File) => file?.size !== 0, "El logotipo es obligatorio")
    .refine((file) => {
      return (
        !file ||
        (file instanceof File && ACCEPTED_IMAGE_TYPES.includes(file.type))
      );
    }, "El archivo debe ser PNG, JPG o JPEG")
    .refine(
      (file) => file?.size < MAX_UPLOAD_SIZE,
      "La imagen debe ocupar menos de 2MB."
    ),
});

export async function createCompany(prevState: any, formData: FormData) {
  const name = formData.get("company");
  const description = formData.get("description");
  const image = formData.get("image");

  const validatedFields = createCompanySchema.safeParse({
    name,
    description,
    image,
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Revisa los errores de validación",
    };
  }

  const session = await auth();

  try {
    const bodyFormData = new FormData();
    bodyFormData.append("name", name as string);
    bodyFormData.append("description", description as string);
    bodyFormData.append("image", image as File);
    const res = await fetch(
      `${process.env.BACKEND_URL}/${API_ROUTES.CREATE_COMPANY}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session!.accessToken}`,
        },
        body: bodyFormData,
      }
    );
    if (!res.ok) {
      const errorData = await res.json();
      return {
        ...prevState,
        message: "API error: " + errorData.message,
      };
    }
  } catch (error: any) {
    return {
      message: "Create company error: " + error.message,
    };
  }

  revalidatePath("/offers");
  redirect("/offers");
}

const createOfferSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  description: z.string().min(1, "La descripción es obligatoria"),
  salary: z.string().min(1, "El salario es obligatorio"),
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

export async function createOffer(prevState: any, formData: FormData) {
  const title = formData.get("title");
  const description = formData.get("description");
  const salary = formData.get("salary");
  const attendances = formData.getAll("attendances");
  const schedules = formData.getAll("schedules");
  const positions = formData.getAll("positions");
  const skills = formData.getAll("skills");
  const places = formData.getAll("places");

  const validatedFields = createOfferSchema.safeParse({
    title,
    description,
    salary,
    attendances,
    schedules,
    positions,
    skills,
    places,
  });
  if (!validatedFields.success) {
    return {
      ...prevState,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Revisa los errores de validación",
    };
  }

  const session = await auth();

  try {
    const res = await fetch(
      `${process.env.BACKEND_URL}/${API_ROUTES.CREATE_OFFER}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session!.accessToken}`,
        },
        body: JSON.stringify({
          title,
          description,
          salary,
          attendances,
          schedules,
          positions,
          skills,
          places,
        }),
      }
    );
    if (!res.ok) {
      const errorData = await res.json();
      return {
        ...prevState,
        message: "API Error: " + errorData,
      };
    }
  } catch (error: any) {
    return {
      message: "Create offer Error: " + error.message,
    };
  }

  revalidatePath("/offers");
  redirect("/offers");
}

const updateCompanySchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().min(1, "La descripción es obligatoria"),
  image: z
    .any()
    .refine((file) => {
      if (file.size === 0) return true;
      return (
        !file ||
        (file instanceof File && ACCEPTED_IMAGE_TYPES.includes(file.type))
      );
    }, "El archivo debe ser PNG, JPG o JPEG")
    .refine(
      (file) => file?.size < MAX_UPLOAD_SIZE,
      "La imagen debe ocupar menos de 2MB."
    ),
});

export async function updateCompany(prevState: any, formData: FormData) {
  const name = formData.get("company");
  const description = formData.get("description");
  const image = formData.get("image") as File;

  const validatedFields = updateCompanySchema.safeParse({
    name,
    description,
    image,
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Revisa los errores de validación",
    };
  }

  const session = await auth();

  try {
    const bodyFormData = new FormData();
    bodyFormData.append("name", name as string);
    bodyFormData.append("description", description as string);
    if (image && image.size > 0) {
      bodyFormData.append("image", image);
    }
    const res = await fetch(
      `${process.env.BACKEND_URL}/${API_ROUTES.UPDATE_COMPANY}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session!.accessToken}`,
        },
        body: bodyFormData,
      }
    );
    if (!res.ok) {
      const errorData = await res.json();
      return {
        ...prevState,
        message: "API error: " + errorData.message,
      };
    }
  } catch (error: any) {
    return {
      message: "Update company error: " + error.message,
    };
  }

  revalidatePath("/profile");
  redirect("/profile");
}

export async function deleteOffer(offerId: number) {
  const session = await auth();
  try {
    const res = await fetch(
      `${process.env.BACKEND_URL}/${API_ROUTES.DELETE_OFFER}/${offerId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session!.accessToken}`,
        },
      }
    );
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error("API error:" + errorData.message);
    }
  } catch (error: any) {
    return {
      message: "Unmatch error: " + error.message,
    };
  }

  revalidatePath("/offers");
  redirect("/offers");
}

export async function publishOffer(offerId: number) {
  const session = await auth();
  try {
    const res = await fetch(
      `${process.env.BACKEND_URL}/${API_ROUTES.PUBLISH_OFFER}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session!.accessToken}`,
        },
        body: JSON.stringify({
          id: offerId,
        }),
      }
    );
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error("API error:" + errorData.message);
    }
  } catch (error: any) {
    return {
      message: "Unmatch error: " + error.message,
    };
  }

  revalidatePath("/offers");
  redirect("/offers");
}

export async function unpublishOffer(offerId: number) {
  const session = await auth();
  try {
    const res = await fetch(
      `${process.env.BACKEND_URL}/${API_ROUTES.UNPUBLISH_OFFER}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session!.accessToken}`,
        },
        body: JSON.stringify({
          id: offerId,
        }),
      }
    );
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error("API error:" + errorData.message);
    }
  } catch (error: any) {
    return {
      message: "Unmatch error: " + error.message,
    };
  }

  revalidatePath("/offers");
  redirect("/offers");
}

const updateOfferSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  description: z.string().min(1, "La descripción es obligatoria"),
  salary: z.string().min(1, "El salario es obligatorio"),
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

export async function updateOffer(
  offerId: number,
  prevState: any,
  formData: FormData
) {
  const title = formData.get("title");
  const description = formData.get("description");
  const salary = formData.get("salary");
  const attendances = formData.getAll("attendances");
  const schedules = formData.getAll("schedules");
  const positions = formData.getAll("positions");
  const skills = formData.getAll("skills");
  const places = formData.getAll("places");

  const validatedFields = updateOfferSchema.safeParse({
    title,
    description,
    salary,
    attendances,
    schedules,
    positions,
    skills,
    places,
  });
  if (!validatedFields.success) {
    return {
      ...prevState,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Revisa los errores de validación",
    };
  }

  const session = await auth();

  try {
    const res = await fetch(
      `${process.env.BACKEND_URL}/${API_ROUTES.UPDATE_OFFER}/${offerId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session!.accessToken}`,
        },
        body: JSON.stringify({
          title,
          description,
          salary,
          attendances,
          schedules,
          positions,
          skills,
          places,
        }),
      }
    );
    if (!res.ok) {
      const errorData = await res.json();
      return {
        ...prevState,
        message: "API Error: " + errorData,
      };
    }
  } catch (error: any) {
    return {
      message: "Edit offer Error: " + error.message,
    };
  }

  revalidatePath("/offers");
  redirect("/offers");
}
