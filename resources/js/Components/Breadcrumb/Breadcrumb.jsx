import { Link, usePage } from '@inertiajs/react';

const Breadcrumb = () => {
  const { url } = usePage();
  const pathSegments = url.split('/').filter(Boolean);

  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/');
    const label = segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    const isLast = index === pathSegments.length - 1;

    return (
      <span key={index}>
        {!isLast ? (
          <>
            <Link href={path} className="text-gray-600 hover:underline">
              {label}
            </Link>
            <span className="mx-2">{'>'}</span>
          </>
        ) : (
          <span className="font-semibold text-gray-800">{label}</span>
        )}
      </span>
    );
  });

  return (
    <nav className="text-sm text-gray-500">
      <Link href="/" className="text-gray-600 hover:underline">Home</Link>
      {pathSegments.length > 0 && <span className="mx-2">{'>'}</span>}
      {breadcrumbs}
    </nav>
  );
};

export default Breadcrumb;
