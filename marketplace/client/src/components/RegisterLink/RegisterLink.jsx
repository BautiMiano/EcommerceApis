
    const RegisterLink = ({ onClick }) => {
    return (
        <p className="register-link">
        ¿No tenés cuenta?{' '}
        <button type="button" onClick={onClick}>
            Creá tu cuenta acá
        </button>
        </p>
    )
    }

export default RegisterLink

