import { isRecord } from "./record";

// Description of a guest
export type Guest = {
    name: string;
    guest_of: string;
    family: boolean;
    plus_one: boolean;
    tag_alongs: number;
    diet_restriction: string;
    guest_name: string;
    guest_restrictions: string;
}

/**
 * 
 * @param val unknown data to parse into a guest
 * @returns 
 */
export const parseGuest = (val: unknown): undefined | Guest => {
    if (!isRecord(val)) {
        console.error("not a guest", val);
        return undefined;
    } 

    if (typeof val.name !== "string") {
        console.error("not a guest: missing 'name'", val);
        return undefined;
    }

    if (typeof val.guest_of !== "string") {
        console.error("not a guest: missing 'host'");
        return undefined;
    }

    if (typeof val.family !== "boolean") {
        console.error("not a guest: missing 'family'");
        return undefined;
    }

    if (typeof val.plus_one !== "boolean") {
        console.error("not a guest: missing 'plus one'");
        return undefined;
    }

    if (typeof val.tag_alongs !== "number") {
        console.error("not a guest: missing 'how many people they're bringing'");
        return undefined;
    }

    if (typeof val.diet_restriction !== "string") {
        console.error("not a guest: missing 'dietary restrictions'");
        return undefined;
    }

    if (typeof val.guest_name !== "string") {
        console.error("not a guest: missing 'additional guests name'");
        return undefined;
    }

    if (typeof val.guest_restrictions !== "string") {
        console.error("not a guest: missing 'additional guests dietary restrictions'");
        return undefined;
    }

    return {
        name: val.name, guest_of: val.guest_of, family: val.family, plus_one: val.plus_one,
        tag_alongs: val.tag_alongs, diet_restriction: val.diet_restriction, guest_name: val.guest_name, guest_restrictions: val.guest_restrictions
    };
}