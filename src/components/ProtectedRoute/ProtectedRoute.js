
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ element: Component, ...props }) {

    const { isAuthenticated } = props;

    return (
        isAuthenticated
            ? <Component {...props} />
            : <Navigate to='/' replace />
    );
}

export default ProtectedRoute;
