import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";


// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check

type Guest = {
  name: string;
  guest_of: string;
  family: boolean;
  plus_one: boolean;
  tag_alongs: number;
  diet_restriction: string | undefined;
  guest_name: string | undefined;
  guest_restrictions: string | undefined;
}

const guests: Map<string, Guest> = new Map();



/** Testing function to remove all the added auctions. */
export const resetForTesting = (): void => {
  guests.clear();
};


/**
 * Returns a list of all of the guests and their info, 
 * sorted so that the ongoing guests come first, 
 * with the ones completed coming most recently.
 * @param _req the request 
 * @param res the responce
 */
export const listGuesets = (_req: SafeRequest, res: SafeResponse): void => {
  const vals = Array.from(guests.values());
  res.send({guests: vals});
}


/**
 * Add the guest to the list
 * @param req the request
 * @param res the response
 */
export const addGuest = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.body.name;
  if (typeof name !== 'string') {
    res.status(400).send("missing 'name' parameter");
    return;
  }

  const guest_of = req.body.guest_of;
  if (typeof guest_of !== 'string') {
    res.status(400).send("missing host name");
    return;
  }

  const plus_one = req.body.plus_one;
  if (typeof plus_one !== 'boolean') {
    res.status(400).send("not a true or false for if youre bringing someone");
    return;
  }

  const family = req.body.family;
  if (typeof family !== 'boolean') {
    res.status(400).send("not a true or false or if you're family");
    return;
  }

  const tag_alongs = req.body.tag_alongs;
  if (typeof tag_alongs !== 'number') {
    res.status(400).send("number of people you're bringing isn't a valid number");
    return;
  }

  const diet_restriction = req.body.diet_restriction;
  if (typeof diet_restriction !== 'string') {
    res.status(400).send("dietary restring is missing");
    return;
  }

  const guest_name = req.body.guest_name;
  if (typeof guest_name !== 'string') {
    res.status(400).send("additional guest name is missing");
    return;
  }

  const guest_restrictions = req.body.guest_restrictions;
  if (typeof guest_restrictions !== 'string') {
    res.status(400).send("missing additional guests dietary restrictions");
    return;
  }

  const guest: Guest = {
    name: name,
    guest_of: guest_of,
    plus_one: plus_one,
    family: family,
    tag_alongs: tag_alongs,
    diet_restriction: diet_restriction,
    guest_name: guest_name,
    guest_restrictions: guest_restrictions
  };

  guests.set(guest.name, guest);
  res.send({guest: guest});

}

/**
 * retrieves a current state of a given guest
 * @param req the request
 * @param res  the response
 */
export const getGuest = (req: SafeRequest, res: SafeResponse): void => {
  const name = first(req.query.name);
  if (name === undefined) {
    res.status(400).send("missing 'name' parameter");
    return;
  }

  const guest = guests.get(name);
  if (guest === undefined) {
    res.status(400).send(`no guest with name '${name}'`);
    return;
  }
  res.send({guest: guest});  // send back the current auction state
}

// TODO: remove the dummy route

/**
 * Dummy route that just returns a hello message to the client.
 * @param req The request object
 * @param res The response object
 */
export const dummy = (req: SafeRequest, res: SafeResponse): void => {
  const name = first(req.query.name);
  if (name === undefined) {
    res.status(400).send('missing or invalid "name" parameter');
    return;
  }

  res.send({msg: `Hi, ${name}!`});
};


// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
const first = (param: unknown): string|undefined => {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
};




