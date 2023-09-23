
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ element: Component, ...props }) {
    const { isLoggedIn } = props;

    return (
        isLoggedIn
            ? <Component {...props} />
            : <Navigate to='/' replace />
    );
}

export default ProtectedRoute;
