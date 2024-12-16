
interface ToggleSwitchProps {
    isToggled: boolean;
    onToggle: () => void;
}

const ToggleSwitch = ({ isToggled, onToggle }: ToggleSwitchProps) => {
    return (
        <div className="flex items-center mb-4">
            {/* <span className="mr-2 font-medium">BANNED WORD</span> */}
            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    checked={isToggled}
                    onChange={onToggle}
                    className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer-checked:bg-blue-600">
                    <div
                        className={`absolute w-5 h-5 bg-white rounded-full top-0.5 left-0.5 transition-transform ${
                            isToggled ? "translate-x-5" : ""
                        }`}
                    ></div>
                </div>
            </label>
        </div>
    );
};

export default ToggleSwitch;
