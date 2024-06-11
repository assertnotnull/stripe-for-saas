import { User } from "@supabase/supabase-js";
import { atom } from "jotai";

export const loggedInUserAtom = atom<User | null>(null);
export const stripeCustomerAtom = atom<any | null>(null);
