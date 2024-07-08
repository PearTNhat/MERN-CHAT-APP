const validateSignUp = (values) => {
    const errors = {};
    if (!values.name) {
        errors.name = 'Username required';
    }
    if (!values.email) {
        errors.email = 'Email required';
    } else if (
        !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(values.email)
    ) {
        errors.email = 'Email is invalid';
    }
    if (!values.password) {
        errors.password = 'Password required';
    } else if (values.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
    }
    if (!values.password2) {
        errors.password2 = 'Please confirm password';
    } else if (values.password2 !== values.password) {
        errors.password2 = 'Password do not match';
    }
    return errors;
};
const validateLogIn = (values) => {
    const errors = {};
    if (!values.email) {
        errors.email = 'Email required';
    } else if (
        !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(values.email)
    ) {
        errors.email = 'Email is invalid';
    }
    if (!values.password) {
        errors.password = 'Password required';
    } else if (values.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
    }
    return errors;
};
export { validateSignUp, validateLogIn };
