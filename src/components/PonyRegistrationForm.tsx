import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import { registrationSchema as ponyScrollSchema, type PonyRegistrationScroll as PonyRegistrationScroll } from "../schemas/registrationSchema";

interface Props {
    onSubmit: (data: PonyRegistrationScroll) => void;
}

/**
 * A sparkly magical form for registering a pony in Equestria 🦄
 */
export const PonyRegistrationForm = ({ onSubmit }: Props) => {
    const [isScrollReady, setIsScrollReady] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm<PonyRegistrationScroll>({
        resolver: zodResolver(ponyScrollSchema),
        mode: "onChange",
    });

    const scrollFields = watch();

    useEffect(() => {
        const scrollComplete =
            !!scrollFields.firstName?.trim() &&
            !!scrollFields.lastName?.trim() &&
            !!scrollFields.email?.trim() &&
            !!scrollFields.birthDate &&
            !!scrollFields.city?.trim() &&
            !!scrollFields.postalCode?.trim();

        setIsScrollReady(scrollComplete);
    }, [scrollFields]);

    const handleMagicSubmit = (data: PonyRegistrationScroll) => {
        try {
            onSubmit(data);
            localStorage.setItem("equestrianRegistry", JSON.stringify(data));
            toast.success("✨ You've been registered in Equestria!");
            reset();
        } catch (error) {
            toast.error("💥 Oh no! There’s a hiccup in your spell...");
            console.error("Pony registration error:", error);
        }
    };

    const onScrollError = () => {
        toast.error("⚠️ Please fix the scroll before sending it to Princess Celestia!");
    };

    return (
        <form
            onSubmit={handleSubmit(handleMagicSubmit, onScrollError)}
            role="form"
            className="space-y-6 max-w-lg mx-auto p-8 bg-white rounded-2xl shadow-lg"
        >
            <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-purple-700">
                    Pony Name
                </label>
                <input
                    {...register("firstName")}
                    id="firstName"
                    className="mt-2 block w-full rounded-lg border border-purple-300 p-3 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
                {errors.firstName && (
                    <p className="text-pink-600 text-sm mt-1">{errors.firstName.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-purple-700">
                    Family Herd
                </label>
                <input
                    {...register("lastName")}
                    id="lastName"
                    className="mt-2 block w-full rounded-lg border border-purple-300 p-3 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
                {errors.lastName && (
                    <p className="text-pink-600 text-sm mt-1">{errors.lastName.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-semibold text-purple-700">
                    Scroll Address
                </label>
                <input
                    {...register("email")}
                    type="email"
                    id="email"
                    className="mt-2 block w-full rounded-lg border border-purple-300 p-3 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
                {errors.email && (
                    <p className="text-pink-600 text-sm mt-1">{errors.email.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="birthDate" className="block text-sm font-semibold text-purple-700">
                    Moon of Birth
                </label>
                <input
                    {...register("birthDate", { valueAsDate: true })}
                    type="date"
                    id="birthDate"
                    className="mt-2 block w-full rounded-lg border border-purple-300 p-3 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
                {errors.birthDate && (
                    <p className="text-pink-600 text-sm mt-1">{errors.birthDate.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="city" className="block text-sm font-semibold text-purple-700">
                    Village or Kingdom
                </label>
                <input
                    {...register("city")}
                    id="city"
                    className="mt-2 block w-full rounded-lg border border-purple-300 p-3 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
                {errors.city && (
                    <p className="text-pink-600 text-sm mt-1">{errors.city.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="postalCode" className="block text-sm font-semibold text-purple-700">
                    Magic Scroll Code
                </label>
                <input
                    {...register("postalCode")}
                    id="postalCode"
                    className="mt-2 block w-full rounded-lg border border-purple-300 p-3 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
                {errors.postalCode && (
                    <p className="text-pink-600 text-sm mt-1">{errors.postalCode.message}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={!isScrollReady}
                className={`w-full py-3 px-6 rounded-lg transition duration-300 ${isScrollReady
                    ? "bg-purple-500 text-white hover:bg-purple-600 focus:ring-2 focus:ring-purple-400"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
                Send Scroll to Canterlot
            </button>
        </form>
    );
};
