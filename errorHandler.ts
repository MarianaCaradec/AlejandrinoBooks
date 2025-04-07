export class DatabaseError extends Error {
    constructor(message = "Failed to connect to the database") {
        super(message);
        this.name = "DatabaseError";
    }
}

export class UserInputError extends Error {
    constructor(message = "Invalid input provided") {
        super(message);
        this.name = "UserInputError";
    }
}

export class AuthError extends Error {
    constructor(message = "Not authenticated") {
        super(message);
        this.name = "AuthError";
    }
}

export class NotFoundError extends Error {
    constructor(message = "Resource not found") {
        super(message);
        this.name = "NotFoundError";
    }
}

interface ErrorResponse {
    message: string;
    statusCode: number;
}


export function handleError(error: unknown): ErrorResponse {
    if (error instanceof DatabaseError) {
        console.error(`Error fetching database: ${error.message}`, {error});
        return {
            message: `Unexpected error ocurred while connecting to the database, please try again later: ${error.message}`,
            statusCode: 500,
        }
    }

    if (error instanceof UserInputError) {
        console.warn(`Validation error on input: ${error.message}`, {error});
        return {
            message: `Validation error: ${error.message}`,
            statusCode: 400,
        }
    }

    if (error instanceof AuthError) {
        console.warn(`Authentication error: ${error.message}`, {error});
        return {
            message: `You're not authenticated: ${error.message}`,
            statusCode: 401,
        }
    }

    if (error instanceof NotFoundError) {
        console.warn(`Not found error: ${error.message}`, {error});
        return {
            message: `Resource not found: ${error.message}`,
            statusCode: 404,
        }
    }

    const genericError = error instanceof Error ? error : new Error(String(error));
    console.error(`Unexpected error: ${genericError.message}`, {error});
    return {
        message: "Unexpected unknown error occurred, please contact our team to notify us",
        statusCode: 500,
    }
}
