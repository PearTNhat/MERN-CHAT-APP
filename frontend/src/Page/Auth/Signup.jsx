import { useState } from 'react';
import useFormSignUp from '../../hooks/useFormSignUp';
import InputGroup from '../../components/InputGroup';
import Input from '../../components/InputGroup/Input';
import Label from '../../components/InputGroup/Label';
import { validateSignUp } from '../../hooks/validateInfo';
import './auth.css';
function SignUp() {
    const { values, handleChangeValue, errors, handleSubmit } =
        useFormSignUp(validateSignUp);
    const [showPassword, setShowPassword] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    return (
        <form className="form-auth" onSubmit={handleSubmit}>
            <InputGroup className="form-inputs">
                <Label htmlFor="name">Name: </Label>
                <Input
                    type="text"
                    placeholder="Enter your name"
                    name="name"
                    id="name"
                    value={values.name}
                    onChange={handleChangeValue}
                />
                {<p className="error-input">{errors.name}</p>}
            </InputGroup>
            <InputGroup className="form-inputs">
                <Label htmlFor="email">Email:</Label>
                <Input
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    id="email"
                    value={values.email}
                    onChange={handleChangeValue}
                />
                {<p className="error-input"> {errors.email}</p>}
            </InputGroup>
            <InputGroup className="form-inputs">
                <Label htmlFor="password">Password:</Label>
                <Input
                    className="icon-right"
                    type={showPassword ? 'password' : 'text'}
                    placeholder="Enter your password"
                    name="password"
                    id="password"
                    value={values.password}
                    onChange={handleChangeValue}
                >
                    {
                        <p
                            className="p-show-hide"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {' '}
                            {showPassword ? 'Show' : 'Hide'}
                        </p>
                    }
                </Input>
                {<p className="error-input">{errors.password}</p>}
            </InputGroup>
            <InputGroup className="form-inputs">
                <Label htmlFor="password2">Confirm password:</Label>
                <Input
                    className="icon-right"
                    type={showPassword ? 'password' : 'text'}
                    placeholder="Confirm your password"
                    name="password2"
                    id="password2"
                    value={values.password2}
                    onChange={handleChangeValue}
                >
                    {
                        <p
                            className="p-show-hide"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {' '}
                            {showPassword ? 'Show' : 'Hide'}
                        </p>
                    }
                </Input>

                <p className="error-input">{errors.password2}</p>
            </InputGroup>
            <InputGroup className="form-inputs">
                <Label htmlFor="pic">Confirm password:</Label>
                <Input
                    type="file"
                    accept="image/*"
                    name="pic"
                    id="pic"
                    onChange={(e) => handleChangeValue(e, setIsLoading)}
                />
            </InputGroup>
            <button type="submit" className="form-btn">
                {isLoading ? <span className="btn-loading"></span> : 'Sign in'}
            </button>
        </form>
    );
}

export default SignUp;
