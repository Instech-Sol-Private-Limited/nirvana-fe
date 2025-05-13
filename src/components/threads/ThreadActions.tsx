import { useState, useRef, useEffect } from "react";
import { BsThreeDots } from "react-icons/bs";

// Define types for actions prop
interface Action {
    label: string;
    onClick: () => void;
}

interface ThreadActionsProps {
    actions: Action[];
    targetType?: 'thread' | 'comment' | 'reply';
    targetId?: string;
}

const ThreadActions: React.FC<ThreadActionsProps> = ({ actions, targetType, targetId }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative flex items-center gap-1 text-sm pl-5">
            <BsThreeDots
                className="text-lg text-gray-400 cursor-pointer"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
            />

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <div
                    ref={dropdownRef}
                    className="absolute top-full left-auto w-40 bg-secondary shadow-lg rounded-md border border-white/20"
                    style={{ left: 0 }}
                >
                    <ul className="flex flex-col text-xs">
                        {actions.map((action, index) => (
                            <li
                                key={index}
                                className="px-3 py-1.5 cursor-pointer hover:bg-white/10"
                                onClick={() => {
                                    action.onClick();
                                    setIsDropdownOpen(false);
                                }}
                            >
                                {action.label}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>

    );
};

export default ThreadActions;
