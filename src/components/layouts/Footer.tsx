import Link from "next/link";

const footerNav = [
    { label: "Privacy Policy", href: "/#" },
    { label: "About Us", href: "/#" },
    { label: "Affiliate Program", href: "/#" },
    { label: "Responsible Gaming", href: "/#" },
    { label: "Terms and Conditions", href: "/#" },
    { label: "Bonus Terms & Conditions", href: "/#" },
] as const;

const Footer = () => {
    return (
        <footer className="mt-auto w-full overflow-hidden border-t border-gold-line bg-[#F4EBDD] py-10 lg:bg-cream">
            <div className="mx-auto max-w-7xl px-[15px] pt-10 pb-6 text-center text-base text-muted">
                <p>© 2026 KSKY SOLUTION. All Rights Reserved.</p>
            </div>
            <nav
                aria-label="Footer links"
                className="mx-auto flex max-w-7xl flex-wrap items-center justify-center divide-x divide-gold-line px-3 py-4 text-sm text-ink"
            >
                {footerNav.map((item) => (
                    <Link
                        key={item.href + item.label}
                        href={item.href}
                        className="px-4 py-1 text-ink hover:text-gold-deep hover:underline sm:px-5"
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>
        </footer>
    );
};

export default Footer;
