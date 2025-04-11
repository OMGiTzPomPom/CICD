import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PonyRegistrationForm } from "./PonyRegistrationForm";
import { toast } from "react-hot-toast";

// Mock react-hot-toast
vi.mock("react-hot-toast", () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

// Mock localStorage
const localStorageMock = (() => {
    let scrollVault: Record<string, string> = {};
    return {
        getItem: vi.fn((key: string) => scrollVault[key] || null),
        setItem: vi.fn((key: string, value: string) => {
            scrollVault[key] = value.toString();
        }),
        clear: vi.fn(() => {
            scrollVault = {};
        }),
    };
})();

Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
});

describe("PonyRegistrationForm", () => {
    const mockOnSubmit = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        localStorageMock.clear();
    });

    it("should disable the scroll button when the scroll is incomplete", () => {
        render(<PonyRegistrationForm onSubmit={mockOnSubmit} />);
        const submitButton = screen.getByText("Send Scroll to Canterlot");
        expect(submitButton).toBeDisabled();
    });

    it("should show an error toast when submitting an empty scroll", async () => {
        render(<PonyRegistrationForm onSubmit={mockOnSubmit} />);
        const form = screen.getByRole("form");
        fireEvent.submit(form);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
                "⚠️ Please fix the scroll before sending it to Princess Celestia!"
            );
        });
    });

    it("should save scroll data to localStorage and show success sparkle toast", async () => {
        render(<PonyRegistrationForm onSubmit={mockOnSubmit} />);

        fireEvent.input(screen.getByLabelText("Pony Name"), {
            target: { value: "Twilight" },
        });
        fireEvent.input(screen.getByLabelText("Family Herd"), {
            target: { value: "Sparkle" },
        });
        fireEvent.input(screen.getByLabelText("Scroll Address"), {
            target: { value: "twilight@ponyville.com" },
        });
        fireEvent.input(screen.getByLabelText("Moon of Birth"), {
            target: { value: "2000-05-01" },
        });
        fireEvent.input(screen.getByLabelText("Village or Kingdom"), {
            target: { value: "Ponyville" },
        });
        fireEvent.input(screen.getByLabelText("Magic Scroll Code"), {
            target: { value: "12345" },
        });

        await waitFor(() => {
            expect(screen.getByText("Send Scroll to Canterlot")).not.toBeDisabled();
        });

        fireEvent.click(screen.getByText("Send Scroll to Canterlot"));

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith("✨ You've been registered in Equestria!");
            expect(mockOnSubmit).toHaveBeenCalled();
            expect(localStorageMock.setItem).toHaveBeenCalled();

            const savedScroll = localStorageMock.setItem.mock.calls[0][1];
            expect(JSON.parse(savedScroll)).toEqual(
                expect.objectContaining({
                    firstName: "Twilight",
                    lastName: "Sparkle",
                    email: "twilight@ponyville.com",
                    city: "Ponyville",
                    postalCode: "12345",
                })
            );
        });
    });

    it("should show an error if the scroll code is invalid", async () => {
        render(<PonyRegistrationForm onSubmit={mockOnSubmit} />);

        fireEvent.input(screen.getByLabelText("Pony Name"), {
            target: { value: "Rainbow" },
        });
        fireEvent.input(screen.getByLabelText("Family Herd"), {
            target: { value: "Dash" },
        });
        fireEvent.input(screen.getByLabelText("Scroll Address"), {
            target: { value: "rainbow@cloudsdale.com" },
        });
        fireEvent.input(screen.getByLabelText("Moon of Birth"), {
            target: { value: "2001-06-10" },
        });
        fireEvent.input(screen.getByLabelText("Village or Kingdom"), {
            target: { value: "Cloudsdale" },
        });
        fireEvent.input(screen.getByLabelText("Magic Scroll Code"), {
            target: { value: "42" }, // invalid scroll code
        });

        await waitFor(() => {
            expect(screen.getByText("Send Scroll to Canterlot")).not.toBeDisabled();
        });

        fireEvent.click(screen.getByText("Send Scroll to Canterlot"));

        await waitFor(() => {
            expect(
                screen.getByText(/Le code postal doit contenir 5 chiffres/i)
            ).toBeInTheDocument();
            expect(toast.error).toHaveBeenCalled();
        });
    });

    it("should sparkle-toast an error if submission magic fails", async () => {
        const errorCastingScroll = vi.fn().mockImplementation(() => {
            throw new Error("Magic flux error");
        });

        render(<PonyRegistrationForm onSubmit={errorCastingScroll} />);

        fireEvent.input(screen.getByLabelText("Pony Name"), {
            target: { value: "Fluttershy" },
        });
        fireEvent.input(screen.getByLabelText("Family Herd"), {
            target: { value: "Softwings" },
        });
        fireEvent.input(screen.getByLabelText("Scroll Address"), {
            target: { value: "flutter@forest.glade" },
        });
        fireEvent.input(screen.getByLabelText("Moon of Birth"), {
            target: { value: "1999-03-15" },
        });
        fireEvent.input(screen.getByLabelText("Village or Kingdom"), {
            target: { value: "Everfree" },
        });
        fireEvent.input(screen.getByLabelText("Magic Scroll Code"), {
            target: { value: "99999" },
        });

        await waitFor(() => {
            expect(screen.getByText("Send Scroll to Canterlot")).not.toBeDisabled();
        });

        fireEvent.click(screen.getByText("Send Scroll to Canterlot"));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
                "💥 Oh no! There’s a hiccup in your spell..."
            );
            expect(errorCastingScroll).toHaveBeenCalled();
        });
    });
});
