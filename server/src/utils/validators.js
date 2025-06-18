const composeValidationResult = (errors) => {
    return {
        isValid: errors.length == 0 ? true : false,
        errors: errors
    }
}

export const passwordValidator = (password) => {
    const errors = []

    if (password === null) {
        errors.push("Password is null")
        return errors
    }

    if (password.length < 6) errors.push("Password is too short")
    if (password.length > 32) errors.push("Password is too long")
    if (!(/[a-zA-Z]/).test(password)) errors.push("Password should contain letters")
    return errors
}

export const emailValidator = (email) => {
    const errors = []

    if (email === null) {
        errors.push("Password is null")
        return errors
    }

    if (!(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g).test(email))
        errors.push("Invalid email format")

    return errors
}

export const nameValidator = (name) => {
    const errors = []

    if (name === null) {
        errors.push("Name is null")
        return errors
    }

    if (name.length < 3) errors.push("Name is too short")
    if (name.length > 32) errors.push("Name is too long")

    return errors
}

export const userDtoValidator = (data = {email: undefined, name: undefined, password: undefined}) => {
    const errors = []

    if (data.email !== undefined) errors.concat(emailValidator(data.email))
    if (data.name !== undefined) errors.concat(nameValidator(data.name))
    if (data.password !== undefined) errors.concat(passwordValidator(data.password))

    return composeValidationResult(errors)
}

export const coAuthorsValidator = (coAuthors) => {
    const errors = []

    if (coAuthors == null || Array.isArray(coAuthors)) {
        errors.push('The given coAuthours object is not an array')
    } else if (coAuthors.length > 10) errors.push('coAuthors length should not be greater than 10')

    return composeValidationResult(errors)
}

export const projectDtoValidator = (name) => {
    const errors = nameValidator(name)
    return composeValidationResult(errors)
}