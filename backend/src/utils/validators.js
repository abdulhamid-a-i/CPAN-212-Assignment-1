import { ENUMS } from "../../config.js";


export function isCSV(filename) {
    return typeof filename === "string" && /\.csv/.test(filename.trim());
}


export function validateCreateWorkOrder(body) {
 const departments = ENUMS.DEPARTMENTS;
 const priorities = ENUMS.PRIORITY;
 const status = ENUMS.STATUS;

  if (!body.title || body.title.length < 5) errors.push({field: "title", reason: "Must be longer than 5 characters"});
  if (!body.description || body.description.length < 10) errors.push({field: "description", reason: "Must be more than 10 characters"});
  if (!departments.includes(body.department)) errors.push({field: "department", reason: "Must be IT/SAFETY/FACILITIES/OTHER"});
  if (!priorities.includes(body.priority)) errors.push({field: "priotity", reason: "Must be LOW/MEDIUM/HIGH"});
  if (!status.includes(body.status)) errors.push({field: "status", reason: "Must be NEW/IN_PROGRESS/BLOCKED/DONE"});


  return {
    ok: errors.length === 0,
    errors,
    value: {
      title: body.title,
      description: body.description,
      category: body.category,
      severity: body.severity
    }
  };
}

export function validateStatusChange(){
    return null;
}