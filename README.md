# CPAN-212-Assignment-1

Team: Abdulhamid Weheliye (n01756626, Section A), Mbaye Fall (n01764121, Section A), Cheyenne Hunsley (N01747035, Section A), Bandanpreet Kaur Malhi (n01726650, Section A), Laura Sofia Santana Acosta (N01737339,Section B)

## Business Case Summary
Internal operation requests in many organizations ofccure through fragmented and unstructured communication channels. This leads to the following inefficiencies:
- Inconsistent request formats which need repeated clarification
- Duplicate or lost requests due to visibility issues
- Uncontrolled progression tracking (WIP)
- Unclear ownership and accountability
- Tracibility and auditability issues
- Unable to measure operational performance and/or limitations

The solution is the development of Lean-inspired digital operational system which utilizes Toyota Production System (TPS) principles for internal service management.

## TPS Alignment Explanation

This application applies the TPS principles by:
- Providing a standardized request format
- Rejecting invalid work orders at upload (All work orders are validated to ensure quality)
- Providing a predefined work flow lifecycle that is enforced by the backend
- Providing a dashboard, details page and work orders table to ensure visibility of status, priority, and ownership.
- Providing clear and centralized error responses.


## Setup Instructions
Run app-start.bat


## API Documentation:

### /api/workorders Endpoint:

#### GET:
Accepts query parameters:
- status, department, priority, assignee
- q (keyword search on title)
- page
- limit

and returns work orders that match provided filters and paginates using page and limit filters.

#### POST:


### /api/workorders/:id Endpoint:

#### GET:
Accepts a work order id as a parameter and returns the specified work order.

Returns 200 with a structured response.

#### PUT:
Accepts a work order id as a parameter and updates one or more of the following valid fields:
- title
- description
- priority
- assignee

and then updates the specified work order and updates the 'updatedAt' field in the backend.

Returns 201 with a structured response on success or a 400 error response on validation failure.

#### DELETE:
Accepts a work order id as a parameter and deletes the specified work order from persistent storage.
Returns a 204 response.


### /api/workorders/:id/status Endpoint:

#### PATCH:
Sends a request to update status to the next allowed status. Backend validates the transition and rejects bad transition requests with a 409 error.

Returns 201 on successful status updates with a structured response.


## CSV Template:

title,description,department,priority,requesterName,assignee

