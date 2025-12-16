import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ToggleTheme() {
	const [isDarkMode, setIsDarkMode] = useState(false);

	useEffect(() => {
		const isDark = document.documentElement.classList.contains("dark");
		setIsDarkMode(isDark);
	}, []);

	const toggleTheme = () => {
		document.documentElement.classList.toggle("dark");
		setIsDarkMode((prev) => !prev);
	};

	return (
		<Button variant="ghost" className="w-10 h-10" onClick={toggleTheme}>
			{isDarkMode ? <Sun /> : <Moon />}
		</Button>
	);
}
