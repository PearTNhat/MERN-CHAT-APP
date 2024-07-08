import { useState } from 'react';
import useFormLogin from '../../hooks/useFormLogin';
import InputGroup from '../../components/InputGroup';
import Input from '../../components/InputGroup/Input';
import Label from '../../components/InputGroup/Label';
import { validateLogIn } from '../../hooks/validateInfo';
import './auth.css';
function Login() {
    const { values, handleChangeValue, errors, handleSubmit } =
        useFormLogin(validateLogIn);
    const [showPassword, setShowPassword] = useState(true);
    const loginWithGoogle = () => {
        window.open(
            `${process.env.REACT_APP_URL_SERVER}/api/auth/google`,
            '_self',
        );
    };

    return (
        <form onSubmit={handleSubmit}>
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
            <button type="submit" className="form-btn">
                Login
            </button>
            <button
                type="button"
                className="form-btn btn-user"
                onClick={loginWithGoogle}
            >
                Login with google
            </button>
        </form>
    );
}

export default Login;
