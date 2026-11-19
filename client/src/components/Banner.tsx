import React from 'react';

interface BannerProps {
    title: string;
    subtitle?: string;
    backgroundImage?: string;
    height?: string;
    children?: React.ReactNode;
    backgroundColor?: string;
}

const Banner: React.FC<BannerProps> = ({
                                           title,
                                           subtitle,
                                           backgroundImage,
                                           height = 'h-96',
                                           children,
                                           backgroundColor = 'bg-primary-dark',
                                       }) => {
    return (
        <div className={`relative w-full ${height} overflow-hidden ${backgroundColor} font-sans`}>
            {/* Background Image */}
            {backgroundImage && (
                <div className="absolute inset-0 w-full h-full">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${backgroundImage})` }}
                    />
                    <div className="absolute inset-0 bg-black/60" />
                </div>
            )}

            {/* Content: rendered visible (no fade-in) — the title is the page's largest element in the
                server HTML, and hiding it until JavaScript loads would delay what visitors see first */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 max-w-4xl uppercase tracking-wider">
                    {title}
                </h1>

                {subtitle && (
                    <p className="text-base sm:text-lg text-gray-200 max-w-2xl mb-8 font-light tracking-wide">
                        {subtitle}
                    </p>
                )}

                {children && (
                    <div>{children}</div>
                )}
            </div>
        </div>
    );
};

export default Banner;