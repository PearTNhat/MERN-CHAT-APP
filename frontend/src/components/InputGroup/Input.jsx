function Input({ children, className, ...props }) {
    return (
        <div className={className} style={{ display: 'flex' }}>
            <input {...props} />
            {children}
        </div>
    );
}

export default Input;
