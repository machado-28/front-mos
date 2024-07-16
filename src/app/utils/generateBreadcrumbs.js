export const generateBreadcrumbs = (location) => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    return pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        return { name: value.charAt(0).toUpperCase() + value.slice(1), path: to };
    });
};