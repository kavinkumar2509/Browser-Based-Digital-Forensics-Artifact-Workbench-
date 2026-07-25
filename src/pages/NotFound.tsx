import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <section className="text-center">
      <h1 className="text-2xl font-bold text-amber-400">404</h1>
      <p className="mt-2 text-sm text-slate-400">Route not found in operations console.</p>
      <Link to="/dashboard" className="mt-4 inline-block text-sm text-cyan-400 hover:text-cyan-300">
        Return to dashboard
      </Link>
    </section>
  );
};

export default NotFound;
