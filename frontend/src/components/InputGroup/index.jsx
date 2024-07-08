function InputGroup({ style, className, children }) {
    return (
        <div style={style} className={`i-l-container ${className}`}>
            {children}
        </div>
    );
}

export default InputGroup;
