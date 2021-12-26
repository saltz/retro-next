import React, {useEffect, useState} from "react";
import {Switch} from "antd";
import {DarkModeIcon} from "./icons/DarkModeIcon";
import {LightModeIcon} from "./icons/LightModeIcon";
import {parseCookies, setCookie} from "nookies";

interface IProps {
}

type ThemeType = "light" | "dark"

export const ThemeSwitch: React.FC<IProps> = (props: IProps): JSX.Element => {
    const {theme} = parseCookies();
    const [currentTheme, setCurrentTheme] = useState<ThemeType>(theme as ThemeType ?? "light");

    useEffect(() => {
        const switchComponent = document.querySelector(".theme-switch").children[0];

        // for some reason the switch gets broken when initially rendered in the checked state
        // so we just flip it one more time
        if (switchComponent && currentTheme === "dark" && !switchComponent.className.includes("checked")) {
            setCurrentTheme("light");
            setTimeout(() => setCurrentTheme("dark"), 1);
        }
    }, []);

    useEffect(() => {
        document.querySelector("html").className = currentTheme;
    }, [currentTheme]);

    const onThemeSwitch = (value: boolean): void => {
        const selectedTheme = value ? "dark" : "light";

        setCurrentTheme(selectedTheme);

        setCookie(null, "theme", selectedTheme, {
            maxAge: 31536000,
            path: "/",
        })
    };

    return (
        <>
            <div className="theme-switch">
                <Switch
                    checked={currentTheme === "dark"}
                    onChange={onThemeSwitch}
                    checkedChildren={<DarkModeIcon style={{marginTop: "2px"}}/>}
                    unCheckedChildren={<LightModeIcon style={{marginTop: "2.3px"}}/>}
                />
            </div>
            <style jsx>
                {`
                  .theme-switch {
                    position: fixed;
                    z-index: 999;
                    top: 30px;
                    left: 30px;
                  }
                `}
            </style>
        </>
    )
        ;
};