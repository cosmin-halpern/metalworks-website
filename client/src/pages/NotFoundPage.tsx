import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const NotFoundPage = () => {
    return (
        <section className="min-h-[60vh] flex items-center justify-center px-4 py-20">
            <div className="text-center max-w-xl">
                <p className="text-6xl font-bold text-primary mb-4">404</p>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    Pagina nu a fost găsită
                </h1>
                <p className="text-gray-600 mb-8">
                    Pagina pe care o căutați nu există sau a fost mutată.
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark transition-colors duration-200"
                >
                    Înapoi la pagina principală
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </div>
        </section>
    );
};

export default NotFoundPage;
