export const stripTypenames = (value: any): any => {
  if (Array.isArray(value)) {
    /** if value is [], send each portion of array through this function  */
    return value.map(stripTypenames);
  } else if (value !== null && typeof value === "object") {
    /**
     * if value exists and is and object, then:
     * remove the __typename property
     * send the value back through this function (in case of nested []'s or {};s)
     * return newly sanitized object
     */
    const newObject: Record<any, any> = {};

    for (const property in value) {
      if (property !== "__typename") {
        newObject[property] = stripTypenames(value[property]);
      }
    }

    return newObject;
  } else {
    /** otherwise keep it unchanged */
    return value;
  }
};
