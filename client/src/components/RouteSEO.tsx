import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { applySeo, resolveSeo } from '../seo/seo';

const RouteSEO = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        applySeo(resolveSeo(pathname));
    }, [pathname]);

    return null;
};

export default RouteSEO;
