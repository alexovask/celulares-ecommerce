import { supabase } from "../supabase/client";

interface IAuthLogin {
  email: string;
  password: string;
}

interface IAuthRegister {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export const signUp = async ({
  email,
  password,
  fullName,
  phone,
}: IAuthRegister) => {
  // 1) Crear usuario en Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    // Mensajes pro para UX
    const msg = error.message.toLowerCase();

    if (msg.includes("already registered")) {
      throw new Error(
        "Este correo ya está registrado. Intenta iniciar sesión.",
      );
    }

    // Ej: password weak, invalid email, etc.
    throw new Error(error.message);
  }

  const userId = data.user?.id;
  if (!userId) throw new Error("No se pudo obtener el id del usuario.");

  const hasSession = Boolean(data.session);

  // 2) Crear registros en tablas (requiere policies RLS correctas)
  const { error: roleError } = await supabase.from("user_roles").insert({
    user_id: userId,
    role: "customer",
  });

  if (roleError) {
    throw new Error("No se pudo asignar el rol del usuario.");
  }

  const { error: customerError } = await supabase.from("customers").insert({
    user_id: userId,
    full_name: fullName,
    phone,
    email,
  });

  if (customerError) {
    throw new Error("No se pudieron guardar los datos del usuario.");
  }

  // 3) Si hay sesión, el usuario ya está logueado.
  // Si no, debe confirmar email y luego iniciar sesión.
  return { ...data, hasSession };
};

export const signIn = async ({ email, password }: IAuthLogin) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log(error);
    throw new Error("Email o contraseña incorrectos");
  }

  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.log(error);
    throw new Error("Error al cerrar sesión");
  }
};

export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.log(error);
    throw new Error("Error al obtener la sesión");
  }

  return data;
};

export const getUserData = async (userId: string) => {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.log(error);
    throw new Error("Error al obtener los datos del usuario");
  }

  return data;
};
