export const validateFields = (requiredFields, data) => {
    const missingFields = requiredFields.filter(field => !data[field]);

    if (missingFields.length > 0) {
        return `Missing fields ${missingFields.join(", ")} required.`;
    }

    return null
}