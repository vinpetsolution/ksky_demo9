"use client";

import { cn } from "@/utils/classNames";
import Image from "next/image";
import React from "react";
import { Button } from "./Button";

interface GameCardProps {
    image: string;
    title: string;
    logo: string;
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
}

const GameCard = ({ image, title, className, onClick, disabled }: GameCardProps) => {
    return (
        <div
            className={cn("relative cursor-pointer", disabled && "opacity-50 pointer-events-none", className)}
        >
            <div
                className={cn(
                    "bg-transparent rounded-xl md:rounded-[20px] relative overflow-hidden",
                )}
            >
                <div className="bg-transparent rounded-xl md:rounded-[20px] group relative overflow-hidden">
                    <Image
                        src={image}
                        alt={title}
                        width={353}
                        height={197}
                        className="relative z-10 aspect-353/197 h-full w-full object-cover rounded-xl md:rounded-[20px]"
                    />
                    <div
                        className={cn(
                            "absolute inset-0 z-15 flex items-center justify-center",
                            "bg-[#222c] opacity-0 transition-opacity duration-300",
                            "group-hover:opacity-100"
                        )}
                    >
                        <div
                            className={cn(
                                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[50% + 10px] px-2.5",
                                "opacity-0 transition-all duration-300",
                                "group-hover:opacity-100 group-hover:-translate-y-1/2"
                            )}
                        >
                            <Button
                                variant="transparent"
                                className={cn("rounded-md text-base h-8 md:h-12 px-4 md:px-8 text-white bg-brand",
                                    "hover:bg-[#a30d25]",
                                    "hover:text-white"
                                )}
                                onClick={onClick}
                                disabled={disabled}
                            >
                                PLAY
                            </Button>
                        </div>
                    </div>
                </div>


                <h3
                    className={cn(
                        "z-20 w-full bg-transparent py-2 md:py-3 px-3 md:px-5 text-left text-xs md:text-sm text-ink",
                    )}
                >
                    {title}
                </h3>
            </div>
        </div>
    );
};

export default GameCard