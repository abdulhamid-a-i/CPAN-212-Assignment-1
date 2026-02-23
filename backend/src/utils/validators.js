import { ENUMS } from "../../config.js";


export function isCSV(filename) {
    return typeof filename === "string" && /\.csv$/i.test(filename.trim());
}


export function validateCreateWorkOrder(body) {
    const errors = [];
    const departments = ENUMS.DEPARTMENTS;
    const priorities = ENUMS.PRIORITY;

    if (!body.title || body.title.length < 5) errors.push({field: "title", reason: "Must be longer than 5 characters"});
    if (!body.description || body.description.length < 10) errors.push({field: "description", reason: "Must be more than 10 characters"});
    if (!departments.includes(body.department)) errors.push({field: "department", reason: "Must be IT/SAFETY/FACILITIES/OTHER"});
    if (!priorities.includes(body.priority)) errors.push({field: "priotity", reason: "Must be LOW/MEDIUM/HIGH"});
    if (body.assignee){
        if (!body.assignee || body.assignee.length > 30) errors.push({field: "assignee", reason: "Cannot be longer than 30 characters"});
    }

    return {
        ok: errors.length === 0,
        errors,
        value: {
        title: body.title,
        description: body.description,
        department: body.department,
        priority: body.priority,
        assignee: body.assignee ?? null
        }
    };
}

export function validateUpdate(body){
    const errors = [];
    const departments = ENUMS.DEPARTMENTS;
    const priorities = ENUMS.PRIORITY;

    if (!body.title || body.title.length < 5) errors.push({field: "title", reason: "Must be longer than 5 characters"});
    if (!body.description || body.description.length < 10) errors.push({field: "description", reason: "Must be more than 10 characters"});
    if (!departments.includes(body.department)) errors.push({field: "department", reason: "Must be IT/SAFETY/FACILITIES/OTHER"});
    if (!priorities.includes(body.priority)) errors.push({field: "priotity", reason: "Must be LOW/MEDIUM/HIGH"});
    if (body.assignee){
        if (!body.assignee || body.assignee.length > 30) errors.push({field: "assignee", reason: "Cannot be longer than 30 characters"});
    }

    return {
        ok: errors.length === 0,
        errors,
        value: {
        title: body.title,
        description: body.description,
        department: body.department,
        priority: body.priority,
        assignee: body.assignee ?? null
        }
    };
}

export function validateStatusChange(){
    return null;
}