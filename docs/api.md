# API Reference

The backend exposes two REST endpoints for submitting survey responses and retrieving aggregated results.

## Submit a Response

**`POST /api/responses`**

Submits a single survey response. Each answer must be an integer from 1 to 3.

### Request Body

```json
{
  "q1": 2,
  "q2": 1,
  "q3": 3
}
```

| Field | Type    | Required | Description                              |
|-------|---------|----------|------------------------------------------|
| q1    | integer | yes      | Dev environment setup friction (1-3)     |
| q2    | integer | yes      | CI/CD pipeline experience (1-3)          |
| q3    | integer | yes      | Finding documentation difficulty (1-3)   |

### Answer Values

| Value | Meaning per Question                  |
|-------|---------------------------------------|
| 1     | Low friction / Great / Easy           |
| 2     | Medium friction / Okay / Moderate     |
| 3     | High friction / Poor / Difficult      |

### Response

**201 Created**

```json
{
  "q1": 2,
  "q2": 1,
  "q3": 3,
  "submittedAt": "2026-03-04T15:30:00.000Z"
}
```

**400 Bad Request** -- returned if any answer is missing or not 1, 2, or 3.

```json
{
  "error": "Each answer must be 1, 2, or 3"
}
```

## Get Aggregated Results

**`GET /api/responses/results`**

Returns the count of responses for each option on each question, plus the total number of responses.

### Response

**200 OK**

```json
{
  "q1": { "1": 12, "2": 34, "3": 8 },
  "q2": { "1": 20, "2": 15, "3": 19 },
  "q3": { "1": 5, "2": 30, "3": 19 },
  "total": 54
}
```

Each question key (`q1`, `q2`, `q3`) contains an object mapping answer values (`"1"`, `"2"`, `"3"`) to the number of respondents who chose that option.
